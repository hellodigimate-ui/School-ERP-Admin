/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */

  "use client";

  import { useState, useEffect } from "react";
  import { useRouter, usePathname } from "next/navigation";
  import {
    LayoutDashboard, UserPlus, Users, Award, 
    AlertTriangle,  Clock, FileText, Medal, GraduationCap, Calendar,
     Briefcase, Bell, Download,  Library, Package,
     Bus, Building, UtensilsCrossed, Trophy, 
    BarChart3, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
    ChevronRight,
    ChevronDown,
    IndianRupeeIcon,
    ClipboardCheck,
    ClipboardList,
    UserCheck
  } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/superAdmin/dashboard" },
    { label: "Front Office", icon: UserPlus, path: "", children: [
      { label: "Admission Enquiry", path: "/superAdmin/front-office/admission-enquiry" },
      { label: "Visitor Book", path: "/superAdmin/front-office/visitor-book" },
      { label: "Phone Call Log", path: "/superAdmin/front-office/phone-call-log" },
      { label: "Postal Receive", path: "/superAdmin/front-office/postal-receive" },
      { label: "Postal Dispatch", path: "/superAdmin/front-office/postal-dispatch" },
      { label: "Complains", path: "/superAdmin/front-office/complains" },
    ]},
    { label: "Academics", icon: GraduationCap, path: "", children: [
      { label: "Schools", path: "/superAdmin/academics/schools" },
      { label: "Branches", path: "/superAdmin/academics/branches" },
      { label: "Subjects", path: "/superAdmin/academics/subjects" },
      { label: "Class", path: "/superAdmin/academics/class" },
      { label: "Sections", path: "/superAdmin/academics/sections" },
      { label: "Periods", path: "/superAdmin/academics/periods" },
      { label: "Class Timetable", path: "/superAdmin/academics/timetable" },
      { label: "Teachers", path: "/superAdmin/academics/teachers" },
      { label: "Parents", path: "/superAdmin/academics/parents" },
    ]},
    { label: "Student Information", icon: Users, path: "", children: [
      { label: "Student Admission", path: "/superAdmin/student/studentAdmission" },
      { label: "Student Details", path: "/superAdmin/student/studentDetails" },
      // { label: "Disabled Students", path: "/superAdmin/student/disabledStudents" },
      // { label: "Bulk Import/Export", path: "/superAdmin/student/bulkImportExport" },
      // { label: "Students Documents", path: "/superAdmin/student/studentDocuments"},
    ]},
    { label: "Certificate", icon: Medal, path: "/superAdmin/certificates" },
    { label: "Attendance", icon: Clock, path: "", children: [
      { label: "QR Code", path: "/superAdmin/attendance/qr-code" },
      { label: "Face Attendance", path: "/superAdmin/attendance/face" },
      { label: "Biometric", path: "/superAdmin/attendance/biometric" },
      // { label: "Approve Leave", path: "/superAdmin/attendance/approve-leave" },
    ]},
    { label: "Examination", icon: FileText, path: "", children: [
      { label: "Exam", path: "/superAdmin/examination/exam" },
      { label: "Exam Schedule", path: "/superAdmin/examination/schedule" },
      { label: "Exam Result", path: "/superAdmin/examination/result" },
      // { label: "Marks Grade", path: "/superAdmin/examination/marks-grade" },
      { label: "Online Exam", path: "/superAdmin/examination/online" },
    ]},
    { label: "Fees Collection", icon: IndianRupeeIcon, path: "", children: [
      { label: "Collect Fees", path: "/superAdmin/fees/collectFees" },
      { label: "Payments", path: "/superAdmin/fees/payments" },
      // { label: "Fees Type", path: "/superAdmin/fees/feesType" },
      { label: "Fees Discount", path: "/superAdmin/fees/feesDiscount" },
      // { label: "Fees Reminder", path: "/superAdmin/fees/feesReminder" },
      // { label: "Search Due Fees", path: "/superAdmin/fees/searchDueFees" },
    ]},
    { label: "Human Resource", icon: Briefcase, path: "/superAdmin/hr"},
    { label: "Annual Calendar", icon: Calendar, path: "/superAdmin/calendar" },
    { label: "Communicate", icon: Bell, path: "/superAdmin/communicate" },
    { label: "Leave Request", icon: ClipboardCheck, path: "/superAdmin/leave" },
    // { label: "Online Course", icon: MonitorPlay, path: "", children: [
    //   { label: "Courses", path: "/superAdmin/online-course/courses" },
    //   { label: "Question Bank", path: "/superAdmin/online-course/question-bank" },
    //   { label: "Reports", path: "/superAdmin/online-course/reports" },
    // ]},
    { label: "Library", icon: Library, path: "/superAdmin/library" },
    { label: "Inventory", icon: Package, path: "/superAdmin/inventory" },
    { label: "Behaviour Records", icon: AlertTriangle, path: "/superAdmin/behaviour" },
    // { label: "G-Meet Live Classes", icon: Video, path: "/superAdmin/live-classes" },
    { label: "Scholarship", icon: Award, path: "/superAdmin/scholarship" },
    // { label: "Lesson Plan", icon: BookMarked, path: "/superAdmin/lesson-plan" },
    { label: "Download Center", icon: Download, path: "/superAdmin/download/uploadContent"},
    { label: "Homework", icon: ClipboardList, path: "/superAdmin/homework/addHomework" },

    { label: "Transport", icon: Bus, path: "/superAdmin/transport" },
    { label: "Hostel", icon: Building, path: "/superAdmin/hostel" },
    { label: "Canteen", icon: UtensilsCrossed, path: "/superAdmin/canteen" },
    { label: "Sports", icon: Trophy, path: "/superAdmin/sports" },
    { label: "Alumni", icon: UserCheck, path: "/superAdmin/alumni" },
    { label: "Reports", icon: BarChart3, path: "/superAdmin/reports" },
    // { label: "Front CMS", icon: Globe, path: "/superAdmin/website-settings" },
    { label: "System Settings", icon: Settings, path: "/superAdmin/setting" },

  ];

  const dummyData = {
    name: "Rahul",
    avatar: "https://pngtree.com/so/user"
  };

const getInitials = (name) => {
  if (!name) return "";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
};

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
    const [data, setData] = useState({
      name: "",
      avatar: "",
    });
    const [loading, setLoading] = useState(true);

    const toggleMenu = (label: string) => {
      setOpenMenus((prev) =>
        prev.includes(label)
          ? prev.filter((item) => item !== label)
          : [...prev, label]
      );
    };

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/admin/profile");

        console.log("Full API Response:", response.data);

        const profile = response?.data?.data || response?.data;

        if (profile?.branchId !== undefined && profile?.branchId !== null) {
          localStorage.setItem("branchId", String(profile.branchId));
        }

        setData({
          name: profile?.name ?? dummyData.name,
          avatar: profile?.avatar ?? "", // 👈 add this
        });
      } catch (error) {
        console.log(
          "API failed, using dummy data:",
          error instanceof Error ? error.message : String(error)
        );
        setData(dummyData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
    

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
        bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200 text-gray-800 flex flex-col shadow-lg transition-all duration-300 dark:bg-gray-900`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 dark:bg-gray-900">
          {!collapsed && (
            <div className="flex items-center gap-2 dark:text-gray-400">
              <GraduationCap className="w-6 h-6" />
              <h2 className="font-bold text-lg dark:text-gray-400">School Super Admin</h2>
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
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent dark:bg-gray-900 dark:text-gray-400">

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
          <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md dark:bg-gray-900 dark:text-gray-400">
            <div className="flex items-center gap-3">
              

              <div className="w-10 h-10 rounded-full overflow-hidden bg-white flex items-center justify-center font-bold">
                {loading ? (
                  "..."
                ) : data?.avatar ? (
                  <img
                    src={data.avatar}
                    alt={data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600">
                    {getInitials(data.name)}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold">{loading ? "..." : data.name}</p>
                <p className="text-xs opacity-80">Super Admin</p>
              </div>
              <LogOut onClick={() => router.push("/")} className="w-4 h-4 cursor-pointer hover:text-red-300" />
            </div>
          </div>
        )}
      </aside>
    );
  }