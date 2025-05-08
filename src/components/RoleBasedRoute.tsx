
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type RoleBasedRouteProps = {
  children: ReactNode;
  allowedRoles: Array<"admin" | "client">;
  redirectTo?: string;
};

const RoleBasedRoute = ({ 
  children, 
  allowedRoles, 
  redirectTo = "/auth" 
}: RoleBasedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Redirect to home or specified route if role not allowed
  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default RoleBasedRoute;
