import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Customer-only protection (if you want to protect some customer pages later)
const isProtectedCustomerRoute = createRouteMatcher([
  // e.g., add protected customer pages here
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedCustomerRoute(req)) {
    const { userId, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  // Run Clerk only for customer area and cart API; exclude admin
  matcher: [
    "/(customer)(.*)",
    "/api/cart/:path*",
  ],
};
