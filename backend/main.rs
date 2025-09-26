use actix_web::{web, App, HttpServer, HttpResponse, Responder, post};
use serde::{Deserialize, Serialize};
mod crypto;
mod ipfs;
mod did;
mod relayer;

#[derive(Deserialize)]
struct UploadRequest {
    passphrase: String,
    filepath: String
}

#[derive(Serialize)]
struct UploadResponse {
    cid: String,
    did: String,
}

#[post("/upload")]
async fn upload(req: web::Json<UploadRequest>) -> impl Responder {
    let key = crypto::derive_key_from_passphrase(&req.passphrase);
    let plain = std::fs::read(&req.filepath);
    if plain.is_err() {
        return HttpResponse::BadRequest().body("file not found");
    }
    let encrypted_b64 = match crypto::encrypt_bytes(&key, &plain.unwrap()) {
        Ok(b) => b,
        Err(e) => return HttpResponse::InternalServerError().body(format!("encrypt err: {}", e))
    };
    let tmp_path = "/tmp/encrypted_doc.bin";
    std::fs::write(tmp_path, base64::decode(&encrypted_b64).unwrap()).unwrap();

    let ipfs_api = std::env::var("IPFS_API").unwrap_or_else(|_| "http://127.0.0.1:5001/api/v0/add".to_string());
    let cid = match ipfs::pin_file_local(tmp_path, &ipfs_api).await {
        Ok(cid) => cid,
        Err(e) => return HttpResponse::InternalServerError().body(format!("ipfs err: {}", e))
    };

    let did_string = did::generate_simple_did();
    let resp = UploadResponse { cid, did: did_string };
    HttpResponse::Ok().json(resp)
}

#[post("/zk-prove")]
async fn zk_prove(payload: web::Bytes) -> impl Responder {
    println!("Received zk request of {} bytes", payload.len());
    HttpResponse::Ok().body("proof accepted (stub)")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting DID Vault backend on 127.0.0.1:8080");
    HttpServer::new(|| App::new().service(upload).service(zk_prove))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
