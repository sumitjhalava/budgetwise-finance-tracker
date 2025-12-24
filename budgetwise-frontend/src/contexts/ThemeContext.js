import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem("bw_theme") || "light");

    useEffect(() => {
        localStorage.setItem("bw_theme", theme);
        // Forcefully set attribute on both html/body to be safe
        document.documentElement.setAttribute("data-theme", theme);
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
