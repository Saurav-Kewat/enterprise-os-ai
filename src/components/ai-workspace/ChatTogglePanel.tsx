"use client";

/**
 * ChatTogglePanel
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps the left-panel chat area with a Demo / Live toggle.
 *
 * Default: Demo — shows the rich mock WatsonxChat.
 * Live:    Attempts the real IBM watsonx Orchestrate connection via
 *          WatsonProvider + WatsonChatPanel.
 *
 * The toggle is visible in the top-right of the panel header so the user
 * can switch at any time during a demo session.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Bot } from "lucide-react";
import { WatsonProvider, WatsonChatPanel } from "@/components/watsonx";
import { WatsonxChat } from "@/components/ai-workspace/WatsonxChat";
import type { WatsonConfig } from "@/lib/watson-config";
import { cn } from "@/lib/utils";

interface ChatTogglePanelProps {
  /** Watson config (null when no credentials are set) */
  watsonConfig: WatsonConfig | null;
}

type Mode = "demo" | "live";

export function ChatTogglePanel({ watsonConfig }: ChatTogglePanelProps) {
  const [mode, setMode] = useState<Mode>("demo");

  const hasCredentials = watsonConfig !== null;

  return (
    <div className="flex flex-col h-full">
      {/* ── Toggle header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/15">
            <BrainCircuit size={13} className="text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground">Chat Interface</span>
        </div>

        {/* ── Toggle pill ───────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-lg bg-card border border-border"
          role="group"
          aria-label="Chat mode"
        >
          {(["demo", "live"] as const).map((m) => {
            const isActive = mode === m;
            const isLiveDisabled = m === "live" && !hasCredentials;

            return (
              <button
                key={m}
                onClick={() => !isLiveDisabled && setMode(m)}
                disabled={isLiveDisabled}
                aria-pressed={isActive}
                aria-label={
                  m === "demo"
                    ? "Demo mode — simulated responses"
                    : hasCredentials
                    ? "Live mode — IBM watsonx Orchestrate"
                    : "Live mode — credentials not configured"
                }
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                  isActive
                    ? m === "live"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-accent text-foreground shadow-sm"
                    : "text-secondary hover:text-foreground",
                  isLiveDisabled && "opacity-40 cursor-not-allowed hover:text-secondary"
                )}
              >
                {/* Active indicator dot for live */}
                {m === "live" && isActive && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
                {m === "demo" && <Bot size={11} />}
                <span className="capitalize">{m}</span>
                {m === "live" && !hasCredentials && (
                  <span className="text-[9px] opacity-60">·no creds</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat panel ────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="wait" initial={false}>
          {mode === "demo" ? (
            <motion.div
              key="demo"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <WatsonxChat />
            </motion.div>
          ) : (
            <motion.div
              key="live"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {/*
               * WatsonProvider is mounted only when Live mode is active.
               * Unmounting it on switch to Demo cleanly destroys the IBM
               * instance and frees the script tag.
               */}
              <WatsonProvider config={watsonConfig}>
                <WatsonChatPanel />
              </WatsonProvider>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
