"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2, BrainCircuit, ShieldCheck, Bell,
  CreditCard, CheckCircle2, ChevronRight, Save,
  RotateCcw, AlertTriangle,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SETTINGS_SECTIONS, type SettingField, type SettingSection } from "@/lib/pagesData";
import { cn } from "@/lib/utils";

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Settings2, BrainCircuit, ShieldCheck, Bell, CreditCard,
};

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0",
        value ? "bg-primary" : "bg-white/10 border border-border"
      )}
    >
      <motion.div
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
        animate={{ x: value ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── Range slider ─────────────────────────────────────────────────────────────

function RangeField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3 min-w-[180px]">
      <input
        type="range"
        min={0} max={1} step={0.05}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
      />
      <span className="text-sm text-foreground font-medium tabular-nums w-8 text-right">{value}</span>
    </div>
  );
}

// ─── Single field row ─────────────────────────────────────────────────────────

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: SettingField;
  value: string | boolean | number;
  onChange: (v: string | boolean | number) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{field.label}</p>
        {field.description && (
          <p className="text-xs text-secondary mt-0.5">{field.description}</p>
        )}
      </div>

      <div className="shrink-0">
        {field.type === "toggle" && typeof value === "boolean" && (
          <Toggle value={value} onChange={(v) => onChange(v)} />
        )}

        {field.type === "badge" && (
          <Badge variant="secondary" className="text-xs font-medium">
            {String(value)}
          </Badge>
        )}

        {field.type === "range" && typeof value === "number" && (
          <RangeField value={value} onChange={(v) => onChange(v)} />
        )}

        {(field.type === "text" || field.type === "number" || field.type === "password") && !field.readOnly && (
          <input
            type={field.type === "password" ? "password" : field.type === "number" ? "number" : "text"}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 px-3 text-sm text-foreground bg-background border border-border rounded-md focus:outline-none focus:border-primary/60 min-w-[180px] text-right tabular-nums"
          />
        )}

        {field.type === "select" && (
          <div className="relative">
            <select
              value={String(value)}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 pl-3 pr-8 text-sm text-foreground bg-background border border-border rounded-md focus:outline-none focus:border-primary/60 appearance-none cursor-pointer min-w-[180px]"
            >
              {(field.options ?? [String(value)]).map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary rotate-90 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.3, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SectionCard({
  section,
  index,
}: {
  section: SettingSection;
  index: number;
}) {
  const [values, setValues] = useState<Record<string, string | boolean | number>>(
    Object.fromEntries(section.fields.map((f) => [f.key, f.value]))
  );
  const [saved, setSaved] = useState(false);

  const Icon = ICON_MAP[section.icon] ?? Settings2;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div
      custom={index}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardCard>
        {/* Card header */}
        <div className="flex items-start gap-3 mb-4 pb-4 border-b border-border -mt-1">
          <div className="p-2 rounded-md bg-primary/10 shrink-0">
            <Icon size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            <p className="text-xs text-secondary mt-0.5">{section.description}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-border">
          {section.fields.map((field) => (
            <FieldRow
              key={field.key}
              field={field}
              value={values[field.key]}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}
        </div>

        {/* Footer */}
        {section.fields.some((f) => !f.readOnly) && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setValues(Object.fromEntries(section.fields.map((f) => [f.key, f.value])))}
              className="flex items-center gap-1.5 text-xs text-secondary hover:text-foreground transition-colors"
            >
              <RotateCcw size={11} />
              Reset to defaults
            </button>
            <Button size="sm" onClick={handleSave} className="h-7 text-xs">
              <AnimatePresence mode="wait" initial={false}>
                {saved ? (
                  <motion.span key="saved" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-white">
                    <CheckCircle2 size={12} /> Saved
                  </motion.span>
                ) : (
                  <motion.span key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                    <Save size={12} /> Save Changes
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </div>
        )}
      </DashboardCard>
    </motion.div>
  );
}

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

function SettingsSidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    Settings2, BrainCircuit, ShieldCheck, Bell, CreditCard,
  };

  return (
    <nav className="w-44 shrink-0 space-y-0.5">
      {SETTINGS_SECTIONS.map((s) => {
        const Icon = icons[s.icon] ?? Settings2;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
              active === s.id
                ? "bg-primary/10 text-primary"
                : "text-secondary hover:text-foreground hover:bg-accent"
            )}
          >
            <Icon size={14} className="shrink-0" />
            {s.title}
            {active === s.id && <ChevronRight size={12} className="ml-auto text-primary" />}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");

  const visibleSections =
    activeSection === "all"
      ? SETTINGS_SECTIONS
      : SETTINGS_SECTIONS.filter((s) => s.id === activeSection);

  return (
    <PageContainer>
      <SectionTitle title="Settings" description="Platform configuration, AI parameters, and security policies" />

      <div className="flex gap-8">
        {/* Sticky left nav */}
        <div className="hidden md:block pt-0.5">
          <SettingsSidebar active={activeSection} onSelect={setActiveSection} />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-5">
          <AnimatePresence mode="wait">
            {visibleSections.map((section, i) => (
              <SectionCard key={section.id} section={section} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
}
