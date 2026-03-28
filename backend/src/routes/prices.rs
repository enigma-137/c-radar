use axum::{extract::Path, Json, http::StatusCode};
use crate::clients::coingecko;
use crate::models::price::CoinDetail;

pub async fn get_price(Path(id): Path<String>) -> Result<Json<CoinDetail>, (StatusCode, String)> {
    match coingecko::fetch_coin_price(&id).await {
        Ok(detail) => Ok(Json(detail)),
        Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
    }
}
