"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatInterface from "@/components/ai/ChatInterface";

const EarthGlobe = dynamic(() => import("@/components/earth/EarthGlobe"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

function AIAgentContent() {
  const params = useSearchParams();
  const initialQuery = params.get("q") || undefined;

  return (
    <main className="relative min-h-screen bg-[#030308] overflow-hidden">
      <div className="relative z-10 pt-16 h-screen flex">
        {/* Left: Mini Earth Globe */}
        <div className="hidden lg:flex w-[40%] h-full items-center justify-center p-8">
          <div className="relative w-full h-full">
            <div className="absolute inset-0">
              <EarthGlobe mini />
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none">
              <p className="text-[10px] text-[#00D4FF]/60" style={{ fontFamily: "var(--font-space-mono)" }}>
                LIVE ORBITAL SIMULATION
              </p>
            </div>
          </div>
        </div>

        {/* Right: Chat Interface */}
        <div className="flex-1 h-full flex flex-col">
          <div className="flex-1 overflow-hidden m-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(0,212,255,0.1)" }}>
            <ChatInterface initialQuery={initialQuery} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function AIAgentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030308] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AIAgentContent />
    </Suspense>
  );
}
