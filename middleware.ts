import NextAuth from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authConfig } from "./lib/auth/config"

const { auth } = NextAuth(authConfig);

const publicPaths = ["/sign-in", "/sign-up", "/superadmin/sign-in", "/superadmin/sign-up", "/shop/:path*", "/products/:path*"];
const rootRoute = '/'
const privateRoute = ["/cart/:path*", "/profile/:path*", "/admin/:path*"]

export default auth(async function middleware(req: NextRequest) {
  const { nextUrl } = req
  const session = await auth()
  // console.log('called middleware when matcher is there')
  // console.log('nextUrl', nextUrl)
  // console.log('session', session)


  const isAuthenticated = !!session?.user;

  const isPublicRoute = ((publicPaths.find(route => nextUrl.pathname.startsWith(route))
  || nextUrl.pathname === rootRoute) && !privateRoute.find(route => nextUrl.pathname.includes(route)));

  console.log('isPublicRoute:',isPublicRoute);


  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL('/sign-in', nextUrl));


  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};

// export const config = {
//   matcher: ["/cart/:path*", "/profile/:path*", "/admin/:path*"],
// }
