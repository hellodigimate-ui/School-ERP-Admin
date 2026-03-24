"use client"

import Link from "next/link";

// import { Link } from "react-router-dom";

interface AttendanceData {
  rate: string;
  present: number;
  absent: number;
  onLeave: number;
}

interface AttendanceCardProps {
  data: AttendanceData;
}

export function AttendanceCard({ data }: AttendanceCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-5 flex items-center justify-between border-b border-border">
        <h3 className="text-base font-semibold text-foreground">My Attendance</h3>
        <Link
          href="/attendance"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View Details →
        </Link>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">{data.rate}</p>
            <p className="text-xs text-muted-foreground mt-1">Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-stat-green">{data.present}</p>
            <p className="text-xs text-muted-foreground mt-1">Present</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-stat-orange">{data.absent}</p>
            <p className="text-xs text-muted-foreground mt-1">Absent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-stat-blue">{data.onLeave}</p>
            <p className="text-xs text-muted-foreground mt-1">On Leave</p>
          </div>
        </div>
      </div>
    </div>
  );
}