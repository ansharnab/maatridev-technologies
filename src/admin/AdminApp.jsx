import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

export default function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("maatridev-admin-token"));

  return (
    <Routes>
      <Route
        index
        element={token ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={setToken} />}
      />
      <Route
        path="dashboard"
        element={token ? <AdminDashboard onLogout={() => setToken(null)} /> : <Navigate to="/admin" replace />}
      />
    </Routes>
  );
}
