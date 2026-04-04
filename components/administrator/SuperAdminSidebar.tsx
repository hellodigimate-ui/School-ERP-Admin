"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Globe,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useState } from "react";

const menuItems = [
  { title: "Dashboard", url: "/administrator/dashboard", icon: LayoutDashboard },
  {
    title: "Front CMS",
    icon: Globe,
    children: [
      { title: "Pages", url: "/administrator/cms/pages" },
      { title: "Menus", url: "/administrator/cms/menus" },
      { title: "Banner Images", url: "/administrator/cms/banners" },
      { title: "Gallery", url: "/administrator/cms/gallery" },
      { title: "News", url: "/administrator/cms/news" },
      { title: "Events", url: "/administrator/cms/events" },
    ],
  },
  { title: "Reports", url: "/administrator/reports", icon: BarChart3 },
  {
    title: "Admin Management",
    icon: ShieldCheck,
    children: [
      { title: "Manage Users", url: "/administrator/management/users" },
      { title: "Roles & Permissions", url: "/administrator/management/roles" },
    ],
  },
  { title: "Pricing Plans", url: "/administrator/pricing", icon: CreditCard },
  { title: "System Settings", url: "/administrator/settings", icon: Settings },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-slate-800"
    >
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/60 dark:bg-secondary/60 flex items-center justify-center shadow">
            <GraduationCap className="w-5 h-5 text-sky-700" />
          </div>

          {!collapsed && (
            <span className="font-bold text-lg text-slate-800">
              Super Admin
            </span>
          )}
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="px-3 py-2">
        <SidebarMenu className="space-y-1">
          {menuItems.map((item) =>
            item.children ? (
              <CollapsibleMenuItem
                key={item.title}
                item={item}
                collapsed={collapsed}
                currentPath={pathname}
              />
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                    ${
                      pathname === item.url
                        ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-semibold shadow-md"
                        : "text-muted-foreground dark:text-muted-foreground hover:bg-secondary/50 dark:hover:bg-secondary/50"
                    }`}
                  >
                    <item.icon className="w-[18px] h-[18px]" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 bg-secondary/30 dark:bg-secondary/30 p-2 rounded-xl shadow-sm">
          <div className="w-9 h-9 rounded-full bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground flex items-center justify-center font-semibold">
            RS
          </div>

          {!collapsed && (
            <>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  Rahul Sharma
                </p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>

              <LogOut onClick={()=>router.push("/")} className="w-4 h-4 text-slate-600 cursor-pointer" />
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

/* Collapsible */
function CollapsibleMenuItem({
  item,
  collapsed,
  currentPath,
}: any) {
  const [open, setOpen] = useState(false);

  if (collapsed) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton>
          <item.icon className="w-[18px] h-[18px]" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/50 dark:hover:bg-secondary/50 w-full">
          <item.icon className="w-[18px] h-[18px]" />
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronRight className={`w-4 h-4 ${open ? "rotate-90" : ""}`} />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child: any) => (
              <Link
                key={child.url}
                href={child.url}
                className={`block px-3 py-1.5 rounded-lg text-sm
                ${
                  currentPath === child.url
                    ? "bg-primary dark:bg-primary text-primary-foreground dark:text-primary-foreground font-medium"
                    : "hover:bg-secondary/50 dark:hover:bg-secondary/50"
                }`}
              >
                {child.title}
              </Link>
            ))}
          </div>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
