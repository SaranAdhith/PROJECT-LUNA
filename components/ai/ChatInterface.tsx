"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, Zap } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED_PROMPTS = [
  "How many satellites orbit Earth right now?",
  "Which country dominates low Earth orbit?",
  "What happened to Sputnik 1?",
  "Why are Starlink satellites controversial?",
  "What are the biggest space debris risks?",
  "Which satellites crashed into Earth?",
];

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-[#00D4FF]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ message, isStreaming }: { message: Message; isStreaming?: boolean }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-1"
          style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}
        >
          <span className="text-sm">🌕</span>
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed`}
        style={
          isUser
            ? {
                background: "rgba(0, 212, 255, 0.12)",
                border: "1px solid rgba(0, 212, 255, 0.3)",
                borderRadius: "18px 18px 4px 18px",
                color: "white",
                fontFamily: "var(--font-dm-sans)",
              }
            : {
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px 18px 18px 18px",
                color: "rgba(255,255,255,0.9)",
                fontFamily: "var(--font-dm-sans)",
              }
        }
      >
        {isStreaming && message.content === "" ? (
          <TypingDots />
        ) : (
          <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: message.content
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/`(.*?)`/g, '<code style="background:rgba(0,212,255,0.1);padding:1px 4px;border-radius:4px;font-family:var(--font-space-mono);font-size:0.8em">$1</code>'),
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

interface ChatInterfaceProps {
  initialQuery?: string;
}

export default function ChatInterface({ initialQuery }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [mode, setMode] = useState<"normal" | "alien">("normal");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialQuerySent = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  useEffect(() => {
    if (initialQuery && !initialQuerySent.current) {
      initialQuerySent.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          mode,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (delta) {
                  fullContent += delta;
                  setStreamingContent(fullContent);
                }
              } catch {
                // non-JSON line, skip
              }
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: fullContent }]);
      setStreamingContent("");
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Signal lost. Unable to reach orbital intelligence network. Please check your API key and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingContent("");
    initialQuerySent.current = false;
  };

  const hasMessages = messages.length > 0 || isLoading;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div>
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
            🌕 LUNA AI
          </h2>
          <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-space-mono)" }}>
            Satellite Intelligence Agent
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasMessages && (
            <button
              onClick={clearChat}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
              title="Clear chat"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button
            onClick={() => setMode(mode === "normal" ? "alien" : "normal")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: mode === "alien" ? "rgba(255,45,85,0.15)" : "rgba(0,212,255,0.08)",
              border: mode === "alien" ? "1px solid rgba(255,45,85,0.4)" : "1px solid rgba(0,212,255,0.2)",
              color: mode === "alien" ? "#FF2D55" : "#00D4FF",
              fontFamily: "var(--font-space-mono)",
            }}
          >
            <Zap size={12} />
            {mode === "alien" ? "👽 CLASSIFIED" : "🤖 NORMAL"}
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <div className="text-center mb-8">
                <div
                  className="text-6xl mb-4 animate-float inline-block"
                  style={{ filter: "drop-shadow(0 0 20px rgba(0,212,255,0.5))" }}
                >
                  🌕
                </div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>
                  Ask LUNA anything
                </h3>
                <p className="text-white/40 text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  Your AI guide to Earth&apos;s orbital infrastructure
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left p-3 rounded-xl text-xs text-white/60 hover:text-white transition-all hover:scale-[1.02]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      fontFamily: "var(--font-dm-sans)",
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isLoading && streamingContent !== "" && (
          <MessageBubble
            message={{ role: "assistant", content: streamingContent }}
            isStreaming={streamingContent === ""}
          />
        )}

        {isLoading && streamingContent === "" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start mb-4"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-2 flex-shrink-0"
              style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}
            >
              <span className="text-sm">🌕</span>
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px 18px 18px 18px",
              }}
            >
              <TypingDots />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-6 py-4 border-t border-white/5">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about satellites, orbital mechanics, space history..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none resize-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(0,212,255,0.2)",
              fontFamily: "var(--font-dm-sans)",
              minHeight: "44px",
              maxHeight: "120px",
            }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "44px";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            style={{ background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)" }}
          >
            <Send size={16} color="#00D4FF" />
          </button>
        </form>
        <p className="text-[10px] text-white/20 mt-1.5 text-center" style={{ fontFamily: "var(--font-space-mono)" }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
