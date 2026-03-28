"use client";

import { useState } from "react";
import { Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { fetchInsight } from "@/lib/api";

interface InsightMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function InsightFeed() {
  const [messages, setMessages] = useState<InsightMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: InsightMessage = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetchInsight(input.trim());
      
      const aiMessage: InsightMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.insight,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: InsightMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I couldn't reach the backend to generate an insight.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <User className="w-4 h-4 text-primary" />
        <h2 className="font-medium text-foreground">AI Insights</h2>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <User className="w-8 h-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Ask about market trends, token analysis, or crypto concepts
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg px-3 py-2">
              <Spinner className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-t border-border"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crypto..."
          className="flex-1 bg-secondary border-border"
          disabled={loading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={loading || !input.trim()}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
