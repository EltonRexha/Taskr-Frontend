"use client";

import { DashboardHeader } from "@/features/dashboard/components/Header";
import { ProjectsOverview } from "@/features/dashboard/components/ProjectsOverview";
import { RecentTasks } from "@/features/dashboard/components/RecentTasks";
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
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 flex flex-col items-center">
        <div className="max-w-364 w-full flex flex-col gap-6">
          <StatsCards />
          <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTasks />
            </div>

            <div className="space-y-6 lg:space-y-8">
              <ProjectsOverview />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
