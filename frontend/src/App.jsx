import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ConstellationIcon, CircuitVaultIcon, FractalKeyIcon, EnergyFlowIcon } from './components/icons';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState([]);
  const [proofs, setProofs] = useState([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('didVaultUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        loadUserDocuments(userData.id);
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('didVaultUser');
      }
    }
  }, []);

  const loadUserDocuments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/${userId}/documents`);
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const createDID = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3001/api/create-did', {
        identityData: {
          name: 'Demo User',
          email: 'demo@example.com',
          timestamp: Date.now()
        }
      });
      
      if (response.data.success) {
        const userData = response.data.user;
        setUser(userData);
        // Save user to localStorage
        localStorage.setItem('didVaultUser', JSON.stringify(userData));
        loadUserDocuments(userData.id);
      } else {
        setError('Failed to create DID');
      }
    } catch (error) {
      console.error('Error creating DID:', error);
      setError('Network error: Please ensure all services are running');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-vault-dark font-body">
      {/* Header */}
      <header className="bg-vault-slate border-b border-vault-gray shadow-glow-cyan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="mr-3 animate-glow">
                <CircuitVaultIcon className="w-8 h-8 text-vault-cyan" variant="gradient" />
              </div>
              <h1 className="text-xl font-heading font-bold text-gradient-vault">DID Vault</h1>
            </div>
            <p className="text-sm text-gray-400 font-body">Decentralized Identity Management</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-vault-slate border-b border-vault-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: ConstellationIcon },
              { id: 'documents', label: 'Documents', icon: CircuitVaultIcon },
              { id: 'proofs', label: 'Proofs', icon: FractalKeyIcon },
              { id: 'profile', label: 'Profile', icon: EnergyFlowIcon }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-tab flex items-center space-x-2 ${
                    activeTab === tab.id ? 'active' : ''
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && (
            <DashboardTab 
              user={user} 
              loading={loading} 
              error={error} 
              createDID={createDID}
              documents={documents}
              proofs={proofs}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsTab 
              user={user} 
              documents={documents} 
              setDocuments={setDocuments}
              loadUserDocuments={loadUserDocuments}
            />
          )}

          {activeTab === 'proofs' && (
            <ProofsTab 
              user={user} 
              proofs={proofs} 
              setProofs={setProofs}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab 
              user={user} 
              setUser={setUser}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardTab({ user, loading, error, createDID, documents, proofs, setActiveTab }) {
  return (
    <div className="space-y-8">
      <div className="card-vault text-center">
        <div className="mb-6">
          <ConstellationIcon className="w-24 h-24 mx-auto text-vault-cyan animate-glow" variant="gradient" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-gradient-vault mb-4">
          Secure Decentralized Identity Management
        </h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Control, store, and share your credentials with full privacy. Create and manage your decentralized identity with zero-knowledge proofs and encrypted document storage.
        </p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-vault p-4 mb-6">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        )}
        
        {!user ? (
          <button
            onClick={createDID}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create My DID'}
          </button>
        ) : (
          <div className="bg-vault-cyan/10 border border-vault-cyan/30 rounded-vault p-6">
            <div className="flex items-center justify-center mb-4">
              <ConstellationIcon className="w-6 h-6 text-vault-cyan mr-3" />
              <h3 className="text-lg font-heading font-medium text-vault-cyan">
                DID Created Successfully
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">Your DID: <code className="bg-vault-dark px-2 py-1 rounded text-vault-cyan">{user.did}</code></p>
              <p className="text-gray-300">User ID: <code className="bg-vault-dark px-2 py-1 rounded text-vault-cyan">{user.id}</code></p>
            </div>
          </div>
        )}
      </div>

      {user && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard 
            icon={CircuitVaultIcon}
            title="Document Storage"
            description={`${documents.length} documents stored securely with end-to-end encryption.`}
            onClick={() => setActiveTab && setActiveTab('documents')}
          />
          <FeatureCard 
            icon={FractalKeyIcon}
            title="Zero-Knowledge Proofs"
            description={`${proofs.length} proofs generated for selective disclosure of identity claims.`}
            onClick={() => setActiveTab && setActiveTab('proofs')}
          />
          <FeatureCard 
            icon={EnergyFlowIcon}
            title="Identity Management"
            description="Manage your decentralized identity across multiple platforms with privacy."
            onClick={() => setActiveTab && setActiveTab('profile')}
          />
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, onClick }) {
  return (
    <div className="card-vault cursor-pointer" onClick={onClick}>
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-vault-cyan animate-energy-flow" variant="gradient" />
        <h3 className="ml-4 text-lg font-heading font-medium text-gray-100">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function DocumentsTab({ user, documents, setDocuments, loadUserDocuments }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [password, setPassword] = useState('');

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user || !password) {
      setUploadError('Please select a file and enter a password');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('userId', user.id);
      formData.append('password', password);

      const response = await axios.post('http://localhost:3001/api/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        await loadUserDocuments(user.id);
        setPassword('');
        event.target.value = '';
      } else {
        setUploadError('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Network error during upload');
    }
    setUploading(false);
  };

  if (!user) {
    return (
      <div className="card-vault text-center">
        <CircuitVaultIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-heading font-medium text-gray-400 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please create a DID first to access document storage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-vault">
        <div className="flex items-center mb-6">
          <CircuitVaultIcon className="w-6 h-6 text-vault-cyan mr-3" />
          <h2 className="text-xl font-heading font-medium text-gray-100">Document Storage</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Encryption Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password for encryption"
              className="input-vault w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Document</label>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading || !password}
              className="input-vault w-full file:mr-4 file:py-2 file:px-4 file:rounded-vault file:border-0 file:text-sm file:font-medium file:bg-vault-cyan file:text-vault-dark hover:file:bg-opacity-90"
            />
          </div>
          
          {uploadError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-vault p-3">
              <div className="text-sm text-red-400">{uploadError}</div>
            </div>
          )}
          
          {uploading && (
            <div className="bg-vault-cyan/10 border border-vault-cyan/30 rounded-vault p-3">
              <div className="text-sm text-vault-cyan">Uploading and encrypting...</div>
            </div>
          )}
        </div>
      </div>

      <div className="card-vault">
        <h3 className="text-lg font-heading font-medium text-gray-100 mb-4">Your Documents</h3>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <CircuitVaultIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-500">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-vault-dark border border-vault-gray rounded-vault p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-100">{doc.filename}</p>
                    <p className="text-sm text-gray-400">
                      Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-vault-cyan">
                    {Math.round(doc.metadata?.size / 1024)} KB
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProofsTab({ user, proofs, setProofs }) {
  const [generating, setGenerating] = useState(false);
  const [proofForm, setProofForm] = useState({ claim: 'age_over_18', threshold: 18, actualValue: 25 });
  const [proofError, setProofError] = useState('');

  const generateProof = async () => {
    if (!user) {
      setProofError('Please create a DID first');
      return;
    }

    setGenerating(true);
    setProofError('');

    try {
      const response = await axios.post('http://localhost:3001/api/generate-proof', {
        claim: proofForm.claim,
        threshold: proofForm.threshold,
        actualValue: proofForm.actualValue
      });

      if (response.data.success) {
        const newProof = {
          id: Date.now(),
          ...response.data,
          timestamp: new Date().toISOString(),
          claim: proofForm.claim
        };
        setProofs([newProof, ...proofs]);
      } else {
        setProofError('Failed to generate proof');
      }
    } catch (error) {
      console.error('Proof generation error:', error);
      setProofError('Network error during proof generation');
    }
    setGenerating(false);
  };

  if (!user) {
    return (
      <div className="card-vault text-center">
        <FractalKeyIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-heading font-medium text-gray-400 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please create a DID first to generate zero-knowledge proofs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-vault">
        <div className="flex items-center mb-6">
          <FractalKeyIcon className="w-6 h-6 text-vault-purple mr-3" />
          <h2 className="text-xl font-heading font-medium text-gray-100">Zero-Knowledge Proofs</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Claim Type</label>
            <select
              value={proofForm.claim}
              onChange={(e) => setProofForm({...proofForm, claim: e.target.value})}
              className="input-vault w-full"
            >
              <option value="age_over_18">Age Over 18</option>
              <option value="age_over_21">Age Over 21</option>
              <option value="credit_score">Credit Score Above Threshold</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Threshold</label>
              <input
                type="number"
                value={proofForm.threshold}
                onChange={(e) => setProofForm({...proofForm, threshold: parseInt(e.target.value)})}
                className="input-vault w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Actual Value</label>
              <input
                type="number"
                value={proofForm.actualValue}
                onChange={(e) => setProofForm({...proofForm, actualValue: parseInt(e.target.value)})}
                className="input-vault w-full"
              />
            </div>
          </div>
          
          <button
            onClick={generateProof}
            disabled={generating}
            className="btn-primary disabled:opacity-50"
          >
            {generating ? 'Generating Proof...' : 'Generate ZK Proof'}
          </button>
          
          {proofError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-vault p-3">
              <div className="text-sm text-red-400">{proofError}</div>
            </div>
          )}
        </div>
      </div>

      <div className="card-vault">
        <h3 className="text-lg font-heading font-medium text-gray-100 mb-4">Generated Proofs</h3>
        {proofs.length === 0 ? (
          <div className="text-center py-8">
            <FractalKeyIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-500">No proofs generated yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proofs.map((proof) => (
              <div key={proof.id} className="bg-vault-dark border border-vault-gray rounded-vault p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-gray-100 capitalize">{proof.claim.replace('_', ' ')}</p>
                  <span className={`px-2 py-1 rounded text-xs ${
                    proof.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {proof.valid ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Generated: {new Date(proof.timestamp).toLocaleDateString()}
                </p>
                <details className="mt-2">
                  <summary className="text-sm text-vault-cyan cursor-pointer">View Proof Data</summary>
                  <pre className="mt-2 text-xs bg-vault-slate p-2 rounded overflow-x-auto">
                    {JSON.stringify(proof.proof, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileTab({ user, setUser }) {
  const [profile, setProfile] = useState({
    name: user?.profile_data?.name || '',
    email: user?.profile_data?.email || ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const updateProfile = async () => {
    if (!user) return;

    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      // In a real implementation, this would call an API to update the profile
      // For now, we'll update localStorage
      const updatedUser = {
        ...user,
        profile_data: { ...user.profile_data, ...profile }
      };
      
      setUser(updatedUser);
      localStorage.setItem('didVaultUser', JSON.stringify(updatedUser));
      setSaveSuccess(true);
      
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      setSaveError('Failed to update profile');
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="card-vault text-center">
        <EnergyFlowIcon className="w-16 h-16 mx-auto text-gray-500 mb-4" />
        <h3 className="text-lg font-heading font-medium text-gray-400 mb-2">Authentication Required</h3>
        <p className="text-gray-500">Please create a DID first to manage your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card-vault">
        <div className="flex items-center mb-6">
          <EnergyFlowIcon className="w-6 h-6 text-vault-amber mr-3" />
          <h2 className="text-xl font-heading font-medium text-gray-100">Identity Profile</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({...profile, name: e.target.value})}
              className="input-vault w-full"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              className="input-vault w-full"
              placeholder="Enter your email"
            />
          </div>
          
          <button
            onClick={updateProfile}
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Profile'}
          </button>
          
          {saveError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-vault p-3">
              <div className="text-sm text-red-400">{saveError}</div>
            </div>
          )}
          
          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-vault p-3">
              <div className="text-sm text-green-400">Profile updated successfully!</div>
            </div>
          )}
        </div>
      </div>

      <div className="card-vault">
        <h3 className="text-lg font-heading font-medium text-gray-100 mb-4">DID Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-400">Decentralized Identifier</label>
            <code className="block bg-vault-dark px-3 py-2 rounded text-vault-cyan text-sm">{user.did}</code>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">User ID</label>
            <code className="block bg-vault-dark px-3 py-2 rounded text-vault-cyan text-sm">{user.id}</code>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">Created</label>
            <p className="text-gray-300">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;