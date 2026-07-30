// ─── Executive Reports mock data ──────────────────────────────────────────────

export type ReportStatus = "ready" | "generating" | "review" | "draft" | "archived";
export type ReportCategory = "financial" | "operations" | "compliance" | "market" | "people";

export interface Report {
  id: string;
  title: string;
  summary: string;
  category: ReportCategory;
  status: ReportStatus;
  updated: string;
  pages: number;
  author: string;
  confidence: number;    // AI confidence 0–100
  recipients: string[];
  tags: string[];
  size: string;
}

export const REPORTS: Report[] = [
  {
    id: "r1",
    title: "Q3 2026 Financial Overview",
    summary: "Comprehensive analysis of Q3 revenue, operating costs, EBITDA, and variance vs. forecast across all business units.",
    category: "financial",
    status: "ready",
    updated: "Today, 09:14",
    pages: 24,
    author: "FinanceAgent-01",
    confidence: 94.2,
    recipients: ["CEO", "CFO", "Board"],
    tags: ["quarterly", "revenue", "EBITDA"],
    size: "2.4 MB",
  },
  {
    id: "r2",
    title: "AI Operations Monthly Report",
    summary: "Monthly aggregation of agent performance, query throughput, accuracy rates, and cost-per-inference across the AI platform.",
    category: "operations",
    status: "generating",
    updated: "In progress — 87% complete",
    pages: 0,
    author: "AnalyticsEngine",
    confidence: 0,
    recipients: ["CTO", "VP Engineering"],
    tags: ["AI", "monthly", "performance"],
    size: "—",
  },
  {
    id: "r3",
    title: "Customer Insights — July 2026",
    summary: "AI-synthesised customer sentiment, NPS breakdown, churn risk cohorts, and product feedback themes.",
    category: "market",
    status: "ready",
    updated: "Yesterday, 17:40",
    pages: 18,
    author: "MarketingAgent-02",
    confidence: 91.5,
    recipients: ["CPO", "VP Sales", "Marketing"],
    tags: ["customers", "NPS", "churn"],
    size: "1.8 MB",
  },
  {
    id: "r4",
    title: "Board Presentation Deck — Q3",
    summary: "Executive-ready 32-slide board deck covering strategy, financials, market share, and FY2027 outlook.",
    category: "financial",
    status: "review",
    updated: "Today, 08:00",
    pages: 32,
    author: "ReportSynthesiser",
    confidence: 88.0,
    recipients: ["Board of Directors"],
    tags: ["board", "strategy", "FY2027"],
    size: "4.1 MB",
  },
  {
    id: "r5",
    title: "GDPR & SOC 2 Compliance Audit",
    summary: "Full audit of data handling practices, access controls, incident log review, and outstanding remediation items.",
    category: "compliance",
    status: "ready",
    updated: "3 days ago",
    pages: 11,
    author: "AISupervisor",
    confidence: 97.1,
    recipients: ["CISO", "Legal", "DPO"],
    tags: ["GDPR", "SOC2", "audit"],
    size: "0.9 MB",
  },
  {
    id: "r6",
    title: "APAC Market Expansion Analysis",
    summary: "Market sizing, competitor landscape, regulatory requirements, and 3-year entry strategy for APAC markets.",
    category: "market",
    status: "draft",
    updated: "5 days ago",
    pages: 9,
    author: "MarketingAgent-02",
    confidence: 76.3,
    recipients: ["CEO", "VP Strategy"],
    tags: ["APAC", "expansion", "market"],
    size: "1.2 MB",
  },
  {
    id: "r7",
    title: "FY2027 Headcount Plan",
    summary: "Workforce planning model with department-level hiring targets, budget impact, and attrition risk projections.",
    category: "people",
    status: "ready",
    updated: "1 week ago",
    pages: 14,
    author: "HR Agent",
    confidence: 89.4,
    recipients: ["CHRO", "CFO", "VP Ops"],
    tags: ["headcount", "FY2027", "hiring"],
    size: "1.5 MB",
  },
  {
    id: "r8",
    title: "IT Infrastructure Cost Optimisation",
    summary: "Cloud spend analysis, rightsizing recommendations, and projected 18-month savings roadmap.",
    category: "operations",
    status: "archived",
    updated: "2 weeks ago",
    pages: 20,
    author: "AnalyticsEngine",
    confidence: 92.7,
    recipients: ["CTO", "CFO"],
    tags: ["cloud", "cost", "infrastructure"],
    size: "3.2 MB",
  },
];

// ─── Knowledge Hub mock data ──────────────────────────────────────────────────

export type NamespaceStatus = "synced" | "indexing" | "error" | "paused";

export interface KnowledgeNamespace {
  id: string;
  name: string;
  description: string;
  docs: number;
  size: string;
  status: NamespaceStatus;
  lastSync: string;
  embedding: string;
  coverage: number;    // 0–100
  color: string;
  icon: string;
}

export interface RecentQuery {
  id: string;
  query: string;
  namespace: string;
  results: number;
  timestamp: string;
  confidence: number;
}

export const NAMESPACES: KnowledgeNamespace[] = [
  {
    id: "ns1",
    name: "Legal & Compliance",
    description: "Contracts, regulatory filings, audit reports, GDPR documentation",
    docs: 1248,
    size: "4.2 GB",
    status: "synced",
    lastSync: "2 min ago",
    embedding: "text-embedding-3-large",
    coverage: 99,
    color: "#0F62FE",
    icon: "Scale",
  },
  {
    id: "ns2",
    name: "Finance & Accounting",
    description: "Financial statements, budgets, forecasts, tax filings, audit trails",
    docs: 847,
    size: "2.8 GB",
    status: "synced",
    lastSync: "5 min ago",
    embedding: "text-embedding-3-large",
    coverage: 97,
    color: "#24A148",
    icon: "DollarSign",
  },
  {
    id: "ns3",
    name: "Product Documentation",
    description: "API references, user guides, release notes, architecture diagrams",
    docs: 2341,
    size: "1.1 GB",
    status: "synced",
    lastSync: "12 min ago",
    embedding: "text-embedding-3-small",
    coverage: 100,
    color: "#8A3FFC",
    icon: "BookOpen",
  },
  {
    id: "ns4",
    name: "HR Policies",
    description: "Employee handbook, benefits documentation, performance frameworks",
    docs: 312,
    size: "0.4 GB",
    status: "indexing",
    lastSync: "Indexing 47 new docs",
    embedding: "text-embedding-3-small",
    coverage: 85,
    color: "#F1C21B",
    icon: "Users",
  },
  {
    id: "ns5",
    name: "Marketing Assets",
    description: "Brand guidelines, campaign reports, market research, competitor intel",
    docs: 956,
    size: "8.7 GB",
    status: "synced",
    lastSync: "30 min ago",
    embedding: "text-embedding-3-large",
    coverage: 94,
    color: "#FF7EB6",
    icon: "Megaphone",
  },
  {
    id: "ns6",
    name: "Engineering Specs",
    description: "System design docs, RFCs, incident post-mortems, deployment runbooks",
    docs: 1784,
    size: "3.3 GB",
    status: "synced",
    lastSync: "1 hr ago",
    embedding: "text-embedding-3-large",
    coverage: 96,
    color: "#3DDBD9",
    icon: "Code2",
  },
];

export const RECENT_QUERIES: RecentQuery[] = [
  { id: "q1", query: "GDPR data retention policy for EU customers", namespace: "Legal & Compliance", results: 8, timestamp: "09:14", confidence: 94 },
  { id: "q2", query: "Q3 budget variance approval workflow", namespace: "Finance & Accounting", results: 5, timestamp: "09:02", confidence: 89 },
  { id: "q3", query: "API rate limiting implementation guide", namespace: "Product Documentation", results: 12, timestamp: "08:47", confidence: 97 },
  { id: "q4", query: "Employee equity grant vesting schedule", namespace: "HR Policies", results: 3, timestamp: "08:30", confidence: 91 },
  { id: "q5", query: "Competitor pricing analysis H1 2026", namespace: "Marketing Assets", results: 7, timestamp: "08:15", confidence: 85 },
];

// ─── Analytics mock data ───────────────────────────────────────────────────────

export const ANALYTICS_STATS = [
  { title: "Total Sessions", value: 48291, display: "48,291", delta: 12.1, trend: "up" as const, icon: "Users" },
  { title: "Avg Session Time", value: 14.3, display: "14.3m", delta: 5.4, trend: "up" as const, icon: "Clock" },
  { title: "AI Requests", value: 2400000, display: "2.4M", delta: 31.7, trend: "up" as const, icon: "BrainCircuit" },
  { title: "Success Rate", value: 99.1, display: "99.1%", delta: 0.3, trend: "up" as const, icon: "CheckCircle2" },
  { title: "Avg Latency", value: 1.24, display: "1.24s", delta: -8.3, trend: "up" as const, icon: "Zap" },
  { title: "Cost / Request", value: 0.0024, display: "$0.0024", delta: -12.1, trend: "up" as const, icon: "DollarSign" },
];

export const SESSION_TREND = [
  { week: "W1", sessions: 9200, active: 7800 },
  { week: "W2", sessions: 10400, active: 8900 },
  { week: "W3", sessions: 11100, active: 9600 },
  { week: "W4", sessions: 9800, active: 8400 },
  { week: "W5", sessions: 12200, active: 10500 },
  { week: "W6", sessions: 13400, active: 11700 },
  { week: "W7", sessions: 12800, active: 11200 },
  { week: "W8", sessions: 14600, active: 12900 },
];

export const TOP_AGENTS_PERF = [
  { name: "Finance Agent", requests: 18420, success: 99.1, avgLatency: 0.92, cost: 44.2 },
  { name: "Knowledge Agent", requests: 42800, success: 99.8, avgLatency: 0.31, cost: 18.7 },
  { name: "HR Agent", requests: 8910, success: 98.4, avgLatency: 1.15, cost: 21.4 },
  { name: "Report Agent", requests: 3200, success: 97.9, avgLatency: 3.24, cost: 102.1 },
  { name: "Email Agent", requests: 5640, success: 96.1, avgLatency: 0.78, cost: 8.9 },
  { name: "Project Agent", requests: 7120, success: 98.7, avgLatency: 1.42, cost: 31.5 },
];

export const USAGE_BY_DEPT = [
  { dept: "Finance", pct: 26.6, queries: 12847, color: "#0F62FE" },
  { dept: "Engineering", pct: 17.7, queries: 8541, color: "#3DDBD9" },
  { dept: "Legal", pct: 16.9, queries: 8180, color: "#24A148" },
  { dept: "Marketing", pct: 15.1, queries: 7290, color: "#FF7EB6" },
  { dept: "HR", pct: 12.6, queries: 6083, color: "#8A3FFC" },
  { dept: "Operations", pct: 11.1, queries: 5388, color: "#F1C21B" },
];

export const DAILY_COST = [
  { day: "Mon", inference: 124, storage: 18, network: 9 },
  { day: "Tue", inference: 141, storage: 18, network: 11 },
  { day: "Wed", inference: 138, storage: 19, network: 10 },
  { day: "Thu", inference: 152, storage: 19, network: 12 },
  { day: "Fri", inference: 167, storage: 19, network: 13 },
  { day: "Sat", inference: 89, storage: 19, network: 7 },
  { day: "Sun", inference: 74, storage: 18, network: 6 },
];

// ─── Integrations mock data ────────────────────────────────────────────────────

export type IntegrationHealth = "healthy" | "degraded" | "down" | "configuring";
export type IntegrationCategory = "CRM" | "ERP" | "Data Warehouse" | "Productivity" | "Messaging" | "BI" | "Storage" | "Security" | "DevOps";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  logo: string;          // icon name
  color: string;
  connected: boolean;
  health: IntegrationHealth;
  lastSync: string;
  syncFreq: string;
  records: string;
  latency: number | null;  // ms
  description: string;
  owner: string;
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "i1", name: "Salesforce CRM", category: "CRM", logo: "Building2", color: "#00A1E0",
    connected: true, health: "degraded", lastSync: "14 min ago", syncFreq: "Every 5 min",
    records: "248,340", latency: 842, description: "Customer accounts, opportunities, and pipeline data",
    owner: "Sales Operations",
  },
  {
    id: "i2", name: "Microsoft 365", category: "Productivity", logo: "LayoutGrid", color: "#0078D4",
    connected: true, health: "healthy", lastSync: "2 min ago", syncFreq: "Real-time",
    records: "1.2M emails", latency: 48, description: "Calendar, email, Teams, and SharePoint data",
    owner: "IT Operations",
  },
  {
    id: "i3", name: "Snowflake", category: "Data Warehouse", logo: "Database", color: "#29B5E8",
    connected: true, health: "healthy", lastSync: "1 min ago", syncFreq: "Streaming",
    records: "4.8B rows", latency: 112, description: "Enterprise data warehouse for analytics and reporting",
    owner: "Data Engineering",
  },
  {
    id: "i4", name: "Slack", category: "Messaging", logo: "MessageSquare", color: "#4A154B",
    connected: true, health: "healthy", lastSync: "Real-time", syncFreq: "Webhook",
    records: "—", latency: 24, description: "Team messaging for AI alerts and report delivery",
    owner: "IT Operations",
  },
  {
    id: "i5", name: "SAP ERP", category: "ERP", logo: "Server", color: "#0070F2",
    connected: false, health: "down", lastSync: "Failed 2h ago", syncFreq: "Every 15 min",
    records: "—", latency: null, description: "Core ERP — finance, procurement, supply chain",
    owner: "Finance Operations",
  },
  {
    id: "i6", name: "Jira", category: "DevOps", logo: "Kanban", color: "#0052CC",
    connected: true, health: "healthy", lastSync: "8 min ago", syncFreq: "Every 10 min",
    records: "14,280 issues", latency: 67, description: "Project tracking, sprint data, and velocity metrics",
    owner: "Engineering",
  },
  {
    id: "i7", name: "Tableau", category: "BI", logo: "PieChart", color: "#E8762D",
    connected: true, health: "healthy", lastSync: "22 min ago", syncFreq: "Every 30 min",
    records: "320 dashboards", latency: 195, description: "BI dashboards and executive visualisations",
    owner: "Analytics",
  },
  {
    id: "i8", name: "AWS S3", category: "Storage", logo: "HardDrive", color: "#FF9900",
    connected: true, health: "healthy", lastSync: "Continuous", syncFreq: "Event-driven",
    records: "12.4 TB", latency: 38, description: "Object storage for documents, exports, and backups",
    owner: "Infrastructure",
  },
  {
    id: "i9", name: "Okta", category: "Security", logo: "ShieldCheck", color: "#007DC1",
    connected: true, health: "healthy", lastSync: "Real-time", syncFreq: "SSO / SCIM",
    records: "1,240 users", latency: 12, description: "Identity provider — SSO, MFA, and user provisioning",
    owner: "Security",
  },
  {
    id: "i10", name: "Workday", category: "ERP", logo: "Users", color: "#CF4520",
    connected: true, health: "configuring", lastSync: "Setup in progress", syncFreq: "Daily",
    records: "—", latency: null, description: "HR management, payroll, and workforce planning",
    owner: "HR Operations",
  },
];

// ─── Settings mock data ────────────────────────────────────────────────────────

export interface SettingField {
  key: string;
  label: string;
  description?: string;
  value: string | boolean | number;
  type: "text" | "select" | "toggle" | "number" | "range" | "password" | "badge";
  options?: string[];
  unit?: string;
  readOnly?: boolean;
}

export interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  fields: SettingField[];
}

export const SETTINGS_SECTIONS: SettingSection[] = [
  {
    id: "general",
    title: "General",
    description: "Basic platform identity and regional preferences",
    icon: "Settings2",
    fields: [
      { key: "name", label: "Platform Name", value: "EnterpriseOS AI", type: "text" },
      { key: "org", label: "Organisation", value: "Acme Corporation", type: "text" },
      { key: "lang", label: "Default Language", value: "English (US)", type: "select", options: ["English (US)", "English (GB)", "Deutsch", "Français", "日本語"] },
      { key: "tz", label: "Timezone", value: "UTC−05:00 (EST)", type: "select", options: ["UTC−08:00 (PST)", "UTC−05:00 (EST)", "UTC+00:00 (GMT)", "UTC+01:00 (CET)", "UTC+09:00 (JST)"] },
      { key: "currency", label: "Default Currency", value: "USD ($)", type: "select", options: ["USD ($)", "EUR (€)", "GBP (£)", "JPY (¥)"] },
    ],
  },
  {
    id: "ai",
    title: "AI Configuration",
    description: "Model selection, inference parameters, and safety guardrails",
    icon: "BrainCircuit",
    fields: [
      { key: "model", label: "Primary LLM", value: "watsonx granite-13b-chat", type: "select", options: ["watsonx granite-13b-chat", "watsonx granite-7b-instruct", "GPT-4o", "Claude 3.5 Sonnet"] },
      { key: "fallback", label: "Fallback Model", value: "GPT-4o", type: "select", options: ["GPT-4o", "Claude 3.5 Sonnet", "None"] },
      { key: "tokens", label: "Max Tokens / Request", value: 4096, type: "number", unit: "tokens" },
      { key: "temp", label: "Temperature", value: 0.7, type: "range", unit: "" },
      { key: "guardrails", label: "Safety Guardrails", value: true, type: "toggle", description: "Block harmful or off-topic outputs" },
      { key: "human_review", label: "Human-in-the-Loop Review", value: true, type: "toggle", description: "Require approval for high-stakes actions" },
      { key: "rate_limit", label: "Rate Limit (req / min)", value: 1000, type: "number", unit: "req/min" },
    ],
  },
  {
    id: "security",
    title: "Security & Access",
    description: "Authentication, session policy, and access controls",
    icon: "ShieldCheck",
    fields: [
      { key: "mfa", label: "MFA Enforcement", value: true, type: "toggle", description: "Require MFA for all enterprise accounts" },
      { key: "sso", label: "SSO Provider", value: "Okta (SAML 2.0)", type: "badge", readOnly: true },
      { key: "session", label: "Session Timeout", value: 60, type: "number", unit: "minutes" },
      { key: "ip", label: "IP Allowlist", value: "Not configured", type: "text", description: "Comma-separated CIDR ranges" },
      { key: "audit", label: "Audit Logging", value: true, type: "toggle", description: "Log all agent and user actions" },
      { key: "data_region", label: "Data Residency Region", value: "us-east-1", type: "select", options: ["us-east-1", "eu-west-1", "ap-northeast-1"] },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Alerts, delivery channels, and escalation rules",
    icon: "Bell",
    fields: [
      { key: "email_alerts", label: "Email Alerts", value: true, type: "toggle" },
      { key: "slack_alerts", label: "Slack Notifications", value: true, type: "toggle" },
      { key: "agent_fail", label: "Alert on Agent Failure", value: true, type: "toggle" },
      { key: "sla_breach", label: "Alert on SLA Breach", value: true, type: "toggle" },
      { key: "report_ready", label: "Notify when Report Ready", value: true, type: "toggle" },
      { key: "digest_freq", label: "Daily Digest", value: "08:00 UTC", type: "select", options: ["Disabled", "06:00 UTC", "08:00 UTC", "12:00 UTC"] },
    ],
  },
  {
    id: "billing",
    title: "Billing & Usage",
    description: "Subscription plan, usage limits, and cost controls",
    icon: "CreditCard",
    fields: [
      { key: "plan", label: "Current Plan", value: "Enterprise Pro", type: "badge", readOnly: true },
      { key: "seats", label: "Active Seats", value: "140 / 200", type: "badge", readOnly: true },
      { key: "token_budget", label: "Monthly Token Budget", value: "50,000,000", type: "badge", readOnly: true },
      { key: "spend_alert", label: "Spend Alert Threshold", value: 5000, type: "number", unit: "USD/month" },
      { key: "overage", label: "Allow Overage", value: false, type: "toggle", description: "Continue serving requests beyond the token budget" },
    ],
  },
];
