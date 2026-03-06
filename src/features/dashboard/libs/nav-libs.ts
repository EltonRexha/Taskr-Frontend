import { NavItems } from "../types/nav-items.types";
import { CheckSquare, FolderKanban, LayoutDashboard } from "lucide-react";

/**
 * A single dashboard navigation group.
 * Each group becomes active when the current route matches `matchRoute`.
 */
export type DashboardNavGroup = {
  /** Route that activates this navigation group (exact match) */
  matchRoute: string;

  /** Navigation items shown when this group is active */
  navItems: NavItems;
};

/**
 * Returns the full dashboard navigation configuration.
 *
 * This configuration defines:
 * - which routes activate which navigation group
 * - which navigation items should be displayed for that group
 */
export function getDashboardNavConfig(): DashboardNavGroup[] {
  return [
    {
      matchRoute: "/dashboard",
      navItems: [
        {
          href: "/dashboard",
          icon: LayoutDashboard,
          label: "Dashboard",
        },
        {
          href: "/dashboard/tasks",
          icon: CheckSquare,
          label: "My Tasks",
        },
        {
          href: "/dashboard/projects",
          icon: FolderKanban,
          label: "Projects",
        },
      ],
    },
  ];
}

/**
 * Resolves the active dashboard navigation group
 * based on the current pathname.
 *
 * @param pathname - Current route pathname (e.g. `/dashboard/projects`)
 * @returns The active dashboard nav group or `undefined` if none match
 *
 * @example
 * ```ts
 * const activeNav = getActiveDashboardNav("/dashboard");
 * // { matchRoute: "/dashboard", navItems: [{ href: "/dashboard/projects", icon: FolderKanban, label: "Projects" }] }
 * ```
 */
export function getActiveDashboardNav(pathname: string) {
  const navConfig = getDashboardNavConfig();

  return navConfig.find((group) => pathname.includes(group.matchRoute));
}
