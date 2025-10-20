import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext({
  username: null,
  id: null,
  setUsername: () => {},
});

export const AuthProvider = ({ children }) => {
  const [username, setUsernameState] = useState(null);
  const [id, setIdState] = useState(null);

  const setUsername = (name) => {
    setUsernameState(name);
  };

  const setId = (id) => {
    setIdState(id);
  };

  return (
    <AuthContext.Provider value={{ username, id, setUsername, setId }}>
      { children }
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);