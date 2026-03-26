"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

interface ProfileMenuProps {
  name: string;
}

export default function ProfileMenu({ name }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center cursor-pointer gap-2 rounded-full px-3 py-2 bg-secondary dark:bg-secondary
        hover:bg-secondary/80 dark:hover:bg-secondary/80  transition"
      >
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground 
        flex items-center justify-center font-semibold">
          {name.charAt(0)}
        </div>

        <span className="hidden sm:block font-medium text-foreground dark:text-foreground">
          {name}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 bg-card dark:bg-card
          border border-border dark:border-border rounded-xl shadow-lg overflow-hidden z-50"
        >
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3
            text-sm text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
