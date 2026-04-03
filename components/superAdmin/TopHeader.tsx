/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Search, Bell, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import BranchSwitcher from "./branchSwitcher";
// import BranchSwitcher from "./BranchSwitcher";

const TopHeader = () => {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async (searchText: string) => {
    try {
      const res = await axiosInstance.get("/api/v1/users", {
        params: {
          page: 1,
          perPage: 5,
          name: searchText,
        },
      });

      return res.data.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getUserRoute = (user: any, query: string) => {
    const highlight = encodeURIComponent(query);

    switch (user.role) {
      case "STUDENT":
        return `/admin/student/studentDetails?id=${user.id}&highlight=${highlight}`;

      case "TEACHER":
        return `/admin/academics/teachers?id=${user.id}&highlight=${highlight}`;

      case "PARENT":
        return `/admin/academics/parents?id=${user.id}&highlight=${highlight}`;

      case "COACH":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      case "SCANNER":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      case "ACCOUNTANT":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      case "RECEPTIONIST":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      case "OTHER":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      case "LIBRAIAN":
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;

      default:
        return `/admin/hr?id=${user.id}&highlight=${highlight}`;
    }
  };

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      const data = await searchUsers(query);
      setResults(data);
      setLoading(false);
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      {/* 🔍 Search */}
      <div className="relative w-[400px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary text-sm focus:ring-2 focus:ring-primary/30"
        />

        {query && (
          <div className="absolute top-12 w-full bg-card border border-border rounded-xl shadow-xl max-h-64 overflow-y-auto z-50">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Searching...
              </div>
            ) : results.length > 0 ? (
              results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setQuery("");

                    router.push(getUserRoute(user, query));
                  }}
                  className="px-4 py-3 hover:bg-primary/10 cursor-pointer transition rounded-lg"
                >
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.email} • {user.role}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-3 text-center text-sm text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🔔 Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.push("/admin/communicate")}
          className="relative w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <BranchSwitcher />
        <div className="px-4 py-2 rounded-full border text-sm font-semibold">
          2025-26
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopHeader;