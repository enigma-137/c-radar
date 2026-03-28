"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CoinPrice } from "@/lib/api";
import { formatPrice, formatPercentage, formatCurrency } from "@/lib/portfolio";

interface PriceCardProps {
  coin: CoinPrice;
}

export function PriceCard({ coin }: PriceCardProps) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <Link href={`/token/${coin.id}`}>
      <div className="group relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-8 h-8 object-contain"
                crossOrigin="anonymous"
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                {coin.name}
              </h3>
              <p className="text-sm text-muted-foreground uppercase">
                {coin.symbol}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="font-mono font-medium text-foreground">
              {formatPrice(coin.current_price)}
            </p>
            <div
              className={`flex items-center justify-end gap-1 text-sm ${
                isPositive ? "text-success" : "text-danger"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="font-mono">
                {formatPercentage(coin.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>

        {coin.sparkline_in_7d?.price && (
          <div className="mt-4 h-12">
            <Sparkline
              data={coin.sparkline_in_7d.price}
              isPositive={isPositive}
            />
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border flex justify-between text-xs text-muted-foreground">
          <span>MCap {formatCurrency(coin.market_cap, 1)}</span>
          <span>Vol {formatCurrency(coin.total_volume, 1)}</span>
        </div>
      </div>
    </Link>
  );
}

function Sparkline({
  data,
  isPositive,
}: {
  data: number[];
  isPositive: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "var(--success)" : "var(--danger)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
