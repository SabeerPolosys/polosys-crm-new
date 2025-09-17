import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Public routes
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = (await cookies()).get("AuthToken");

  const isPublicRoute = publicRoutes.includes(path);
  const isAuthenticated = Boolean(session);

  // 2. Redirect unauthenticated users from protected routes to /login
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Redirect authenticated users away from /login and /signup
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
