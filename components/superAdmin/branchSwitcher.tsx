import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Building2 } from "lucide-react";
import { useBranchContext } from "@/context/BranchContext";
import { cn } from "@/lib/utils";

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  schoolId: string;
  school?: {
    id: string;
    name: string;
  };
}

const BranchSwitcher = () => {
  const router = useRouter();
  const { branches, loading, error, selectedBranch, setSelectedBranch } =
    useBranchContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleBranchSelect = (branch: Branch | "all") => {
    setSelectedBranch(branch);
    setIsOpen(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
        <Building2 className="w-4 h-4 text-muted-foreground animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border">
        <Building2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Error loading branches
        </span>
      </div>
    );
  }

  if (!selectedBranch || selectedBranch === "all") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border",
            "hover:bg-secondary/80 transition-colors min-w-[200px] justify-between",
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <div className="text-left min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">
                All Branches
              </div>
              <div className="text-xs text-muted-foreground truncate">
                View all branches
              </div>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <button
                onClick={() => handleBranchSelect("all")}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-secondary transition-colors",
                  selectedBranch === "all" && "bg-primary/10 text-primary",
                )}
              >
                <div className="text-sm font-medium text-foreground">
                  All Branches
                </div>
                <div className="text-xs text-muted-foreground">
                  View all branches
                </div>
              </button>
              {branches.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => handleBranchSelect(branch)}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-secondary transition-colors",
                  )}
                >
                  <div className="text-sm font-medium text-foreground">
                    {branch.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {branch.city}, {branch.address}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border",
          "hover:bg-secondary/80 transition-colors min-w-[200px] justify-between",
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Building2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground truncate">
              {selectedBranch.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {selectedBranch.city}
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            <button
              onClick={() => handleBranchSelect("all")}
              className={cn(
                "w-full px-3 py-2 text-left hover:bg-secondary transition-colors",
                "",
              )}
            >
              <div className="text-sm font-medium text-foreground">
                All Branches
              </div>
              <div className="text-xs text-muted-foreground">
                View all branches
              </div>
            </button>
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleBranchSelect(branch)}
                className={cn(
                  "w-full px-3 py-2 text-left hover:bg-secondary transition-colors",
                  selectedBranch === branch && "bg-primary/10 text-primary",
                )}
              >
                <div className="text-sm font-medium text-foreground">
                  {branch.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {branch.city}, {branch.address}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchSwitcher;