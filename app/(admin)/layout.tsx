import { currentUser } from "@clerk/nextjs/server";
import prisma  from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";


export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1️⃣ Get the signed-in user from Clerk
  console.log('layout load in dashboard', )
  const user = await currentUser();
  console.log('user', user )
  if (!user) {
    // Not signed in → redirect to login
    redirect("/");
  }
  console.log('user', user)
  // 2️⃣ Extract the email
  const email = user.emailAddresses[0]?.emailAddress;
  console.log("User email:", email);

  // prisma.user.findUnique({
  //   where: { email },
  // })
  // 3️⃣ Check if email exists in your database
  const dbUser = await prisma.user.findUnique({
    where: { email },
  });
  console.log('db user', dbUser)
  // 4️⃣ If user not in DB → redirect to login
  if (!dbUser) {
    redirect("/");
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
