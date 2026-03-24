import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Student {
  rank: number;
  name: string;
  class: string;
  score: number;
  avatar: string;
}

const topStudents: Student[] = [
  {
    rank: 1,
    name: "Emma Johnson",
    class: "Class 12-A",
    score: 98.5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 2,
    name: "William Brown",
    class: "Class 11-A",
    score: 97.2,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 3,
    name: "Sophia Martinez",
    class: "Class 12-B",
    score: 96.8,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 4,
    name: "Oliver Garcia",
    class: "Class 10-B",
    score: 95.5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

export function TopStudents() {
  return (
    <div className="dashboard-section animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-warning" />
        <h2 className="section-title mb-0">Top Performers</h2>
      </div>
      <div className="space-y-0">
        {topStudents.map((student) => (
          <div key={student.rank} className="performer-row">
            <span className="w-6 text-center font-bold text-muted-foreground">
              {student.rank}
            </span>
            <Avatar className="w-9 h-9">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{student.name}</p>
              <p className="text-xs text-muted-foreground">{student.class}</p>
            </div>
            <span className="text-primary font-bold">{student.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
