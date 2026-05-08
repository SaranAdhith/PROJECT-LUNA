"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Treemap,
} from "recharts";

const COUNTRY_DATA = [
  { country: "🇺🇸 USA", satellites: 5400, fill: "#00D4FF" },
  { country: "🇨🇳 China", satellites: 900, fill: "#0066FF" },
  { country: "🇬🇧 UK", satellites: 800, fill: "#0088CC" },
  { country: "🇷🇺 Russia", satellites: 400, fill: "#004499" },
  { country: "🇯🇵 Japan", satellites: 200, fill: "#0033AA" },
  { country: "🇮🇳 India", satellites: 150, fill: "#0055BB" },
  { country: "🇪🇺 Europe", satellites: 300, fill: "#003388" },
  { country: "🌍 Others", satellites: 850, fill: "#002266" },
];

const STATUS_DONUT = [
  { name: "Active", value: 9000, color: "#00FF88" },
  { name: "Inactive", value: 3200, color: "#6B7280" },
  { name: "Debris", value: 14800, color: "#FF2D55" },
];

const LAUNCH_TREND = [
  { year: "2000", launches: 103 },
  { year: "2002", launches: 127 },
  { year: "2004", launches: 134 },
  { year: "2006", launches: 112 },
  { year: "2008", launches: 126 },
  { year: "2010", launches: 120 },
  { year: "2012", launches: 149 },
  { year: "2014", launches: 192 },
  { year: "2016", launches: 228 },
  { year: "2018", launches: 382 },
  { year: "2019", launches: 496 },
  { year: "2020", launches: 1200 },
  { year: "2021", launches: 1713 },
  { year: "2022", launches: 2195 },
  { year: "2023", launches: 2877 },
  { year: "2024", launches: 3100 },
];

const MISSION_TYPE = [
  { name: "Commercial", value: 60, color: "#00D4FF" },
  { name: "Military", value: 15, color: "#FF2D55" },
  { name: "Science", value: 15, color: "#00FF88" },
  { name: "Government", value: 10, color: "#FFB800" },
];

const TREEMAP_DATA = [
  { name: "SpaceX Starlink", size: 6000, fill: "#00D4FF" },
  { name: "OneWeb", size: 648, fill: "#0066FF" },
  { name: "Planet Labs", size: 200, fill: "#0088FF" },
  { name: "Amazon Kuiper", size: 100, fill: "#004499" },
  { name: "Iridium NEXT", size: 66, fill: "#003388" },
  { name: "GPS", size: 31, fill: "#0055BB" },
  { name: "GLONASS", size: 24, fill: "#002266" },
  { name: "BeiDou", size: 35, fill: "#001155" },
  { name: "Galileo", size: 28, fill: "#00DD88" },
  { name: "Himawari", size: 2, fill: "#FFB800" },
];

const ORBIT_DIST = [
  { name: "LEO (<2,000 km)", value: 7800, color: "#00D4FF" },
  { name: "MEO (2–35k km)", value: 200, color: "#0066FF" },
  { name: "GEO (35,786 km)", value: 580, color: "#FFB800" },
  { name: "HEO/Other", value: 420, color: "#00FF88" },
];

const TOP_EXPENSIVE = [
  { name: "James Webb ST", cost: 10, fill: "#00D4FF" },
  { name: "Hubble ST", cost: 4.7, fill: "#0088FF" },
  { name: "GPS Block III", cost: 3.5, fill: "#0066FF" },
  { name: "Cassini", cost: 3.26, fill: "#004499" },
  { name: "Chandra X-ray", cost: 1.65, fill: "#003388" },
  { name: "NOAA-21 JPSS", cost: 1.5, fill: "#002266" },
  { name: "Sentinel-6", cost: 0.9, fill: "#001155" },
  { name: "Terra", cost: 1.3, fill: "#0033AA" },
  { name: "Landsat 9", cost: 0.75, fill: "#0044CC" },
  { name: "Fermi GBT", cost: 0.69, fill: "#0055DD" },
];

const DARK_TOOLTIP_STYLE = {
  contentStyle: {
    background: "rgba(3,3,8,0.95)",
    border: "1px solid rgba(0,212,255,0.2)",
    borderRadius: "8px",
    color: "white",
    fontSize: "11px",
    fontFamily: "Space Mono, monospace",
  },
};

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.08)" }}
    >
      <p className="text-[10px] text-[#00D4FF] mb-4 font-medium" style={{ fontFamily: "var(--font-space-mono)" }}>
        ◉ {title}
      </p>
      {children}
    </motion.div>
  );
}

function CounterStrip() {
  const total = useCountUp(27000);
  const active = useCountUp(9000);
  const inactive = useCountUp(3200);
  const debris = useCountUp(14800);

  return (
    <div
      className="rounded-2xl p-4 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
      style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}
    >
      {[
        { emoji: "🛰️", count: total, label: "Total Tracked Objects", color: "#00D4FF" },
        { emoji: "✅", count: active, label: "Active Satellites", color: "#00FF88" },
        { emoji: "💀", count: inactive, label: "Inactive Objects", color: "#6B7280" },
        { emoji: "☄️", count: debris, label: "Debris Pieces", color: "#FF2D55" },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-xl mb-1">{item.emoji}</div>
          <div className="text-xl font-bold" style={{ fontFamily: "var(--font-space-mono)", color: item.color }}>
            {item.count.toLocaleString()}+
          </div>
          <div className="text-[10px] text-white/40 mt-0.5" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

const CustomTreemapContent = ({ x, y, width, height, name, fill }: {
  x?: number; y?: number; width?: number; height?: number; name?: string; fill?: string;
  [key: string]: unknown;
}) => {
  const px = x ?? 0, py = y ?? 0, pw = width ?? 0, ph = height ?? 0;
  if (pw < 30 || ph < 20) return null;
  return (
    <g>
      <rect x={px} y={py} width={pw} height={ph} fill={fill || "#00D4FF"} stroke="rgba(0,0,0,0.3)" strokeWidth={1} rx={4} />
      {pw > 60 && ph > 30 && (
        <text x={px + pw / 2} y={py + ph / 2} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={Math.min(11, pw / 8)} fontFamily="Space Mono, monospace">
          {name}
        </text>
      )}
    </g>
  );
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#030308]">
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
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
            📊 Orbit Analytics
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Data-driven insights into Earth&apos;s orbital ecosystem
          </p>
        </motion.div>

        <CounterStrip />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Country dominance */}
          <ChartCard title="WHO OWNS SPACE? (Active Satellites by Country)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={COUNTRY_DATA} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="country" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v) => [`${(v as number).toLocaleString()} satellites`]} />
                <Bar dataKey="satellites" radius={[0, 6, 6, 0]}>
                  {COUNTRY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Active/Inactive/Debris */}
          <ChartCard title="ORBITAL STATUS DISTRIBUTION">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={STATUS_DONUT} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
                  {STATUS_DONUT.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v) => [(v as number).toLocaleString()]} />
                <Legend
                  formatter={(value) => <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontFamily: "Space Mono, monospace" }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Launch trend */}
          <ChartCard title="SATELLITES LAUNCHED PER YEAR (The Starlink Effect)">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={LAUNCH_TREND} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v) => [`${v} launches`]} />
                <Line type="monotone" dataKey="launches" stroke="#00D4FF" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "#00D4FF" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Mission types */}
          <ChartCard title="MISSION TYPES BREAKDOWN">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={MISSION_TYPE} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={{ stroke: "rgba(255,255,255,0.2)" }}>
                  {MISSION_TYPE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Space dominance treemap */}
          <ChartCard title="SPACE DOMINANCE — Companies by Satellite Count">
            <ResponsiveContainer width="100%" height={220}>
              <Treemap
                data={TREEMAP_DATA}
                dataKey="size"
                content={<CustomTreemapContent />}
              />
            </ResponsiveContainer>
          </ChartCard>

          {/* Most expensive satellites */}
          <ChartCard title="TOP 10 MOST EXPENSIVE SATELLITES (Billion USD)">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={TOP_EXPENSIVE} layout="vertical" margin={{ left: 5, right: 15 }}>
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "Space Mono" }} axisLine={false} tickLine={false} width={100} />
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(v) => [`$${v}B`]} />
                <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                  {TOP_EXPENSIVE.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Orbit heatmap */}
        <ChartCard title="ORBIT ALTITUDE DISTRIBUTION — Where Do Satellites Actually Live?">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ORBIT_DIST.map((orbit) => (
              <div
                key={orbit.name}
                className="text-center p-4 rounded-xl"
                style={{ background: `${orbit.color}0A`, border: `1px solid ${orbit.color}25` }}
              >
                <div
                  className="text-2xl font-black mb-1"
                  style={{ color: orbit.color, fontFamily: "var(--font-space-mono)" }}
                >
                  {orbit.value.toLocaleString()}
                </div>
                <div className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {orbit.name}
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(orbit.value / 9000) * 100}%`, background: orbit.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </main>
  );
}
