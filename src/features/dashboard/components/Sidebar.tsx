"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Plus, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import Logo from "@/components/Logo";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { Skeleton } from "@/components/ui/skeleton";
import { getActiveDashboardNav } from "../libs/nav-libs";
import { toast } from "sonner";
import { SearchProject } from "./SearchProject";
import { Suspense } from "react";

const SIDEBAR_PROJECT_LIMIT = 10;

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectNameFilter = searchParams.get("projectName") ?? undefined;

  const {
    data,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useProjects({
    limit: SIDEBAR_PROJECT_LIMIT,
    project_name_like: projectNameFilter,
  });

  const navItems = getActiveDashboardNav(pathname)?.navItems;
  const projects = data?.projects ?? [];

  if (!navItems) {
    throw new Error("No nav items found for path: " + pathname);
  }

  if (error) {
    toast.error("Error fetching projects");
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar hidden lg:flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4 shrink-0">
        <Logo width={100} height={32} />
      </div>

      {/* Search */}
      <Suspense fallback={<Skeleton className="h-8 w-[90%] m-auto my-4" />}>
        <SearchProject />
      </Suspense>

      {/* Nav + Projects — scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 pb-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}

        {/* Projects section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {projectNameFilter ? `"${projectNameFilter}"` : "Projects"}{" "}
              {/* ← hint when filtered */}
            </span>
            <Link href="/projects/new">
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-sidebar-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-0.5">
            {isLoading && projects.length === 0 ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </>
            ) : projects.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground">
                {projectNameFilter
                  ? `No projects matching "${projectNameFilter}"`
                  : "No projects yet"}
              </p>
            ) : (
              projects.map((project) => {
                const isActive = pathname.includes(project.id);
                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors group",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          project.projectType === "KANBAN"
                            ? "#FF0000"
                            : "#00FF00",
                      }}
                    />
                    <span className="truncate">{project.name}</span>
                  </Link>
                );
              })
            )}
          </div>

          {/* View More */}
          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground disabled:opacity-50"
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  View more projects
                </>
              )}
            </button>
          )}
        </div>
      </nav>

      {/* User dropdown */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <UserDropdown />
      </div>
    </aside>
  );
}

export function SidebarSkeleton() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar hidden lg:flex flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4 shrink-0">
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Search */}
      <div className="px-3 py-3 shrink-0">
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
            <Skeleton className="h-4 w-4 rounded-md shrink-0" />
            <Skeleton className="h-3.5 w-24" />
          </div>
        ))}

        {/* Projects section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-3 py-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
          <div className="space-y-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <Skeleton
                  className="h-3.5"
                  style={{ width: `${50 + (i % 3) * 15}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
      </div>
    </aside>
  );
}
