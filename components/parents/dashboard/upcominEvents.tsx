import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  color: "primary" | "success" | "warning" | "destructive";
}

interface UpcomingEventsProps {
  events: Event[];
}

const colorClasses = {
  primary: "border-l-primary bg-primary/5",
  success: "border-l-success bg-success/5",
  warning: "border-l-warning bg-warning/5",
  destructive: "border-l-destructive bg-destructive/5",
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <div className="dashboard-section p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={cn("event-card", colorClasses[event.color])}
          >
            <h4 className="font-medium text-sm">{event.title}</h4>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {event.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
