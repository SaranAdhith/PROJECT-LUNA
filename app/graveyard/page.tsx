"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { graveyardSatellites } from "@/lib/satellite-data";
import { Brain } from "lucide-react";

const FEATURED_DISASTERS = [
  {
    id: "kosmos-954",
    emoji: "☢️",
    name: "Kosmos-954",
    subtitle: "Nuclear Satellite Falls Over Canada",
    date: "January 24, 1978",
    story:
      "A Soviet RORSAT reconnaissance satellite powered by 50kg of enriched uranium dropped out of orbit, scattering radioactive debris across 600km of Canada's Northwest Territories. Operation Morning Light scrambled to recover fragments — the largest nuclear search operation in history.",
    cause: "Technical Failure",
    causeColor: "#FF6B00",
    debrisScore: 9,
    query: "Tell me about the Kosmos-954 nuclear satellite crash in Canada in 1978",
  },
  {
    id: "iridium-cosmos-collision",
    emoji: "💥",
    name: "Iridium-Cosmos Collision",
    subtitle: "First Accidental Satellite Collision",
    date: "February 10, 2009",
    story:
      "At 11.7 km/s, the active US Iridium 33 and the defunct Russian Kosmos-2251 collided 789km above Siberia. The impact vaporized both satellites and created over 2,000 trackable debris fragments that continue to threaten spacecraft today.",
    cause: "Human Error",
    causeColor: "#FF2D55",
    debrisScore: 10,
    query: "Tell me about the 2009 Iridium-Kosmos satellite collision in space",
  },
  {
    id: "skylab",
    emoji: "🔥",
    name: "Skylab",
    subtitle: "America's Falling Space Station",
    date: "July 11, 1979",
    story:
      "NASA's 77-tonne Skylab space station tumbled out of orbit after attempts to boost it failed. Debris rained down over the Indian Ocean and Western Australia. NASA was fined $400 by the town of Esperance for 'littering' — the bill was paid 30 years later by a US radio station.",
    cause: "Natural (Solar Activity)",
    causeColor: "#FFB800",
    debrisScore: 7,
    query: "Tell me about the Skylab reentry and crash in 1979",
  },
  {
    id: "vanguard-tv3",
    emoji: "💣",
    name: "Vanguard TV3",
    subtitle: "America's Most Embarrassing Launch Failure",
    date: "December 6, 1957",
    story:
      "Broadcast live on national TV, America's attempt to answer Sputnik exploded 2 seconds after ignition, reaching a majestic 1.2 meters of altitude before collapsing in a fireball. Soviet press gleefully dubbed it 'Kaputnik', 'Flopnik', and 'Stayputnik'.",
    cause: "Technical Failure",
    causeColor: "#FF6B00",
    debrisScore: 2,
    query: "Tell me about the Vanguard TV3 rocket explosion in 1957",
  },
  {
    id: "uars",
    emoji: "🛰️",
    name: "UARS",
    subtitle: "6-Ton NASA Satellite's Dramatic Reentry",
    date: "September 24, 2011",
    story:
      "NASA's 6-tonne Upper Atmosphere Research Satellite made international headlines as it tumbled toward Earth. The media reported a 1-in-3,200 chance of hitting a person. In the end, all fragments splashed harmlessly into the South Pacific, and NASA got great PR for 'uncontrolled reentry transparency'.",
    cause: "End of Mission",
    causeColor: "#6B7280",
    debrisScore: 3,
    query: "Tell me about the UARS satellite uncontrolled reentry in 2011",
  },
  {
    id: "mir",
    emoji: "🌊",
    name: "Mir Space Station",
    subtitle: "Russia's Iconic Station Controlled Deorbit",
    date: "March 23, 2001",
    story:
      "After 15 years of service and 125 astronauts, Russia deliberately deorbited the 137-tonne Mir space station. Hundreds of tonnes of debris burned up on reentry, with remaining fragments splashing down in the South Pacific near Fiji — witnessed by thousands on viewing ships and cheering crowds worldwide.",
    cause: "End of Mission",
    causeColor: "#6B7280",
    debrisScore: 6,
    query: "Tell me about the controlled deorbit of the Mir space station in 2001",
  },
];


function DebrisBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-white/30" style={{ fontFamily: "var(--font-space-mono)" }}>
        DEBRIS IMPACT
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${score * 10}%`,
            background: score >= 8 ? "#FF2D55" : score >= 5 ? "#FF6B00" : "#FFB800",
          }}
        />
      </div>
      <span className="text-[10px] font-bold" style={{ color: score >= 8 ? "#FF2D55" : score >= 5 ? "#FF6B00" : "#FFB800", fontFamily: "var(--font-space-mono)" }}>
        {score}/10
      </span>
    </div>
  );
}

export default function GraveyardPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGraveyard = graveyardSatellites.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#030308]">
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-black mb-3"
            style={{
              fontFamily: "var(--font-syne)",
              color: "#FF2D55",
              textShadow: "0 0 30px rgba(255,45,85,0.4)",
            }}
          >
            ☠️ THE SATELLITE GRAVEYARD
          </h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Where missions go to die. A record of every satellite lost to the cosmos.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { icon: "💀", value: "2,900+", label: "Deorbited" },
            { icon: "🔥", value: "1,400+", label: "Burned in Atmosphere" },
            { icon: "💥", value: "12+", label: "Collision Destroyed" },
            { icon: "☢️", value: "32+", label: "Nuclear-Powered Lost" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel-red text-center py-4 px-3"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-bold text-[#FF2D55]" style={{ fontFamily: "var(--font-space-mono)" }}>
                {stat.value}
              </div>
              <div className="text-[11px] text-white/40" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured disasters */}
        <h2
          className="text-lg font-bold text-[#FF2D55] mb-5"
          style={{ fontFamily: "var(--font-syne)", textShadow: "0 0 15px rgba(255,45,85,0.4)" }}
        >
          ◉ FEATURED SPACE DISASTERS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {FEATURED_DISASTERS.map((disaster, i) => (
            <motion.div
              key={disaster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: "rgba(255,45,85,0.04)",
                border: "1px solid rgba(255,45,85,0.15)",
              }}
            >
              <div className="p-5 flex-1">
                <div className="text-3xl mb-3">{disaster.emoji}</div>
                <h3
                  className="text-base font-bold text-white mb-0.5"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  {disaster.name}
                </h3>
                <p className="text-xs text-[#FF2D55] mb-3" style={{ fontFamily: "var(--font-space-mono)" }}>
                  {disaster.subtitle}
                </p>
                <p
                  className="text-[10px] text-white/30 mb-3"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {disaster.date}
                </p>
                <p className="text-xs text-white/60 mb-4 leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {disaster.story}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{
                      background: `${disaster.causeColor}18`,
                      border: `1px solid ${disaster.causeColor}44`,
                      color: disaster.causeColor,
                      fontFamily: "var(--font-space-mono)",
                    }}
                  >
                    {disaster.cause}
                  </span>
                </div>

                <DebrisBar score={disaster.debrisScore} />
              </div>

              <div className="px-5 pb-5">
                <Link
                  href={`/ai-agent?q=${encodeURIComponent(disaster.query)}`}
                  className="flex items-center gap-2 w-full justify-center py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                  style={{
                    background: "rgba(255,45,85,0.1)",
                    border: "1px solid rgba(255,45,85,0.3)",
                    color: "#FF2D55",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  <Brain size={12} /> Full Story →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Graveyard table */}
        <div className="glass-panel-red rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#FF2D55]/10 flex items-center justify-between flex-wrap gap-3">
            <h2
              className="text-sm font-bold text-[#FF2D55]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              ◉ COMPLETE GRAVEYARD REGISTRY ({graveyardSatellites.length} entries)
            </h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dead satellites..."
              className="px-3 py-1.5 rounded-lg text-xs text-white placeholder:text-white/30 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,45,85,0.2)",
                fontFamily: "var(--font-dm-sans)",
              }}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs" style={{ fontFamily: "var(--font-space-mono)" }}>
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "Country", "Status", "Year", "Orbit", "Mission"].map((col) => (
                    <th key={col} className="text-left px-5 py-3 text-white/30 font-normal text-[10px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredGraveyard.map((sat, i) => (
                  <motion.tr
                    key={sat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <Link href={`/satellites/${sat.id}`} className="text-white hover:text-[#FF2D55] transition-colors">
                        {sat.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-white/50">
                      {sat.countryFlag} {sat.country}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-[10px]"
                        style={{
                          color:
                            sat.status === "Deorbited"
                              ? "#FF2D55"
                              : sat.status === "Lost"
                              ? "#FF6B00"
                              : "#6B7280",
                        }}
                      >
                        ● {sat.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40">
                      {sat.launchDate.split("-")[0]}
                    </td>
                    <td className="px-5 py-3 text-white/40">{sat.orbitType}</td>
                    <td className="px-5 py-3 text-white/40">{sat.missionType}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
