// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// const activities = [
//   {
//     id: 1,
//     user: "Sarah Wilson",
//     avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
//     action: "enrolled in",
//     target: "Advanced Mathematics",
//     time: "2 min ago",
//   },
//   {
//     id: 2,
//     user: "Michael Chen",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
//     action: "submitted grades for",
//     target: "Physics 101",
//     time: "15 min ago",
//   },
//   {
//     id: 3,
//     user: "Emily Davis",
//     avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
//     action: "updated schedule for",
//     target: "Class 10-A",
//     time: "1 hour ago",
//   },
//   {
//     id: 4,
//     user: "James Anderson",
//     avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
//     action: "added new student to",
//     target: "Grade 8",
//     time: "2 hours ago",
//   },
//   {
//     id: 5,
//     user: "Lisa Thompson",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
//     action: "created report for",
//     target: "Q4 Performance",
//     time: "3 hours ago",
//   },
// ];

// export function RecentActivity() {
//   return (
//     <div className="bg-card rounded-xl border border-border/50 p-6">
//       <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
//       <div className="space-y-4">
//         {activities.map((activity) => (
//           <div key={activity.id} className="flex items-center gap-4">
//             <Avatar className="w-10 h-10">
//               <AvatarImage src={activity.avatar} />
//               <AvatarFallback>{activity.user.split(" ").map(n => n[0]).join("")}</AvatarFallback>
//             </Avatar>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm">
//                 <span className="font-medium">{activity.user}</span>{" "}
//                 <span className="text-muted-foreground">{activity.action}</span>{" "}
//                 <span className="font-medium text-accent">{activity.target}</span>
//               </p>
//               <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




"use client";

import { ArrowUpRight, UserPlus, DollarSign, CheckCircle, Calendar, AlertCircle } from "lucide-react";

const activities = [
  { text: "New admission: Priya Patel - Class 8A", time: "2 min ago", type: "admission" },
  { text: "Fees collected: ₹25,000 from Amit K.", time: "15 min ago", type: "fees" },
  { text: "Leave approved: Mrs. Sharma (Math)", time: "1 hour ago", type: "leave" },
  { text: "Exam schedule published for Class 10", time: "2 hours ago", type: "exam" },
  { text: "New complaint registered: ID #1247", time: "3 hours ago", type: "complaint" },
];

const typeDetails: Record<
  string,
  { bgColor: string; icon: React.ReactNode; iconColor: string }
> = {
  admission: {
    bgColor: "bg-gradient-to-tr from-blue-400 to-blue-600",
    icon: <UserPlus className="w-5 h-5 text-white" />,
    iconColor: "text-white",
  },
  fees: {
    bgColor: "bg-gradient-to-tr from-green-400 to-green-600",
    icon: <DollarSign className="w-5 h-5 text-white" />,
    iconColor: "text-white",
  },
  leave: {
    bgColor: "bg-gradient-to-tr from-purple-400 to-purple-600",
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    iconColor: "text-white",
  },
  exam: {
    bgColor: "bg-gradient-to-tr from-yellow-400 to-yellow-600",
    icon: <Calendar className="w-5 h-5 text-white" />,
    iconColor: "text-white",
  },
  complaint: {
    bgColor: "bg-gradient-to-tr from-pink-500 to-red-600",
    icon: <AlertCircle className="w-5 h-5 text-white" />,
    iconColor: "text-white",
  },
};

const RecentActivity = () => {
  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md animate-fade-in"
      style={{ animationDelay: "400ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-gray-900 text-lg">Recent Activity</h3>
        <button className="text-indigo-600 font-semibold flex items-center gap-1 text-sm hover:underline transition-colors">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-5">
        {activities.map((activity, index) => {
          const { bgColor, icon } = typeDetails[activity.type] || {};
          return (
            <div
              key={index}
              className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 rounded-lg p-3 transition"
              title={activity.text}
            >
              {/* Icon circle */}
              <div
                className={`${bgColor} flex items-center justify-center rounded-full w-10 h-10 flex-shrink-0 shadow-md`}
              >
                {icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 leading-snug truncate">
                  {activity.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
