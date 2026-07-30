"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, ChevronDown, Settings,
  LogOut, User, HelpCircle, X, Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMobileMenu } from "./MobileMenuProvider";

// ─── Mock notifications ───────────────────────────────────────────────────────

const notifications = [
  { id: "1", title: "AI Agent Completed", description: "Report synthesis finished successfully.", time: "2m ago", read: false },
  { id: "2", title: "Integration Warning", description: "Salesforce sync latency above threshold.", time: "15m ago", read: false },
  { id: "3", title: "New Query Batch", description: "124 queries queued for processing.", time: "1h ago", read: true },
];

// ─── Dropdown animation variants ─────────────────────────────────────────────

const dropdownVariants = {
  hidden:  { opacity: 0, y: -6, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { opacity: 0, y: -4, scale: 0.97,
    transition: { duration: 0.1 } },
};

// ─── Hook: close on outside click or Escape ───────────────────────────────────

function useOutsideClose(
  refs: React.RefObject<HTMLElement | null>[],
  onClose: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") onClose();
        return;
      }
      if (refs.every((r) => r.current && !r.current.contains(e.target as Node))) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [refs, onClose]);
}

// ─── Header ───────────────────────────────────────────────────────────────────

interface HeaderProps {}

export function Header(_props: HeaderProps) {
  const { open: openMobileMenu } = useMobileMenu();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useOutsideClose([notifRef], () => setNotifOpen(false));
  useOutsideClose([profileRef], () => setProfileOpen(false));

  return (
    <header className="fixed top-0 left-0 md:left-60 right-0 h-14 bg-background/90 backdrop-blur-md border-b border-border z-20 flex items-center px-4 md:px-6 gap-3">
      {/* Mobile menu trigger */}
      <button
        onClick={openMobileMenu}
        className="flex md:hidden items-center justify-center w-8 h-8 rounded-md text-secondary hover:text-foreground hover:bg-accent transition-colors shrink-0"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <div
          className={cn(
            "flex items-center gap-2 h-8 px-3 rounded-md border transition-colors bg-card",
            searchFocused ? "border-primary" : "border-border"
          )}
        >
          <Search size={14} className="text-secondary shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search across platform…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-secondary/60 focus:outline-none"
            aria-label="Search"
          />
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
                onClick={() => setSearchValue("")}
                aria-label="Clear search"
                className="text-secondary hover:text-foreground transition-colors"
              >
                <X size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* ── Notifications ──────────────────────────────────────────────── */}
        <div ref={notifRef} className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
            aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ""}`}
            aria-expanded={notifOpen}
            aria-haspopup="dialog"
            className="relative"
          >
            <Bell size={16} aria-hidden="true" />
            {unread > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary"
                aria-hidden="true"
              />
            )}
          </Button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                key="notif-panel"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
                role="dialog"
                aria-label="Notifications"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">Notifications</span>
                  {unread > 0 && <Badge variant="default">{unread} new</Badge>}
                </div>
                <ul role="list" className="divide-y divide-border max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-accent transition-colors cursor-pointer",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" aria-hidden="true" />
                        )}
                        <div className={cn(!n.read ? "" : "ml-3.5")}>
                          <p className="text-xs font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-secondary mt-0.5">{n.description}</p>
                          <p className="text-xs text-secondary/50 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-2.5 border-t border-border">
                  <button className="text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Profile menu ──────────────────────────────────────────────── */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
            className="flex items-center gap-2 h-8 px-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0" aria-hidden="true">
              <span className="text-xs font-semibold text-primary">JD</span>
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">Jane Doe</span>
            <ChevronDown
              size={14}
              className={cn("text-secondary transition-transform duration-200", profileOpen && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                key="profile-menu"
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-lg shadow-2xl overflow-hidden"
                role="menu"
                aria-label="User menu"
              >
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Jane Doe</p>
                  <p className="text-xs text-secondary mt-0.5">jane.doe@enterprise.com</p>
                </div>
                <ul role="none" className="py-1">
                  {[
                    { label: "Profile",       icon: User },
                    { label: "Settings",      icon: Settings },
                    { label: "Help & Support",icon: HelpCircle },
                  ].map(({ label, icon: Icon }) => (
                    <li key={label} role="none">
                      <button
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors text-left"
                        role="menuitem"
                      >
                        <Icon size={14} className="text-secondary shrink-0" aria-hidden="true" />
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border py-1">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    role="menuitem"
                  >
                    <LogOut size={14} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

