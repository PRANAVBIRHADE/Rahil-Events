import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const role = (req.auth?.user as any)?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/adminlogin", nextUrl));
    }
    if (role !== 'ADMIN') {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
  }

  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
}
