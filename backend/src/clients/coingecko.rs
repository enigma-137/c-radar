use crate::models::price::{CoinDetail, CoinPrice, CoingeckoCoinDetail, SparklineIn7d};
use reqwest::Client;
use std::env;

pub async fn fetch_market_data() -> Result<Vec<CoinPrice>, Box<dyn std::error::Error>> {
    let api_key = env::var("COINGECKO_API_KEY").unwrap_or_default();
    let url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true";
    
    let client = Client::new();
    let mut req = client.get(url).header("User-Agent", "CryptoEngine/1.0");
    
    if !api_key.is_empty() {
        // Typically x-cg-demo-api-key or x-cg-pro-api-key depending on plan
        req = req.header("x-cg-demo-api-key", api_key);
    }

    let res = req.send().await?;
    let prices: Vec<CoinPrice> = res.json().await?;
    Ok(prices)
}

pub async fn fetch_coin_price(id: &str) -> Result<CoinDetail, Box<dyn std::error::Error>> {
    let api_key = env::var("COINGECKO_API_KEY").unwrap_or_default();
    let url = format!("https://api.coingecko.com/api/v3/coins/{}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true", id);
    
    let client = Client::new();
    let mut req = client.get(&url).header("User-Agent", "CryptoEngine/1.0");
    
    if !api_key.is_empty() {
        req = req.header("x-cg-demo-api-key", api_key);
    }

    let res = req.send().await?;
    let details: CoingeckoCoinDetail = res.json().await?;

    let description = details.description.and_then(|d| d.en);
    let image = details.image.and_then(|i| i.large).unwrap_or_default();
    
    // Fallbacks if market data is missing
    let md = details.market_data;
    
    let (
        current_price,
        market_cap,
        total_volume,
        price_change_percentage_24h,
        high_24h,
        low_24h,
        ath,
        ath_change_percentage,
        circulating_supply,
        total_supply,
    ) = if let Some(m) = md {
        (
            m.current_price.and_then(|c| c.usd).unwrap_or(0.0),
            m.market_cap.and_then(|c| c.usd).unwrap_or(0.0),
            m.total_volume.and_then(|c| c.usd).unwrap_or(0.0),
            m.price_change_percentage_24h.unwrap_or(0.0),
            m.high_24h.and_then(|c| c.usd),
            m.low_24h.and_then(|c| c.usd),
            m.ath.and_then(|c| c.usd),
            m.ath_change_percentage.and_then(|c| c.usd),
            m.circulating_supply,
            m.total_supply,
        )
    } else {
        (0.0, 0.0, 0.0, 0.0, None, None, None, None, None, None)
    };

    Ok(CoinDetail {
        id: details.id,
        symbol: details.symbol,
        name: details.name,
        image,
        current_price,
        price_change_percentage_24h,
        market_cap,
        total_volume,
        sparkline_in_7d: None, // Or parse if needed
        description,
        market_cap_rank: details.market_cap_rank,
        high_24h,
        low_24h,
        ath,
        ath_change_percentage,
        circulating_supply,
        total_supply,
    })
}
