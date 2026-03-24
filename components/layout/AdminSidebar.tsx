  /* eslint-disable @typescript-eslint/no-explicit-any */

  "use client";

  import { useState, useEffect } from "react";
  import { useRouter, usePathname } from "next/navigation";
  import {
    LayoutDashboard, UserPlus, Users, Award, 
    AlertTriangle,  Clock, FileText, Medal, GraduationCap, Calendar,
     Briefcase, Bell, Download,  Library, Package,
     Bus, Building, UtensilsCrossed, Trophy, Globe, 
    BarChart3, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
    ChevronRight,
    ChevronDown,
    IndianRupeeIcon,
    ClipboardCheck,
    ClipboardList
  } from "lucide-react";

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Front Office", icon: UserPlus, path: "", children: [
      { label: "Admission Enquiry", path: "/admin/front-office/admission-enquiry" },
      { label: "Visitor Book", path: "/admin/front-office/visitor-book" },
      { label: "Phone Call Log", path: "/admin/front-office/phone-call-log" },
      { label: "Postal Receive", path: "/admin/front-office/postal-receive" },
      { label: "Postal Dispatch", path: "/admin/front-office/postal-dispatch" },
      { label: "Complains", path: "/admin/front-office/complains" },
    ]},
    { label: "Academics", icon: GraduationCap, path: "", children: [
      { label: "Schools", path: "/admin/academics/schools" },
      { label: "Branches", path: "/admin/academics/branches" },
      { label: "Subjects", path: "/admin/academics/subjects" },
      { label: "Class", path: "/admin/academics/class" },
      { label: "Sections", path: "/admin/academics/sections" },
      { label: "Periods", path: "/admin/academics/periods" },
      { label: "Class Timetable", path: "/admin/academics/timetable" },
      { label: "Teachers", path: "/admin/academics/teachers" },
      { label: "Parents", path: "/admin/academics/parents" },
    ]},
    { label: "Student Information", icon: Users, path: "", children: [
      { label: "Student Admission", path: "/admin/student/studentAdmission" },
      { label: "Student Details", path: "/admin/student/studentDetails" },
      // { label: "Disabled Students", path: "/admin/student/disabledStudents" },
      // { label: "Bulk Import/Export", path: "/admin/student/bulkImportExport" },
      // { label: "Students Documents", path: "/admin/student/studentDocuments"},
    ]},
    { label: "Certificate", icon: Medal, path: "/admin/certificates" },
    { label: "Attendance", icon: Clock, path: "", children: [
      { label: "QR Code", path: "/admin/attendance/qr-code" },
      { label: "Face Attendance", path: "/admin/attendance/face" },
      { label: "Biometric", path: "/admin/attendance/biometric" },
      // { label: "Approve Leave", path: "/admin/attendance/approve-leave" },
    ]},
    { label: "Examination", icon: FileText, path: "", children: [
      { label: "Exam", path: "/admin/examination/exam" },
      { label: "Exam Schedule", path: "/admin/examination/schedule" },
      { label: "Exam Result", path: "/admin/examination/result" },
      { label: "Marks Grade", path: "/admin/examination/marks-grade" },
      { label: "Online Exam", path: "/admin/examination/online" },
    ]},
    { label: "Fees Collection", icon: IndianRupeeIcon, path: "", children: [
      { label: "Collect Fees", path: "/admin/fees/collectFees" },
      { label: "Payments", path: "/admin/fees/payments" },
      // { label: "Fees Type", path: "/admin/fees/feesType" },
      { label: "Fees Discount", path: "/admin/fees/feesDiscount" },
      // { label: "Fees Reminder", path: "/admin/fees/feesReminder" },
      // { label: "Search Due Fees", path: "/admin/fees/searchDueFees" },
    ]},
    { label: "Human Resource", icon: Briefcase, path: "/admin/hr"},
    { label: "Annual Calendar", icon: Calendar, path: "/admin/calendar" },
    { label: "Communicate", icon: Bell, path: "/admin/communicate" },
    { label: "Leave Request", icon: ClipboardCheck, path: "/admin/leave" },
    // { label: "Online Course", icon: MonitorPlay, path: "", children: [
    //   { label: "Courses", path: "/admin/online-course/courses" },
    //   { label: "Question Bank", path: "/admin/online-course/question-bank" },
    //   { label: "Reports", path: "/admin/online-course/reports" },
    // ]},
    { label: "Library", icon: Library, path: "/admin/library" },
    { label: "Inventory", icon: Package, path: "/admin/inventory" },
    { label: "Behaviour Records", icon: AlertTriangle, path: "/admin/behaviour" },
    // { label: "G-Meet Live Classes", icon: Video, path: "/admin/live-classes" },
    { label: "Scholarship", icon: Award, path: "/admin/scholarship" },
    // { label: "Lesson Plan", icon: BookMarked, path: "/admin/lesson-plan" },
    { label: "Download Center", icon: Download, path: "/admin/download/uploadContent"},
    { label: "Homework", icon: ClipboardList, path: "/admin/homework/addHomework" },

    { label: "Transport", icon: Bus, path: "/admin/transport" },
    { label: "Hostel", icon: Building, path: "/admin/hostel" },
    { label: "Canteen", icon: UtensilsCrossed, path: "/admin/canteen" },
    { label: "Sports", icon: Trophy, path: "/admin/sports" },
    // { label: "Alumni", icon: UserCheck, path: "/admin/alumni" },
    { label: "Reports", icon: BarChart3, path: "/admin/reports" },
    { label: "Front CMS", icon: Globe, path: "/admin/website-settings" },
    { label: "System Settings", icon: Settings, path: "/admin/setting" },

  ];

  interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
  }

  export default function AdminSidebar({
    collapsed,
    setCollapsed,
  }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (label: string) => {
      setOpenMenus((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    };

    const isActive = (path: string) => pathname === path;

    const isParentActive = (item: any) =>
      item.children?.some((child: any) => pathname.startsWith(child.path));

    // Auto open parent if child route active
    useEffect(() => {
      menuItems.forEach((item) => {
        if (item.children) {
          const activeChild = item.children.some((child) =>
            pathname.startsWith(child.path)
          );
          if (activeChild) {
            setOpenMenus((prev) =>
              prev.includes(item.label) ? prev : [...prev, item.label]
            );
          }
        }
      });
    }, [pathname]);

    return (
      <aside
        className={`fixed top-0 left-0 h-screen z-50
        ${collapsed ? "w-[80px]" : "w-[270px]"}
        bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-gray-800 flex flex-col shadow-lg transition-all duration-300`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              <h2 className="font-bold text-lg">School Admin</h2>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-white/20 transition"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelLeftClose className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">

          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasChildren = !!item.children;
            const open = openMenus.includes(item.label);
            const active = isActive(item.path) || isParentActive(item);

            return (
              <div key={item.label}>
                {/* Parent Button */}
                <button
                  onClick={() => {
                    if (hasChildren) {
                      if (collapsed) {
                        setCollapsed(false);
                        setTimeout(() => toggleMenu(item.label), 200);
                      } else {
                        toggleMenu(item.label);
                      }
                    } else {
                      router.push(item.path);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-white text-indigo-700 shadow-lg"
                      : "hover:bg-white/20"
                  }`}
                >
                  <Icon className="w-5 h-5" />

                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">
                        {item.label}
                      </span>

                      {hasChildren &&
                        (open ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        ))}
                    </>
                  )}
                </button>

                {/* Dropdown Children */}
                {hasChildren && open && !collapsed && (
                  <div className="ml-10 mt-1 space-y-1 transition-all duration-300">
                    {item.children!.map((child) => (
                      <button
                        key={child.path}
                        onClick={() => router.push(child.path)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition
                          ${
                            isActive(child.path)
                              ? "bg-white text-indigo-700"
                              : "hover:bg-white/20"
                          }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        {!collapsed && (
          <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center font-bold">
                RS
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Rahul Sharma</p>
                <p className="text-xs opacity-80">Admin</p>
              </div>
              <LogOut onClick={() => router.push("/login")} className="w-4 h-4 cursor-pointer hover:text-red-300" />
            </div>
          </div>
        )}
      </aside>
    );
  }

