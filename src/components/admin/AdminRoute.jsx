import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const userRole = localStorage.getItem("userRole");

  return userRole === "admin" ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
