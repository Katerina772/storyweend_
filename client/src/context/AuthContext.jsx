// import { createContext, useState, useEffect, useCallback } from "react";
// import { authApi } from "../api/auth.api.js";

// export const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // При завантаженні застосунку перевіряємо, чи є токен
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     // Спочатку пробуємо взяти з localStorage (швидко)
//     if (storedUser) {
//       try {
//         setUser(JSON.parse(storedUser));
//       } catch {
//         localStorage.removeItem("user");
//       }
//     }

//     // Потім перевіряємо токен на сервері
//     authApi
//       .me()
//       .then(({ user }) => {
//         setUser(user);
//         localStorage.setItem("user", JSON.stringify(user));
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const login = useCallback(async (email, password) => {
//     const { user, token } = await authApi.login({ email, password });
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     setUser(user);
//     return user;
//   }, []);

//   const register = useCallback(async (username, email, password) => {
//     const { user, token } = await authApi.register({
//       username,
//       email,
//       password,
//     });
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(user));
//     setUser(user);
//     return user;
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//   }, []);

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === "ADMIN",
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

import { useState, useEffect, useCallback } from "react";
import { authApi } from "../api/auth.api.js";
import { AuthContext } from "./authContextValue.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token) {
      setLoading(false);
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    authApi
      .me()
      .then(({ user }) => {
        if (cancelled) return;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { user, token } = await authApi.login({ email, password });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { user, token } = await authApi.register({
      username,
      email,
      password,
    });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
