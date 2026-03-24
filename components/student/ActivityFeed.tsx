"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Activity {
  id: string;
  avatar?: string;
  name: string;
  action: string;
  target: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    name: "Mrs. Sharma",
    action: "posted new assignment for",
    target: "Mathematics",
    time: "10 min ago",
  },
  {
    id: "2",
    name: "Mr. Patel",
    action: "updated grades for",
    target: "Physics 101",
    time: "1 hour ago",
  },
  {
    id: "3",
    name: "Mrs. Gupta",
    action: "scheduled test for",
    target: "English Literature",
    time: "2 hours ago",
  },
  {
    id: "4",
    name: "Admin",
    action: "sent fee reminder for",
    target: "Term 2 Fees",
    time: "3 hours ago",
  },
  {
    id: "5",
    name: "Mr. Kumar",
    action: "uploaded study material for",
    target: "Chemistry",
    time: "5 hours ago",
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="p-4 space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback className="bg-secondary text-xs">
                {activity.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="text-primary font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}