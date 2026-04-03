/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
  createdAt?: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent assignments from homework endpoint
        const response = await axiosInstance.get("/api/v1/homework/teacher", {
          params: { page: 1, perPage: 5 },
        });

        if (response.data?.data && Array.isArray(response.data.data)) {
          const formattedActivities = response.data.data.map((item: any, index: number) => ({
            id: item.id || item._id,
            user: "You",
            avatar: "",
            action: "Created assignment",
            target: item.title || "Untitled Assignment",
            time: getTimeAgo(item.createdAt || new Date()),
            createdAt: item.createdAt,
          }));

          setActivities(formattedActivities);
        } else {
          setActivities([]);
        }
      } catch (err: any) {
        console.error("Error fetching recent assignments:", err);
        setError("Failed to load recent assignments");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAssignments();
  }, []);

  const getTimeAgo = (date: string | Date): string => {
    try {
      const now = new Date();
      const activityDate = typeof date === "string" ? new Date(date) : date;
      const seconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

      let interval = seconds / 31536000;
      if (interval > 1) return Math.floor(interval) + " years ago";

      interval = seconds / 2592000;
      if (interval > 1) return Math.floor(interval) + " months ago";

      interval = seconds / 86400;
      if (interval > 1) return Math.floor(interval) + " days ago";

      interval = seconds / 3600;
      if (interval > 1) return Math.floor(interval) + " hours ago";

      interval = seconds / 60;
      if (interval > 1) return Math.floor(interval) + " mins ago";

      return Math.floor(seconds) + " seconds ago";
    } catch {
      return "recently";
    }
  };

  return (
    <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              Recent Activity
            </h2>
            <p className="text-xs text-muted-foreground">
              Your latest actions & assignments
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            Loading activities...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-medium">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            📭 No recent assignments yet
          </div>
        ) : (
          <div className="space-y-5">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className="relative flex items-start gap-4 group"
              >
                {/* TIMELINE DOT */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 shadow" />
                  {index !== activities.length - 1 && (
                    <div className="w-[2px] flex-1 bg-gradient-to-b from-indigo-300 to-transparent mt-1" />
                  )}
                </div>

                {/* CARD */}
                <div className="flex-1 bg-white/70 dark:bg-gray-800/60 backdrop-blur rounded-xl p-4 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">

                  <div className="flex items-start gap-3">
                    {/* AVATAR */}
                    <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-indigo-100">
                      {activity.avatar ? (
                        <AvatarImage src={activity.avatar} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm">
                          {activity.user.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {/* TEXT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-foreground">
                          {activity.user}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {activity.action}
                        </span>{" "}
                        <span className="font-semibold text-indigo-600 group-hover:text-pink-500 transition">
                          {activity.target}
                        </span>
                      </p>

                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>

                  {/* HOVER GLOW */}
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition pointer-events-none bg-gradient-to-r from-indigo-500/5 to-pink-500/5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
