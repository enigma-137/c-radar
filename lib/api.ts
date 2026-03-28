const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

export interface CoinDetail extends CoinPrice {
  description?: string;
  market_cap_rank?: number;
  high_24h?: number;
  low_24h?: number;
  ath?: number;
  ath_change_percentage?: number;
  circulating_supply?: number;
  total_supply?: number;
}

export interface InsightResponse {
  insight: string;
  timestamp: string;
}

export async function fetchMarketData(): Promise<CoinPrice[]> {
  const res = await fetch(`${API_URL}/market`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
}

export async function fetchCoinPrice(id: string): Promise<CoinDetail> {
  const res = await fetch(`${API_URL}/prices/${id}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to fetch coin price");
  return res.json();
}

export async function fetchInsight(prompt: string): Promise<InsightResponse> {
  const res = await fetch(`${API_URL}/insight`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("Failed to fetch insight");
  return res.json();
}

// Mock data for demo purposes
export const mockMarketData: CoinPrice[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 67234.52,
    price_change_percentage_24h: 2.34,
    market_cap: 1320000000000,
    total_volume: 28500000000,
    sparkline_in_7d: {
      price: [65000, 65500, 66000, 65800, 66500, 67000, 67234],
    },
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3456.78,
    price_change_percentage_24h: -1.23,
    market_cap: 415000000000,
    total_volume: 12300000000,
    sparkline_in_7d: {
      price: [3500, 3480, 3420, 3450, 3430, 3460, 3456],
    },
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    current_price: 178.92,
    price_change_percentage_24h: 5.67,
    market_cap: 78000000000,
    total_volume: 3200000000,
    sparkline_in_7d: {
      price: [165, 168, 170, 172, 175, 177, 178],
    },
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    current_price: 0.642,
    price_change_percentage_24h: -0.89,
    market_cap: 22500000000,
    total_volume: 456000000,
    sparkline_in_7d: {
      price: [0.65, 0.648, 0.645, 0.64, 0.638, 0.64, 0.642],
    },
  },
  {
    id: "avalanche-2",
    symbol: "avax",
    name: "Avalanche",
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    current_price: 42.15,
    price_change_percentage_24h: 3.21,
    market_cap: 16200000000,
    total_volume: 890000000,
    sparkline_in_7d: {
      price: [40, 40.5, 41, 41.2, 41.8, 42, 42.15],
    },
  },
  {
    id: "polkadot",
    symbol: "dot",
    name: "Polkadot",
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    current_price: 8.23,
    price_change_percentage_24h: 1.45,
    market_cap: 11200000000,
    total_volume: 345000000,
    sparkline_in_7d: {
      price: [8.0, 8.05, 8.1, 8.15, 8.18, 8.2, 8.23],
    },
  },
  {
    id: "chainlink",
    symbol: "link",
    name: "Chainlink",
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    current_price: 18.45,
    price_change_percentage_24h: -2.1,
    market_cap: 10800000000,
    total_volume: 567000000,
    sparkline_in_7d: {
      price: [19, 18.8, 18.6, 18.5, 18.4, 18.42, 18.45],
    },
  },
  {
    id: "uniswap",
    symbol: "uni",
    name: "Uniswap",
    image: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    current_price: 12.34,
    price_change_percentage_24h: 4.56,
    market_cap: 9300000000,
    total_volume: 234000000,
    sparkline_in_7d: {
      price: [11.5, 11.7, 11.9, 12.0, 12.1, 12.2, 12.34],
    },
  },
];
