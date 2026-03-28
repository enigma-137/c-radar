"use client";

import { X, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useState } from "react";

interface AlertBannerProps {
  type: "success" | "danger" | "info" | "warning";
  title: string;
  message: string;
  dismissible?: boolean;
}

export function AlertBanner({
  type,
  title,
  message,
  dismissible = true,
}: AlertBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const icons = {
    success: TrendingUp,
    danger: TrendingDown,
    info: AlertCircle,
    warning: AlertCircle,
  };

  const colors = {
    success: "border-success/30 bg-success/5 text-success",
    danger: "border-danger/30 bg-danger/5 text-danger",
    info: "border-primary/30 bg-primary/5 text-primary",
    warning: "border-warning/30 bg-warning/5 text-warning",
  };

  const Icon = icons[type];

  return (
    <div className={`border rounded-lg px-4 py-3 ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium">{title}</p>
          <p className="text-sm opacity-80 mt-0.5">{message}</p>
        </div>
        {dismissible && (
          <button
            onClick={() => setVisible(false)}
            className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
