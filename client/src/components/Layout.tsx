import { Topbar, Footer } from "@/components";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Topbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};
