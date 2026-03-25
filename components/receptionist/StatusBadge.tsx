"use client";

import { Badge } from "@/components/ui/badge";

const statusStyles: Record<string, string> = {
  Open: "bg-info text-info-foreground",
  Closed: "bg-muted text-muted-foreground",
  Won: "bg-success text-success-foreground",
  Lost: "bg-destructive text-destructive-foreground",
  Pending: "bg-warning text-warning-foreground",
  Resolved: "bg-success text-success-foreground",
  "In Progress": "bg-info text-info-foreground",
  Incoming: "bg-success text-success-foreground",
  Outgoing: "bg-primary text-primary-foreground",
  Receive: "bg-info text-info-foreground",
  Dispatch: "bg-accent text-accent-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  const className =
    statusStyles[status] || "bg-muted text-muted-foreground";

  return (
    <Badge className={className}>
      {status}
    </Badge>
  );
}