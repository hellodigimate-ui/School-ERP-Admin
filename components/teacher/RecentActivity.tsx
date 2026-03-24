import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  id: number;
  user: string;
  avatar: string;
  action: string;
  target: string;
  time: string;
}

const activities: ActivityItem[] = [
  {
    id: 1,
    user: "You",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    action: "submitted grades for",
    target: "Class 12-A Mathematics",
    time: "10 min ago",
  },
  {
    id: 2,
    user: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    action: "submitted assignment for",
    target: "Algebra Quiz",
    time: "25 min ago",
  },
  {
    id: 3,
    user: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    action: "requested leave for",
    target: "Feb 10, 2026",
    time: "1 hour ago",
  },
  {
    id: 4,
    user: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    action: "completed homework for",
    target: "Geometry Chapter 5",
    time: "2 hours ago",
  },
  {
    id: 5,
    user: "Admin",
    avatar: "",
    action: "scheduled meeting",
    target: "Staff Training",
    time: "3 hours ago",
  },
];

export function RecentActivity() {
  return (
    <div className="dashboard-section animate-fade-in">
      <h2 className="section-title">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 animate-slide-in">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {activity.user.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="text-primary font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
