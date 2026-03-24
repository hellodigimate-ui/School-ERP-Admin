"use client";

import Billing from "@/components/canteen/biiling";
import CanteenLayout from "@/components/canteen/canteenLayout";
import DailySalesReport from "@/components/canteen/dailySalesReport";
import CanteenDashboard from "@/components/canteen/dashboard";
import ItemManagement from "@/components/canteen/itemManagement";
import ParentControl from "@/components/canteen/parentControl";
import StockManagement from "@/components/canteen/stockManagement";
import StudentWallet from "@/components/canteen/studentWallet";
import { useState } from "react";

const modules: Record<string, React.ComponentType> = {
  dashboard: CanteenDashboard,
  items: ItemManagement,
  stock: StockManagement,
  billing: Billing,
  wallet: StudentWallet,
  parent: ParentControl,
  reports: DailySalesReport,
};

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const ActiveComponent = modules[activeModule] || CanteenDashboard;

  return (
    <CanteenLayout>
      <ActiveComponent />
    </CanteenLayout>
  );
};

export default Index;
