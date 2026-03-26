/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { axiosInstance } from "@/apiHome/axiosInstanc";
import {
  ArrowUpRight,
  UserPlus,
  DollarSign,
  CheckCircle,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";



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

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const RecentActivity = () => {
  const [users, setUsers] = useState<User[]>([]);

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);


  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("/api/v1/users", {
        params: {
          page,
          perPage: 5,
        },
      });

      console.log("Users:", res.data.data);

      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md dark:bg-gray-900 animate-fade-in"
      style={{ animationDelay: "400ms" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-gray-900 dark:text-gray-100 text-lg">
          Recent Activity
        </h3>
        <button className="text-indigo-600 font-semibold flex items-center gap-1 text-sm hover:underline transition-colors">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-5">
        {users.map((user) => (
          <div
            key={user.id}
            className="border p-4 rounded-lg flex justify-between items-center "
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="text-right">
              <p className="text-xs bg-gray-100 dark:text-gray-500 px-2 py-1 rounded">
                {user.role}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;