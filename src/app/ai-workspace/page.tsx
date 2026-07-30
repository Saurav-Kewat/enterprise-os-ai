import type { Metadata } from "next";
import { ChatTogglePanel } from "@/components/ai-workspace/ChatTogglePanel";
import { AgentCollab } from "@/components/ai-workspace/AgentCollab";
import { AgentPipeline } from "@/components/ai-workspace/AgentPipeline";
import { getWatsonConfig } from "@/lib/watson-config";

export const metadata: Metadata = { title: "AI Workspace" };

const watsonConfig = getWatsonConfig();

export default function AIWorkspacePage() {
  return (
    <div className="flex gap-0 overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── Left: Chat panel with Demo / Live toggle (50%) ───────────── */}
      <div className="flex-1 min-w-0 flex flex-col p-4 border-r border-border overflow-hidden">
        <div className="flex-1 min-h-0">
          <ChatTogglePanel watsonConfig={watsonConfig} />
        </div>
      </div>

      {/* ── Centre: Agent Pipeline (25%) ─────────────────────────────── */}
      <div className="w-[260px] xl:w-[300px] shrink-0 flex flex-col p-4 border-r border-border overflow-hidden">
        <div className="flex-1 min-h-0">
          <AgentPipeline />
        </div>
      </div>

      {/* ── Right: Live agent collaboration (25%) ────────────────────── */}
      <div className="w-[360px] xl:w-[400px] shrink-0 flex flex-col p-4 overflow-hidden">
        <div className="flex-1 min-h-0">
          <AgentCollab />
        </div>
      </div>
    </div>
  );
}


