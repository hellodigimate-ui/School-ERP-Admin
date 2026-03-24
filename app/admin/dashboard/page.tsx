
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import { AdminLayout } from "@/components/layout/AdminLayout";
import TopAttendance from "@/components/dashboard/TopAttendance";
import ChartsSection from "@/components/dashboard/ChartsSection";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";


const Page = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 max-w-[1400px]">
        <WelcomeBanner />
        <StatCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentActivity />
          <UpcomingEvents />
          <TopAttendance />
        </div>

        {/* Charts */}
        <ChartsSection />
        <IncomeExpenseChart />
      </div>
    </AdminLayout>
  );
};

export default Page;
