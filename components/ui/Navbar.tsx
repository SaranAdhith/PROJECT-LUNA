"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Satellite, Brain, Skull, BarChart3, BookOpen, Home } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/satellites", label: "Satellites", icon: Satellite },
  { href: "/ai-agent", label: "AI Agent", icon: Brain },
  { href: "/graveyard", label: "Graveyard", icon: Skull },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/spacepedia", label: "Spacepedia", icon: BookOpen },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(3, 3, 8, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0, 212, 255, 0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: active ? "#00D4FF" : "rgba(255,255,255,0.6)",
                    background: active ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    border: active ? "1px solid rgba(0, 212, 255, 0.2)" : "1px solid transparent",
                    textShadow: active ? "0 0 10px rgba(0,212,255,0.5)" : "none",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)" }}>
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-live-pulse" />
              <span className="text-xs font-medium text-[#00FF88]" style={{ fontFamily: "var(--font-space-mono)" }}>
                LIVE
              </span>
            </div>

            <button
              className="md:hidden p-2 rounded-lg"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current mb-1" />
              <div className="w-5 h-0.5 bg-current" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden"
          style={{ background: "rgba(3, 3, 8, 0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(0,212,255,0.1)" }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                  style={{
                    color: active ? "#00D4FF" : "rgba(255,255,255,0.7)",
                    background: active ? "rgba(0,212,255,0.08)" : "transparent",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
