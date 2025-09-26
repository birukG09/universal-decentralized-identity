# DID Vault - Scaffold
A starter scaffold for **Decentralized Identity (DID) Vault** with Solidity contracts (Hardhat) and a Rust Actix-web backend.

## Contents
- `contracts/` - Solidity contracts (DIDToken, AccessManager, VerifierInterface, SimpleDAO)
- `hardhat.config.js` - Hardhat config
- `package.json` - Hardhat devDependencies
- `scripts/deploy.js` - Example deploy script
- `rust-backend/` - Rust backend scaffold (Actix-web)
- `.gitignore`

## Quickstart

### Contracts (Hardhat)
1. Install Node.js (16+), then:
   ```
   cd contracts
   npm install
   npx hardhat compile
   npx hardhat test
   ```
2. Edit `.env` and `hardhat.config.js` to add network keys for deployment.

### Rust backend
```
cd rust-backend
cargo run
```

### Notes
- ZK verifier is a placeholder. Integrate Circom / SnarkJS or Arkworks for real proofs.
- Replace naive KDF with Argon2 in production.
- This scaffold is a starting point; expand modules as needed.
