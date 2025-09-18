import SiteNavbar from "@/components/navbar-components/site-navbar";
import Footer from "@/components/footer";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
