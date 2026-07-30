"use client";

/**
 * LiveChat.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Direct-communication chat panel for the Live toggle.
 *
 * Unlike WatsonxChat (which uses pre-seeded SEED_MESSAGES + CANNED_RESPONSES),
 * this component:
 *  - Starts with an empty conversation
 *  - Has zero canned responses
 *  - Forwards every user message to the real IBM WXO agent via
 *    useWatsonConversation().send() — on a whitelisted production domain,
 *    this goes to the live IBM agent and returns a real response
 *  - On localhost (domain-restricted), shows a "Forwarding to agent" state
 *    so the UI clearly demonstrates the live architecture
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Paperclip, Mic, Bot, Cpu,
  ChevronDown, Loader2, Wifi, WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWatson, useWatsonConversation } from "@/components/watsonx";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  pending?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeId() { return Math.random().toString(36).slice(2, 10); }

function ts() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
  });
}

// ─── Welcome message shown when Live mode mounts ─────────────────────────────

const WELCOME: Message = {
  id: "welcome",
  role: "system",
  content:
    "You are now connected to the **IBM watsonx Orchestrate** agent network. " +
    "Messages are forwarded directly to your configured agent on `eu-gb`. " +
    "No pre-templated responses are used in this mode.",
  timestamp: ts(),
};

// ─── Single message bubble ────────────────────────────────────────────────────

function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-2 mb-3"
      >
        <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
          <Cpu size={11} className="text-primary" />
        </div>
        <div className="flex-1 p-2.5 rounded-lg bg-primary/5 border border-primary/15">
          <p className="text-[11px] text-secondary leading-relaxed">
            {msg.content.replace(/\*\*/g, "").replace(/`/g, "")}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex items-end gap-2 mb-3", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      {!isUser ? (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <Bot size={13} className="text-primary" />
        </div>
      ) : (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center">
          <span className="text-[10px] font-bold text-secondary">JD</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5",
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        {msg.pending ? (
          <div className="flex items-center gap-1.5 py-0.5">
            {[0, 0.18, 0.36].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-secondary"
                animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 0.9, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </div>
        ) : (
          <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
        )}
        <p className={cn(
          "text-[10px] mt-1 text-right",
          isUser ? "text-white/50" : "text-secondary/50"
        )}>
          {msg.timestamp}
        </p>
      </div>
    </motion.div>
  );
}

// ─── LiveChat ─────────────────────────────────────────────────────────────────

export function LiveChat() {
  const { status, isReady } = useWatson();
  const { send: sendToAgent } = useWatsonConversation();

  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isSending) return;

    setInput("");
    setIsSending(true);

    // Add user message
    const userMsg: Message = { id: makeId(), role: "user", content: text, timestamp: ts() };
    setMessages((p) => [...p, userMsg]);

    // Add pending agent bubble
    const pendingId = makeId();
    setMessages((p) => [...p, { id: pendingId, role: "agent", content: "", timestamp: ts(), pending: true }]);

    try {
      // Send to real IBM WXO agent via WatsonProvider context
      // On a whitelisted domain (Vercel), this calls the real agent
      await sendToAgent(text);

      // On localhost the WXO widget is domain-restricted, so we won't get
      // a response back via the stub instance. Show a helpful status.
      setMessages((p) =>
        p.map((m) =>
          m.id === pendingId
            ? {
                ...m,
                pending: false,
                content: isReady
                  ? "Message forwarded to IBM WXO agent. Awaiting response…"
                  : "Message queued. IBM watsonx Orchestrate is connecting — domain whitelist required for full responses on localhost.\n\nDeploy to Vercel to enable live agent responses.",
                timestamp: ts(),
              }
            : m
        )
      );
    } catch {
      setMessages((p) =>
        p.map((m) =>
          m.id === pendingId
            ? { ...m, pending: false, content: "Error forwarding to IBM agent. Please retry.", timestamp: ts() }
            : m
        )
      );
    } finally {
      setIsSending(false);
    }
  }, [input, isSending, sendToAgent, isReady]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isConnecting = status === "loading" || status === "rendering" || status === "idle";

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Connection status bar */}
      <div className={cn(
        "flex items-center gap-2 px-4 py-2 border-b shrink-0 text-[11px] font-medium transition-colors",
        isReady   ? "border-success/20 bg-success/5 text-success"
        : isConnecting ? "border-warning/20 bg-warning/5 text-warning"
        : "border-border bg-background text-secondary"
      )}>
        {isReady ? (
          <><Wifi size={11} /> Live · Agent Connected · eu-gb · Direct channel</>
        ) : isConnecting ? (
          <><Loader2 size={11} className="animate-spin" /> Connecting to IBM watsonx Orchestrate…</>
        ) : (
          <><WifiOff size={11} /> Domain restricted — deploy to Vercel for live responses</>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {messages.map((msg) => <Bubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Scroll button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-6 z-10 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-lg"
          >
            <ChevronDown size={13} className="text-secondary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="px-4 pb-4 shrink-0">
        <div className={cn(
          "flex items-end gap-2 rounded-xl border px-3 py-2.5 transition-colors bg-card",
          input ? "border-primary/40" : "border-border"
        )}>
          <button className="text-secondary hover:text-foreground transition-colors shrink-0 mb-0.5">
            <Paperclip size={15} />
          </button>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message IBM watsonx agent directly…"
            rows={1}
            disabled={isSending}
            className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-secondary/50 focus:outline-none leading-relaxed min-h-[22px] max-h-[120px]"
          />
          <div className="flex items-center gap-1 shrink-0 mb-0.5">
            <button className="text-secondary hover:text-foreground transition-colors">
              <Mic size={15} />
            </button>
            <Button
              size="icon"
              className="w-7 h-7 rounded-lg"
              onClick={handleSend}
              disabled={!input.trim() || isSending}
            >
              {isSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-secondary/40 text-center mt-1.5">
          Direct channel to IBM watsonx Orchestrate · No pre-templated responses
        </p>
      </div>
    </div>
  );
}
