import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { routes } from "./lib/routes";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(routes.PROTECTED);
const isGuestRoute = createRouteMatcher(routes.GUEST);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  //The user is authenticated but trying to access a guest route
  if (isGuestRoute(req) && userId) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedRoute(req) && !userId) {
    console.log("User is not authenticated");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
