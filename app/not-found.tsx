"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import SiteNavbar from "@/components/navbar-components/site-navbar";
import Footer from "@/components/footer";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div>
      <SiteNavbar />
      <div className="flex items-center justify-center min-h-[80vh] p-6">
        <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
          <CardContent className="p-8 flex flex-col items-center gap-4">
            <AlertTriangle className="w-16 h-16 text-destructive mb-2" />

            <h1 className="text-2xl font-bold">Page Not Found</h1>
            <p className="text-muted-foreground">
              The route{" "}
              <span className="font-mono text-foreground">{pathname}</span> does
              not exist.
            </p>

            <Link href="/" passHref>
              <Button className="mt-4">Go Back Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
