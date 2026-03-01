import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// The "login" screen passes one of these user objects.
// In a real app this would come from an API/JWT.
export function AuthProvider({ children, users }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login  = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
