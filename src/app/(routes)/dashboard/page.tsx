"use client";

import { DashboardHeader } from "@/features/dashboard/components/Header";
import { StatsCards } from "@/features/dashboard/components/StatsCards";
import { useUser } from "@clerk/nextjs";

function DashboardPage() {
  const user = useUser();
  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard"
        firstName={user.user?.firstName || ""}
      />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-364">
        <StatsCards />
      </div>
    </div>
  );
}

export default DashboardPage;
