import { Search, Bell } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const TopBar = () => {
//   const today = new Date().toLocaleDateString('en-IN', {
//     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//   });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search fees, students, reports..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        
        {/* <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-accent/10 transition-colors relative">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-accent/10 transition-colors relative">
          <Calendar className="w-4 h-4 text-muted-foreground" />
        </button> */}
        <button className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-accent/10 transition-colors relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive border-2 border-card" />
        </button>
        <div className="text-sm font-semibold text-foreground bg-muted px-3 py-1.5 rounded-lg">
          2025-26
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default TopBar;