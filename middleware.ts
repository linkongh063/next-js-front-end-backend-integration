import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const pathname = nextUrl.pathname

  console.log("middleware called")
  console.log("auth object:", req.auth)

  // Protect /cart and /profile
  if (!req.auth && ["/cart", "/profile"].some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  // Protect /admin (only admins allowed)
  if (pathname.startsWith("/admin")) {
    if (!req.auth || req.auth.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/cart/:path*", "/profile/:path*", "/admin/:path*"],
}
