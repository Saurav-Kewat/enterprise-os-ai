"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/aiWorkspaceData";

// ─── Typing indicator ─────────────────────────────────────────────────────────

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2.5 mb-4"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
        <WatsonxIcon size={14} />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 0.18, 0.36].map((delay, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-secondary"
              animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Watsonx logo mark ────────────────────────────────────────────────────────

export function WatsonxIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Z"
        fill="#0F62FE"
        opacity="0.15"
      />
      <path
        d="M12 6.5c-3.038 0-5.5 2.462-5.5 5.5s2.462 5.5 5.5 5.5 5.5-2.462 5.5-5.5S15.038 6.5 12 6.5Z"
        fill="#0F62FE"
        opacity="0.4"
      />
      <circle cx="12" cy="12" r="2.5" fill="#0F62FE" />
    </svg>
  );
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
// Handles **bold**, *italic*, inline code, headings, bullet lists, tables

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inTable = false;

  const flushTable = () => {
    if (tableHeaders.length === 0) return;
    nodes.push(
      <div key={`tbl-${nodes.length}`} className="overflow-x-auto my-2">
        <table className="text-xs w-full border-collapse">
          <thead>
            <tr>
              {tableHeaders.map((h, i) => (
                <th key={i} className="px-2 py-1 text-left border border-border text-secondary font-medium bg-background">
                  {h.trim()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, ri) => (
              <tr key={ri} className="even:bg-background/50">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2 py-1 border border-border text-foreground">
                    {inlineFormat(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, i) => {
    // Table detection
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (line.replace(/\|/g, "").trim().replace(/-/g, "").trim() === "") {
        // separator row — skip
        return;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable();
    }

    if (line.trim() === "") {
      nodes.push(<div key={`br-${i}`} className="h-2" />);
    } else if (line.startsWith("### ")) {
      nodes.push(
        <p key={i} className="text-xs font-bold text-foreground mt-2 mb-0.5">
          {inlineFormat(line.slice(4))}
        </p>
      );
    } else if (line.startsWith("## ")) {
      nodes.push(
        <p key={i} className="text-sm font-bold text-foreground mt-2 mb-1">
          {inlineFormat(line.slice(3))}
        </p>
      );
    } else if (line.match(/^[-*] /)) {
      nodes.push(
        <div key={i} className="flex items-start gap-1.5 my-0.5">
          <span className="text-primary mt-0.5 shrink-0">•</span>
          <span className="text-xs">{inlineFormat(line.slice(2))}</span>
        </div>
      );
    } else {
      nodes.push(
        <p key={i} className="text-xs leading-relaxed">
          {inlineFormat(line)}
        </p>
      );
    }
  });

  if (inTable) flushTable();
  return nodes;
}

function inlineFormat(text: string): React.ReactNode {
  // Split on **bold**, *italic*, `code`
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="px-1 py-0.5 rounded bg-primary/10 text-primary font-mono text-[11px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

// ─── Single message bubble ────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: ChatMessage;
  index: number;
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: i * 0.05, ease: "easeOut" },
  }),
};

export function MessageBubble({ message, index }: MessageBubbleProps) {
  if (message.role === "system" || !message.content) return null;

  const isUser = message.role === "user";

  return (
    <motion.div
      custom={index}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={cn("flex items-end gap-2.5 mb-4", isUser && "flex-row-reverse")}
    >
      {/* Avatar */}
      {!isUser ? (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <WatsonxIcon size={14} />
        </div>
      ) : (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center">
          <span className="text-[10px] font-bold text-secondary">JD</span>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 space-y-1",
          isUser
            ? "bg-primary text-white rounded-br-sm"
            : "bg-card border border-border rounded-bl-sm"
        )}
      >
        <div className={cn("space-y-1", isUser && "text-white/90")}>
          {renderMarkdown(message.content)}
        </div>
        <p className={cn("text-[10px] mt-1 text-right", isUser ? "text-white/50" : "text-secondary/50")}>
          {message.timestamp}
        </p>
      </div>
    </motion.div>
  );
}
