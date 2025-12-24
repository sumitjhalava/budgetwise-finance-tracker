import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    document.documentElement.setAttribute("data-theme", theme === "light" ? "dark" : "light");
  };

  return (
    <UIContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar, theme, toggleTheme }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
