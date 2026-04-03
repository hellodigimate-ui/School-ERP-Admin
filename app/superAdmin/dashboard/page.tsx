"use client";

import { useEffect } from "react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import TopAttendance from "@/components/dashboard/TopAttendance";
import ChartsSection from "@/components/dashboard/ChartsSection";
import IncomeExpenseChart from "@/components/dashboard/IncomeExpenseChart";
import { AdminLayout } from "@/components/superAdmin/AdminLayout";

const Page = () => {

  useEffect(() => {
    const speak = () => {
      const message = new SpeechSynthesisUtterance(
        "Welcome to admin panel"
      );

      message.lang = "en-US";
      message.rate = 1;
      message.pitch = 1.2; // thodi female tone

      const voices = window.speechSynthesis.getVoices();

      // female voice find karne ki try
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("google us english")
        ) || voices[0];

      if (femaleVoice) {
        message.voice = femaleVoice;
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(message);
    };

    // voices load hone ka wait
    if (speechSynthesis.getVoices().length > 0) {
      speak();
    } else {
      speechSynthesis.onvoiceschanged = speak;
    }
  }, []);

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