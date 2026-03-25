/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Image from "next/image";
import { useState } from "react";

import LoginImage from "@/assets/home/school.jpg";
import {  Eye, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toastNotifications } from "@/utils/toastNotifications";



const demoAccounts = [
  // {
  //   role: "SUPERADMIN",
  //   email: "superadmin123@gmail.com",
  //   password: "superadmin@123",
  //   route: "/superAdmin/dashboard",
  //   color: "from-blue-500 to-blue-700",
  // },
  {
    role: "ADMIN",
    email: "admin123@gmail.com",
    password: "admin@123",
    route: "/admin/dashboard",
    color: "from-blue-500 to-blue-700",
  },
  {
    role: "ACCOUNTANT",
    email: "accountant123@gmail.com",
    password: "accountant@123",
    route: "/accountant/dashboard",
    color: "from-green-500 to-green-700",
  },
  {
    role: "LIBRAIAN",
    email: "librarian123@gmail.com",
    password: "librarian@123",
    route: "/librarian/dashboard",
    color: "from-orange-300 to-orange-600",
  },
  {
    role: "TEACHER",
    email: "teacher123@gmail.com",
    password: "teacher@123",
    route: "/teacher/dashboard",
    color: "from-yellow-500 to-orange-500",
  },
  {
    role: "Student",
    email: "amit123@gmail.com",
    password: "amit@123",
    route: "/student/dashboard",
    color: "from-green-500 to-purple-500",
  },
  {
    role: "PARENT",
    email: "sonuparent123@gmail.com",
    password: "sonuparent@123",
    route: "/parents/dashboard",
    color: "from-pink-500 to-red-500",
  },
  {
    role: "RECEPTIONIST",
    email: "harsh123@gmail.com",
    password: "Harsh@123",
    route: "/receptionist/dashboard",
    color: "from-purple-500 to-indigo-500",
  },
];




export default function Login() {

  const router = useRouter();



const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [showDemo, setShowDemo] = useState(false);


  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axiosInstance.post("/api/v1/auth/login", {
      email,
      password,
    });

    console.log("Login response:", response.data);

    if (!response.data.success) {
      setError(response.data.message);
      toastNotifications.error.login(response.data.message);
      return;
    }

    localStorage.setItem("token", response.data.data.access_token);

    toastNotifications.success.login();

    const rawRole = String(response.data.data.role || "").trim();
    const role = rawRole.toUpperCase();
    const routeMap: Record<string, string> = {
      ADMIN: "/admin/dashboard",
      // SUPERADMIN: "/superAdmin/dashboard",
      STUDENT: "/student/dashboard",
      PARENT: "/parents/dashboard",
      TEACHER: "/teacher/dashboard",
      LIBRAIAN: "/librarian/dashboard",
      ACCOUNTANT: "/accountant/dashboard",
      RECEPTIONIST: "/receptionist/dashboard",
    };

    const targetRoute = routeMap[role];
    if (targetRoute) {
      console.debug("Login role:", rawRole, "mapped:", role, "->", targetRoute);
      router.push(targetRoute);
      return;
    }

    console.error("Unknown login role", rawRole);
    setError("Unable to redirect: unknown user role.");
    toastNotifications.error.login("Unable to redirect: unknown user role.");

  } catch (err: any) {
    console.error(err);
    const errorMessage = err?.response?.data?.message || "Failed to login";
    setError(errorMessage);
    toastNotifications.error.login(errorMessage);
  }
};

const handleDemoFill = (account: any) => {
  setEmail(account.email);
  setPassword(account.password);
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      
      {/* LEFT */}
      <div className="flex flex-col justify-center px-6 sm:px-16 backdrop-blur-lg">
        
        {/* Card Container */}
        <div className="bg-white/80 shadow-2xl rounded-3xl p-8 border border-white/40">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-slate-900">
              Welcome Back 👋
            </h1>
            <p className="text-center text-slate-500 mt-2">
              Sign in to manage your institute
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block font-semibold text-black mb-1">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-black">
                  Password
                </label>
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  <Eye size={18} />
                </button>
              </div>

              {error && (
                <p className="text-red-600 text-sm mt-1 font-medium">
                  {error}
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 font-semibold text-white hover:scale-[1.02] transition shadow-lg"
            >
              Sign In →
            </button>
          </form>

          {/* DEMO SECTION */}
          <div className="mt-6">

            {/* Toggle Button */}
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="w-full mb-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow hover:scale-[1.02] transition"
            >
              {showDemo ? "Hide Demo Accounts ▲" : "Show Demo Accounts ▼"}
            </button>

            {/* Demo Accounts */}
            {showDemo && (
              <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleDemoFill(acc)}
                    className={`relative overflow-hidden rounded-xl p-[2px] bg-gradient-to-r ${acc.color} group`}
                  >
                    <div className="bg-white rounded-xl py-2 text-sm font-semibold text-gray-700 group-hover:bg-transparent group-hover:text-white transition">
                      {acc.role}
                    </div>
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden md:block relative">
        <Image
          src={LoginImage}
          alt="Auth Banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/70 flex flex-col justify-center text-white px-16 backdrop-blur-sm">
          <h2 className="text-4xl font-bold mb-4">
            Manage Your Institute Effortlessly
          </h2>
          <p className="mb-8 text-white/80">
            Attendance, fees, exams & communication — all in one platform.
          </p>

          <div className="flex gap-10">
            <Stat label="Institutes" value="50+" />
            <Stat label="Students" value="900+" />
            <Stat label="Uptime" value="99%" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  );
}
