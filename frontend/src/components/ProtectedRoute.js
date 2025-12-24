import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const auth = useAuth(); // SAFE

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
