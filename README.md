# DIDVault – Decentralized Identity (DID) Management App

[![Rust](https://img.shields.io/badge/Rust-1.70-orange?logo=rust)](https://www.rust-lang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue?logo=ethereum)](https://docs.soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**DIDVault** is a secure, decentralized identity management platform that allows users to create, store, and manage their decentralized digital identities (DIDs) safely. Built using **Rust** for backend logic and **Solidity** for smart contract integration on blockchain networks, the app ensures user privacy, ownership, and verifiable identity credentials.
![img alt]()
![img alt](https://github.com/birukG09/universal-decentralized-identity/blob/029ab519d887c358b05977ca3c6dc4d007d1d84a/attached_assets/20250926_1628_Decentralized%20Identity%20Vault_simple_compose_01k6338s0xe189r2xkjzf4zed9_1758893624107.png)
---

## Table of Contents

1. [Features](#features)  
2. [Technology Stack](#technology-stack)  
3. [Installation](#installation)  
4. [Usage](#usage)  
5. [Folder Structure](#folder-structure)  
6. [Contributing](#contributing)  
7. [License](#license)  
8. [Contact](#contact)  

---

## Features

- **Decentralized Identity Creation** – Generate unique DIDs for secure identification.  
- **Blockchain-Based Storage** – Store identity data securely on-chain using smart contracts.  
- **Rust-Powered Backend** – High-performance and memory-safe backend for handling sensitive data.  
- **Smart Contract Integration** – Solidity contracts ensure verification and immutable identity records.  
- **Identity Verification** – Verify identity credentials easily with cryptographic proofs.  
- **User-Friendly Interface** – Minimalist and intuitive frontend for seamless identity management.  
- **Secure Data Handling** – Encryption for all sensitive personal data.  

---

## Technology Stack

- **Backend:** Rust  
- **Smart Contracts:** Solidity  
- **Blockchain Network:** Ethereum-compatible / EVM  
- **Frontend (optional):** React / HTML & CSS  
- **Database (optional):** Local storage or IPFS integration  
- **Cryptography:** SHA256, Ed25519, or secp256k1  

---

## Installation

### Prerequisites

- Rust ≥ 1.70  
- Node.js & npm ≥ 18 (if using frontend)  
- Truffle / Hardhat for Solidity smart contract deployment  
- Ganache or Ethereum testnet for local testing  

### Steps

1. **Clone the repository**  
```bash
git clone https://github.com/<your-username>/DIDVault.git
cd DIDVault
```

2. **Install Rust dependencies**  
```bash
cargo build
cargo run
```

3. **Install frontend dependencies (optional)**  
```bash
cd frontend
npm install
npm start
```

4. **Deploy Smart Contracts**  
```bash
cd smart-contracts
truffle migrate --network <network-name>
```

---

## Usage

1. Run the Rust backend server.  
2. Connect your wallet to the app for DID creation.  
3. Generate a new decentralized identity (DID).  
4. Store or verify credentials using the blockchain smart contract.  
5. Access your DID records anytime securely.

---

## Folder Structure

```
DIDVault/
│
├─ backend/               # Rust backend logic
├─ frontend/              # Optional frontend code
├─ smart-contracts/       # Solidity contracts
├─ scripts/               # Deployment & utility scripts
├─ README.md              # Project documentation
└─ LICENSE
```

---

## Contributing

Contributions are welcome! If you want to contribute:  

1. Fork the repository  
2. Create a new branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m 'Add feature'`)  
4. Push to your branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  

---

## Contact

**Author:** Biruk G  
**GitHub:** [birukG09](https://github.com/birukG09)  
**Email:** biruk@example.com  
