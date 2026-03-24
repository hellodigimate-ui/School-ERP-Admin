"use client"

import { useState } from "react";
import { Search, Clock, Ban, Edit } from "lucide-react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ParentRule {
  id: string;
  studentName: string;
  studentId: string;
  parentName: string;
  dailyLimit: number;
  blockedItems: string[];
  allowedTimeStart: string;
  allowedTimeEnd: string;
  walletEnabled: boolean;
  notifications: boolean;
}

const initialRules: ParentRule[] = [
  { id: "1", studentName: "Aarav Sharma", studentId: "STU001", parentName: "Rajesh Sharma", dailyLimit: 150, blockedItems: ["Coffee"], allowedTimeStart: "10:00", allowedTimeEnd: "14:00", walletEnabled: true, notifications: true },
  { id: "2", studentName: "Priya Patel", studentId: "STU002", parentName: "Meena Patel", dailyLimit: 100, blockedItems: ["Cola", "Chips"], allowedTimeStart: "10:30", allowedTimeEnd: "13:30", walletEnabled: true, notifications: true },
  { id: "3", studentName: "Rohan Gupta", studentId: "STU003", parentName: "Anil Gupta", dailyLimit: 120, blockedItems: [], allowedTimeStart: "09:00", allowedTimeEnd: "15:00", walletEnabled: false, notifications: false },
  { id: "4", studentName: "Sneha Reddy", studentId: "STU004", parentName: "Lakshmi Reddy", dailyLimit: 200, blockedItems: ["Energy Drink"], allowedTimeStart: "10:00", allowedTimeEnd: "14:00", walletEnabled: true, notifications: true },
  { id: "5", studentName: "Vikram Singh", studentId: "STU005", parentName: "Harpreet Singh", dailyLimit: 100, blockedItems: [], allowedTimeStart: "10:00", allowedTimeEnd: "13:00", walletEnabled: true, notifications: false },
];

const ParentControl = () => {
  const [rules, setRules] = useState<ParentRule[]>(initialRules);
  const [search, setSearch] = useState("");
  const [editRule, setEditRule] = useState<ParentRule | null>(null);
  const [editForm, setEditForm] = useState({ dailyLimit: "", allowedTimeStart: "", allowedTimeEnd: "", blockedItems: "" });
  const { toast } = useToast();

  const filtered = rules.filter(
    (r) => r.studentName.toLowerCase().includes(search.toLowerCase()) || r.parentName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleWallet = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, walletEnabled: !r.walletEnabled } : r)));
  };

  const toggleNotifications = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, notifications: !r.notifications } : r)));
  };

  const openEdit = (rule: ParentRule) => {
    setEditRule(rule);
    setEditForm({
      dailyLimit: rule.dailyLimit.toString(),
      allowedTimeStart: rule.allowedTimeStart,
      allowedTimeEnd: rule.allowedTimeEnd,
      blockedItems: rule.blockedItems.join(", "),
    });
  };

  const handleSave = () => {
    if (!editRule) return;
    setRules((prev) =>
      prev.map((r) =>
        r.id === editRule.id
          ? {
              ...r,
              dailyLimit: Number(editForm.dailyLimit),
              allowedTimeStart: editForm.allowedTimeStart,
              allowedTimeEnd: editForm.allowedTimeEnd,
              blockedItems: editForm.blockedItems.split(",").map((s) => s.trim()).filter(Boolean),
            }
          : r
      )
    );
    toast({ title: "Updated", description: `Rules updated for ${editRule.studentName}` });
    setEditRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold">Parent Controls</h3>
          <p className="text-sm text-muted-foreground">Manage spending limits, restrictions & notifications set by parents</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or parent..." className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Parent</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Daily Limit</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Allowed Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Blocked Items</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Wallet</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Alerts</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rule) => (
                  <tr key={rule.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{rule.studentName}</p>
                        <p className="text-xs text-muted-foreground">{rule.studentId}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{rule.parentName}</td>
                    <td className="py-3 px-4 font-semibold">₹{rule.dailyLimit}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {rule.allowedTimeStart} - {rule.allowedTimeEnd}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {rule.blockedItems.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {rule.blockedItems.map((item) => (
                            <Badge key={item} variant="secondary" className="text-xs gap-1">
                              <Ban className="h-2.5 w-2.5" /> {item}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Switch checked={rule.walletEnabled} onCheckedChange={() => toggleWallet(rule.id)} />
                    </td>
                    <td className="py-3 px-4">
                      <Switch checked={rule.notifications} onCheckedChange={() => toggleNotifications(rule.id)} />
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(rule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editRule} onOpenChange={(open) => { if (!open) setEditRule(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Edit Rules — {editRule?.studentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Daily Spending Limit (₹)</Label>
              <Input type="number" value={editForm.dailyLimit} onChange={(e) => setEditForm((p) => ({ ...p, dailyLimit: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Allowed From</Label>
                <Input type="time" value={editForm.allowedTimeStart} onChange={(e) => setEditForm((p) => ({ ...p, allowedTimeStart: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Allowed Until</Label>
                <Input type="time" value={editForm.allowedTimeEnd} onChange={(e) => setEditForm((p) => ({ ...p, allowedTimeEnd: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Blocked Items (comma separated)</Label>
              <Input value={editForm.blockedItems} onChange={(e) => setEditForm((p) => ({ ...p, blockedItems: e.target.value }))} placeholder="e.g. Cola, Chips" />
            </div>
            <Button onClick={handleSave} className="w-full">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentControl;
