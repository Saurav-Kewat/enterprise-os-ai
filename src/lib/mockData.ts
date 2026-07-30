// ─── Mock Enterprise Data ────────────────────────────────────────────────────
// All data is static for UI purposes. Replace with real API calls in production.

// ── Query volume (30-day sparkline) ──────────────────────────────────────────
export const queryVolumeData = [
  { day: "Jul 1", queries: 8420, success: 8210, failed: 210 },
  { day: "Jul 2", queries: 9150, success: 8970, failed: 180 },
  { day: "Jul 3", queries: 7890, success: 7740, failed: 150 },
  { day: "Jul 4", queries: 6200, success: 6100, failed: 100 },
  { day: "Jul 5", queries: 6800, success: 6650, failed: 150 },
  { day: "Jul 6", queries: 9900, success: 9700, failed: 200 },
  { day: "Jul 7", queries: 10250, success: 10050, failed: 200 },
  { day: "Jul 8", queries: 11400, success: 11200, failed: 200 },
  { day: "Jul 9", queries: 10900, success: 10700, failed: 200 },
  { day: "Jul 10", queries: 11800, success: 11600, failed: 200 },
  { day: "Jul 11", queries: 12100, success: 11900, failed: 200 },
  { day: "Jul 12", queries: 9800, success: 9600, failed: 200 },
  { day: "Jul 13", queries: 9400, success: 9200, failed: 200 },
  { day: "Jul 14", queries: 11200, success: 11000, failed: 200 },
  { day: "Jul 15", queries: 12800, success: 12600, failed: 200 },
  { day: "Jul 16", queries: 13200, success: 13000, failed: 200 },
  { day: "Jul 17", queries: 11700, success: 11500, failed: 200 },
  { day: "Jul 18", queries: 12400, success: 12200, failed: 200 },
  { day: "Jul 19", queries: 10600, success: 10400, failed: 200 },
  { day: "Jul 20", queries: 10200, success: 10000, failed: 200 },
  { day: "Jul 21", queries: 11900, success: 11700, failed: 200 },
  { day: "Jul 22", queries: 12700, success: 12500, failed: 200 },
  { day: "Jul 23", queries: 13500, success: 13300, failed: 200 },
  { day: "Jul 24", queries: 11200, success: 11000, failed: 200 },
  { day: "Jul 25", queries: 12100, success: 11900, failed: 200 },
  { day: "Jul 26", queries: 10800, success: 10600, failed: 200 },
  { day: "Jul 27", queries: 11600, success: 11400, failed: 200 },
  { day: "Jul 28", queries: 12300, success: 12100, failed: 200 },
  { day: "Jul 29", queries: 12847, success: 12620, failed: 227 },
];

// ── Agent response time distribution (7-day) ─────────────────────────────────
export const responseTimeData = [
  { day: "Mon", p50: 0.92, p95: 1.84, p99: 2.61 },
  { day: "Tue", p50: 1.05, p95: 2.10, p99: 3.20 },
  { day: "Wed", p50: 0.88, p95: 1.76, p99: 2.40 },
  { day: "Thu", p50: 0.97, p95: 1.94, p99: 2.80 },
  { day: "Fri", p50: 1.12, p95: 2.24, p99: 3.45 },
  { day: "Sat", p50: 0.76, p95: 1.52, p99: 2.10 },
  { day: "Sun", p50: 0.68, p95: 1.36, p99: 1.90 },
];

// ── Department AI usage breakdown ─────────────────────────────────────────────
export const departmentUsageData = [
  { department: "Finance", queries: 3420, color: "#0F62FE" },
  { department: "Legal", queries: 2180, color: "#24A148" },
  { department: "Marketing", queries: 1940, color: "#F1C21B" },
  { department: "HR", queries: 1620, color: "#8A3FFC" },
  { department: "Engineering", queries: 2280, color: "#FF7EB6" },
  { department: "Operations", queries: 1407, color: "#3DDBD9" },
];

// ── Model accuracy over time ──────────────────────────────────────────────────
export const accuracyTrendData = [
  { month: "Feb", accuracy: 94.1, baseline: 92.0 },
  { month: "Mar", accuracy: 95.2, baseline: 92.0 },
  { month: "Apr", accuracy: 95.8, baseline: 92.0 },
  { month: "May", accuracy: 96.1, baseline: 92.0 },
  { month: "Jun", accuracy: 96.7, baseline: 92.0 },
  { month: "Jul", accuracy: 97.3, baseline: 92.0 },
];

// ── Animated KPI stats ────────────────────────────────────────────────────────
export const kpiStats = [
  {
    id: "queries",
    title: "Queries Today",
    value: 12847,
    displayValue: "12,847",
    delta: 18.4,
    deltaLabel: "vs yesterday",
    trend: "up" as const,
    icon: "MessageSquare",
    suffix: "",
  },
  {
    id: "accuracy",
    title: "Response Accuracy",
    value: 97.3,
    displayValue: "97.3%",
    delta: 1.2,
    deltaLabel: "vs last week",
    trend: "up" as const,
    icon: "Target",
    suffix: "%",
  },
  {
    id: "agents",
    title: "Active Agents",
    value: 24,
    displayValue: "24",
    delta: 4,
    deltaLabel: "new today",
    trend: "up" as const,
    icon: "Bot",
    suffix: "",
  },
  {
    id: "response",
    title: "Avg Response Time",
    value: 1.24,
    displayValue: "1.24s",
    delta: -8.3,
    deltaLabel: "faster",
    trend: "up" as const,
    icon: "Clock",
    suffix: "s",
  },
];

// ── Recent activity feed ──────────────────────────────────────────────────────
export const activityFeed = [
  {
    id: "a1",
    title: "Report Synthesis Completed",
    description: "Q3 Financial Executive Report generated with 94.2% confidence score.",
    timestamp: "2 min ago",
    status: "success" as const,
    agent: "FinanceAgent-01",
    category: "Reports",
  },
  {
    id: "a2",
    title: "Salesforce Integration Latency Alert",
    description: "CRM API response time elevated to 842ms — above 800ms SLA threshold.",
    timestamp: "14 min ago",
    status: "warning" as const,
    agent: "IntegrationWatcher",
    category: "Integrations",
  },
  {
    id: "a3",
    title: "Knowledge Base Ingestion Complete",
    description: "428 Legal documents vectorised and indexed into the Legal namespace.",
    timestamp: "1 hr ago",
    status: "info" as const,
    agent: "KnowledgeIndexer",
    category: "Knowledge Hub",
  },
  {
    id: "a4",
    title: "Agent Execution Failed",
    description: "MarketingAgent-03 encountered a timeout on campaign ROAS analysis.",
    timestamp: "2 hr ago",
    status: "error" as const,
    agent: "MarketingAgent-03",
    category: "AI Workspace",
  },
  {
    id: "a5",
    title: "Analytics Pipeline Completed",
    description: "Daily aggregation job processed 2.1M records across 6 departments.",
    timestamp: "3 hr ago",
    status: "success" as const,
    agent: "AnalyticsEngine",
    category: "Analytics",
  },
  {
    id: "a6",
    title: "User Access Policy Updated",
    description: "MFA enforcement policy applied to 140 active enterprise accounts.",
    timestamp: "5 hr ago",
    status: "info" as const,
    agent: "AccessManager",
    category: "Security",
  },
  {
    id: "a7",
    title: "Compliance Audit Passed",
    description: "GDPR compliance scan completed with 0 critical findings.",
    timestamp: "6 hr ago",
    status: "success" as const,
    agent: "AISupervisor",
    category: "Compliance",
  },
  {
    id: "a8",
    title: "Model Accuracy Degradation Warning",
    description: "GPT-4o accuracy dropped below 96% threshold on finance queries.",
    timestamp: "8 hr ago",
    status: "warning" as const,
    agent: "PerformanceMonitor",
    category: "AI Monitoring",
  },
];

// ── Quick actions ─────────────────────────────────────────────────────────────
export const quickActionItems = [
  { id: "qa1", label: "Generate Report", icon: "FileBarChart2", color: "#0F62FE", description: "AI synthesis" },
  { id: "qa2", label: "Spawn Agent", icon: "BrainCircuit", color: "#24A148", description: "Launch new agent" },
  { id: "qa3", label: "Upload Documents", icon: "Upload", color: "#8A3FFC", description: "Add to knowledge base" },
  { id: "qa4", label: "Run Audit", icon: "ShieldCheck", color: "#F1C21B", description: "Compliance check" },
  { id: "qa5", label: "Sync Integrations", icon: "RefreshCw", color: "#3DDBD9", description: "Force connector sync" },
  { id: "qa6", label: "Semantic Search", icon: "Search", color: "#FF7EB6", description: "Query knowledge base" },
];

// ── Suggested actions ─────────────────────────────────────────────────────────
export const suggestedActions = [
  {
    id: "sa1",
    title: "Review pending AI agent approvals",
    description: "3 agents are awaiting supervisor sign-off before autonomous execution can begin.",
    priority: "high" as const,
    category: "AI Governance",
  },
  {
    id: "sa2",
    title: "Salesforce sync latency alert",
    description: "CRM integration latency is elevated above 800ms for the past 2 hours.",
    priority: "medium" as const,
    category: "Integrations",
  },
  {
    id: "sa3",
    title: "Q3 Executive Report due in 2 days",
    description: "AI synthesis is 87% complete. Manual review required for the financial section.",
    priority: "high" as const,
    category: "Reports",
  },
  {
    id: "sa4",
    title: "Onboard new knowledge base dataset",
    description: "Legal team uploaded 240 new documents awaiting vectorisation.",
    priority: "low" as const,
    category: "Knowledge Hub",
  },
];

// ── Business metrics ──────────────────────────────────────────────────────────
export const businessMetrics = [
  { label: "Revenue YTD", value: "$24.8M", change: 12.4, trend: "up" as const },
  { label: "Active Users", value: "148,320", change: 5.2, trend: "up" as const },
  { label: "AI Queries", value: "2.4M", change: 31.7, trend: "up" as const },
  { label: "Avg Response", value: "1.24s", change: -8.3, trend: "up" as const },
  { label: "Error Rate", value: "0.04%", change: -1.2, trend: "up" as const },
  { label: "Uptime", value: "99.97%", change: 0, trend: "neutral" as const },
];

// ── System services ───────────────────────────────────────────────────────────
export const systemServices = [
  { name: "AI Inference Engine", status: "operational" as const, latency: 42 },
  { name: "Knowledge Vector Store", status: "operational" as const, latency: 18 },
  { name: "Analytics Pipeline", status: "operational" as const, latency: 95 },
  { name: "Salesforce Integration", status: "degraded" as const, latency: 842 },
  { name: "Report Generator", status: "operational" as const, latency: 210 },
  { name: "Auth Service", status: "operational" as const, latency: 12 },
];
