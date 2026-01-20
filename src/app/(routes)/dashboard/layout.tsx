import { Sidebar } from "@/features/dashboard/components/Sidebar";
import type React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}
