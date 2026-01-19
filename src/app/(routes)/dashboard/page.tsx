'use client'

import { DashboardHeader } from "@/features/dashboard/components/Header";
import { useUser } from "@clerk/nextjs";

function DashboardPage() {
  const user = useUser();
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Dashboard" subtitle={`Welcome ${user.user?.firstName}, what would you like to do today?`}/>
    </div>
  )
}

export default DashboardPage