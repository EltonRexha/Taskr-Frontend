type RouteType = "PROTECTED" | "GUEST";

export const routes: Record<RouteType, string[]> = {
  PROTECTED: ["/dashboard"],
  GUEST: ["/login", "/register"],
};
