import { Topbar, Footer } from "@/components";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Topbar />
      <main className="flex flex-col grow py-5">{children}</main>
      <Footer />
    </>
  );
};
