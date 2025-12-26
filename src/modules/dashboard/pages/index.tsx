import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export default function Dashboard() {
  const { session, isLoading } = useAuth();

  // Optional but important: avoid redirect flicker
  if (isLoading) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  switch (session.role) {
    case "admin":
      return <Navigate to="/dashboard/admin" replace />;
    case "cashier":
      return <Navigate to="/dashboard/cashier" replace />;
    case "sales":
      return <Navigate to="/dashboard/sales" replace />;
    case "inventory":
      return <Navigate to="/dashboard/inventory" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
