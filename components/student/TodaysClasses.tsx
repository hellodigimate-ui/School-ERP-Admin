"use client";

import { Clock, BookOpen, User } from "lucide-react";

interface ClassItem {
  id: string;
  subject: string;
  time?: string;
  teacher?: {
    name: string;
  };
  period?: {
    startTime: string;
    endTime: string;
  };
  day?: string;
}

interface TodaysClassesProps {
  classes?: ClassItem[];
  loading?: boolean;
  error?: string;
}

const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export function TodaysClasses({
  classes = [],
  loading = false,
  error,
}: TodaysClassesProps) {
  const getTodayName = () => {
    const today = new Date().getDay();
    return days[today];
  };

  const formatTime = (time: string | Date) => {
    if (!time) return "";
    const date = new Date(time);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const todaysClasses = classes.filter(
    (cls) =>
      cls.day === getTodayName() || cls.day === getTodayName().toLowerCase(),
  );

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Today's Classes
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-muted-foreground">
          Loading schedule...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Today's Classes
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-muted-foreground">
          {error}
        </div>
      </div>
    );
  }

  if (todaysClasses.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-5 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">
            Today's Classes
          </h3>
        </div>
        <div className="p-4 text-center text-sm text-muted-foreground">
          No classes scheduled for today
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Today's Classes
          </h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {todaysClasses.length} Class{todaysClasses.length !== 1 ? "es" : ""}
          </span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {todaysClasses.map((classItem, idx) => (
          <div
            key={classItem.id || idx}
            className="pb-3 border-b border-border last:border-0 last:pb-0"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {classItem.subject}
                </h4>
                {classItem.teacher && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{classItem.teacher.name}</span>
                  </div>
                )}
              </div>
              {classItem.period && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatTime(classItem.period.startTime)} -{" "}
                    {formatTime(classItem.period.endTime)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
