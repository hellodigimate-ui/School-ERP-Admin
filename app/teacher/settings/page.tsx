"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import {
  User,
  Shield,
} from "lucide-react";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { DashboardHeader } from "@/components/teacher/DashboardHeader";
import ProfileSettings from "@/components/coach/profileSetting";
import SecuritySetting from "@/components/coach/securitySetting";


export default function SystemSettingsPage() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const defaultTab = path.includes("/settings/currency") ? "currency" : "profile";

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Teacher Sidebar */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 p-6">
        <DashboardHeader />

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Settings Dashboard</h1>
            <p className="text-sm opacity-90 mt-1">
              Manage your account, system preferences, and configurations
            </p>
          </div>

          {/* glow effect */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          
          <TabsList
            className="
              flex gap-2 p-1.5 rounded-2xl
              bg-gradient-to-r 
              from-indigo-100 via-sky-100 to-purple-100
              dark:from-gray-800 dark:via-gray-800 dark:to-gray-900
              shadow-inner backdrop-blur-md
            "
          >
            <TabsTrigger
              value="profile"
              className="
                group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                text-gray-600 dark:text-gray-300
                transition-all duration-300

                hover:bg-white/60 dark:hover:bg-gray-700
                hover:text-indigo-600

                data-[state=active]:bg-white
                data-[state=active]:text-indigo-600
                data-[state=active]:shadow-lg
                data-[state=active]:scale-105
              "
            >
              <User className="w-4 h-4 transition-transform group-hover:rotate-6" />
              Profile

              {/* Active Indicator */}
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-indigo-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition" />
            </TabsTrigger>

            <TabsTrigger
              value="security"
              className="
                group relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                text-gray-600 dark:text-gray-300
                transition-all duration-300

                hover:bg-white/60 dark:hover:bg-gray-700
                hover:text-pink-600

                data-[state=active]:bg-white
                data-[state=active]:text-pink-600
                data-[state=active]:shadow-lg
                data-[state=active]:scale-105
              "
            >
              <Shield className="w-4 h-4 transition-transform group-hover:rotate-6" />
              Security

              {/* Active Indicator */}
              <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-pink-500 rounded-full opacity-0 data-[state=active]:opacity-100 transition" />
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <SecuritySetting />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}