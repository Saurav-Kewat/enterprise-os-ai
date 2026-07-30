"use client";

import { DashboardCard } from "@/components/ui/DashboardCard";
import { ActionCard } from "@/components/ui/ActionCard";
import { Button } from "@/components/ui/button";
import { suggestedActions as actions } from "@/lib/mockData";

export function SuggestedActions() {
  return (
    <DashboardCard
      title="Suggested Actions"
      description="AI-prioritised items requiring attention"
      headerAction={
        <Button variant="ghost" size="sm" className="text-xs text-primary">
          View All
        </Button>
      }
    >
      <div className="space-y-2">
        {actions.map((action) => (
          <ActionCard key={action.id} {...action} />
        ))}
      </div>
    </DashboardCard>
  );
}
