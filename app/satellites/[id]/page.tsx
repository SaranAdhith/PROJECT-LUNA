import { notFound } from "next/navigation";
import Link from "next/link";
import { getSatelliteById, satellites } from "@/lib/satellite-data";
import { Calendar, Rocket, Globe, Activity, DollarSign, ArrowLeft, Brain } from "lucide-react";

export function generateStaticParams() {
  return satellites.map((s) => ({ id: s.id }));
}

const statusColors: Record<string, string> = {
  Active: "#00FF88",
  Inactive: "#6B7280",
  Deorbited: "#FF2D55",
  Lost: "#FF6B00",
  "Graveyard Orbit": "#9B59B6",
};

const orbitColor: Record<string, string> = {
  LEO: "#00D4FF",
  MEO: "#0066FF",
  GEO: "#FFB800",
  HEO: "#00FF88",
  Interplanetary: "#FF2D55",
};

function OrbitDiagram({ orbitType }: { orbitType: string }) {
  const radii: Record<string, number> = {
    LEO: 55,
    MEO: 70,
    GEO: 85,
    HEO: 90,
    Interplanetary: 110,
  };
  const r = radii[orbitType] || 70;
  const col = orbitColor[orbitType] || "#00D4FF";

  return (
    <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto opacity-70">
      <circle cx="100" cy="100" r="30" fill="#1a6b3c" stroke="#00D4FF" strokeWidth="1" />
      <text x="100" y="105" textAnchor="middle" fill="#00D4FF" fontSize="8" fontFamily="Space Mono, monospace">
        EARTH
      </text>
      <ellipse
        cx="100"
        cy="100"
        rx={r}
        ry={r * 0.4}
        fill="none"
        stroke={col}
        strokeWidth="1.5"
        strokeDasharray="4 3"
        opacity="0.8"
      />
      <circle cx={100 + r} cy="100" r="5" fill={col} />
      <text x="100" y={100 - r * 0.4 - 8} textAnchor="middle" fill={col} fontSize="8" fontFamily="Space Mono, monospace">
        {orbitType}
      </text>
    </svg>
  );
}

export default async function SatelliteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const satellite = getSatelliteById(id);
  if (!satellite) notFound();

  const statusColor = statusColors[satellite.status] || "#6B7280";

  return (
    <main className="min-h-screen bg-[#030308]">
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-6xl mx-auto">
        <Link
          href="/satellites"
          className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white mb-6 transition-colors"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          <ArrowLeft size={12} /> Back to Database
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{satellite.countryFlag}</span>
                <div className="flex-1 min-w-0">
                  <h1
                    className="text-2xl sm:text-3xl font-black text-white mb-1 leading-tight"
                    style={{ fontFamily: "var(--font-syne)" }}
                  >
                    {satellite.name}
                  </h1>
                  <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {satellite.agency}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold border"
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
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    color: orbitColor[satellite.orbitType] || "#fff",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {satellite.orbitType}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs text-white/50"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    fontFamily: "var(--font-space-mono)",
                  }}
                >
                  {satellite.missionType}
                </span>
              </div>

              <p className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {satellite.description}
              </p>
            </div>

            {/* Facts */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <h2 className="text-sm font-bold text-[#00D4FF] mb-4" style={{ fontFamily: "var(--font-space-mono)" }}>
                ◉ KEY FACTS
              </h2>
              <ul className="space-y-3">
                {satellite.facts.map((fact, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[#00D4FF] mt-0.5 flex-shrink-0">▸</span>
                    <span className="text-white/70 text-sm leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                      {fact}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ask LUNA */}
            <Link
              href={`/ai-agent?q=${encodeURIComponent(`Tell me everything about the ${satellite.name}`)}`}
              className="flex items-center gap-3 p-4 rounded-2xl transition-all hover:opacity-80 hover:scale-[1.01]"
              style={{
                background: "rgba(0,212,255,0.06)",
                border: "1px solid rgba(0,212,255,0.2)",
              }}
            >
              <Brain size={20} color="#00D4FF" />
              <div>
                <p className="text-[#00D4FF] text-sm font-medium" style={{ fontFamily: "var(--font-syne)" }}>
                  Ask LUNA About This Satellite
                </p>
                <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Get AI-powered deep dive into {satellite.name}
                </p>
              </div>
              <span className="ml-auto text-[#00D4FF]">→</span>
            </Link>
          </div>

          {/* Right: Stats */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Calendar, label: "Launch Date", value: satellite.launchDate },
              { icon: Rocket, label: "Launch Vehicle", value: satellite.launchVehicle },
              { icon: Globe, label: "Orbit Type", value: satellite.orbitType },
              {
                icon: Activity,
                label: "Altitude",
                value:
                  satellite.altitudeKm > 1000000
                    ? `${(satellite.altitudeKm / 1000000).toFixed(1)}M km`
                    : satellite.altitudeKm > 0
                    ? `${satellite.altitudeKm.toLocaleString()} km`
                    : "Surface impact",
              },
              { icon: Globe, label: "Country", value: `${satellite.countryFlag} ${satellite.country}` },
              ...(satellite.costUSD ? [{ icon: DollarSign, label: "Estimated Cost", value: satellite.costUSD }] : []),
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(0,212,255,0.1)" }}
                >
                  <Icon size={16} color="#00D4FF" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/30 mb-0.5" style={{ fontFamily: "var(--font-space-mono)" }}>
                    {label}
                  </p>
                  <p className="text-sm text-white font-medium truncate" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    {value}
                  </p>
                </div>
              </div>
            ))}

            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[10px] text-white/30 mb-3 text-center" style={{ fontFamily: "var(--font-space-mono)" }}>
                ORBIT DIAGRAM
              </p>
              <OrbitDiagram orbitType={satellite.orbitType} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
