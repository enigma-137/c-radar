use reqwest::Client;
use serde_json::json;
use std::env;

pub async fn generate_insight(prompt: &str) -> Result<String, Box<dyn std::error::Error>> {
    let api_key = env::var("GEMINI_API_KEY")?;
    let url = format!("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={}", api_key);
    
    let client = Client::new();
    
    let body = json!({
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    });

    let res = client.post(&url).json(&body).send().await?;
    let json_res: serde_json::Value = res.json().await?;

    if let Some(candidates) = json_res.get("candidates") {
        if let Some(first_candidate) = candidates.get(0) {
            if let Some(content) = first_candidate.get("content") {
                if let Some(parts) = content.get("parts") {
                    if let Some(first_part) = parts.get(0) {
                        if let Some(text) = first_part.get("text") {
                            return Ok(text.as_str().unwrap_or("").to_string());
                        }
                    }
                }
            }
        }
    }

    // Return the literal JSON error payload from Gemini to diagnose the issue
    Ok(json_res.to_string())
}
