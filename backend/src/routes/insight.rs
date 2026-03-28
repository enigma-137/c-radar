use axum::{Json, http::StatusCode};
use crate::clients::{gemini, coingecko};
use crate::models::insight::{InsightRequest, InsightResponse};
use std::time::{SystemTime, UNIX_EPOCH};

pub async fn post_insight(Json(payload): Json<InsightRequest>) -> Result<Json<InsightResponse>, (StatusCode, String)> {
    let mut context = String::from("You are a specialized Cryptocurrency AI assistant integrated into a live crypto dashboard. Always give concise, engaging answers focused squarely on the crypto market. ");
    
    if let Ok(market) = coingecko::fetch_market_data().await {
        let top_coins = market.iter()
            .take(10)
            .map(|c| format!("{} (${}, {}% 24h)", c.name, c.current_price, c.price_change_percentage_24h))
            .collect::<Vec<_>>()
            .join(", ");
        context.push_str(&format!("Current Top 10 Coins context: {}. ", top_coins));
    }
    
    let enriched_prompt = format!("{}User Question: {}", context, payload.prompt);

    match gemini::generate_insight(&enriched_prompt).await {
        Ok(insight_text) => {
            let start = SystemTime::now();
            let since_the_epoch = start.duration_since(UNIX_EPOCH).expect("Time went backwards");
            let timestamp = format!("{}", since_the_epoch.as_secs());
            
            let res = InsightResponse {
                insight: insight_text,
                timestamp,
            };
            Ok(Json(res))
        },
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
