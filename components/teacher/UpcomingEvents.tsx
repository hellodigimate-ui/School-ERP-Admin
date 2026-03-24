import { Calendar, Clock } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  colorClass: string;
}

const events: Event[] = [
  {
    id: 1,
    title: "Parent-Teacher Meeting",
    date: "Jan 30, 2026",
    time: "10:00 AM",
    colorClass: "event-card-purple",
  },
  {
    id: 2,
    title: "Science Fair",
    date: "Feb 5, 2026",
    time: "9:00 AM",
    colorClass: "event-card-green",
  },
  {
    id: 3,
    title: "Mid-Term Exams Begin",
    date: "Feb 10, 2026",
    time: "8:00 AM",
    colorClass: "event-card-red",
  },
  {
    id: 4,
    title: "Staff Training",
    date: "Feb 15, 2026",
    time: "2:00 PM",
    colorClass: "event-card-blue",
  },
];

export function UpcomingEvents() {
  return (
    <div className="dashboard-section animate-fade-in">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="space-y-0">
        {events.map((event) => (
          <div key={event.id} className={`event-card ${event.colorClass}`}>
            <h3 className="font-medium">{event.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
