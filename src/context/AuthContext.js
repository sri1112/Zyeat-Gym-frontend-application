// import React, { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const checkAuth = async () => {
//     try {
//       const res = await fetch("http://localhost:3001/api/auth/me", {
//         credentials: "include",
//       });

//       if (!res.ok) throw new Error("Unauthenticated");

//       const data = await res.json();
//       setUser(data.user);
//       return data.user;
//     } catch {
//       setUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, setUser, checkAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const data = await authService.getCurrentUser()

      setUser(data.user)

      return data.user
    } catch (err) {
      setUser(null)

      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.log(err)
    }

    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
        checkAuth,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
