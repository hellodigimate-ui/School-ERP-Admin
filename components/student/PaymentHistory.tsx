"use client";

import { CheckCircle, Clock } from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  status: string;
  paymentDate: string | Date;
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

export function PaymentHistory({ payments = [] }: PaymentHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4 text-stat-green" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-stat-yellow" />;
      default:
        return null;
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">
          Payment History
        </h3>
      </div>
      <div className="p-4">
        {payments && payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="pb-3 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.paymentMode}
                      </p>
                      {payment.transactionId && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {payment.transactionId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(payment.paymentDate)}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 bg-secondary rounded text-xs font-medium text-foreground">
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No payment history
          </p>
        )}
      </div>
    </div>
  );
}
