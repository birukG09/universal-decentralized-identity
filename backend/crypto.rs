use aes_gcm::{Aes256Gcm, KeyInit, Nonce};
use aes_gcm::aead::{Aead, OsRng, generic_array::GenericArray};
use rand::RngCore;
use base64::{encode, decode};
use sha2::{Digest, Sha256};

pub fn derive_key_from_passphrase(pass: &str) -> [u8; 32] {
    let mut hasher = Sha256::new();
    hasher.update(pass.as_bytes());
    let out = hasher.finalize();
    let mut key = [0u8;32];
    key.copy_from_slice(&out);
    key
}

pub fn encrypt_bytes(key_bytes: &[u8;32], plaintext: &[u8]) -> Result<String, Box<dyn std::error::Error>> {
    let key = GenericArray::from_slice(key_bytes);
    let cipher = Aes256Gcm::new(key);

    let mut nonce_bytes = [0u8;12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext = cipher.encrypt(nonce, plaintext)?;
    let mut out = nonce_bytes.to_vec();
    out.extend(ciphertext);
    Ok(encode(&out))
}

pub fn decrypt_bytes(key_bytes: &[u8;32], b64: &str) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let raw = decode(b64)?;
    if raw.len() < 12 { return Err("invalid".into()); }
    let (nonce_bytes, ciphertext) = raw.split_at(12);
    let key = GenericArray::from_slice(key_bytes);
    let cipher = Aes256Gcm::new(key);
    let nonce = Nonce::from_slice(nonce_bytes);
    let plaintext = cipher.decrypt(nonce, ciphertext.as_ref())?;
    Ok(plaintext)
}
