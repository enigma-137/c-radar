"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface ELI5ButtonProps {
  coinName: string;
  coinSymbol: string;
  currentPrice: number;
  priceChange: number;
}

export function ELI5Button({
  coinName,
  coinSymbol,
  currentPrice,
  priceChange,
}: ELI5ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsight = async () => {
    setIsOpen(true);
    setLoading(true);

    // Simulate API call for demo
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const insights = [
      `${coinName} (${coinSymbol.toUpperCase()}) is like digital money that lives on the internet. Right now, one ${coinSymbol.toUpperCase()} costs ${currentPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}. ${priceChange >= 0 ? "It went up" : "It went down"} by ${Math.abs(priceChange).toFixed(2)}% today, which means ${priceChange >= 0 ? "more people want to buy it" : "some people decided to sell"}.`,
      `Think of ${coinName} as special digital tokens that people trade with each other. Today it&apos;s ${priceChange >= 0 ? "having a good day" : "having a tough day"} with a ${Math.abs(priceChange).toFixed(2)}% ${priceChange >= 0 ? "increase" : "decrease"}. At ${currentPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })}, it&apos;s ${currentPrice > 1000 ? "one of the more valuable" : "an accessible"} cryptocurrencies.`,
      `${coinName} is a cryptocurrency - basically computer code that acts like money. People are ${priceChange >= 0 ? "buying more of it today" : "selling some today"}, which ${priceChange >= 0 ? "pushed the price up" : "brought the price down"} ${Math.abs(priceChange).toFixed(2)}%. One coin costs ${currentPrice.toLocaleString("en-US", { style: "currency", currency: "USD" })} right now.`,
    ];

    setInsight(insights[Math.floor(Math.random() * insights.length)]);
    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={generateInsight}
        variant="outline"
        className="gap-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
      >
        <Sparkles className="w-4 h-4" />
        ELI5
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-card border border-border rounded-lg p-6 shadow-xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-medium text-foreground">
                {coinName} Explained Simply
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="w-6 h-6 text-primary" />
              </div>
            ) : (
              <p className="text-muted-foreground leading-relaxed">{insight}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
