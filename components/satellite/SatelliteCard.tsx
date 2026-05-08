"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Satellite } from "@/lib/satellite-data";
import { ExternalLink } from "lucide-react";

const statusColors: Record<string, string> = {
  Active: "#00FF88",
  Inactive: "#6B7280",
  Deorbited: "#FF2D55",
  Lost: "#FF6B00",
  "Graveyard Orbit": "#9B59B6",
};

const orbitBg: Record<string, string> = {
  LEO: "rgba(0,212,255,0.12)",
  MEO: "rgba(0,102,255,0.12)",
  GEO: "rgba(255,184,0,0.12)",
  HEO: "rgba(0,255,136,0.1)",
  Interplanetary: "rgba(255,45,85,0.1)",
};

const orbitColor: Record<string, string> = {
  LEO: "#00D4FF",
  MEO: "#0066FF",
  GEO: "#FFB800",
  HEO: "#00FF88",
  Interplanetary: "#FF2D55",
};

export default function SatelliteCard({ satellite, index = 0 }: { satellite: Satellite; index?: number }) {
  const statusColor = statusColors[satellite.status] || "#6B7280";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/satellites/${satellite.id}`} className="block group">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = `${statusColor}33`;
            e.currentTarget.style.boxShadow = `0 8px 32px ${statusColor}11`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {/* Status strip */}
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ background: statusColor }}
          />

          <div className="pl-5 pr-4 py-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{satellite.countryFlag}</span>
                  <h3
                    className="font-bold text-white text-sm leading-snug truncate"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {satellite.name}
                  </h3>
                </div>
                <p
                  className="text-[11px] text-white/40 truncate"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                >
                  {satellite.agency}
                </p>
              </div>
              <ExternalLink
                size={14}
                className="text-white/20 group-hover:text-[#00D4FF] transition-colors flex-shrink-0 mt-1"
              />
            </div>

            <p
              className="text-xs text-white/50 mb-3 line-clamp-2 leading-relaxed"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {satellite.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: orbitBg[satellite.orbitType] || "rgba(255,255,255,0.05)",
                  color: orbitColor[satellite.orbitType] || "#fff",
                  border: `1px solid ${orbitColor[satellite.orbitType] || "#fff"}33`,
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                {satellite.orbitType}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium border"
                style={{
                  color: statusColor,
                  borderColor: `${statusColor}44`,
                  background: `${statusColor}11`,
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                ● {satellite.status}
              </span>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] text-white/30"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                {satellite.missionType}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
