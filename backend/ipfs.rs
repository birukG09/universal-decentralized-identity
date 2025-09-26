use reqwest::Client;
use serde::Deserialize;
use std::fs::File;
use std::io::Read;

pub async fn pin_file_local(path: &str, ipfs_api: &str) -> Result<String, Box<dyn std::error::Error>> {
    let mut f = File::open(path)?;
    let mut buf = Vec::new();
    f.read_to_end(&mut buf)?;

    let client = Client::new();
    let part = reqwest::multipart::Part::bytes(buf).file_name("doc");
    let form = reqwest::multipart::Form::new().part("file", part);

    let resp = client.post(ipfs_api).multipart(form).send().await?;
    let text = resp.text().await?;
    #[derive(Deserialize)]
    struct AddResp { Hash: String }
    let add: AddResp = serde_json::from_str(&text)?;
    Ok(add.Hash)
}
