"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { SuperAdminSidebar } from "./SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SuperAdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 flex items-center gap-4 border-b border-border bg-card px-4 sticky top-0 z-10">
            <SidebarTrigger />

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search students, fees, reports..."
                  className="pl-9 bg-secondary border-0"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>

              <span className="text-sm font-medium text-muted-foreground bg-secondary px-3 py-1.5 rounded-lg">
                2025-26
              </span>

              <button
                onClick={toggleDark}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>

          {/* Footer */}
          <footer className="powered-by border-t border-border py-3 text-center text-sm text-muted-foreground">
            Powered by Digimate
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}

// "use client";

// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
// import { Bell, Search, Moon, Sun } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { useState } from "react";
// import { SuperAdminSidebar } from "./SuperAdminSidebar";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleDark = () => {
//     setDarkMode(!darkMode);
//     document.documentElement.classList.toggle("dark");
//   };

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
        
//         <SuperAdminSidebar />

//         <div className="flex-1 flex flex-col">
//           {/* Topbar */}
//           <header className="h-14 flex items-center gap-4 px-4 bg-white border-b">
//             <SidebarTrigger />

//             <div className="flex-1 max-w-md">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <Input
//                   placeholder="Search..."
//                   className="pl-9 bg-gray-100 border-0"
//                 />
//               </div>
//             </div>

//             <div className="flex items-center gap-3 ml-auto">
//               <Bell className="w-5 h-5 text-gray-500 cursor-pointer" />

//               <button onClick={toggleDark}>
//                 {darkMode ? <Sun /> : <Moon />}
//               </button>

//               <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
//                 RS
//               </div>
//             </div>
//           </header>

//           {/* Content */}
//           <main className="flex-1 p-6">{children}</main>

//           {/* Footer */}
//           <footer className="text-center text-xs py-3 text-gray-400">
//             Powered by Digimate
//           </footer>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }