import { Toaster } from "sonner";
import { Topbar, Footer } from "@/components";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Topbar />
      <main className="flex flex-col grow">{children}</main>
      <Footer />
      <Toaster richColors position="top-center" />
    </>
  );
};
