"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import SatelliteCard from "@/components/satellite/SatelliteCard";
import { satellites, searchSatellites } from "@/lib/satellite-data";
import { Search, Filter } from "lucide-react";

const STATUS_FILTERS = ["All", "Active", "Inactive", "Deorbited", "Lost"];
const ORBIT_FILTERS = ["All", "LEO", "MEO", "GEO", "HEO", "Interplanetary"];
const MISSION_FILTERS = ["All", "Science", "Military", "Communication", "Navigation", "Weather", "Commercial", "Crewed"];


export default function SatellitesPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orbitFilter, setOrbitFilter] = useState("All");
  const [missionFilter, setMissionFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  const results = useMemo(
    () =>
      searchSatellites(query, {
        status: statusFilter,
        orbitType: orbitFilter,
        missionType: missionFilter,
        country: countryFilter,
      }),
    [query, statusFilter, orbitFilter, missionFilter, countryFilter]
  );

  return (
    <main className="min-h-screen bg-[#030308]">
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-black mb-3"
            style={{ fontFamily: "var(--font-syne)", color: "#00D4FF", textShadow: "0 0 30px rgba(0,212,255,0.3)" }}
          >
            🛰️ Satellite Database
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {satellites.length} documented missions — from Sputnik to Starlink
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="relative max-w-2xl mx-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search satellites by name, agency, or country..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-white placeholder:text-white/30 outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,212,255,0.2)",
                fontFamily: "var(--font-dm-sans)",
              }}
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <FilterRow label="Status" options={STATUS_FILTERS} value={statusFilter} onChange={setStatusFilter} color="#00D4FF" />
          <FilterRow label="Orbit" options={ORBIT_FILTERS} value={orbitFilter} onChange={setOrbitFilter} color="#0066FF" />
          <FilterRow label="Mission" options={MISSION_FILTERS} value={missionFilter} onChange={setMissionFilter} color="#00FF88" />
        </motion.div>

        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-space-mono)" }}>
            {results.length} satellite{results.length !== 1 ? "s" : ""} found
          </p>
          {(statusFilter !== "All" || orbitFilter !== "All" || missionFilter !== "All" || query) && (
            <button
              onClick={() => {
                setQuery("");
                setStatusFilter("All");
                setOrbitFilter("All");
                setMissionFilter("All");
                setCountryFilter("All");
              }}
              className="text-xs text-white/40 hover:text-white transition-colors flex items-center gap-1"
            >
              <Filter size={11} /> Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((sat, i) => (
              <SatelliteCard key={sat.id} satellite={sat} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🛰️</p>
            <p className="text-white/40 text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
              No satellites found in orbital database
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
  color,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  color: string;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] text-white/30 mr-1" style={{ fontFamily: "var(--font-space-mono)" }}>
        {label}:
      </span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
          style={{
            background: value === opt ? `${color}18` : "rgba(255,255,255,0.03)",
            border: value === opt ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.06)",
            color: value === opt ? color : "rgba(255,255,255,0.45)",
            fontFamily: "var(--font-space-mono)",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
