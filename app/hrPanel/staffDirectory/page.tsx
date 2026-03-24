"use client"

import Layout from "@/components/hrPanel/layout";
import { Search, Filter, Plus, MoreVertical, Phone } from "lucide-react";

const staffMembers = [
  { id: 1, name: "Dr. Anita Roy", designation: "HOD Mathematics", department: "Teaching", phone: "+91 98765 43210", email: "anita.roy@school.edu", status: "Active", avatar: "AR", joinDate: "2018-06-15" },
  { id: 2, name: "Mr. Vikram Das", designation: "Sr. Physics Teacher", department: "Teaching", phone: "+91 98765 43211", email: "vikram.das@school.edu", status: "Active", avatar: "VD", joinDate: "2019-03-20" },
  { id: 3, name: "Mrs. Priya Nair", designation: "English Teacher", department: "Teaching", phone: "+91 98765 43212", email: "priya.nair@school.edu", status: "On Leave", avatar: "PN", joinDate: "2020-07-01" },
  { id: 4, name: "Mr. Arjun Mehta", designation: "Chemistry Teacher", department: "Teaching", phone: "+91 98765 43213", email: "arjun.mehta@school.edu", status: "Active", avatar: "AM", joinDate: "2017-01-10" },
  { id: 5, name: "Ms. Kavita Joshi", designation: "Biology Teacher", department: "Teaching", phone: "+91 98765 43214", email: "kavita.joshi@school.edu", status: "Active", avatar: "KJ", joinDate: "2021-04-15" },
  { id: 6, name: "Mr. Rajesh Kumar", designation: "Accountant", department: "Admin", phone: "+91 98765 43215", email: "rajesh.kumar@school.edu", status: "Active", avatar: "RK", joinDate: "2016-08-20" },
  { id: 7, name: "Mrs. Suman Verma", designation: "Librarian", department: "Support", phone: "+91 98765 43216", email: "suman.verma@school.edu", status: "Active", avatar: "SV", joinDate: "2019-11-01" },
  { id: 8, name: "Mr. Deepak Singh", designation: "Lab Assistant", department: "Lab", phone: "+91 98765 43217", email: "deepak.singh@school.edu", status: "Active", avatar: "DS", joinDate: "2022-02-14" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-success/10 text-success",
  "On Leave": "bg-warning/10 text-warning",
  Inactive: "bg-destructive/10 text-destructive",
};

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Directory</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage all staff members</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search staff..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-foreground">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Staff Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Join Date</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((staff, i) => (
                <tr key={staff.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{staff.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{staff.name}</p>
                        <p className="text-xs text-muted-foreground">{staff.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{staff.department}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{staff.phone}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{staff.joinDate}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle[staff.status]}`}>{staff.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><MoreVertical className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Page;