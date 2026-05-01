import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
// import { ProtectedRoute } from "./components/ProtectedRoute";
import { TodosPage } from "./pages/TodosPage";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/todos" element={<TodosPage />} />
        {/* <Route path="/todos" element={<ProtectedRoute />}>
          <Route path="/todos" element={<TodosPage />} />
        </Route> */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};
