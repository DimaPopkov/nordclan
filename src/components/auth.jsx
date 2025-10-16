import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
  username: null,
  setUsername: () => {},
});

export const AuthProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);

  const setUsername = (name) => {
    setUsernameState(name);
  };

  return (
    <AuthContext.Provider value={{ username, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Создаем хук для удобного доступа
export const useAuth = () => useContext(AuthContext);