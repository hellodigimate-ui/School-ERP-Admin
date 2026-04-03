"use client";

interface FeeBreakdownProps {
  admissionFee?: number;
  tutionFee?: number;
  transportFee?: number;
  hostelFee?: number;
  otherFee?: number;
  depositFee?: number;
  totalDiscount?: number;
}

export function FeeBreakdown({
  admissionFee = 0,
  tutionFee = 0,
  transportFee = 0,
  hostelFee = 0,
  otherFee = 0,
  depositFee = 0,
  totalDiscount = 0,
}: FeeBreakdownProps) {
  const fees = [
    { label: "Admission Fee", amount: admissionFee },
    { label: "Tuition Fee", amount: tutionFee },
    { label: "Transport Fee", amount: transportFee },
    { label: "Hostel Fee", amount: hostelFee },
    { label: "Other Fee", amount: otherFee },
    { label: "Deposit Fee", amount: depositFee },
  ].filter((fee) => fee.amount > 0);

  const subtotal = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const total = subtotal - totalDiscount;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">
          Fee Breakdown
        </h3>
      </div>
      <div className="p-4 space-y-3">
        {fees.map((fee, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{fee.label}</span>
            <span className="text-sm font-medium text-foreground">
              ₹{fee.amount.toLocaleString()}
            </span>
          </div>
        ))}
        {fees.length > 0 && (
          <>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Subtotal
                </span>
                <span className="text-sm font-semibold text-foreground">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
            </div>
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stat-green">
                  Discount
                </span>
                <span className="text-sm font-semibold text-stat-green">
                  -₹{totalDiscount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total
              </span>
              <span className="text-lg font-bold text-foreground">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
