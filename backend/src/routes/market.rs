use axum::{Json, http::StatusCode};
use crate::clients::coingecko;
use crate::models::price::CoinPrice;

pub async fn get_market() -> Result<Json<Vec<CoinPrice>>, (StatusCode, String)> {
    match coingecko::fetch_market_data().await {
        Ok(prices) => Ok(Json(prices)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
