// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {  MapPin, ArrowUpRight } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
// import { axiosInstance } from "@/apiHome/axiosInstance"; // Make sure path is correct

interface Event {
  id: string;
  name: string;
  date: string;
  eventType: string;
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const gradients = [
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate().toString().padStart(2, "0");
    return { month, day };
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/events");
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md dark:bg-gray-900 animate-fade-in hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: "400ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 hover:scale-105 transition-transform duration-300" >
        <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg hover:scale-105 transition-transform duration-300">
          Upcoming Events
        </h3>
        <button className="text-indigo-600 font-semibold flex items-center gap-1 text-sm hover:underline transition-colors hover:scale-105 transition-transform duration-300">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Events List */}
      {loading ? (
        <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">
          Loading events...
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">
          No events found
        </p>
      ) : (
        <div className="space-y-5 hover:scale-105 transition-transform duration-300">
          {events.map((event, i) => {
            const { month, day } = formatDate(event.date);

            return (
              <div
                key={event.id}
                className="border p-4 rounded-lg flex justify-between items-center  hover:scale-105 transition-transform duration-300"
              >
                {/* Date Box */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br hover:scale-105 transition-transform duration-300 ${
                    gradients[i % gradients.length]
                  } flex flex-col items-center justify-center text-white shadow-md hover:scale-105 transition-transform duration-300`}
                >
                  <span className="text-[11px] font-semibold uppercase hover:scale-105 transition-transform duration-300">{month}</span>
                  <span className="text-lg font-bold">{day}</span>
                </div>

                {/* Event Details */}
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-800 dark:text-gray-100 hover:scale-105 transition-transform duration-300">
                    {event.name}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 hover:scale-105 transition-transform duration-300">
                    <MapPin size={12} /> <span>{event.eventType}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingEvents;