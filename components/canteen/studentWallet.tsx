import { useState } from "react";
import { Search, Wallet, TrendingUp, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  class: string;
  balance: number;
  dailyLimit: number;
  lastTransaction: string;
  photo: string;
}

const initialStudents: Student[] = [
  { id: "STU001", name: "Aarav Sharma", class: "10-A", balance: 500, dailyLimit: 150, lastTransaction: "Thali - ₹80", photo: "👦" },
  { id: "STU002", name: "Priya Patel", class: "9-B", balance: 320, dailyLimit: 100, lastTransaction: "Sandwich - ₹45", photo: "👧" },
  { id: "STU003", name: "Rohan Gupta", class: "8-C", balance: 0, dailyLimit: 120, lastTransaction: "None", photo: "👦" },
  { id: "STU004", name: "Sneha Reddy", class: "10-A", balance: 1200, dailyLimit: 200, lastTransaction: "Rice Bowl - ₹85", photo: "👧" },
  { id: "STU005", name: "Vikram Singh", class: "7-D", balance: 75, dailyLimit: 100, lastTransaction: "Tea - ₹15", photo: "👦" },
  { id: "STU006", name: "Ananya Nair", class: "9-A", balance: 890, dailyLimit: 150, lastTransaction: "Dosa - ₹60", photo: "👧" },
  { id: "STU007", name: "Kabir Joshi", class: "8-B", balance: 45, dailyLimit: 100, lastTransaction: "Samosa x2 - ₹40", photo: "👦" },
  { id: "STU008", name: "Meera Iyer", class: "10-C", balance: 650, dailyLimit: 200, lastTransaction: "Coffee - ₹20", photo: "👧" },
];

const StudentWallet = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<"add" | "deduct">("add");
  const { toast } = useToast();

  const totalBalance = students.reduce((sum, s) => sum + s.balance, 0);
  const lowBalance = students.filter((s) => s.balance < 100);
  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleTransaction = () => {
    if (!selected || !amount) return;
    const amt = Number(amount);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? { ...s, balance: action === "add" ? s.balance + amt : Math.max(0, s.balance - amt) }
          : s
      )
    );
    toast({
      title: action === "add" ? "Balance Added ✅" : "Balance Deducted",
      description: `₹${amt} ${action === "add" ? "added to" : "deducted from"} ${selected.name}'s wallet`,
    });
    setSelected(null);
    setAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="stat-card-gradient">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-2xl font-heading font-bold">₹{totalBalance.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Wallets</p>
              <p className="text-2xl font-heading font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-gradient">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-destructive/10">
              <IndianRupee className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Balance</p>
              <p className="text-2xl font-heading font-bold">{lowBalance.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID..." className="pl-9" />
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{student.photo}</div>
                  <div>
                    <p className="font-heading font-semibold text-sm">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.id} · {student.class}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Balance</p>
                  <p className={`text-xl font-heading font-bold ${student.balance < 100 ? "text-destructive" : "text-foreground"}`}>
                    ₹{student.balance}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Daily Limit</p>
                  <p className="text-sm font-medium">₹{student.dailyLimit}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 truncate">Last: {student.lastTransaction}</p>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 text-xs"
                  onClick={() => { setSelected(student); setAction("add"); }}
                >
                  <ArrowUpRight className="h-3 w-3 text-success" /> Add
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 text-xs"
                  onClick={() => { setSelected(student); setAction("deduct"); }}
                >
                  <ArrowDownRight className="h-3 w-3 text-destructive" /> Deduct
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transaction Dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">
              {action === "add" ? "Add Balance" : "Deduct Balance"} — {selected?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">Current Balance: <span className="font-semibold text-foreground">₹{selected?.balance}</span></p>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
            </div>
            <Button onClick={handleTransaction} className="w-full" variant={action === "add" ? "default" : "destructive"}>
              {action === "add" ? "Add Balance" : "Deduct Balance"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentWallet;
