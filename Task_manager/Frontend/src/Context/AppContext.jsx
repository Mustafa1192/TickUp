import { createContext, useContext } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // const backendUrl = "http://localhost:5000"; // or your deployed URL
  const backendUrl = "https://tickup.onrender.com"; // or your deployed URL

  return (
    <AppContext.Provider value={{ backendUrl }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
