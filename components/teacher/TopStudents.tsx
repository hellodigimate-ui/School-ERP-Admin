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
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 2,
    name: "William Brown",
    class: "Class 11-A",
    score: 97.2,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 3,
    name: "Sophia Martinez",
    class: "Class 12-B",
    score: 96.8,
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  },
  {
    rank: 4,
    name: "Oliver Garcia",
    class: "Class 10-B",
    score: 95.5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  },
];

export function TopStudents() {
  return (
    <div
      className="relative rounded-2xl p-6 overflow-hidden
      bg-gradient-to-br from-background to-muted/40
      border border-border/50 shadow-sm hover:shadow-xl
      transition-all duration-300"
    >
      {/* Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-warning/10 rounded-full blur-3xl opacity-40" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-400/10 flex items-center justify-center shadow-inner">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>

          <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Top Performers
          </h2>
        </div>

        {/* List */}
        <div className="space-y-4">
          {topStudents.map((student, index) => {
            const isTop3 = student.rank <= 3;

            return (
              <div
                key={student.rank}
                className={`
                  group flex items-center gap-4 p-4 rounded-xl
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-lg
                  bg-gradient-to-br ${
                    isTop3
                      ? "from-yellow-400/10 to-orange-400/5 border border-yellow-400/20"
                      : "from-muted/40 to-background border border-border/40"
                  }
                  animate-fade-in-up
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Rank Badge */}
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                    ${
                      student.rank === 1
                        ? "bg-yellow-400 text-black shadow-md"
                        : student.rank === 2
                        ? "bg-gray-300 text-black"
                        : student.rank === 3
                        ? "bg-orange-400 text-black"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {student.rank}
                </div>

                {/* Avatar */}
                <Avatar className="w-11 h-11 ring-2 ring-primary/20 group-hover:ring-primary/40 transition">
                  <AvatarImage src={student.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {student.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {student.class}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-lg font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
                    {student.score}%
                  </p>
                  <p className="text-xs text-muted-foreground">Score</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}