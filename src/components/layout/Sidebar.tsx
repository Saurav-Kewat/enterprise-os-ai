"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, BrainCircuit, FileBarChart2,
  BookOpen, BarChart3, Plug, Settings, Zap,
  Activity, ShieldCheck, ChevronRight, Bot, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useMobileMenu } from "./MobileMenuProvider";

// ─── Nav config ───────────────────────────────────────────────────────────────

const primaryNav = [
  { label: "Dashboard",         href: "/",                   icon: LayoutDashboard },
  { label: "AI Workspace",      href: "/ai-workspace",       icon: BrainCircuit, badge: 3 },
  { label: "Executive Reports", href: "/executive-reports",  icon: FileBarChart2 },
  { label: "Knowledge Hub",     href: "/knowledge-hub",      icon: BookOpen },
  { label: "Analytics",         href: "/analytics",          icon: BarChart3 },
  { label: "Integrations",      href: "/integrations",       icon: Plug },
  { label: "Settings",          href: "/settings",           icon: Settings },
];

const utilityNav = [
  { label: "Quick Actions", href: "/quick-actions",  icon: Zap },
  { label: "System Status", href: "/system-status",  icon: Activity },
  { label: "AI Supervisor", href: "/ai-supervisor",  icon: ShieldCheck },
];

// ─── Nav link ─────────────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  badge?: number;
  onClick?: () => void;
}

function NavLink({ href, icon: Icon, label, badge, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors group",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-secondary hover:text-foreground hover:bg-accent"
        )}
        whileHover={{ x: 2 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full"
            initial={false}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        )}
        <Icon size={16} className="shrink-0" aria-hidden="true" />
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && (
          <span
            className="flex items-center justify-center w-5 h-5 rounded text-xs font-semibold bg-primary/15 text-primary"
            aria-label={`${badge} items`}
          >
            {badge}
          </span>
        )}
        {isActive && (
          <ChevronRight size={14} className="shrink-0 text-primary" aria-hidden="true" />
        )}
      </motion.div>
    </Link>
  );
}

// ─── Sidebar content ──────────────────────────────────────────────────────────

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary" aria-hidden="true">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-foreground leading-tight">EnterpriseOS</span>
          <span className="text-xs text-secondary leading-tight">AI Platform</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5" aria-label="Main navigation">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary/50" aria-hidden="true">
          Main
        </p>
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} onClick={onNavClick} />
        ))}

        <div className="py-3">
          <Separator />
        </div>

        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-secondary/50" aria-hidden="true">
          Tools
        </p>
        {utilityNav.map((item) => (
          <NavLink key={item.href} {...item} onClick={onNavClick} />
        ))}
      </nav>

      {/* User footer */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent transition-colors cursor-pointer">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0" aria-hidden="true">
            <span className="text-[11px] font-bold text-primary">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Jane Doe</p>
            <p className="text-[11px] text-secondary truncate">Enterprise Admin</p>
          </div>
          <span
            className="w-1.5 h-1.5 rounded-full bg-success shrink-0"
            role="status"
            aria-label="Status: online"
          />
        </div>
      </div>
    </>
  );
}

// ─── Sidebar (desktop fixed + mobile drawer) ──────────────────────────────────

export function Sidebar() {
  const { isOpen, close } = useMobileMenu();
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Prevent body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* ── Desktop sidebar (fixed) ──────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-sidebar border-r border-border flex-col z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer backdrop ────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={close}
              aria-hidden="true"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-border flex flex-col z-50 md:hidden"
              aria-label="Navigation menu"
            >
              {/* Close button */}
              <button
                onClick={close}
                className="absolute top-3.5 right-3 flex items-center justify-center w-8 h-8 rounded-md text-secondary hover:text-foreground hover:bg-accent transition-colors z-10"
                aria-label="Close navigation menu"
              >
                <X size={16} />
              </button>
              <SidebarContent onNavClick={close} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

