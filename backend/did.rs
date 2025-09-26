use rand::Rng;
use sha2::{Digest, Sha256};
use base58::ToBase58;

pub fn generate_simple_did() -> String {
    let mut rng = rand::thread_rng();
    let mut b = [0u8; 16];
    rng.fill(&mut b);
    let hash = Sha256::digest(&b);
    let id = hash[0..16].to_base58();
    format!("did:dv:{}", id)
}
