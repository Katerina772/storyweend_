// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext.jsx";

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }
//   return context;
// }

import { useContext } from "react";
import { AuthContext } from "../context/authContextValue.js";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
