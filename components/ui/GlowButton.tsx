"use client";

import { ReactNode } from "react";
import { clsx } from "clsx";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "cyan" | "red" | "green" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

const variants = {
  cyan: {
    background: "rgba(0, 212, 255, 0.1)",
    border: "1px solid rgba(0, 212, 255, 0.4)",
    color: "#00D4FF",
    hoverShadow: "0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.1)",
  },
  red: {
    background: "rgba(255, 45, 85, 0.1)",
    border: "1px solid rgba(255, 45, 85, 0.4)",
    color: "#FF2D55",
    hoverShadow: "0 0 20px rgba(255, 45, 85, 0.4), 0 0 40px rgba(255, 45, 85, 0.1)",
  },
  green: {
    background: "rgba(0, 255, 136, 0.1)",
    border: "1px solid rgba(0, 255, 136, 0.4)",
    color: "#00FF88",
    hoverShadow: "0 0 20px rgba(0, 255, 136, 0.4)",
  },
  ghost: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "rgba(255,255,255,0.8)",
    hoverShadow: "0 0 10px rgba(255,255,255,0.1)",
  },
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function GlowButton({
  children,
  onClick,
  variant = "cyan",
  size = "md",
  className,
  disabled,
}: GlowButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "rounded-lg font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer",
        "hover:scale-[1.02] active:scale-[0.98]",
        s,
        disabled && "opacity-40 cursor-not-allowed",
        className
      )}
      style={{
        background: v.background,
        border: v.border,
        color: v.color,
        fontFamily: "var(--font-space-mono)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.boxShadow = v.hoverShadow;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {children}
    </button>
  );
}
