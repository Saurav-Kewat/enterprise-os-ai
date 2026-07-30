"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  RotateCcw,
  ChevronDown,
  Sparkles,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageBubble, TypingIndicator, WatsonxIcon } from "./ChatComponents";
import {
  SEED_MESSAGES,
  CANNED_RESPONSES,
  type ChatMessage,
} from "@/lib/aiWorkspaceData";
import { cn } from "@/lib/utils";

// ─── Suggested prompts ────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  { label: "Agent status", prompt: "What is the status of all agents?" },
  { label: "Finance update", prompt: "What are the current financial metrics?" },
  { label: "HR summary", prompt: "Give me an HR workforce summary." },
  { label: "Generate report", prompt: "Generate an executive report now." },
  { label: "Knowledge search", prompt: "Search the knowledge base for compliance documents." },
];

function matchCannedResponse(input: string) {
  const lower = input.toLowerCase();
  if (lower.includes("finance") || lower.includes("revenue") || lower.includes("financial")) {
    return CANNED_RESPONSES.finance;
  }
  if (lower.includes("hr") || lower.includes("headcount") || lower.includes("employee") || lower.includes("workforce")) {
    return CANNED_RESPONSES.hr;
  }
  if (lower.includes("knowledge") || lower.includes("document") || lower.includes("search")) {
    return CANNED_RESPONSES.knowledge;
  }
  if (lower.includes("report") || lower.includes("executive") || lower.includes("generate")) {
    return CANNED_RESPONSES.report;
  }
  if (lower.includes("status") || lower.includes("agent") || lower.includes("all")) {
    return CANNED_RESPONSES.agents;
  }
  return CANNED_RESPONSES.default;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function now() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WatsonxChat({ headerless = false }: { headerless?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    SEED_MESSAGES.filter((m) => m.role !== "system")
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, []);

  useEffect(() => {
    if (!isTyping) scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 120);
  };

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      const userMsg: ChatMessage = {
        id: makeId(),
        role: "user",
        content: trimmed,
        timestamp: now(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate variable response latency
      const delay = 1200 + Math.random() * 800;
      setTimeout(() => {
        const response = matchCannedResponse(trimmed);
        const assistantMsg: ChatMessage = {
          id: makeId(),
          role: "assistant",
          content: response.content,
          timestamp: now(),
          agentRefs: response.agentRefs,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages(SEED_MESSAGES.filter((m) => m.role !== "system"));
    setIsTyping(false);
    setInput("");
  };

  return (
    <div className={cn("flex flex-col h-full bg-background overflow-hidden", !headerless && "rounded-lg border border-border")}>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      {!headerless && (
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-sidebar shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <WatsonxIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">watsonx Orchestrate</span>
              <Badge variant="default" className="text-[10px] py-0 px-1.5">IBM</Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[11px] text-secondary">Connected · granite-13b-chat</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={resetChat} aria-label="Reset conversation">
            <RotateCcw size={14} />
          </Button>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/10 border border-primary/20">
            <Cpu size={11} className="text-primary" />
            <span className="text-[10px] text-primary font-medium">6 agents active</span>
          </div>
        </div>
      </div>
      )}

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id} message={msg} index={i} />
        ))}

        <AnimatePresence>{isTyping && <TypingIndicator />}</AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Scroll-to-bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-32 right-6 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/40 transition-colors"
            aria-label="Scroll to bottom"
          >
            <ChevronDown size={14} className="text-secondary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Suggested prompts ─────────────────────────────────────────────── */}
      <div className="px-4 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTED_PROMPTS.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.prompt)}
              disabled={isTyping}
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-card text-secondary hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-40"
            >
              <Sparkles size={10} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4 shrink-0">
        <div
          className={cn(
            "flex items-end gap-2 rounded-xl border bg-card px-3 py-2.5 transition-colors",
            input ? "border-primary/40" : "border-border"
          )}
        >
          <button
            className="text-secondary hover:text-foreground transition-colors shrink-0 mb-0.5"
            aria-label="Attach file"
          >
            <Paperclip size={15} />
          </button>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              // auto-resize
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message watsonx Orchestrate…"
            rows={1}
            disabled={isTyping}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-secondary/50 focus:outline-none leading-relaxed min-h-[22px] max-h-[120px] overflow-y-auto"
            aria-label="Chat input"
          />

          <div className="flex items-center gap-1 shrink-0 mb-0.5">
            <button
              className="text-secondary hover:text-foreground transition-colors"
              aria-label="Voice input"
            >
              <Mic size={15} />
            </button>
            <Button
              size="icon"
              className="w-7 h-7 rounded-lg"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={13} />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-secondary/40 text-center mt-1.5">
          Powered by IBM watsonx · Enterprise data stays private
        </p>
      </div>
    </div>
  );
}
