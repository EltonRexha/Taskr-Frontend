import {
  Sidebar,
  SidebarSkeleton,
} from "@/features/dashboard/components/Sidebar";
import type React from "react";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const queryParams = await params;
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar urlNavOptions={queryParams} />
      </Suspense>
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
