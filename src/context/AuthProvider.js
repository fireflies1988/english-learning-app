import React from "react";
import { createContext, useState } from "react";

const AuthContext = createContext({});

// { children } only get children property in props (props.children)
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    accessToken: null,
    tokenType: null,
    loggedIn: false,
    isAdmin: false,
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
