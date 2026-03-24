import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

const students = [
  {
    id: 1,
    name: "Emma Johnson",
    grade: "Grade 12",
    score: 98.5,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "William Brown",
    grade: "Grade 11",
    score: 97.2,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Sophia Martinez",
    grade: "Grade 12",
    score: 96.8,
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Oliver Garcia",
    grade: "Grade 10",
    score: 95.5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
  },
];

export function TopStudents() {
  return (
    <div className="bg-card rounded-xl border border-border/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-warning" />
        <h3 className="font-semibold text-lg">Top Performers</h3>
      </div>
      <div className="space-y-4">
        {students.map((student, index) => (
          <div key={student.id} className="flex items-center gap-4">
            <span className="w-6 text-center font-semibold text-muted-foreground">
              {index + 1}
            </span>
            <Avatar className="w-10 h-10">
              <AvatarImage src={student.avatar} />
              <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{student.name}</p>
              <p className="text-xs text-muted-foreground">{student.grade}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-accent">{student.score}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
