import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  avatar: string;
  avatarFallback: string;
  title: string;
  highlight: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="dashboard-section p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-0">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarImage src={activity.avatar} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {activity.avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <p className="text-sm">
                <span>{activity.title}</span>{" "}
                <span className="text-primary font-medium">{activity.highlight}</span>
              </p>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
