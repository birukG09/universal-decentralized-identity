from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os
from typing import Dict, Any
import numpy as np
import hashlib
import secrets
import json

app = FastAPI(title="DID Vault Crypto Services", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://127.0.0.1:5000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class EncryptionRequest(BaseModel):
    data: str
    password: str

class DecryptionRequest(BaseModel):
    encrypted_data: str
    password: str
    salt: str

class ZKProofRequest(BaseModel):
    claim: str
    threshold: int
    actual_value: int

class DIDGenerationRequest(BaseModel):
    identity_data: Dict[str, Any]
    
# Encryption service  
def generate_key(password: str, salt: bytes | None = None) -> tuple[bytes, bytes]:
    if salt is None:
        salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(password.encode()))
    return key, salt

@app.get("/")
async def root():
    return {"message": "DID Vault Crypto Services API", "status": "running"}

@app.post("/encrypt")
async def encrypt_data(request: EncryptionRequest):
    try:
        key, salt = generate_key(request.password)
        fernet = Fernet(key)
        encrypted = fernet.encrypt(request.data.encode())
        
        return {
            "encrypted_data": base64.urlsafe_b64encode(encrypted).decode(),
            "salt": base64.urlsafe_b64encode(salt).decode(),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/decrypt")
async def decrypt_data(request: DecryptionRequest):
    try:
        encrypted_bytes = base64.urlsafe_b64decode(request.encrypted_data.encode())
        # Use the provided salt from the encryption metadata
        salt = base64.urlsafe_b64decode(request.salt.encode())
        key, _ = generate_key(request.password, salt)
        fernet = Fernet(key)
        decrypted = fernet.decrypt(encrypted_bytes)
        
        return {
            "decrypted_data": decrypted.decode(),
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed")

@app.post("/generate-did")
async def generate_did(request: DIDGenerationRequest):
    """Generate a decentralized identifier"""
    try:
        # Create a deterministic DID based on identity data
        identity_hash = hashlib.sha256(json.dumps(request.identity_data, sort_keys=True).encode()).hexdigest()
        did = f"did:vault:{identity_hash[:32]}"
        
        # Generate cryptographic proof
        proof_data = {
            "did": did,
            "timestamp": secrets.token_hex(8),
            "verification_method": f"{did}#key-1",
            "proof_hash": hashlib.sha256((did + str(request.identity_data)).encode()).hexdigest()
        }
        
        return {
            "did": did,
            "proof": proof_data,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-zk-proof")
async def generate_zk_proof(request: ZKProofRequest):
    """Generate a zero-knowledge proof (simulated)"""
    try:
        # Simulate ZK proof generation
        # In a real implementation, this would use actual ZK libraries
        
        proof_valid = request.actual_value >= request.threshold
        
        # Generate a cryptographic commitment
        commitment = hashlib.sha256(f"{request.claim}:{request.actual_value}:{secrets.token_hex(16)}".encode()).hexdigest()
        
        # Create proof object
        zk_proof = {
            "claim": request.claim,
            "proof_type": "range_proof",
            "commitment": commitment,
            "proof_data": {
                "valid": proof_valid,
                "proof_hash": hashlib.sha256(f"{commitment}:{proof_valid}".encode()).hexdigest()
            },
            "verification_key": secrets.token_hex(32)
        }
        
        return {
            "proof": zk_proof,
            "valid": proof_valid,
            "status": "success"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "crypto-services"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)