"use client";

import { useMemo } from "react";
import { PortfolioAsset } from "@/lib/portfolio";
import { CoinPrice } from "@/lib/api";
import { formatCurrency } from "@/lib/portfolio";

interface PortfolioChartProps {
  assets: PortfolioAsset[];
  prices: CoinPrice[];
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function PortfolioChart({ assets, prices }: PortfolioChartProps) {
  const chartData = useMemo(() => {
    const data = assets.map((asset) => {
      const priceData = prices.find((p) => p.id === asset.id);
      const currentPrice = priceData?.current_price || asset.averageBuyPrice;
      const value = asset.amount * currentPrice;
      return {
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        value,
      };
    });

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.map((item, index) => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, [assets, prices]);

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">No assets in portfolio</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Add coins to track your holdings
        </p>
      </div>
    );
  }

  // Calculate pie chart paths
  let currentAngle = -90;
  const paths = chartData.map((item) => {
    const angle = (item.percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`,
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {paths.map((item) => (
              <path
                key={item.id}
                d={item.path}
                fill={item.color}
                className="transition-opacity hover:opacity-80"
              />
            ))}
            <circle cx="50" cy="50" r="25" fill="var(--card)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(totalValue, 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {chartData.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-foreground">{item.name}</span>
              <span className="text-muted-foreground uppercase">
                {item.symbol}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-muted-foreground">
                {item.percentage.toFixed(1)}%
              </span>
              <span className="font-mono text-foreground">
                {formatCurrency(item.value, 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
