import {
  Sidebar,
  SidebarSkeleton,
} from "@/features/dashboard/components/Sidebar";
import type React from "react";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
