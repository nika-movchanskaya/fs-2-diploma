import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
};

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user } = useAuth();

  return user //localStorage.getItem('user') 
    ? <> 
        {children} 
      </>
    : <Navigate to="/login" replace />;
}
