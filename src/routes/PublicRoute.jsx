// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function PublicRoute() {
//   const { user, loading } = useAuth();

//   // ⛔ Wait until auth check finishes
//   if (loading) return null;

//   // ✅ If logged in → go to home
//   return user ? <Navigate to="/home" replace /> : <Outlet />;
// }
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicRoute () {
  const { user, loading } = useAuth()

  if (loading) return null

  if (user) {
    const isProfileComplete = user.name && user.diet

    // ✅ FIX: Send them to '/home' or '/dashboard', NOT '/'
    return isProfileComplete ? (
      <Navigate to='/home' replace />
    ) : (
      <Navigate to='/profile' replace />
    )
  }

  return <Outlet />
}
