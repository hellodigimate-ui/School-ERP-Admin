"use client"
import Layout from "@/components/hrPanel/layout";
import { UserX, Phone } from "lucide-react";

const disabledStaff = [
  { name: "Mr. Sunil Thakur", designation: "Peon", disability: "Visual Impairment (40%)", phone: "+91 98765 11111", joinDate: "2015-06-10", avatar: "ST" },
  { name: "Mrs. Rekha Bai", designation: "Cleaner", disability: "Locomotor Disability (50%)", phone: "+91 98765 22222", joinDate: "2018-09-01", avatar: "RB" },
];

const Page = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Disabled Staff</h1>
          <p className="text-sm text-muted-foreground mt-1">Staff members with disabilities & special accommodations</p>
        </div>

        {disabledStaff.length === 0 ? (
          <div className="stat-card text-center py-12">
            <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No disabled staff records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {disabledStaff.map((s, i) => (
              <div key={i} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center font-bold">{s.avatar}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.designation}</p>
                    <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-warning/10 text-warning text-xs font-medium">{s.disability}</div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {s.phone}</span>
                      <span>Joined: {s.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Page;
