/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Users, Trophy, Medal, Clock, UserCog } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import EnrollmentTab from "@/components/sports/enrollments";
import ScheduleTab from "@/components/sports/schedule";
import TournamentTab from "@/components/sports/tournament";
import AchievementsTab from "@/components/sports/achievement";
import SportsList from "@/components/sports/sportsList";

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState("list");

  const [stats, setStats] = useState<any>({
    totalSports: 0,
    totalEnrollments: 0,
    totalPracticeSchedules: 0,
    totalAchievements: 0,
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 p-5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl">
            <Dumbbell size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Sports Management</h1>
            <p className="text-sm opacity-90">
              Manage sports, coaches, schedules & achievements
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats &&
          [
            {
              label: "Total Sports",
              value: stats.totalSports,
              color: "from-blue-400 to-blue-600",
              icon: Dumbbell,
            },
            {
              label: "Enrolled Students",
              value: stats.totalEnrollments,
              color: "from-emerald-400 to-green-600",
              icon: Users,
            },
            {
              label: "Active Coaches",
              value: stats.totalPracticeSchedules,
              color: "from-purple-400 to-purple-600",
              icon: UserCog,
            },
            {
              label: "Achievements",
              value: stats.totalAchievements,
              color: "from-amber-400 to-orange-500",
              icon: Trophy,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg hover:scale-[1.03] transition`}
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.label}</p>
                </div>
                <stat.icon size={28} className="opacity-40" />
              </div>
            </div>
          ))}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-muted p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger
            value="list"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Dumbbell size={14} className="mr-1.5" /> Sports List
          </TabsTrigger>
          <TabsTrigger
            value="enrollment"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Users size={14} className="mr-1.5" /> Enrollment
          </TabsTrigger>
          
          <TabsTrigger
            value="schedule"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Clock size={14} className="mr-1.5" /> Schedule
          </TabsTrigger>
          <TabsTrigger
            value="tournaments"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Trophy size={14} className="mr-1.5" /> Tournaments
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <Medal size={14} className="mr-1.5" /> Achievements
          </TabsTrigger>
        </TabsList>

        {/* Sports List Tab */}
        <TabsContent value="list" className="space-y-6">
          <SportsList />
        </TabsContent>

        {/* Enrollment Tab */}
        <TabsContent value="enrollment" className="space-y-4">
          <EnrollmentTab />
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <ScheduleTab />
        </TabsContent>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-4">
          <TournamentTab />
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <AchievementsTab />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}