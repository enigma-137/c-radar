export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averageBuyPrice: number;
  addedAt: string;
}

export interface Portfolio {
  assets: PortfolioAsset[];
  updatedAt: string;
}

const STORAGE_KEY = "visualize_portfolio";

export function getPortfolio(): Portfolio {
  if (typeof window === "undefined") {
    return { assets: [], updatedAt: new Date().toISOString() };
  }
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { assets: [], updatedAt: new Date().toISOString() };
  }
  
  try {
    return JSON.parse(stored);
  } catch {
    return { assets: [], updatedAt: new Date().toISOString() };
  }
}

export function savePortfolio(portfolio: Portfolio): void {
  if (typeof window === "undefined") return;
  
  portfolio.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
}

export function addAsset(asset: Omit<PortfolioAsset, "addedAt">): Portfolio {
  const portfolio = getPortfolio();
  const existingIndex = portfolio.assets.findIndex((a) => a.id === asset.id);
  
  if (existingIndex >= 0) {
    const existing = portfolio.assets[existingIndex];
    const totalAmount = existing.amount + asset.amount;
    const weightedAvg =
      (existing.amount * existing.averageBuyPrice +
        asset.amount * asset.averageBuyPrice) /
      totalAmount;
    
    portfolio.assets[existingIndex] = {
      ...existing,
      amount: totalAmount,
      averageBuyPrice: weightedAvg,
    };
  } else {
    portfolio.assets.push({
      ...asset,
      addedAt: new Date().toISOString(),
    });
  }
  
  savePortfolio(portfolio);
  return portfolio;
}

export function removeAsset(id: string): Portfolio {
  const portfolio = getPortfolio();
  portfolio.assets = portfolio.assets.filter((a) => a.id !== id);
  savePortfolio(portfolio);
  return portfolio;
}

export function updateAssetAmount(
  id: string,
  amount: number,
  averageBuyPrice?: number
): Portfolio {
  const portfolio = getPortfolio();
  const index = portfolio.assets.findIndex((a) => a.id === id);
  
  if (index >= 0) {
    portfolio.assets[index].amount = amount;
    if (averageBuyPrice !== undefined) {
      portfolio.assets[index].averageBuyPrice = averageBuyPrice;
    }
    savePortfolio(portfolio);
  }
  
  return portfolio;
}

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(decimals)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

export function formatPrice(value: number): string {
  if (value >= 1000) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (value >= 1) {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
