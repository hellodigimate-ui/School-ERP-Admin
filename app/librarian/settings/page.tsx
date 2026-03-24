/* eslint-disable react-hooks/static-components */
"use client"


import { useState } from "react";
import { Settings, Save, BookOpen, Bell, Shield, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LibrarianLayout from "../shell/page";

const inputClass = "h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-accent/30 transition-all";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "circulation", label: "Circulation", icon: BookOpen },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "print", label: "Print", icon: Printer },
];

export default function LibrarySettings() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  // General
  const [libraryName, setLibraryName] = useState("School Library");
  const [libraryCode, setLibraryCode] = useState("LIB-001");
  const [address, setAddress] = useState("123 Education Street, City");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("library@school.edu");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("17:00");
  const [currency, setCurrency] = useState("INR (₹)");
  const [academicYear, setAcademicYear] = useState("2025-26");

  // Circulation
  const [maxBooksStudent, setMaxBooksStudent] = useState(3);
  const [maxBooksStaff, setMaxBooksStaff] = useState(5);
  const [loanDaysStudent, setLoanDaysStudent] = useState(14);
  const [loanDaysStaff, setLoanDaysStaff] = useState(30);
  const [maxRenewals, setMaxRenewals] = useState(2);
  const [reservationDays, setReservationDays] = useState(3);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [dueDateReminder, setDueDateReminder] = useState(2);
  const [overdueReminder, setOverdueReminder] = useState(true);
  const [newArrivalNotif, setNewArrivalNotif] = useState(true);

  // Security
  const [requireId, setRequireId] = useState(true);
  const [autoLogout, setAutoLogout] = useState(30);
  const [allowSelfCheckout, setAllowSelfCheckout] = useState(false);

  // Print
  const [receiptHeader, setReceiptHeader] = useState("School Library - Issue/Return Receipt");
  const [showBarcode, setShowBarcode] = useState(true);
  const [paperSize, setPaperSize] = useState("A4");

  const save = () => toast({ title: "Settings Saved", description: "Your library settings have been updated." });

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!checked)} className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-muted"}`}>
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform mt-0.5 ${checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <LibrarianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display">Settings</h1>
            <p className="text-sm text-muted-foreground">Configure your library system preferences</p>
          </div>
          <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={save}>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-48 shrink-0 space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === t.id ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 rounded-xl border border-border bg-card p-6">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-display">General Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Library Name</label><input value={libraryName} onChange={e => setLibraryName(e.target.value)} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Library Code</label><input value={libraryCode} onChange={e => setLibraryCode(e.target.value)} className={inputClass} /></div>
                </div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Address</label><input value={address} onChange={e => setAddress(e.target.value)} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Phone</label><input value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Email</label><input value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Opening Time</label><input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Closing Time</label><input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Academic Year</label><input value={academicYear} onChange={e => setAcademicYear(e.target.value)} className={inputClass} /></div>
                </div>
                <div className="space-y-1.5 max-w-xs"><label className="text-xs font-medium text-muted-foreground">Currency</label>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select>
                </div>
              </div>
            )}

            {activeTab === "circulation" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-display">Circulation Rules</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Max Books (Student)</label><input type="number" value={maxBooksStudent} onChange={e => setMaxBooksStudent(+e.target.value)} min={1} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Max Books (Staff)</label><input type="number" value={maxBooksStaff} onChange={e => setMaxBooksStaff(+e.target.value)} min={1} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Loan Period - Student (days)</label><input type="number" value={loanDaysStudent} onChange={e => setLoanDaysStudent(+e.target.value)} min={1} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Loan Period - Staff (days)</label><input type="number" value={loanDaysStaff} onChange={e => setLoanDaysStaff(+e.target.value)} min={1} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Max Renewals</label><input type="number" value={maxRenewals} onChange={e => setMaxRenewals(+e.target.value)} min={0} className={inputClass} /></div>
                  <div className="space-y-1.5"><label className="text-xs font-medium text-muted-foreground">Reservation Hold (days)</label><input type="number" value={reservationDays} onChange={e => setReservationDays(+e.target.value)} min={1} className={inputClass} /></div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-display">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted-foreground">Send email alerts for due dates and overdue books</p></div>
                    <Toggle checked={emailNotif} onChange={setEmailNotif} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">SMS Notifications</p><p className="text-xs text-muted-foreground">Send SMS reminders to students and parents</p></div>
                    <Toggle checked={smsNotif} onChange={setSmsNotif} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">Overdue Reminders</p><p className="text-xs text-muted-foreground">Automatic reminders for overdue books</p></div>
                    <Toggle checked={overdueReminder} onChange={setOverdueReminder} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">New Arrival Alerts</p><p className="text-xs text-muted-foreground">Notify members about new book additions</p></div>
                    <Toggle checked={newArrivalNotif} onChange={setNewArrivalNotif} />
                  </div>
                  <div className="max-w-xs space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Due Date Reminder (days before)</label>
                    <input type="number" value={dueDateReminder} onChange={e => setDueDateReminder(+e.target.value)} min={1} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-display">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">Require ID for Issue/Return</p><p className="text-xs text-muted-foreground">Members must present valid ID card</p></div>
                    <Toggle checked={requireId} onChange={setRequireId} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div><p className="text-sm font-medium">Allow Self-Checkout</p><p className="text-xs text-muted-foreground">Enable self-service kiosk for book checkout</p></div>
                    <Toggle checked={allowSelfCheckout} onChange={setAllowSelfCheckout} />
                  </div>
                  <div className="max-w-xs space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Auto Logout (minutes)</label>
                    <input type="number" value={autoLogout} onChange={e => setAutoLogout(+e.target.value)} min={5} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "print" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold font-display">Print Settings</h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Receipt Header Text</label>
                  <input value={receiptHeader} onChange={e => setReceiptHeader(e.target.value)} className={inputClass} />
                </div>
                <div className="max-w-xs space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Paper Size</label>
                  <select value={paperSize} onChange={e => setPaperSize(e.target.value)} className={inputClass}>
                    <option>A4</option><option>A5</option><option>Letter</option><option>Thermal (80mm)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4 max-w-md">
                  <div><p className="text-sm font-medium">Show Barcode on Receipt</p><p className="text-xs text-muted-foreground">Print barcode for easy scanning</p></div>
                  <Toggle checked={showBarcode} onChange={setShowBarcode} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LibrarianLayout>
  );
}
