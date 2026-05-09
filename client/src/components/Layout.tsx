import { Toaster } from "sonner";
import { Topbar, Footer } from "@/components";
import { useThemeStore } from "@/features/theme/store/themeStore";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme } = useThemeStore();
  return (
    <>
      <Topbar />
      <main className="flex flex-col grow py-5">{children}</main>
      <Footer />
      <Toaster
        richColors
        position="top-center"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </>
  );
};
