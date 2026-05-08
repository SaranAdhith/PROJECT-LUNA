"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Satellite, Skull, BarChart3, Brain, X } from "lucide-react";

const EarthGlobe = dynamic(() => import("@/components/earth/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#00D4FF] text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
          Initializing orbital view...
        </p>
      </div>
    </div>
  ),
});

const LIVE_FEED = [
  { name: "Starlink-5234", country: "🇺🇸", orbit: "LEO" },
  { name: "Chandrayaan-2 Orbiter", country: "🇮🇳", orbit: "Lunar" },
  { name: "GOES-18", country: "🇺🇸", orbit: "GEO" },
  { name: "Tiangong CSS", country: "🇨🇳", orbit: "LEO" },
  { name: "OneWeb-0445", country: "🇬🇧", orbit: "LEO" },
  { name: "BeiDou G7", country: "🇨🇳", orbit: "GEO" },
  { name: "Hubble Space Telescope", country: "🇺🇸", orbit: "LEO" },
  { name: "NOAA-21", country: "🇺🇸", orbit: "LEO" },
  { name: "Galileo IOV-1", country: "🇪🇺", orbit: "MEO" },
  { name: "ISS", country: "🌍", orbit: "LEO" },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCounter({ value, label, icon }: { value: number; label: string; icon: string }) {
  const count = useCountUp(value);
  return (
    <div className="text-center">
      <span className="text-base font-bold" style={{ fontFamily: "var(--font-space-mono)", color: "#00D4FF" }}>
        {icon} {count.toLocaleString()}+
      </span>
      <p className="text-[11px] text-white/50 mt-0.5">{label}</p>
    </div>
  );
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedSat, setSelectedSat] = useState<string | null>(null);
  const router = useRouter();

  const handleAskLuna = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ai-agent?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/ai-agent");
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#030308]">
      <div className="absolute inset-0 z-10">
        <EarthGlobe onSatelliteSelect={setSelectedSat} selectedSatellite={selectedSat} />
      </div>

      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Top-left branding */}
        <motion.div
          className="absolute top-5 left-20"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h1
            className="text-2xl sm:text-3xl font-black tracking-tight leading-none"
            style={{
              fontFamily: "var(--font-syne)",
              color: "#00D4FF",
              textShadow: "0 0 20px rgba(0,212,255,0.5), 0 0 50px rgba(0,212,255,0.2)",
            }}
          >
            🌕 LUNA
          </h1>
          <p className="text-white/60 text-xs mt-1 text-center" style={{ fontFamily: "var(--font-dm-sans)" }}>
            The Intelligence Layer for Earth&apos;s Orbit
          </p>
        </motion.div>

        {/* Right-side panels — flex column so gap is natural, no height guessing */}
        <motion.div
          className="absolute top-24 right-6 pointer-events-auto flex flex-col gap-5"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="glass-panel p-4 min-w-[210px]">
            <p className="text-[10px] text-[#00D4FF] mb-3 font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
              ◉ LIVE ORBITAL STATUS
            </p>
            <div className="space-y-3">
              <StatCounter value={9000} label="Active Satellites" icon="🛰️" />
              <div className="border-t border-white/5 pt-2">
                <StatCounter value={3200} label="Inactive Objects" icon="💀" />
              </div>
              <div className="border-t border-white/5 pt-2">
                <StatCounter value={27000} label="Debris Tracked" icon="☄️" />
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 min-w-[210px]">
            <p className="text-[10px] text-[#00D4FF] mb-3 font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
              ◉ MISSION TRACKER
            </p>
            <div className="space-y-0">
              {[
                { name: "Artemis III",    type: "🌕", status: "PLANNING",  color: "#FFB800" },
                { name: "Europa Clipper", type: "🪐", status: "EN ROUTE",  color: "#00D4FF" },
                { name: "JWST",           type: "🔭", status: "ACTIVE",    color: "#00FF88" },
                { name: "Mars 2020",      type: "🔴", status: "ACTIVE",    color: "#00FF88" },
                { name: "Voyager 1",      type: "🚀", status: "ACTIVE",    color: "#00FF88" },
                { name: "OSIRIS-REx",     type: "☄️", status: "RETURNED",  color: "#AAAAAA" },
              ].map((m) => (
                <div key={m.name} className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]">{m.type}</span>
                    <span className="text-[10px] text-white/70" style={{ fontFamily: "var(--font-space-mono)" }}>{m.name}</span>
                  </div>
                  <span className="text-[8px] font-medium" style={{ color: m.color, fontFamily: "var(--font-space-mono)" }}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { href: "/satellites", icon: <Satellite size={13} />, label: "Explore Satellites" },
              { href: "/graveyard", icon: <Skull size={13} />, label: "Satellite Graveyard" },
              { href: "/analytics", icon: <BarChart3 size={13} />, label: "Orbit Analytics" },
              { href: "/ai-agent", icon: <Brain size={13} />, label: "Ask LUNA AI" },
            ].map((btn) => (
              <Link
                key={btn.href}
                href={btn.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-[#00D4FF] transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              >
                {btn.icon} {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Middle-left space weather panel */}
        <motion.div
          className="absolute left-6 w-64 pointer-events-auto"
          style={{ bottom: "calc(9rem + 226px + 12px)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <div className="glass-panel p-4">
            <p className="text-[10px] text-[#00D4FF] mb-3 font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
              ◉ SPACE WEATHER
            </p>
            <div className="space-y-2">
              {[
                { label: "Solar Wind",     value: "452 km/s",  status: "NOMINAL",  dot: "#00FF88" },
                { label: "Kp Index",       value: "2.3",       status: "QUIET",    dot: "#00FF88" },
                { label: "X-Ray Flux",     value: "B4.2",      status: "LOW",      dot: "#00FF88" },
                { label: "ISS Altitude",   value: "408 km",    status: "STABLE",   dot: "#00D4FF" },
                { label: "Debris (LEO)",   value: "27,182",    status: "TRACKED",  dot: "#FFB800" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px]" style={{ color: item.dot }}>●</span>
                    <span className="text-[10px] text-white/50" style={{ fontFamily: "var(--font-space-mono)" }}>{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-white/80 block" style={{ fontFamily: "var(--font-space-mono)" }}>{item.value}</span>
                    <span className="text-[8px]" style={{ color: item.dot, fontFamily: "var(--font-space-mono)" }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom-left live feed */}
        <motion.div
          className="absolute bottom-36 left-6 w-64 pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <div className="glass-panel p-4" style={{ maxHeight: "210px", overflow: "hidden" }}>
            <p className="text-[10px] text-[#00D4FF] mb-3 font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
              ◉ LIVE ORBITAL FEED
            </p>
            <div style={{ height: "150px", overflow: "hidden", position: "relative" }}>
              <div className="animate-scroll-up">
                {[...LIVE_FEED, ...LIVE_FEED].map((sat, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5 border-b border-white/5">
                    <span className="text-[10px] text-[#00FF88]">●</span>
                    <span className="text-[11px] text-white/80 flex-1 truncate" style={{ fontFamily: "var(--font-space-mono)" }}>
                      {sat.country} {sat.name}
                    </span>
                    <span className="text-[10px] text-white/30">{sat.orbit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom-center Ask LUNA bar */}
        <motion.div
          className="absolute bottom-4 left-0 right-0 px-4 pointer-events-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <form onSubmit={handleAskLuna} className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about any satellite, mission, or orbital event..."
                className="w-full px-5 py-4 pr-14 rounded-2xl text-sm text-white placeholder:text-white/40 outline-none"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(0, 212, 255, 0.4)",
                  boxShadow: "0 0 20px rgba(0,212,255,0.15)",
                  backdropFilter: "blur(20px)",
                  fontFamily: "var(--font-dm-sans)",
                }}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)" }}
              >
                <Search size={16} color="#00D4FF" />
              </button>
            </div>
          </form>
        </motion.div>

      </div>

      {/* Satellite detail panel */}
      <AnimatePresence>
        {selectedSat && (
          <motion.div
            className="absolute top-0 right-0 h-full w-72 z-30 pointer-events-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="h-full glass-panel rounded-none rounded-l-2xl p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] text-[#00D4FF] mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>
                    🛰️ SATELLITE DETECTED
                  </p>
                  <h3 className="text-base font-bold text-white leading-snug" style={{ fontFamily: "var(--font-syne)" }}>
                    {selectedSat}
                  </h3>
                </div>
                <button onClick={() => setSelectedSat(null)} className="text-white/40 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 flex-1">
                {[
                  { label: "STATUS", value: "● ACTIVE — Nominal Operations", color: "#00FF88" },
                  { label: "ORBIT TYPE", value: "Low Earth Orbit (LEO)", color: "white" },
                  { label: "ALTITUDE", value: "~400–600 km", color: "white" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-lg" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.08)" }}>
                    <p className="text-[10px] text-white/40 mb-1" style={{ fontFamily: "var(--font-space-mono)" }}>{item.label}</p>
                    <p className="text-xs text-white" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <Link
                href={`/ai-agent?q=${encodeURIComponent(`Tell me about the ${selectedSat} satellite`)}`}
                className="mt-4 w-full py-2.5 rounded-xl text-xs text-center font-medium transition-all hover:opacity-80 block"
                style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF" }}
              >
                Ask LUNA About This Satellite →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
