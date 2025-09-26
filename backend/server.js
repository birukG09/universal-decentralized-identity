import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle database connection events
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database
async function initializeDatabase() {
  try {
    const client = await pool.connect();
    try {
      console.log('Connected to PostgreSQL database');
      
      // Create tables if they don't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          did VARCHAR(255) UNIQUE NOT NULL,
          profile_data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          filename VARCHAR(255),
          file_hash VARCHAR(255),
          encrypted_path VARCHAR(500),
          metadata JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS verifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          verification_type VARCHAR(100),
          proof_data JSONB,
          verified BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Database tables initialized');
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database initialization failed:', error);
    setTimeout(initializeDatabase, 5000); // Retry after 5 seconds
  }
}

initializeDatabase();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: ['http://localhost:5000', 'http://127.0.0.1:5000', '*'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Ensure uploads directory exists
const uploadsDir = join(__dirname, 'uploads');
try {
  await fs.access(uploadsDir);
} catch {
  await fs.mkdir(uploadsDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'DID Vault Backend API',
    status: 'running',
    version: '1.0.0'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Create DID and user profile
app.post('/api/create-did', async (req, res) => {
  try {
    const { identityData } = req.body;
    
    // Call Python crypto service to generate DID
    const response = await axios.post('http://localhost:8000/generate-did', {
      identity_data: identityData
    });
    
    const { did, proof } = response.data;
    
    // Store user in database
    const result = await pool.query(
      'INSERT INTO users (did, profile_data) VALUES ($1, $2) RETURNING *',
      [did, identityData]
    );
    
    res.json({
      success: true,
      user: result.rows[0],
      did,
      proof
    });
  } catch (error) {
    console.error('Error creating DID:', error);
    res.status(500).json({ success: false, error: 'Failed to create DID' });
  }
});

// Upload and encrypt document
app.post('/api/upload-document', upload.single('document'), async (req, res) => {
  try {
    const { userId, password } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }
    
    // Generate file hash
    const fileHash = crypto.createHash('sha256').update(file.buffer).digest('hex');
    
    // Call Python service to encrypt file content
    const encryptResponse = await axios.post('http://localhost:8000/encrypt', {
      data: file.buffer.toString('base64'),
      password: password
    });
    
    // Save encrypted file
    const filename = `${uuidv4()}_${file.originalname}`;
    const encryptedPath = join(uploadsDir, filename);
    
    await fs.writeFile(encryptedPath, encryptResponse.data.encrypted_data);
    
    // Store document metadata in database
    const result = await pool.query(
      'INSERT INTO documents (user_id, filename, file_hash, encrypted_path, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, file.originalname, fileHash, filename, {
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        salt: encryptResponse.data.salt
      }]
    );
    
    res.json({
      success: true,
      document: result.rows[0]
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ success: false, error: 'Failed to upload document' });
  }
});

// Generate ZK proof for selective disclosure
app.post('/api/generate-proof', async (req, res) => {
  try {
    const { claim, threshold, actualValue } = req.body;
    
    // Call Python service to generate ZK proof
    const response = await axios.post('http://localhost:8000/generate-zk-proof', {
      claim,
      threshold,
      actual_value: actualValue
    });
    
    res.json({
      success: true,
      proof: response.data.proof,
      valid: response.data.valid
    });
  } catch (error) {
    console.error('Error generating proof:', error);
    res.status(500).json({ success: false, error: 'Failed to generate proof' });
  }
});

// Get user documents
app.get('/api/user/:userId/documents', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM documents WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({
      success: true,
      documents: result.rows
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch documents' });
  }
});

// Get user profile
app.get('/api/user/:did', async (req, res) => {
  try {
    const { did } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM users WHERE did = $1',
      [did]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`DID Vault Backend running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await pool.end();
  process.exit(0);
});