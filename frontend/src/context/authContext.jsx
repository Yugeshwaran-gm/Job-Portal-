import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // ✅ Restore user from localStorage on refresh
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // ✅ Restore user object on refresh
    }
  }, []);

  // ✅ Login function with token decoding
  const login = (token, role) => {
    try {
      const decodedUser = jwtDecode(token);
      console.log("🛠️ Decoded Token:", decodedUser);
      // const userData = { id: decodedUser.id, role: decodedUser.role, token };
      const userData = { id: decodedUser.id, role, token };
      console.log("📌 Storing in localStorage:", userData);

      localStorage.setItem("user", JSON.stringify(userData)); // ✅ Store full user object
      setUser(userData);
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
