// import { Calendar, Clock } from "lucide-react";

// const events = [
//   {
//     id: 1,
//     title: "Parent-Teacher Meeting",
//     date: "Jan 30, 2026",
//     time: "10:00 AM",
//     type: "meeting",
//   },
//   {
//     id: 2,
//     title: "Science Fair",
//     date: "Feb 5, 2026",
//     time: "9:00 AM",
//     type: "event",
//   },
//   {
//     id: 3,
//     title: "Mid-Term Exams Begin",
//     date: "Feb 10, 2026",
//     time: "8:00 AM",
//     type: "exam",
//   },
//   {
//     id: 4,
//     title: "Staff Training",
//     date: "Feb 15, 2026",
//     time: "2:00 PM",
//     type: "training",
//   },
// ];

// const typeColors = {
//   meeting: "bg-accent/10 border-accent/30",
//   event: "bg-success/10 border-success/30",
//   exam: "bg-warning/10 border-warning/30",
//   training: "bg-primary/10 border-primary/30",
// };

// export function UpcomingEvents() {
//   return (
//     <div className="bg-card rounded-xl border border-border/50 p-6">
//       <h3 className="font-semibold text-lg mb-4">Upcoming Events</h3>
//       <div className="space-y-3">
//         {events.map((event) => (
//           <div
//             key={event.id}
//             className={`p-4 rounded-lg border ${typeColors[event.type as keyof typeof typeColors]}`}
//           >
//             <p className="font-medium text-sm">{event.title}</p>
//             <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
//               <span className="flex items-center gap-1">
//                 <Calendar className="w-3.5 h-3.5" />
//                 {event.date}
//               </span>
//               <span className="flex items-center gap-1">
//                 <Clock className="w-3.5 h-3.5" />
//                 {event.time}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { CalendarHeart, MapPin } from "lucide-react";

const events = [
  {
    month: "Feb",
    day: "15",
    title: "Parent-Teacher Meeting",
    location: "Main Hall",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    month: "Feb",
    day: "20",
    title: "Annual Sports Day",
    location: "Sports Ground",
    gradient: "from-orange-500 to-red-500",
  },
  {
    month: "Mar",
    day: "01",
    title: "Final Exam Begins",
    location: "All Classes",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    month: "Mar",
    day: "14",
    title: "Science Exhibition",
    location: "Lab Complex",
    gradient: "from-green-500 to-emerald-500",
  },
];

const UpcomingEvents = () => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          Upcoming Events
        </h3>

        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md hover:scale-105 transition">
          <CalendarHeart size={18} />
        </button>
      </div>

      {/* Events List */}
      <div className="space-y-5">
        {events.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-4 hover:translate-x-1 transition duration-200"
          >
            {/* Date Box */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${e.gradient} flex flex-col items-center justify-center text-white shadow-md`}
            >
              <span className="text-[11px] font-semibold uppercase">
                {e.month}
              </span>
              <span className="text-lg font-bold">
                {e.day}
              </span>
            </div>

            {/* Event Details */}
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {e.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin size={12} />
                <span>{e.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
