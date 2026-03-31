import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/auth/adminlogin", nextUrl));
    }
    
    // Admin has full access
    if (role === 'ADMIN') return;

    // Volunteers only have access to scanner and checkin terminals
    const isVolunteerAllowedRoute = nextUrl.pathname.startsWith("/admin/scanner") || nextUrl.pathname.startsWith("/admin/checkin");
    
    if (role === 'VOLUNTEER' && !isVolunteerAllowedRoute) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }

    if (role === 'PARTICIPANT') {
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
