"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const genderData = [
  { name: "Boys", students: 1580 },
  { name: "Girls", students: 1267 },
];

const feeData = [
  { name: "Collected", percentage: 72 },
  { name: "Pending", percentage: 28 },
];

export default function DashboardPage() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        School Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Student Gender Ratio */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Student Gender Ratio
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="bg-white p-6 rounded-3xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Fee Collection Status
          </h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="percentage" fill="#10B981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
