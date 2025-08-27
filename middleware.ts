import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    console.log('userid',userId)
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });

    // ✅ You can’t call Prisma here if Edge runtime
    // Authorization check should happen in server component or API route
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/brands/:path*", "/categories/:path*", "/products/:path*", "/users/:path*", "/orders/:path*", "/settings/:path*"], // make sure your dashboard route is matched
};
