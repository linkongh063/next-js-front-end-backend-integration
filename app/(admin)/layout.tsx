import { auth } from "@/auth";
import prisma  from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const email = (session as any)?.user?.email as string | undefined;
  const role = (session as any)?.user?.role as Role | undefined;
  if (!email || role !== "ADMIN") {
    redirect("/superadmin/sign-in");
  }
  // Ensure the admin exists (optional extra check)
  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/superadmin/sign-in");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 px-4 m-4 border-t-1 py-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
