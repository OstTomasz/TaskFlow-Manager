import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage, TodosPage } from "./pages";
// import { ProtectedRoute } from "./components";

export const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/todos" element={<TodosPage />} />
        {/* <Route path="/todos" element={<ProtectedRoute />}>
          <Route path="/todos" element={<TodosPage />} />
        </Route> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
