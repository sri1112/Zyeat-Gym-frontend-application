// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute() {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   return user ? <Outlet /> : <Navigate to="/" replace />;
// }
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute () {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to='/' replace />
  }

  //  CRITICAL: Check if BOTH name and diet exist
  const isProfileComplete = user.name && user.diet

  // If incomplete, force them to the profile page immediately upon login
  if (!isProfileComplete && location.pathname !== '/profile') {
    return <Navigate to='/profile' replace />
  }

  return <Outlet />
}
