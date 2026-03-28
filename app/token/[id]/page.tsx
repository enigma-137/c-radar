import Link from "next/link";
import { ArrowLeft, TrendingUp, TrendingDown, Plus, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { ELI5Button } from "@/components/eli5-button";
import { Button } from "@/components/ui/button";
import { fetchCoinPrice } from "@/lib/api";
import { formatPrice, formatPercentage, formatCurrency } from "@/lib/portfolio";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const coin = await fetchCoinPrice(id);

  const isPositive = coin.price_change_percentage_24h >= 0;

  // Generate mock historical data
  const generateChartData = (basePrice: number) => {
    const data: number[] = [];
    let price = basePrice * 0.9;
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.48) * (basePrice * 0.02);
      data.push(price);
    }
    return data;
  };

  const chartData = generateChartData(coin.current_price);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Market</span>
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-12 h-12 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-semibold text-foreground">
                    {coin.name}
                  </h1>
                  <span className="px-2 py-0.5 bg-secondary rounded text-sm text-muted-foreground uppercase">
                    {coin.symbol}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground">
                    Rank #1
                  </span>
                  <span className="text-muted-foreground/50">·</span>
                  <a
                    href="#"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Website
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ELI5Button
                coinName={coin.name}
                coinSymbol={coin.symbol}
                currentPrice={coin.current_price}
                priceChange={coin.price_change_percentage_24h}
              />
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Add to Portfolio
              </Button>
            </div>
          </div>

          {/* Price Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Price
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-mono font-semibold text-foreground">
                    {formatPrice(coin.current_price)}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-lg ${
                      isPositive ? "text-success" : "text-danger"
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="font-mono">
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {["1H", "1D", "1W", "1M", "1Y", "ALL"].map((period, index) => (
                  <button
                    key={period}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                      index === 2
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="h-64">
              <PriceChart data={chartData} isPositive={isPositive} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Market Cap"
              value={formatCurrency(coin.market_cap, 2)}
            />
            <StatCard
              label="24h Volume"
              value={formatCurrency(coin.total_volume, 2)}
            />
            <StatCard
              label="24h High"
              value={formatPrice(coin.current_price * 1.03)}
            />
            <StatCard
              label="24h Low"
              value={formatPrice(coin.current_price * 0.97)}
            />
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-medium text-foreground mb-4">
              About {coin.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {coin.description ? (
                <span dangerouslySetInnerHTML={{ __html: coin.description }} />
              ) : (
                `${coin.name} is a decentralized digital currency that enables peer-to-peer transactions without the need for intermediaries. It operates on a blockchain network, ensuring transparency and security for all transactions.`
              )}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="font-mono font-medium text-foreground">{value}</p>
    </div>
  );
}

function PriceChart({
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

  const fillPoints = `0,100 ${points} 100,100`;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor={isPositive ? "var(--success)" : "var(--danger)"}
            stopOpacity="0.2"
          />
          <stop
            offset="100%"
            stopColor={isPositive ? "var(--success)" : "var(--danger)"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#chartGradient)" />
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "var(--success)" : "var(--danger)"}
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
