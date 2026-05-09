import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useThemeStore } from "./features/theme/store/themeStore";
import { ErrorBoundary, ProtectedRoute } from "./components";
import { HomePage, TodosPage } from "./pages";

export const App = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        richColors
        position="top-center"
        theme={theme === "dark" ? "dark" : "light"}
      />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/todos" element={<ProtectedRoute />}>
            <Route path="/todos" element={<TodosPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/todos" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};
