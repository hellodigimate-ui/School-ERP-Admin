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
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const genderColors = {
    Male: "#3b82f6",
    Female: "#ec4899",
    Other: "#dc2626",
  };

  const roleColors = {
    ADMIN: "#6366f1",
    TEACHER: "#22c55e",
    STUDENT: "#3b82f6",
    PARENT: "#f59e0b",
    OTHER: "#a855f7",
    COACH: "#14b8a6",
    SCANNER: "#e11d48",
    ACCOUNTANT: "#10b981",
    LIBRARIAN: "#f97316", // ✅ fixed
    DRIVER: "#64748b",
    RECEPTIONIST: "#ec4899",
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [genderRes, roleRes] = await Promise.all([
          axiosInstance.get("/api/v1/students/gender/count"),
          axiosInstance.get("/api/v1/admin/users/count"),
        ]);

        const genderFormatted = genderRes.data.data.map((g) => ({
          name:
            g.gender === "Male"
              ? "Boys"
              : g.gender === "Female"
              ? "Girls"
              : "Others",
          value: g.count,
          color: genderColors[g.gender] || "gray",
        }));

        const roleFormatted = roleRes.data.data.map((r) => ({
          name: r.role,
          value: r._count.role,
          color: roleColors[r.role] || "#8884d8",
        }));

        setGenderData(genderFormatted);
        setRoleData(roleFormatted);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Gender Card */}
      <Card className="col-span-1 shadow-md hover:scale-105 transition-transform duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">
            Student Gender Ratio
          </h3>

          {loading ? (
            <div className="animate-pulse h-32 bg-gray-200 rounded-lg" />
          ) : genderData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              📊 No data available
            </p>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={genderData}
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    strokeWidth={0}
                    onClick={(data) => setSelectedGender(data)}
                  >
                    {genderData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={
                          selectedGender &&
                          selectedGender.name !== entry.name
                            ? 0.4
                            : 1
                        }
                      />
                    ))}
                  </Pie>

                  {/* Center Label */}
                  {selectedGender && (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-bold fill-gray-700"
                    >
                      {selectedGender.value}
                    </text>
                  )}
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="space-y-3">
                {genderData.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <div>
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {d.value} students
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Info */}
          {selectedGender && (
            <div className="mt-4 text-sm font-semibold text-center">
              {selectedGender.name}: {selectedGender.value} students
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Card */}
      <Card className="col-span-2 shadow-lg rounded-2xl hover:scale-105 transition-transform duration-300">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-4">
            User Roles Distribution
          </h3>

          {loading ? (
            <div className="animate-pulse h-40 bg-gray-200 rounded-lg" />
          ) : roleData.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              📊 No data available
            </p>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Pie */}
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={roleData}
                    innerRadius={50}
                    outerRadius={75}
                    dataKey="value"
                    strokeWidth={0}
                    paddingAngle={3}
                    onClick={(data) => setSelectedRole(data)}
                  >
                    {roleData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={entry.color}
                        opacity={
                          selectedRole &&
                          selectedRole.name !== entry.name
                            ? 0.4
                            : 1
                        }
                      />
                    ))}
                  </Pie>

                  {/* Center Value */}
                  {selectedRole && (
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm font-bold fill-gray-700"
                    >
                      {selectedRole.value}
                    </text>
                  )}
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {roleData.map((role) => (
                  <div
                    key={role.name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <span className="text-sm font-medium">
                        {role.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {role.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Info */}
          {selectedRole && (
            <div className="mt-4 text-sm font-semibold text-center">
              {selectedRole.name}: {selectedRole.value} users
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
