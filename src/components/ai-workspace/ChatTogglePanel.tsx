"use client";

/**
 * ChatTogglePanel
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the left-panel chat area with a Demo / Live toggle embedded
 * directly in the panel's own header row — no separate toggle bar above.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";
import { WatsonProvider } from "@/components/watsonx";
import { WatsonxChat } from "@/components/ai-workspace/WatsonxChat";
import { LiveChat } from "@/components/ai-workspace/LiveChat";
import { WatsonxIcon } from "@/components/ai-workspace/ChatComponents";
import { Badge } from "@/components/ui/badge";
import type { WatsonConfig } from "@/lib/watson-config";
import { cn } from "@/lib/utils";

interface ChatTogglePanelProps {
  watsonConfig: WatsonConfig | null;
}

type Mode = "demo" | "live";

// ─── Toggle pill (rendered inside the shared header) ─────────────────────────

interface ToggleProps {
  mode: Mode;
  onChange: (m: Mode) => void;
}

function ModeToggle({ mode, onChange }: ToggleProps) {
  return (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg bg-background border border-border shrink-0"
      role="group"
      aria-label="Chat mode"
    >
      {(["demo", "live"] as const).map((m) => {
        const isActive = mode === m;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            aria-pressed={isActive}
            aria-label={m === "demo" ? "Demo mode — simulated responses" : "Live mode — IBM watsonx Orchestrate"}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all duration-200",
              isActive
                ? m === "live"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-accent text-foreground shadow-sm"
                : "text-secondary hover:text-foreground"
            )}
          >
            {m === "live" && isActive && (
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white shrink-0"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
            )}
            {m === "demo" && <Bot size={10} className="shrink-0" />}
            <span className="capitalize">{m}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Shared header (same height as WatsonxChat's own header) ─────────────────

interface SharedHeaderProps {
  mode: Mode;
  onChange: (m: Mode) => void;
}

function SharedHeader({ mode, onChange }: SharedHeaderProps) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-sidebar shrink-0">
      <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
        <WatsonxIcon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">watsonx Orchestrate</span>
          <Badge variant="default" className="text-[10px] py-0 px-1.5 shrink-0">IBM</Badge>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {mode === "demo" ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] text-success">Demo mode · Simulated</span>
            </>
          ) : (
            <>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <span className="text-[11px] text-primary">Live · IBM WXO Agent · Direct channel</span>
            </>
          )}
        </div>
      </div>

      {/* Toggle embedded in header right side */}
      <ModeToggle mode={mode} onChange={onChange} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ChatTogglePanel({ watsonConfig }: ChatTogglePanelProps) {
  const [mode, setMode] = useState<Mode>("demo");

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border overflow-hidden">
      {/* Single shared header — toggle lives here */}
      <SharedHeader mode={mode} onChange={setMode} />

      {/* Chat body — fills remaining height, no extra header */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "demo" ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {/*
               * Pass headerless=true to WatsonxChat so it skips rendering
               * its own header (we rendered it above via SharedHeader).
               */}
              <WatsonxChat headerless />
            </motion.div>
          ) : (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              {/*
               * WatsonProvider initialises the IBM WXO connection.
               * LiveChat uses useWatsonConversation().send() to forward
               * messages directly to the live IBM agent — no canned responses.
               */}
              <WatsonProvider config={watsonConfig}>
                <LiveChat />
              </WatsonProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


interface ChatTogglePanelProps {
  /** Watson config (null when no credentials are set) */
  watsonConfig: WatsonConfig | null;
}
