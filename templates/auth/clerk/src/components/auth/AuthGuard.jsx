import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export function AuthGuard({ children, redirectTo = "/sign-in" }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}

// Higher-order component version
export function withAuthGuard(Component, redirectTo) {
  return function AuthGuardedComponent(props) {
    return (
      <AuthGuard redirectTo={redirectTo}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}