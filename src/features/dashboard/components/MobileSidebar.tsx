"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { UserDropdown } from "./UserDropdown";
import Logo from "@/components/Logo";
import { NavItems } from "../types/nav-items.types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getProjectColorByType } from "@/features/projects/libs/getProjectColorByType";
import { ProjectDto } from "@/features/projects/types/projects.types";

interface MobileSidebarProps {
  projects: ProjectDto[];
  navItems: NavItems;
}

export function MobileSidebar({ projects, navItems }: MobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-muted-foreground"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 p-0 bg-sidebar border-sidebar-border"
      >
        <VisuallyHidden>
          <SheetTitle>Sidebar</SheetTitle>
        </VisuallyHidden>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Logo height={45} width={100} />
          </div>

          {/* Search */}
          <div className="px-3 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-sidebar-accent/50 border-sidebar-border"
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
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

                return (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: getProjectColorByType(
                            project.projectType,
                          ),
                        }}
                      />
                      <span>{project.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User */}
          <div className="border-t border-sidebar-border p-3">
            <UserDropdown />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
