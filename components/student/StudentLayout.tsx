"use client"

import { useState } from "react";
import { StudentHeader } from "./StudentHeader";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import StudentSidebar from "./StudentSidebar";
import MobileSidebar from "./MobileSidebar";

interface StudentLayoutProps {
children: React.ReactNode;
}

export function StudentLayout({ children }: StudentLayoutProps) {
const [collapsed, setCollapsed] = useState(false);
const [mobileOpen, setMobileOpen] = useState(false);
const isMobile = useIsMobile();

return (
  <div className="min-h-screen mx-7 bg-background">
    {/* Desktop Sidebar */}
    {!isMobile && (
      <StudentSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
    )}
    
    {/* Mobile Sidebar */}
    {isMobile && (
      <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
    )}
    
    <div className={cn(
      "transition-all duration-300",
      !isMobile && (collapsed ? "ml-16" : "ml-56"),
      isMobile && "ml-0"
    )}>
      <StudentHeader 
        studentName="Rahul Kumar" 
        onMenuClick={() => setMobileOpen(true)}
        showMenuButton={isMobile}
      />
      <main className="p-4 md:p-6">{children}</main>
      <footer className="py-4 text-center text-xs text-muted-foreground border-t border-border">
        Powered by Digimate Tech™
      </footer>
    </div>
  </div>
);
}
