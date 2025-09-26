use async_trait::async_trait;

#[async_trait]
pub trait Relayer {
    async fn sync_identity(&self, did: &str, target_chain_rpc: &str) -> Result<(), Box<dyn std::error::Error>>;
}

pub struct SimpleRelayer {}

#[async_trait]
impl Relayer for SimpleRelayer {
    async fn sync_identity(&self, did: &str, _target_chain_rpc: &str) -> Result<(), Box<dyn std::error::Error>> {
        println!("Relaying DID {} to target chain RPC {}", did, _target_chain_rpc);
        Ok(())
    }
}
