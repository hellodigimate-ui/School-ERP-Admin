import { Clock } from "lucide-react";

interface ScheduleItem {
  time: string;
  subject: string;
  class: string;
  room: string;
  status: "completed" | "ongoing" | "upcoming";
}

const scheduleItems: ScheduleItem[] = [
  { time: "08:00 - 08:45", subject: "Advanced Mathematics", class: "Class 12-A", room: "Room 201", status: "completed" },
  { time: "09:00 - 09:45", subject: "Algebra", class: "Class 10-B", room: "Room 105", status: "completed" },
  { time: "10:00 - 10:45", subject: "Geometry", class: "Class 11-A", room: "Room 302", status: "ongoing" },
  { time: "11:00 - 11:45", subject: "Statistics", class: "Class 12-B", room: "Room 201", status: "upcoming" },
  { time: "12:30 - 13:15", subject: "Basic Math", class: "Class 9-A", room: "Room 103", status: "upcoming" },
];

export function TodaySchedule() {
  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Today`s Schedule</h2>
        <a href="/schedule" className="text-sm text-primary hover:underline font-medium">
          View Full →
        </a>
      </div>
      <div className="space-y-3">
        {scheduleItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              item.status === "ongoing"
                ? "bg-primary/10 border border-primary/30"
                : item.status === "completed"
                ? "opacity-60"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2 w-32 flex-shrink-0">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{item.time}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.subject}</p>
              <p className="text-sm text-muted-foreground">{item.class} • {item.room}</p>
            </div>
            <div className="flex-shrink-0">
              {item.status === "ongoing" && (
                <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                  Now
                </span>
              )}
              {item.status === "completed" && (
                <span className="px-2 py-1 text-xs font-medium bg-success/20 text-success rounded-full">
                  Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
