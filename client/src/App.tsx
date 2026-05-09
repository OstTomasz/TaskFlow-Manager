import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, TodosPage } from "./pages";
import { ProtectedRoute } from "./components";
import { Toaster } from "sonner";
import { useThemeStore } from "./features/theme/store/themeStore";

export const App = () => {
  const { theme } = useThemeStore();
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        richColors
        position="top-center"
        theme={theme === "dark" ? "dark" : "light"}
      />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/todos" element={<ProtectedRoute />}>
          <Route path="/todos" element={<TodosPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/todos" replace />} />
      </Routes>
    </div>
  );
};
