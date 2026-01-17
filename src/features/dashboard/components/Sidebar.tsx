"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import Logo from "@/components/Logo";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

const projects = [
  {
    id: "1",
    name: "Project 1",
    type: "kanban",
    color: "#FF0000",
  },
];

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tasks", icon: CheckSquare, label: "My Tasks" },
  { href: "/dashboard/projects", icon: FolderKanban, label: "Projects" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      console.log(token);
    };
    fetchToken();
  }, [getToken]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border hidden lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <Logo width={100} height={32} />
        </div>

        <div className="px-3 py-4">
          <div className="flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50 px-3 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>Search...</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
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

          {/* Projects */}
          <div className="pt-6">
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Projects
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 text-muted-foreground hover:text-sidebar-foreground"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {projects.map((project) => {
              const isActive = pathname.includes(project.id);
              const taskCount = project.type === "kanban" ? 6 : 10;

              return (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span>{project.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {taskCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User - now using dropdown */}
        <div className="border-t border-sidebar-border p-3">
          <UserDropdown />
        </div>
      </div>
    </aside>
  );
}
