import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'theme-preference';

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage disabled or unavailable — silently ignore
  }
  return null;
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage disabled — silently ignore
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = getStoredTheme();
    return stored || getSystemTheme();
  });

  const [hasManualOverride, setHasManualOverride] = useState(() => {
    return getStoredTheme() !== null;
  });

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e) => {
      // Only follow system if user hasn't manually set a preference
      if (!hasManualOverride) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [hasManualOverride]);

  // Listen for storage events (multi-tab sync)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue === 'light' || e.newValue === 'dark') {
          setTheme(e.newValue);
          setHasManualOverride(true);
        } else if (e.newValue === null) {
          // Storage was cleared
          setHasManualOverride(false);
          setTheme(getSystemTheme());
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      persistTheme(next);
      setHasManualOverride(true);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
