"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { PortfolioChart } from "@/components/portfolio-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getPortfolio,
  addAsset,
  removeAsset,
  PortfolioAsset,
  formatPrice,
  formatPercentage,
} from "@/lib/portfolio";
import { mockMarketData, CoinPrice } from "@/lib/api";

export default function PortfolioPage() {
  const [assets, setAssets] = useState<PortfolioAsset[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [buyPrice, setBuyPrice] = useState<string>("");

  useEffect(() => {
    setAssets(getPortfolio().assets);
  }, []);

  const handleAddAsset = useCallback(() => {
    if (!selectedCoin || !amount || !buyPrice) return;

    const coin = mockMarketData.find((c) => c.id === selectedCoin);
    if (!coin) return;

    const portfolio = addAsset({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      amount: parseFloat(amount),
      averageBuyPrice: parseFloat(buyPrice),
    });

    setAssets(portfolio.assets);
    setIsAddModalOpen(false);
    setSelectedCoin("");
    setAmount("");
    setBuyPrice("");
  }, [selectedCoin, amount, buyPrice]);

  const handleRemoveAsset = useCallback((id: string) => {
    const portfolio = removeAsset(id);
    setAssets(portfolio.assets);
  }, []);

  const calculatePnL = useCallback(
    (asset: PortfolioAsset) => {
      const currentPrice =
        mockMarketData.find((c) => c.id === asset.id)?.current_price ||
        asset.averageBuyPrice;
      const costBasis = asset.amount * asset.averageBuyPrice;
      const currentValue = asset.amount * currentPrice;
      const pnl = currentValue - costBasis;
      const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
      return { pnl, pnlPercent, currentValue, currentPrice };
    },
    []
  );

  const totalValue = assets.reduce((sum, asset) => {
    const { currentValue } = calculatePnL(asset);
    return sum + currentValue;
  }, 0);

  const totalCostBasis = assets.reduce(
    (sum, asset) => sum + asset.amount * asset.averageBuyPrice,
    0
  );

  const totalPnL = totalValue - totalCostBasis;
  const totalPnLPercent =
    totalCostBasis > 0 ? (totalPnL / totalCostBasis) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                Portfolio
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your cryptocurrency holdings
              </p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Add Asset
            </Button>
          </div>

          {/* Portfolio Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Value
                  </p>
                  <p className="text-3xl font-mono font-semibold text-foreground">
                    {formatPrice(totalValue)}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    totalPnL >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {totalPnL >= 0 ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-mono">
                    {formatPrice(Math.abs(totalPnL))} (
                    {formatPercentage(totalPnLPercent)})
                  </span>
                </div>
              </div>

              <PortfolioChart assets={assets} prices={mockMarketData} />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Cost Basis
                </p>
                <p className="font-mono font-medium text-foreground">
                  {formatPrice(totalCostBasis)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Total P&L
                </p>
                <p
                  className={`font-mono font-medium ${
                    totalPnL >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {totalPnL >= 0 ? "+" : ""}
                  {formatPrice(totalPnL)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">
                  Assets Held
                </p>
                <p className="font-mono font-medium text-foreground">
                  {assets.length}
                </p>
              </div>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-medium text-foreground">Holdings</h2>
            </div>

            {assets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No assets yet</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add your first cryptocurrency holding
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  variant="outline"
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Asset
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Asset
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Price
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Holdings
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Avg Buy
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        P&L
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                        Value
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => {
                      const coin = mockMarketData.find(
                        (c) => c.id === asset.id
                      );
                      const { pnl, pnlPercent, currentValue, currentPrice } =
                        calculatePnL(asset);
                      const isPositive = pnl >= 0;

                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                                {coin && (
                                  <img
                                    src={coin.image}
                                    alt={asset.name}
                                    className="w-6 h-6 object-contain"
                                    crossOrigin="anonymous"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {asset.name}
                                </p>
                                <p className="text-sm text-muted-foreground uppercase">
                                  {asset.symbol}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-mono text-foreground">
                              {formatPrice(currentPrice)}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-mono text-foreground">
                              {asset.amount.toFixed(4)}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-mono text-muted-foreground">
                              {formatPrice(asset.averageBuyPrice)}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p
                              className={`font-mono ${
                                isPositive ? "text-success" : "text-danger"
                              }`}
                            >
                              {formatPercentage(pnlPercent)}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <p className="font-mono font-medium text-foreground">
                              {formatPrice(currentValue)}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleRemoveAsset(asset.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Add Asset
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Cryptocurrency
                </label>
                <select
                  value={selectedCoin}
                  onChange={(e) => {
                    setSelectedCoin(e.target.value);
                    const coin = mockMarketData.find(
                      (c) => c.id === e.target.value
                    );
                    if (coin) {
                      setBuyPrice(coin.current_price.toString());
                    }
                  }}
                  className="w-full px-3 py-2 rounded-md border border-border bg-secondary text-foreground"
                >
                  <option value="">Select a coin</option>
                  {mockMarketData.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.name} ({coin.symbol.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Amount
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-secondary border-border"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">
                  Buy Price (USD)
                </label>
                <Input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddAsset}
                disabled={!selectedCoin || !amount || !buyPrice}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Asset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
