import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-[#030308] flex items-center justify-center">
      <div className="relative z-10 text-center px-4">
        <div
          className="text-8xl mb-6 inline-block"
          style={{ filter: "drop-shadow(0 0 30px rgba(0,212,255,0.4))" }}
        >
          🛰️
        </div>
        <h1
          className="text-3xl sm:text-4xl font-black mb-3 text-white"
          style={{ fontFamily: "var(--font-syne)" }}
        >
          Satellite Not Found
        </h1>
        <p
          className="text-white/50 text-sm mb-8 max-w-md mx-auto"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          This object is not found in any known orbital database. It may have deorbited, been classified, or never existed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(0,212,255,0.1)",
              border: "1px solid rgba(0,212,255,0.3)",
              color: "#00D4FF",
              fontFamily: "var(--font-space-mono)",
            }}
          >
            ← Return to Mission Control
          </Link>
          <Link
            href="/satellites"
            className="px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "var(--font-space-mono)",
            }}
          >
            Browse Satellite Database
          </Link>
        </div>
        <p
          className="text-white/20 text-xs mt-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          ERROR 404 — ORBITAL OBJECT NOT CATALOGUED
        </p>
      </div>
    </main>
  );
}
