// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   Users,
//   BookOpen,
//   Calendar,
//   ClipboardCheck,
//   FileText,
//   Bell,
//   Settings,
//   ChevronLeft,
//   ChevronRight,
//   GraduationCap,
//   MessageSquare,
// } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { cn } from "@/lib/utils";

// interface NavItem {
//   icon: React.ElementType;
//   label: string;
//   path: string;
// }

// const navItems: NavItem[] = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
//   { icon: Users, label: "My Students", path: "/teacher/students" },
//   { icon: BookOpen, label: "My Classes", path: "/teacher/classes" },
//   { icon: Calendar, label: "Schedule", path: "/teacher/schedule" },
//   { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
//   { icon: FileText, label: "Assignments", path: "/teacher/assignments" },
//   { icon: GraduationCap, label: "Grades", path: "/teacher/grades" },
//   { icon: MessageSquare, label: "Messages", path: "/teacher/messages" },
// ];

// const bottomNavItems: NavItem[] = [
//   { icon: Bell, label: "Notifications", path: "/teacher/notifications" },
//   { icon: Settings, label: "Settings", path: "/teacher/settings" },
// ];

// export function TeacherSidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();

//   return (
//     <aside
//       className={cn(
//         "h-screen bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 sticky top-0",
//         collapsed ? "w-20" : "w-64"
//       )}
//     >
//       {/* Logo */}
//       <div className="flex items-center gap-3 h-16 px-4 border-b border-gray-700">
//         <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl flex-shrink-0">
//           <GraduationCap className="w-6 h-6" />
//         </div>
//         {!collapsed && (
//           <div className="flex flex-col">
//             <span className="font-semibold text-gray-100">School</span>
//             <span className="text-xs text-gray-400">Teacher Panel</span>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-1">
//         {navItems.map((item) => {
//           const isActive = pathname.startsWith(item.path);
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
//                 isActive ? "bg-gray-800 font-medium" : "hover:bg-gray-700",
//                 collapsed && "justify-center px-0"
//               )}
//               title={collapsed ? item.label : undefined}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom Navigation + Collapse */}
//       <div className="px-3 py-2 border-t border-gray-700 flex flex-col gap-1 mt-auto">
//         {bottomNavItems.map((item) => {
//           const isActive = pathname.startsWith(item.path);
//           return (
//             <Link
//               key={item.path}
//               href={item.path}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
//                 isActive ? "bg-gray-800 font-medium" : "hover:bg-gray-700",
//                 collapsed && "justify-center px-0"
//               )}
//               title={collapsed ? item.label : undefined}
//             >
//               <item.icon className="w-5 h-5 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </Link>
//           );
//         })}

//         {/* Collapse Button */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="flex items-center gap-3 justify-center px-3 py-2 rounded-md text-sm mt-2 hover:bg-gray-700 transition-colors"
//           aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {collapsed ? (
//             <ChevronRight className="w-5 h-5" />
//           ) : (
//             <>
//               <ChevronLeft className="w-5 h-5" />
//               <span>Collapse</span>
//             </>
//           )}
//         </button>
//       </div>

//       {/* Profile */}
//       <div
//         className={cn(
//           "px-3 py-4 border-t border-gray-700 flex items-center gap-3",
//           collapsed && "justify-center"
//         )}
//       >
//         <Avatar className="w-10 h-10 flex-shrink-0">
//           <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" />
//           <AvatarFallback>JD</AvatarFallback>
//         </Avatar>
//         {!collapsed && (
//           <div className="flex flex-col overflow-hidden">
//             <span className="font-medium truncate text-gray-100">
//               Jane Doe
//             </span>
//             <span className="text-xs text-gray-400">Mathematics Teacher</span>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }



"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
  { icon: Users, label: "My Students", path: "/teacher/students" },
  { icon: BookOpen, label: "My Classes", path: "/teacher/classes" },
  { icon: Calendar, label: "Schedule", path: "/teacher/schedule" },
  { icon: ClipboardCheck, label: "Attendance", path: "/teacher/attendance" },
  { icon: FileText, label: "Assignments", path: "/teacher/assignments" },
  { icon: GraduationCap, label: "Grades", path: "/teacher/grades" },
  { icon: MessageSquare, label: "Messages", path: "/teacher/messages" },
];

const bottomNavItems: NavItem[] = [
  { icon: Bell, label: "Notifications", path: "/teacher/notifications" },
  { icon: Settings, label: "Settings", path: "/teacher/settings" },
];

export function TeacherSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-screen flex flex-col transition-all duration-300 sticky top-0",
        "bg-gradient-to-b from-sky-400 to-blue-200 dark:from-sidebar-background dark:to-sidebar-background text-foreground dark:text-foreground",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6" />
          {!collapsed && (
            <span className="font-semibold text-lg">Teacher</span>
          )}
        </div>

        {/* Collapse Toggle */}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-medium shadow"
                  : "hover:bg-secondary/50 dark:hover:bg-secondary/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 space-y-2 mb-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl transition-all",
                isActive
                  ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-medium shadow"
                  : "hover:bg-secondary/50 dark:hover:bg-secondary/50",
                collapsed && "justify-center"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div
        className={cn(
          "px-3 py-4 flex items-center gap-3",
          collapsed && "justify-center"
        )}
      >
        <Avatar className="w-10 h-10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground">
            T
          </AvatarFallback>
        </Avatar>

        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-medium">Jane Doe</span>
            <span className="text-xs text-muted-foreground dark:text-muted-foreground">Teacher</span>
          </div>
        )}
      </div>
    </aside>
  );
}