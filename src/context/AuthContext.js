import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(
    JSON.parse(localStorage.getItem("users")) || []
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );

  // Đồng bộ localStorage khi users thay đổi
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Đồng bộ localStorage khi user thay đổi
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  // Đăng ký người dùng mới (không tự login)
  const register = (newUser) => {
    const emailExists = users.some((u) => u.email === newUser.email);
    if (emailExists) {
      return { success: false, message: "Email đã được sử dụng." };
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    return { success: true };
  };

  // Đăng nhập
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!foundUser) {
      return { success: false, message: "Email hoặc mật khẩu không đúng." };
    }

    setUser(foundUser);
    return { success: true };
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ users, user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
