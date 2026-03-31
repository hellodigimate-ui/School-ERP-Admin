// /* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useRouter } from "next/navigation";

interface Attendance {
  id: string;
  user: {
    name: string;
  };
  createdAt: string;
  status: "PRESENT" | "ABSENT";
  remarks?: string;
}

const RecentAttendance = () => {
  const [data, setData] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/attendance", {
        params: { perPage: 6 },
      });
      setData(res.data.data || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md dark:bg-gray-900 animate-fade-in hover:scale-105 transition-transform duration-300"
      style={{ animationDelay: "400ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 hover:scale-105 transition-transform duration-300">
        <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg hover:scale-105 transition-transform duration-300">
          Recent Attendance
        </h3>
        <button onClick={()=>router.push("/admin/attendance/qr-code")} className="text-indigo-600 font-semibold flex items-center gap-1 text-sm hover:underline transition-colors hover:scale-105 duration-300">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Attendance List */}
      {loading ? (
        <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">
          Loading attendance...
        </p>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">
          No attendance records found
        </p>
      ) : (
        <div className="space-y-4 hover:scale-105 transition-transform duration-300">
          {data.map((item) => (
            <div
              key={item.id}
              className="border p-4 rounded-lg flex justify-between items-center hover:scale-105 transition-transform duration-300"
            >
              {/* Left: User Info */}
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-100 hover:scale-105 transition-transform duration-300">
                  {item.user?.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 hover:scale-105 transition-transform duration-300">
                  {new Date(item.createdAt).toLocaleString("en-IN")}
                </p>
                {item.remarks && (
                  <p className="text-xs text-gray-400 italic mt-0.5 hover:scale-105 transition-transform duration-300">
                    {item.remarks}
                  </p>
                )}
              </div>

              {/* Right: Status */}
              <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                {item.status === "PRESENT" ? (
                  <>
                    <CheckCircle className="text-green-500  hover:scale-105 transition-transform duration-300" size={16} />
                    <span className="text-xs font-medium text-green-600 hover:scale-105 transition-transform duration-300">Present</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500  hover:scale-105 transition-transform duration-300" size={16} />
                    <span className="text-xs font-medium text-red-500 hover:scale-105 transition-transform duration-300">Absent</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAttendance;