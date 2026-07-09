import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'dark' | 'light' | 'matrix';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const handleThemeChange = (e: any) => setTheme(e.detail);
    window.addEventListener('change-theme', handleThemeChange);
    return () => window.removeEventListener('change-theme', handleThemeChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.setProperty('--bg', '#0f0f0f');
      root.style.setProperty('--term', '#dcdcdc');
      root.style.setProperty('--border', '#1f1f1f');
    } else if (theme === 'light') {
      root.style.setProperty('--bg', '#ffffff');
      root.style.setProperty('--term', '#1a1a1a');
      root.style.setProperty('--border', '#e0e0e0');
    } else if (theme === 'matrix') {
      root.style.setProperty('--bg', '#000000');
      root.style.setProperty('--term', '#00ff41');
      root.style.setProperty('--border', '#003b00');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div style={{ backgroundColor: 'var(--bg)', color: 'var(--term)' }} className="h-full w-full transition-colors duration-300">
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext)!;
