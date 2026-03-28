"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Search, Command } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Market", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Image src="/favicon.ico" alt="Logo" width={32} height={32} />
              </div>
              <span className="font-semibold text-foreground hidden sm:block">
                C-Radar
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-secondary/50 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <kbd className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-xs">
                <Command className="w-3 h-3" />K
              </kbd>
            </button>

            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">?</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
