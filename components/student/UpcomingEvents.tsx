"use client"

import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  color: "purple" | "yellow" | "red" | "gray";
}

const events: Event[] = [
  {
    id: "1",
    title: "Mathematics Test",
    date: "Feb 8, 2026",
    time: "10:00 AM",
    color: "purple",
  },
  {
    id: "2",
    title: "Science Fair",
    date: "Feb 12, 2026",
    time: "9:00 AM",
    color: "yellow",
  },
  {
    id: "3",
    title: "Mid-Term Exams",
    date: "Feb 20, 2026",
    time: "8:00 AM",
    color: "red",
  },
  {
    id: "4",
    title: "Parent-Teacher Meeting",
    date: "Feb 25, 2026",
    time: "2:00 PM",
    color: "gray",
  },
];

const borderColors = {
  purple: "border-l-event-purple",
  yellow: "border-l-event-yellow",
  red: "border-l-event-red",
  gray: "border-l-event-gray",
};

const bgColors = {
  purple: "bg-event-purple/5",
  yellow: "bg-event-yellow/5",
  red: "bg-event-red/5",
  gray: "bg-secondary/50",
};

export function UpcomingEvents() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Upcoming Events</h3>
      </div>
      <div className="p-4 space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={cn(
              "p-3 rounded-lg border-l-4",
              borderColors[event.color],
              bgColors[event.color]
            )}
          >
            <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
            <div className="flex items-center gap-4 mt-1.5">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}