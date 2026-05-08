"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen, Loader2 } from "lucide-react";

const CATEGORIES = [
  {
    name: "Satellites",
    icon: "🛰️",
    topics: ["GPS Constellation", "Geostationary Orbit", "CubeSats", "Spy Satellites", "Starlink Mega-Constellation", "Spy Satellites", "Weather Satellites"],
  },
  {
    name: "Rockets",
    icon: "🚀",
    topics: ["Falcon 9 Reusability", "Saturn V", "Soyuz Rocket", "Ariane 5", "Long March Series", "Starship", "Electron Rocket"],
  },
  {
    name: "Space Agencies",
    icon: "🏛️",
    topics: ["NASA", "ISRO", "ESA", "CNSA", "Roscosmos", "JAXA", "SpaceX"],
  },
  {
    name: "Orbital Concepts",
    icon: "🌐",
    topics: ["Kessler Syndrome", "Lagrange Points", "Orbital Mechanics", "Geostationary Orbit", "Orbital Debris", "Space Weather", "Reentry Physics"],
  },
  {
    name: "Space History",
    icon: "📚",
    topics: ["Space Race", "Moon Landings", "Sputnik Crisis", "Columbia Disaster", "Challenger Disaster", "Mir Space Station", "Hubble Servicing Missions"],
  },
  {
    name: "Physics",
    icon: "⚛️",
    topics: ["Orbital Velocity", "Escape Velocity", "Tsiolkovsky Equation", "Hohmann Transfer", "Gravitational Assist", "Tidal Locking", "Lagrange Points"],
  },
];

function MarkdownRenderer({ content }: { content: string }) {
  const html = content
    .replace(/^### (.*$)/gm, '<h3 style="font-size:1rem;font-weight:700;color:#00D4FF;margin:1.2rem 0 0.4rem;font-family:var(--font-syne)">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="font-size:1.2rem;font-weight:800;color:#00D4FF;margin:1.5rem 0 0.5rem;font-family:var(--font-syne)">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="font-size:1.5rem;font-weight:900;color:#00D4FF;margin:0 0 0.75rem;font-family:var(--font-syne)">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:white;font-weight:700">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:rgba(255,255,255,0.8)">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(0,212,255,0.1);padding:1px 5px;border-radius:4px;font-family:var(--font-space-mono);font-size:0.8em;color:#00D4FF">$1</code>')
    .replace(/^- (.*$)/gm, '<li style="margin:0.25rem 0;padding-left:0.5rem;color:rgba(255,255,255,0.7)">▸ $1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul style="margin:0.5rem 0 0.75rem;list-style:none;padding:0">$&</ul>')
    .split("\n\n")
    .map((para) => {
      if (para.startsWith("<h") || para.startsWith("<ul") || para.startsWith("<li")) return para;
      return `<p style="color:rgba(255,255,255,0.65);line-height:1.7;margin:0.6rem 0;font-size:0.875rem">${para}</p>`;
    })
    .join("\n");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      style={{ fontFamily: "var(--font-dm-sans)" }}
    />
  );
}

export default function SpacepediaPage() {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].name);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const loadTopic = async (topic: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setSelectedTopic(topic);
    setContent("");
    setStreamingContent("");
    setIsLoading(true);

    const prompt = `Write a comprehensive Spacepedia entry about "${topic}". Include:
- A brief overview (2-3 sentences)
- History and background
- Technical specifications or key details where relevant
- Key facts and significance
- Current status or future outlook

Format as clean markdown with clear ## sections. Be informative, accurate, and engaging. Aim for 400-600 words.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          mode: "normal",
        }),
        signal: abortRef.current.signal,
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let full = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  full += parsed.delta.text;
                  setStreamingContent(full);
                }
              } catch { /* skip */ }
            }
          }
        }
      }

      setContent(full);
      setStreamingContent("");
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setContent("⚠️ Unable to load article. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentCategory = CATEGORIES.find((c) => c.name === selectedCategory);
  const displayContent = streamingContent || content;

  return (
    <main className="min-h-screen bg-[#030308]">
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl sm:text-5xl font-black mb-3"
            style={{ fontFamily: "var(--font-syne)", color: "#00D4FF", textShadow: "0 0 30px rgba(0,212,255,0.3)" }}
          >
            📡 Spacepedia
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
            AI-powered encyclopedia of space concepts — ask LUNA to explain anything
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Left sidebar */}
          <div className="lg:col-span-1">
            <div
              className="rounded-2xl overflow-hidden sticky top-20"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.08)" }}
            >
              <div className="p-4 border-b border-white/5">
                <p className="text-[10px] text-[#00D4FF]" style={{ fontFamily: "var(--font-space-mono)" }}>
                  ◉ TOPICS
                </p>
              </div>
              <div className="p-2">
                {CATEGORIES.map((cat) => (
                  <div key={cat.name}>
                    <button
                      onClick={() => setSelectedCategory(cat.name)}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5"
                      style={{
                        background: selectedCategory === cat.name ? "rgba(0,212,255,0.08)" : "transparent",
                        color: selectedCategory === cat.name ? "#00D4FF" : "rgba(255,255,255,0.5)",
                        fontFamily: "var(--font-dm-sans)",
                      }}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <ChevronRight size={12} className="ml-auto" />
                    </button>

                    {selectedCategory === cat.name && (
                      <div className="mb-2 pl-3">
                        {cat.topics.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => loadTopic(topic)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all"
                            style={{
                              background: selectedTopic === topic ? "rgba(0,212,255,0.06)" : "transparent",
                              color: selectedTopic === topic ? "#00D4FF" : "rgba(255,255,255,0.35)",
                              fontFamily: "var(--font-dm-sans)",
                            }}
                          >
                            ▸ {topic}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl min-h-[500px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.08)" }}
            >
              {!selectedTopic ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 text-center">
                  <BookOpen size={40} color="rgba(0,212,255,0.3)" className="mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                    Select a Topic
                  </h3>
                  <p className="text-white/40 text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
                    Choose any topic from the sidebar to get an AI-generated Spacepedia article
                  </p>
                </div>
              ) : (
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    {isLoading && !streamingContent ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-3 mb-6"
                      >
                        <Loader2 size={16} color="#00D4FF" className="animate-spin" />
                        <span className="text-[#00D4FF] text-xs" style={{ fontFamily: "var(--font-space-mono)" }}>
                          Accessing orbital knowledge database...
                        </span>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {displayContent && (
                    <motion.div
                      key={selectedTopic}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <MarkdownRenderer content={displayContent} />
                      {isLoading && (
                        <span className="inline-block w-0.5 h-4 bg-[#00D4FF] ml-0.5 animate-pulse" />
                      )}
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: related topics + quick ask */}
          <div className="lg:col-span-1 space-y-4">
            {selectedTopic && currentCategory && (
              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(0,212,255,0.08)" }}
              >
                <p className="text-[10px] text-[#00D4FF] mb-3" style={{ fontFamily: "var(--font-space-mono)" }}>
                  ◉ RELATED TOPICS
                </p>
                <div className="space-y-1">
                  {currentCategory.topics
                    .filter((t) => t !== selectedTopic)
                    .slice(0, 5)
                    .map((topic) => (
                      <button
                        key={topic}
                        onClick={() => loadTopic(topic)}
                        className="w-full text-left text-xs px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        → {topic}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.15)" }}
            >
              <p className="text-[10px] text-[#00D4FF] mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                ◉ ASK LUNA ANYTHING
              </p>
              <p className="text-xs text-white/50 mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Want a deeper explanation or have a custom question?
              </p>
              <a
                href="/ai-agent"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium"
                style={{
                  background: "rgba(0,212,255,0.1)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  color: "#00D4FF",
                  fontFamily: "var(--font-space-mono)",
                }}
              >
                🌕 Open LUNA AI →
              </a>
            </div>

            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="text-[10px] text-white/30 mb-2" style={{ fontFamily: "var(--font-space-mono)" }}>
                TOPIC CATEGORIES
              </p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="px-2 py-1 rounded-full text-[10px] transition-all"
                    style={{
                      background: selectedCategory === cat.name ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                      border: selectedCategory === cat.name ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.06)",
                      color: selectedCategory === cat.name ? "#00D4FF" : "rgba(255,255,255,0.3)",
                      fontFamily: "var(--font-space-mono)",
                    }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
