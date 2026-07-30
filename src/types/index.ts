export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface StatCardData {
  title: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
  agent?: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
}

export interface SystemService {
  name: string;
  status: "operational" | "degraded" | "down";
  latency?: number;
}
