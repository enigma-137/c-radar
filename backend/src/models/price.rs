use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SparklineIn7d {
    pub price: Vec<f64>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CoinPrice {
    pub id: String,
    pub symbol: String,
    pub name: String,
    pub image: String,
    pub current_price: f64,
    pub price_change_percentage_24h: f64,
    pub market_cap: f64,
    pub total_volume: f64,
    pub sparkline_in_7d: Option<SparklineIn7d>,
}

#[derive(Serialize, Debug, Clone)]
pub struct CoinDetail {
    pub id: String,
    pub symbol: String,
    pub name: String,
    pub image: String,
    pub current_price: f64,
    pub price_change_percentage_24h: f64,
    pub market_cap: f64,
    pub total_volume: f64,
    pub sparkline_in_7d: Option<SparklineIn7d>,
    pub description: Option<String>,
    pub market_cap_rank: Option<u32>,
    pub high_24h: Option<f64>,
    pub low_24h: Option<f64>,
    pub ath: Option<f64>,
    pub ath_change_percentage: Option<f64>,
    pub circulating_supply: Option<f64>,
    pub total_supply: Option<f64>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct CoingeckoCoinDetail {
    pub id: String,
    pub symbol: String,
    pub name: String,
    pub description: Option<Description>,
    pub image: Option<Image>,
    pub market_cap_rank: Option<u32>,
    pub market_data: Option<MarketData>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Description {
    pub en: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Image {
    pub large: Option<String>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct MarketData {
    pub current_price: Option<CurrencyValue>,
    pub market_cap: Option<CurrencyValue>,
    pub total_volume: Option<CurrencyValue>,
    pub price_change_percentage_24h: Option<f64>,
    pub high_24h: Option<CurrencyValue>,
    pub low_24h: Option<CurrencyValue>,
    pub ath: Option<CurrencyValue>,
    pub ath_change_percentage: Option<CurrencyValue>,
    pub circulating_supply: Option<f64>,
    pub total_supply: Option<f64>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct CurrencyValue {
    pub usd: Option<f64>,
}
