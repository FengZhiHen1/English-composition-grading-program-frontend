import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return null; // 可返回 loading UI
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;