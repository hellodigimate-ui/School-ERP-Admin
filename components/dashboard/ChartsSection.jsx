/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, ResponsiveContainer, PieChart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/apiHome/axiosInstanc";

export default function ChartsSection() {
  const [genderData, setGenderData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const genderColors = {
    Male: "#3b82f6",     // bright blue
    Female: "#ec4899",   // vibrant pink
    Other: "#dc2626",    // rich purple
  };

  const chartSize = 140;

  const roleColors = {
    ADMIN: "#6366f1",
    TEACHER: "#22c55e",
    STUDENT: "#3b82f6",
    PARENT: "#f59e0b",
    OTHER: "#a855f7",
    COACH: "#14b8a6",
    SCANNER: "#e11d48",
    ACCOUNTANT: "#10b981",
    LIBRAIAN: "#f97316",
    DRIVER: "#64748b",
    RECEPTIONIST: "#ec4899",
  };

  const fetchGenderData = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/students/gender/count");
      const formatted = res.data.data.map((g) => ({
        name:
          g.gender === "Male"
            ? "Boys"
            : g.gender === "Female"
              ? "Girls"
              : "Others",
        value: g.count,
        color: genderColors[g.gender] || "gray",
      }));
      setGenderData(formatted);
    } catch (error) {
      console.error("Error fetching gender data", error);
    }
  };

  const fetchRoleData = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/admin/users/count");
      const formatted = res.data.data.map((r) => ({
        name: r.role,
        value: r._count.role,
        color: roleColors[r.role] || "#8884d8",
      }));
      setRoleData(formatted);
    } catch (error) {
      console.error("Error fetching role data", error);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await Promise.all([fetchGenderData(), fetchRoleData()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6 ">
      {/* Gender Card */}
      <Card className="flex-1 min-w-[280px] border-0 shadow-md col-span-1 hover:scale-105 transition-transform duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 hover:scale-105 transition-transform duration-300">Student Gender Ratio</h3>

          {loading ? (
            <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">Loading...</p>
          ) : genderData.length === 0 ? (
            <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">No data found</p>
          ) : (
            <div className="flex items-center gap-6 hover:scale-105 transition-transform duration-300">
              <ResponsiveContainer width={chartSize} height={chartSize}>
                <PieChart>
                  <Pie
                    data={genderData}
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {genderData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-3 hover:scale-105 transition-transform duration-300">
                {genderData.map((d) => (
                  <div key={d.name} className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
                    <div
                      className="w-3 h-3 rounded-full hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold hover:scale-105 transition-transform duration-300">{d.name}</p>
                      <p className="text-xs text-muted-foreground hover:scale-105 transition-transform duration-300">
                        {d.value} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Card */}
      <Card className="flex-1 min-w-[280px] border-0 shadow-lg col-span-2 rounded-2xl hover:scale-105 transition-transform duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4 hover:scale-105 transition-transform duration-300">User Roles Distribution</h3>

          {loading ? (
            <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">Loading...</p>
          ) : roleData.length === 0 ? (
            <p className="text-sm text-gray-500 hover:scale-105 transition-transform duration-300">No data found</p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 hover:scale-105 transition-transform duration-300">
              {/* Pie Chart */}
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={roleData}
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    strokeWidth={0}
                    paddingAngle={3}
                  >
                    {roleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Role Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 hover:scale-105 transition-transform duration-300">
                {roleData.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                      <div
                        className="w-3 h-3 rounded-full hover:scale-105 transition-transform duration-300"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-sm font-medium hover:scale-105 transition-transform duration-300">{role.name}</span>
                    </div>
                    <span className="text-xs text-gray-100 hover:scale-105 transition-transform duration-300">{role.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
