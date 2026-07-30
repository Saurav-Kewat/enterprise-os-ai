// ─── AI Workspace Types ───────────────────────────────────────────────────────

export type AgentStatus = "running" | "idle" | "paused" | "error" | "completed";

export interface AgentLog {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface AgentData {
  id: string;
  name: string;
  role: string;
  model: string;
  color: string;
  icon: string;
  status: AgentStatus;
  currentTask: string;
  progress: number; // 0–100
  tasksCompleted: number;
  tokensUsed: number;
  logs: AgentLog[];
}

export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  agentRefs?: string[]; // agents referenced in the response
}

// ─── Mock Agent Definitions ───────────────────────────────────────────────────

export const INITIAL_AGENTS: AgentData[] = [
  {
    id: "finance",
    name: "Finance Agent",
    role: "Financial Analysis & Forecasting",
    model: "watsonx/granite-13b-chat",
    color: "#0F62FE",
    icon: "TrendingUp",
    status: "running",
    currentTask: "Analysing Q3 revenue variance vs forecast",
    progress: 67,
    tasksCompleted: 18,
    tokensUsed: 142800,
    logs: [
      { id: "f1", timestamp: "09:14:32", message: "Revenue variance computation started", type: "info" },
      { id: "f2", timestamp: "09:14:45", message: "Loaded 24 months of historical data", type: "success" },
      { id: "f3", timestamp: "09:15:02", message: "Applying seasonal adjustment model", type: "info" },
    ],
  },
  {
    id: "hr",
    name: "HR Agent",
    role: "People Operations & Talent Insights",
    model: "watsonx/granite-7b-instruct",
    color: "#24A148",
    icon: "Users",
    status: "running",
    currentTask: "Generating headcount forecast for FY2027",
    progress: 42,
    tasksCompleted: 11,
    tokensUsed: 89200,
    logs: [
      { id: "h1", timestamp: "09:10:15", message: "Employee data pipeline connected", type: "success" },
      { id: "h2", timestamp: "09:11:40", message: "Attrition model v2.3 loaded", type: "info" },
      { id: "h3", timestamp: "09:13:22", message: "Processing 1,240 employee records", type: "info" },
    ],
  },
  {
    id: "project",
    name: "Project Agent",
    role: "Project Intelligence & Risk Monitoring",
    model: "watsonx/granite-13b-chat",
    color: "#8A3FFC",
    icon: "FolderKanban",
    status: "idle",
    currentTask: "Awaiting trigger — next scheduled at 10:00",
    progress: 0,
    tasksCompleted: 7,
    tokensUsed: 54100,
    logs: [
      { id: "p1", timestamp: "08:59:50", message: "Risk scan completed — 2 medium flags raised", type: "warning" },
      { id: "p2", timestamp: "09:00:05", message: "Report dispatched to PMO inbox", type: "success" },
    ],
  },
  {
    id: "knowledge",
    name: "Knowledge Agent",
    role: "Vector Indexing & Semantic Retrieval",
    model: "watsonx/text-embedding-ada",
    color: "#F1C21B",
    icon: "BookOpen",
    status: "running",
    currentTask: "Vectorising 240 new Legal documents",
    progress: 88,
    tasksCompleted: 428,
    tokensUsed: 2140000,
    logs: [
      { id: "k1", timestamp: "09:05:11", message: "Ingestion batch #14 started — 240 docs", type: "info" },
      { id: "k2", timestamp: "09:12:33", message: "211 / 240 documents embedded", type: "success" },
      { id: "k3", timestamp: "09:14:01", message: "Namespace 'legal-2026' updated", type: "info" },
    ],
  },
  {
    id: "email",
    name: "Email Agent",
    role: "Intelligent Email Drafting & Routing",
    model: "watsonx/granite-7b-instruct",
    color: "#3DDBD9",
    icon: "Mail",
    status: "error",
    currentTask: "Failed: SMTP relay timeout on outbound queue",
    progress: 0,
    tasksCompleted: 34,
    tokensUsed: 41700,
    logs: [
      { id: "e1", timestamp: "09:08:44", message: "Outbound email queue processing started", type: "info" },
      { id: "e2", timestamp: "09:09:15", message: "SMTP relay connection timeout (30s)", type: "error" },
      { id: "e3", timestamp: "09:09:16", message: "Retry 1/3 failed — backing off 60s", type: "error" },
    ],
  },
  {
    id: "report",
    name: "Executive Report Agent",
    role: "C-Suite Report Synthesis & Delivery",
    model: "watsonx/granite-13b-chat",
    color: "#FF7EB6",
    icon: "FileBarChart2",
    status: "completed",
    currentTask: "Q3 Board Report delivered to 5 executives",
    progress: 100,
    tasksCompleted: 9,
    tokensUsed: 318400,
    logs: [
      { id: "r1", timestamp: "09:00:00", message: "Initiated Q3 board report synthesis", type: "info" },
      { id: "r2", timestamp: "09:06:28", message: "Consolidated data from 4 source agents", type: "success" },
      { id: "r3", timestamp: "09:13:50", message: "Report delivered — confidence score 94.2%", type: "success" },
    ],
  },
];

// ─── Seed chat history ─────────────────────────────────────────────────────────

export const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "m0",
    role: "system",
    content: "",
    timestamp: "",
  },
  {
    id: "m1",
    role: "assistant",
    content:
      "Hello! I'm **watsonx Orchestrate**, your enterprise AI assistant. I can coordinate your agent network, answer questions about ongoing tasks, generate reports, and query your knowledge bases.\n\nHow can I help you today?",
    timestamp: "09:00:01",
    agentRefs: [],
  },
  {
    id: "m2",
    role: "user",
    content: "What's the current status of the Q3 financial analysis?",
    timestamp: "09:02:14",
  },
  {
    id: "m3",
    role: "assistant",
    content:
      "The **Finance Agent** is currently 67% through the Q3 revenue variance analysis.\n\n**Progress summary:**\n- ✅ Historical data loaded (24 months)\n- ✅ Seasonal adjustment model applied\n- 🔄 Variance computation in progress\n- ⏳ Executive summary pending\n\nEstimated completion in ~4 minutes. The **Executive Report Agent** is standing by to synthesise once analysis is complete.",
    timestamp: "09:02:17",
    agentRefs: ["finance", "report"],
  },
  {
    id: "m4",
    role: "user",
    content: "Are there any issues I should be aware of?",
    timestamp: "09:03:45",
  },
  {
    id: "m5",
    role: "assistant",
    content:
      "Yes — one active issue requires your attention:\n\n⚠️ **Email Agent** is experiencing an SMTP relay timeout. 3 queued executive summaries could not be delivered. Retry attempts have been exhausted.\n\n**Recommended action:** Check SMTP relay configuration in *Integrations → Email* or manually trigger a relay restart.\n\nAll other agents are operating within normal parameters.",
    timestamp: "09:03:48",
    agentRefs: ["email"],
  },
];

// ─── Canned responses for chat simulation ─────────────────────────────────────

export const CANNED_RESPONSES: Record<string, { content: string; agentRefs: string[] }> = {
  default: {
    content:
      "I've received your request and am processing it across the relevant agents. I'll have a response shortly.\n\nIs there anything specific you'd like me to prioritise?",
    agentRefs: [],
  },
  finance: {
    content:
      "Querying the **Finance Agent** now...\n\n**Current metrics:**\n- Q3 Revenue: $8.2M (▲ 12.4% vs forecast)\n- Operating Cost: $3.1M (▲ 2.1%)\n- Net Margin: 62.2%\n- EBITDA: $5.1M\n\nFull variance report will be ready in ~4 minutes.",
    agentRefs: ["finance"],
  },
  hr: {
    content:
      "The **HR Agent** reports:\n\n- Active headcount: 1,240 employees\n- Open roles: 24\n- Attrition risk (30-day): 3.2%\n- Hiring pipeline: 47 candidates in process\n\nFY2027 headcount forecast is 38% complete.",
    agentRefs: ["hr"],
  },
  knowledge: {
    content:
      "Searching knowledge bases...\n\n**Relevant namespaces queried:**\n- Legal & Compliance (1,248 docs)\n- Finance & Accounting (847 docs)\n\nI found **12 relevant documents**. Top result: *Q2 2026 Audit Report — GDPR Compliance Summary*.\n\nWould you like me to summarise any specific documents?",
    agentRefs: ["knowledge"],
  },
  report: {
    content:
      "Triggering **Executive Report Agent**...\n\nI'll consolidate inputs from the Finance, HR, and Project agents to generate a comprehensive executive summary. This typically takes 6–8 minutes.\n\n📄 Report will be delivered to your inbox and available in *Executive Reports* once complete.",
    agentRefs: ["finance", "hr", "project", "report"],
  },
  agents: {
    content:
      "**Current agent status:**\n\n| Agent | Status | Progress |\n|---|---|---|\n| Finance Agent | 🟢 Running | 67% |\n| HR Agent | 🟢 Running | 42% |\n| Project Agent | 🟡 Idle | — |\n| Knowledge Agent | 🟢 Running | 88% |\n| Email Agent | 🔴 Error | — |\n| Executive Report Agent | ✅ Completed | 100% |",
    agentRefs: ["finance", "hr", "project", "knowledge", "email", "report"],
  },
};
