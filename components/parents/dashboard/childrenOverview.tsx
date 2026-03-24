"use client"


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users } from "lucide-react";

interface Child {
  id: string;
  name: string;
  avatar: string;
  class: string;
  attendance: number;
  cgpa: number;
  pendingFees: number;
}

interface ChildrenOverviewProps {
  data: Child[];
}

export function ChildrenOverview({ data }: ChildrenOverviewProps) {
  return (
    <div className="dashboard-section p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">My Children</h3>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {data.length}
        </Badge>
      </div>
      <div className="space-y-4">
        {data.map((child) => (
          <div
            key={child.id}
            className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-12 h-12 border-2 border-primary/30">
                <AvatarImage src={child.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {child.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{child.name}</h4>
                <p className="text-sm text-muted-foreground">{child.class}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Attendance</div>
                <div className="text-sm font-semibold text-success">{child.attendance}%</div>
                <Progress value={child.attendance} className="h-1.5 mt-1" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">CGPA</div>
                <div className="text-sm font-semibold">{child.cgpa}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Pending Fees</div>
                <div className="text-sm font-semibold text-warning">₹{child.pendingFees.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
