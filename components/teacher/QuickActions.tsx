import { ClipboardCheck,  CalendarPlus,  Users, BookOpen } from "lucide-react";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  iconColor: string;
}

const quickActions: QuickAction[] = [
  {
    icon: ClipboardCheck,
    title: "Take Attendance",
    description: "Mark today's attendance",
    href: "/teacher/attendance",
    iconColor: "text-primary",
  },
  {
    icon: Users,
    title: "My Students",
    description: "Enter student ",
    href: "/teacher/students",
    iconColor: "text-success",
  },
  {
    icon: CalendarPlus,
    title: "Create Assignment",
    description: "Add new assignment",
    href: "/teacher/assignments",
    iconColor: "text-warning",
  },
  {
    icon: BookOpen,
    title: "My Classes",
    description: "Create class ",
    href: "/teacher/classes",
    iconColor: "text-info",
  },
];

export function QuickActions() {
  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <p className="text-xs text-muted-foreground">
            Perform common tasks instantly
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group relative flex flex-col items-center justify-center gap-3 p-5 rounded-xl 
              bg-white/70 dark:bg-gray-800/60 backdrop-blur 
              border border-border/50 
              shadow-sm hover:shadow-md 
              hover:-translate-y-1 transition-all duration-300"
            >
              {/* ICON */}
              <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                bg-gradient-to-br from-indigo-500/10 to-pink-500/10
                group-hover:scale-110 transition-transform duration-300 shadow-inner"
              >
                <action.icon
                  className={`w-6 h-6 
                  ${
                    action.title === "Take Attendance"
                      ? "text-indigo-600"
                      : action.title === "Add Grades"
                      ? "text-green-500"
                      : action.title === "Create Assignment"
                      ? "text-yellow-500"
                      : "text-pink-500"
                  }`}
                />
              </div>

              {/* TEXT */}
              <div className="text-center">
                <p className="font-semibold text-sm text-foreground group-hover:text-indigo-600 transition">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-indigo-500/5 to-pink-500/5" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
