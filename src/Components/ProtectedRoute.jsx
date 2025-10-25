import { Navigate } from "react-router";
import { useApp } from "../context/AppContext";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useApp();

  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
