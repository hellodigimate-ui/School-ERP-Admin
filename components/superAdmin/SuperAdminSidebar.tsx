"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { title: "Dashboard", url: "/superAdmin/dashboard", icon: LayoutDashboard },
  {
    title: "Front CMS",
    icon: Globe,
    children: [
      { title: "Pages", url: "/superAdmin/cms/pages" },
      { title: "Menus", url: "/superAdmin/cms/menus" },
      { title: "Banner Images", url: "/superAdmin/cms/banners" },
      { title: "Gallery", url: "/superAdmin/cms/gallery" },
      { title: "News", url: "/superAdmin/cms/news" },
      { title: "Events", url: "/superAdmin/cms/events" },
    ],
  },
  { title: "Reports", url: "/superAdmin/reports", icon: BarChart3 },
  {
    title: "Admin Management",
    icon: ShieldCheck,
    children: [
      { title: "Manage Users", url: "/superAdmin/management/users" },
      { title: "Roles & Permissions", url: "/superAdmin/management/roles" },
    ],
  },
  { title: "Pricing Plans", url: "/superAdmin/pricing", icon: CreditCard },
  { title: "System Settings", url: "/superAdmin/settings", icon: Settings },
];

export function SuperAdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-slate-800"
    >
      {/* Header */}
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shadow">
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
                        ? "bg-white text-sky-700 font-semibold shadow-md"
                        : "text-slate-700 hover:bg-white/60"
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
        <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl shadow-sm">
          <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center font-semibold text-sky-700">
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

              <LogOut className="w-4 h-4 text-slate-600 cursor-pointer" />
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
        <CollapsibleTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/40 w-full">
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
                    ? "bg-white text-indigo-600 font-medium"
                    : "hover:bg-white/40"
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