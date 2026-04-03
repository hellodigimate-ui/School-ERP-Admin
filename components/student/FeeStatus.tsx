"use client";

import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface FeeStatusProps {
  totalFee?: number;
  totalPaid?: number;
  pendingFee?: number;
  overdueFee?: number;
  dueDate?: string | Date;
  isOverdue?: boolean;
  status?: string;
  // Legacy props for backward compatibility
  collected?: string;
  pending?: string;
  overdue?: string;
}

export function FeeStatus(props: FeeStatusProps) {
  const {
    totalFee = 0,
    totalPaid = 0,
    pendingFee = 0,
    overdueFee = 0,
    dueDate,
    isOverdue = false,
    status = "PENDING",
    collected,
    pending,
    overdue,
  } = props;

  // Use real data if available, fallback to legacy props
  const displayPaid =
    totalPaid > 0 ? `₹${totalPaid.toLocaleString()}` : collected || "₹0";
  const displayPending =
    pendingFee > 0 ? `₹${pendingFee.toLocaleString()}` : pending || "₹0";
  const displayOverdue =
    overdueFee > 0 ? `₹${overdueFee.toLocaleString()}` : overdue || "₹0";
  const displayTotal = totalFee > 0 ? `₹${totalFee.toLocaleString()}` : "N/A";
  const displayDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const progressPercentage =
    totalFee > 0 ? Math.round((totalPaid / totalFee) * 100) : 0;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Fee Status</p>
            <p className="text-lg font-bold text-foreground">{displayTotal}</p>
          </div>
          <div className="flex items-center">
            {status === "COMPLETED" ? (
              <CheckCircle className="h-5 w-5 text-stat-green" />
            ) : isOverdue ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Clock className="h-5 w-5 text-stat-yellow" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalFee > 0 && (
        <div className="px-4 pt-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">
              Payment Progress
            </span>
            <span className="text-xs font-medium text-foreground">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-stat-green h-2 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Paid</span>
          <span className="text-sm font-medium text-stat-green">
            {displayPaid}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Pending</span>
          <span className="text-sm font-medium text-stat-yellow">
            {displayPending}
          </span>
        </div>
        {overdueFee > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overdue</span>
            <span className="text-sm font-medium text-destructive">
              {displayOverdue}
            </span>
          </div>
        )}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Due Date</span>
          <span className="text-xs font-medium text-foreground">
            {displayDueDate}
          </span>
        </div>
      </div>
    </div>
  );
}
