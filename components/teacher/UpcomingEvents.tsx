"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  eventType: string;
  createdAt: string;
  updatedAt: string;
}

interface FormattedEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  colorClass: string;
}

const eventTypeColors: { [key: string]: string } = {
  WEBINAR: "from-purple-500/20 to-purple-400/10 border-purple-500/30",
  FUNDRAISER: "from-emerald-500/20 to-green-400/10 border-emerald-500/30",
  TOURNAMENT: "from-red-500/20 to-rose-400/10 border-red-500/30",
  MEETING: "from-blue-500/20 to-indigo-400/10 border-blue-500/30",
  CONFERENCE: "from-orange-500/20 to-amber-400/10 border-orange-500/30",
  WORKSHOP: "from-yellow-400/20 to-yellow-300/10 border-yellow-400/30",
  TRAINING: "from-pink-500/20 to-rose-400/10 border-pink-500/30",
  DEFAULT: "from-gray-400/20 to-gray-300/10 border-gray-400/30",
};

export function UpcomingEvents() {
  const [events, setEvents] = useState<FormattedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/api/v1/events", {
          params: { page: 1, perPage: 10 },
        });

        if (response.data?.data && Array.isArray(response.data.data)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcomingEvents = response.data.data
            .filter((event: Event) => new Date(event.date) >= today)
            .sort(
              (a: Event, b: Event) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(0, 4)
            .map((event: Event) => {
              const eventDate = new Date(event.date);

              return {
                id: event.id,
                title: event.name,
                date: eventDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
                time: eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }),
                colorClass:
                  eventTypeColors[event.eventType] ||
                  eventTypeColors.DEFAULT,
              };
            });

          setEvents(upcomingEvents);
        }
      } catch (err: any) {
        console.error(err);
        setError("Failed to load upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  return (
    <div className="relative rounded-2xl p-6 overflow-hidden
      bg-gradient-to-br from-background to-muted/40
      border border-border/50 shadow-sm hover:shadow-xl
      transition-all duration-300">

      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10">
        <h2 className="text-xl font-bold mb-5 bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
          Upcoming Events
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive text-sm py-10">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-10">
            No upcoming events
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`
                  group p-4 rounded-xl border
                  bg-gradient-to-br ${event.colorClass}
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-lg
                  animate-fade-in-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}