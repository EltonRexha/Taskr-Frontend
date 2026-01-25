"use client";

import { MobileSidebar } from "./MobileSidebar";
import { usePathname } from "next/navigation";
import { getActiveDashboardNav } from "../libs/nav-libs";
import { useProjects } from "@/features/projects/hooks/use-projects";
import { toast } from "sonner";
import { NotificationsDropdown } from "./NotificationDropdown";
import HeaderSearch from "./HeaderSearch";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardHeaderProps {
  title: string;
  firstName?: string;
}

export function DashboardHeader({ title, firstName }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { data, error: projectsError } = useProjects({});
  const activeNav = getActiveDashboardNav(pathname)?.navItems;
  const projects = data?.projects;

  if (!activeNav) {
    throw new Error("No nav items found for path: " + pathname);
  }

  if (projectsError) {
    toast.error("Failed to load projects");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/95 px-4 py-3 sm:px-6 lg:px-8 min-h-18">
      <div className="flex items-center gap-3">
        <MobileSidebar navItems={activeNav} projects={projects || []} />
        <div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
            {title}
          </h1>
          {firstName ? (
            <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
              Welcome {firstName}, what would you like to do today?
            </p>
          ) : (
            <Skeleton className="h-4 w-64 md:w-84 mt-1" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <HeaderSearch />
        <NotificationsDropdown />
      </div>
    </header>
  );
}
