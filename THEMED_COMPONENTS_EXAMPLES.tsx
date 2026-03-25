/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/set-state-in-effect */
// PROPERLY THEMED COMPONENTS - Copy & Paste Examples
// Use these as templates for fixing your existing components

// ============================================
// 1. SIMPLE CARD (Recommended Pattern)
// ============================================
"use client";

import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function ThemedCard({ title, children, icon }: CardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-accent">{icon}</span>}
        <h3 className="text-foreground font-semibold">{title}</h3>
      </div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}

// Usage:
// <ThemedCard title="Students" icon={<Users />}>
//   <p>Total: 1,245</p>
// </ThemedCard>

// ============================================
// 2. STAT CARD (with number)
// ============================================
export function StatCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string | number;
  change?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 transition-colors duration-300">
      <p className="text-muted-foreground text-sm font-medium">{label}</p>
      <p className="text-foreground text-3xl font-bold mt-2">{value}</p>
      {change && (
        <p className="text-success text-sm mt-2">
          {change} from last month
        </p>
      )}
    </div>
  );
}

// Usage:
// <StatCard label="Total Revenue" value="$12,456" change="+12%" />

// ============================================
// 3. TABLE (Theme-Aware)
// ============================================
export function ThemedTable() {
  const data = [
    { name: "John Doe", role: "Student", status: "Active" },
    { name: "Jane Smith", role: "Teacher", status: "Active" },
    { name: "Bob Johnson", role: "Staff", status: "Inactive" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-secondary">
          <tr>
            <th className="text-foreground font-semibold p-4 text-left">
              Name
            </th>
            <th className="text-foreground font-semibold p-4 text-left">Role</th>
            <th className="text-foreground font-semibold p-4 text-left">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-t border-border hover:bg-secondary/50 transition-colors duration-200"
            >
              <td className="text-foreground p-4">{row.name}</td>
              <td className="text-muted-foreground p-4">{row.role}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    row.status === "Active"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// 4. BUTTON GROUP (Theme-Aware)
// ============================================
export function ButtonGroup() {
  return (
    <div className="flex gap-3 flex-wrap">
      {/* Primary Button */}
      <button className="bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
        Primary
      </button>

      {/* Secondary Button */}
      <button className="bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
        Secondary
      </button>

      {/* Ghost Button */}
      <button className="text-foreground border border-border hover:bg-secondary px-4 py-2 rounded-lg font-medium transition-colors duration-200">
        Ghost
      </button>

      {/* Danger Button */}
      <button className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
        Delete
      </button>
    </div>
  );
}

// ============================================
// 5. ALERT BOX (Theme-Aware)
// ============================================
export function ThemedAlert({
  type = "info",
  message,
}: {
  type?: "success" | "warning" | "error" | "info";
  message: string;
}) {
  const colors = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-accent/10 text-accent border-accent/20",
  };

  return (
    <div
      className={`border rounded-lg p-4 ${colors[type]} transition-colors duration-300`}
    >
      {message}
    </div>
  );
}

// Usage:
// <ThemedAlert type="success" message="Student added successfully" />
// <ThemedAlert type="error" message="Failed to update record" />

// ============================================
// 6. INPUT FIELD (Theme-Aware)
// ============================================
export function ThemedInput({
  placeholder,
  label,
  error,
}: {
  placeholder?: string;
  label: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-foreground font-medium">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-background text-foreground border border-border rounded-lg px-4 py-2 placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors duration-300"
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

// Usage:
// <ThemedInput label="Name" placeholder="Enter name" />

// ============================================
// 7. CHART EXAMPLE (Recharts)
// ============================================
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { name: "Jan", students: 400, fees: 2400 },
  { name: "Feb", students: 300, fees: 1398 },
  { name: "Mar", students: 200, fees: 9800 },
];

export function ThemedChart() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = theme === "dark";

  const colors = {
    text: isDark ? "#E5E7EB" : "#1F2937",
    grid: isDark ? "#374151" : "#E5E7EB",
    bar1: isDark ? "#06B6D4" : "#3B82F6",
    bar2: isDark ? "#10B981" : "#10B981",
  };

  return (
    <div className="w-full h-96 bg-card border border-border rounded-lg p-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis dataKey="name" stroke={colors.text} />
          <YAxis stroke={colors.text} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${colors.grid}`,
              color: colors.text,
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="students" fill={colors.bar1} />
          <Bar dataKey="fees" fill={colors.bar2} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// 8. SIDEBAR ITEM
// ============================================
import { ChevronRight } from "lucide-react";

export function SidebarItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon?: ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      }`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span className="flex-1 text-left font-medium">{label}</span>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

// ============================================
// 9. MODAL/DIALOG
// ============================================
export function ThemedModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6 border-b border-border">
          <h2 className="text-foreground text-lg font-semibold">{title}</h2>
        </div>
        <div className="p-6 text-muted-foreground">{children}</div>
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
          <button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-lg transition-colors duration-200">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 10. BADGE/CHIP
// ============================================
export function ThemedBadge({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warning" | "error";
}) {
  const styles = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles[variant]} transition-colors duration-300`}
    >
      {label}
    </span>
  );
}

// Usage:
// <ThemedBadge label="Active" variant="success" />
// <ThemedBadge label="Pending" variant="warning" />

// ============================================
// KEY PATTERNS
// ============================================
/*
✅ ALWAYS USE:
- bg-card, bg-background, bg-secondary
- text-foreground, text-muted-foreground
- border-border
- bg-accent, text-accent
- transition-colors duration-300

❌ NEVER USE:
- bg-white, bg-gray-*
- text-gray-*, text-black, text-white
- border-gray-*, border-zinc-*
- Hardcoded #colors (except in dynamic theme logic)

💡 FOR CHARTS:
- Extract theme with useTheme()
- Check mounted state
- Create color object based on theme
- Pass to chart components
- Add transition class to container

🎨 COLORS AVAILABLE:
- background, foreground
- card, card-foreground
- secondary, secondary-foreground
- accent, accent-foreground
- success, success-foreground
- warning, warning-foreground
- destructive, destructive-foreground
- muted, muted-foreground
- border, input, ring
*/
