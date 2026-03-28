"use client";

import { TrendingUp, Activity, Coins, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/portfolio";

interface MarketStatsProps {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  activeCoins: number;
}

export function MarketStats({
  totalMarketCap,
  totalVolume,
  btcDominance,
  activeCoins,
}: MarketStatsProps) {
  const stats = [
    {
      label: "Total Market Cap",
      value: formatCurrency(totalMarketCap, 2),
      icon: DollarSign,
      change: "+2.4%",
      positive: true,
    },
    {
      label: "24h Volume",
      value: formatCurrency(totalVolume, 2),
      icon: Activity,
      change: "-1.2%",
      positive: false,
    },
    {
      label: "BTC Dominance",
      value: `${btcDominance.toFixed(1)}%`,
      icon: TrendingUp,
      change: "+0.3%",
      positive: true,
    },
    {
      label: "Active Coins",
      value: activeCoins.toLocaleString(),
      icon: Coins,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono font-medium text-lg text-foreground">
                {stat.value}
              </span>
              {stat.change && (
                <span
                  className={`text-xs font-mono ${
                    stat.positive ? "text-success" : "text-danger"
                  }`}
                >
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
