"use client"


import { StudentLayout } from "@/components/student/StudentLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  BookOpen,
  Award,
  Edit,
  Camera
} from "lucide-react";

const studentData = {
  name: "Rahul Kumar",
  email: "rahul.kumar@student.edu",
  phone: "+91 98765 43210",
  dateOfBirth: "15 March 2005",
  address: "123 Main Street, Mumbai, Maharashtra - 400001",
  enrollmentNo: "STU2024001",
  rollNo: "CS-2024-042",
  course: "B.Tech Computer Science",
  semester: "4th Semester",
  batch: "2024-2028",
  section: "Section A",
  admissionDate: "01 August 2024",
  bloodGroup: "O+",
  guardian: "Suresh Kumar",
  guardianPhone: "+91 98765 12345",
};

const academicStats = [
  { label: "Current CGPA", value: "8.5", icon: Award },
  { label: "Credits Earned", value: "72/180", icon: BookOpen },
  { label: "Attendance", value: "92%", icon: Calendar },
  { label: "Rank", value: "12th", icon: GraduationCap },
];

export default function Profile() {
  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">View and manage your personal information</p>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-stat-teal text-primary-foreground text-2xl">
                    RK
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h2 className="text-xl font-semibold text-foreground">{studentData.name}</h2>
                  <Badge variant="secondary" className="w-fit">{studentData.course}</Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {studentData.enrollmentNo} • {studentData.section}
                </p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {studentData.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {studentData.phone}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Academic Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {academicStats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-stat-teal/10">
                  <stat.icon className="h-5 w-5 text-stat-teal" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-stat-teal" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm font-medium text-foreground">{studentData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium text-foreground">{studentData.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Blood Group</p>
                  <p className="text-sm font-medium text-foreground">{studentData.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="text-sm font-medium text-foreground">{studentData.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email Address</p>
                <p className="text-sm font-medium text-foreground">{studentData.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground flex items-start gap-1">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  {studentData.address}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-stat-teal" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Enrollment No.</p>
                  <p className="text-sm font-medium text-foreground">{studentData.enrollmentNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Roll No.</p>
                  <p className="text-sm font-medium text-foreground">{studentData.rollNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="text-sm font-medium text-foreground">{studentData.course}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Semester</p>
                  <p className="text-sm font-medium text-foreground">{studentData.semester}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Batch</p>
                  <p className="text-sm font-medium text-foreground">{studentData.batch}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Section</p>
                  <p className="text-sm font-medium text-foreground">{studentData.section}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Admission Date</p>
                <p className="text-sm font-medium text-foreground">{studentData.admissionDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Guardian Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-stat-teal" />
                Guardian Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Guardian Name</p>
                  <p className="text-sm font-medium text-foreground">{studentData.guardian}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Guardian Phone</p>
                  <p className="text-sm font-medium text-foreground">{studentData.guardianPhone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Relationship</p>
                  <p className="text-sm font-medium text-foreground">Father</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
