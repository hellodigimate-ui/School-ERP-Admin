import { BookOpen, ClipboardCheck, FileText, Calendar } from "lucide-react";

const actions = [
  { label: "View Attendance", icon: ClipboardCheck },
  { label: "Assignments", icon: FileText },
  { label: "Exams", icon: BookOpen },
  { label: "Time Table", icon: Calendar },
];

export function StudentQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((a) => (
        <button
          key={a.label}
          className="rounded-xl border bg-card dark:bg-card p-4 hover:bg-secondary dark:hover:bg-secondary transition text-left"
        >
          <a.icon className="w-5 h-5 mb-2 text-primary" />
          <p className="text-sm font-medium">{a.label}</p>
        </button>
      ))}
    </div>
  );
}
