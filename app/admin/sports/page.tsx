/* eslint-disable @typescript-eslint/no-explicit-any */


"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Users, Trophy, Medal, Clock, UserCog } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import EnrollmentTab from "@/components/sports/enrollments";
import ScheduleTab from "@/components/sports/schedule";
import TournamentTab from "@/components/sports/tournament";
import AchievementsTab from "@/components/sports/achievement";
import SportsList from "@/components/sports/sportsList";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState("list");

  const [stats, setStats] = useState<any>({
    totalSports: 0,
    totalEnrollments: 0,
    totalCoaches: 0,
    totalAchievements: 0,
  });

  // ✅ Fetch stats API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/sports/stats");

        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
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
            value: stats.totalCoaches, // ✅ fixed
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="list"><Dumbbell size={14}/> Sports List</TabsTrigger>
          <TabsTrigger value="enrollment"><Users size={14}/> Enrollment</TabsTrigger>
          <TabsTrigger value="schedule"><Clock size={14}/> Schedule</TabsTrigger>
          <TabsTrigger value="tournaments"><Trophy size={14}/> Tournaments</TabsTrigger>
          <TabsTrigger value="achievements"><Medal size={14}/> Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="list"><SportsList /></TabsContent>
        <TabsContent value="enrollment"><EnrollmentTab /></TabsContent>
        <TabsContent value="schedule"><ScheduleTab /></TabsContent>
        <TabsContent value="tournaments"><TournamentTab /></TabsContent>
        <TabsContent value="achievements"><AchievementsTab /></TabsContent>
      </Tabs>
    </AdminLayout>
  );
}