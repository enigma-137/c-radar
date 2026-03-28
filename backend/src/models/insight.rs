use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug)]
pub struct InsightRequest {
    pub prompt: String,
}

#[derive(Serialize, Debug)]
pub struct InsightResponse {
    pub insight: String,
    pub timestamp: String,
}
