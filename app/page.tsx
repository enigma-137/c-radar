import { Navigation } from "@/components/navigation";
import { PriceCard } from "@/components/price-card";
import { InsightFeed } from "@/components/insight-feed";
import { MarketStats } from "@/components/market-stats";
import { AlertBanner } from "@/components/alert-banner";
import { fetchMarketData } from "@/lib/api";

export default async function MarketDashboard() {
  const marketData = await fetchMarketData();

  // Calculate market stats from live data
  const totalMarketCap = marketData.reduce(
    (sum, coin) => sum + coin.market_cap,
    0
  );
  const totalVolume = marketData.reduce(
    (sum, coin) => sum + coin.total_volume,
    0
  );
  const bitcoin = marketData.find((c) => c.id === "bitcoin");
  const btcDominance =
    (bitcoin?.market_cap || 0) /
    totalMarketCap *
    100;

  const isBtcPositive = (bitcoin?.price_change_percentage_24h ?? 0) >= 0;
  const alertType: "success" | "warning" = isBtcPositive ? "success" : "warning";
  const alertTitle = isBtcPositive ? "Market Momentum" : "Market Correction";
  const btcChange = Math.abs(bitcoin?.price_change_percentage_24h ?? 0).toFixed(2);
  const alertMessage = bitcoin 
    ? `Bitcoin is ${isBtcPositive ? "up" : "down"} ${btcChange}% in the last 24 hours.`
    : "Market data is currently syncing.";

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Market Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time cryptocurrency prices and AI-powered insights
            </p>
          </div>

          {/* Alert */}
          <AlertBanner
            type={alertType}
            title={alertTitle}
            message={alertMessage}
          />

          {/* Stats */}
          <MarketStats
            totalMarketCap={totalMarketCap}
            totalVolume={totalVolume}
            btcDominance={btcDominance}
            activeCoins={marketData.length}
          />

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Price Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-foreground">Top Cryptocurrencies</h2>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm rounded-md bg-secondary text-foreground">
                    All
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                    Gainers
                  </button>
                  <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                    Losers
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketData.map((coin) => (
                  <PriceCard key={coin.id} coin={coin} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <InsightFeed />

              {/* Trending */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4">Trending</h3>
                <div className="space-y-3">
                  {marketData.slice(0, 5).map((coin, index) => (
                    <div
                      key={coin.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-muted-foreground">
                          {index + 1}
                        </span>
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-5 h-5"
                          crossOrigin="anonymous"
                        />
                        <span className="text-foreground">{coin.symbol.toUpperCase()}</span>
                      </div>
                      <span
                        className={`font-mono ${coin.price_change_percentage_24h >= 0
                            ? "text-success"
                            : "text-danger"
                          }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
