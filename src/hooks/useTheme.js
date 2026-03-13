import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'theme-preference';
const VALID_THEMES = ['light', 'dark'];
const DEBOUNCE_MS = 300;

/**
 * Safely read from localStorage.
 * Returns null if storage is unavailable or value is invalid.
 */
function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value && VALID_THEMES.includes(value)) {
      return value;
    }
  } catch {
    // localStorage disabled or unavailable
  }
  return null;
}

/**
 * Safely write to localStorage.
 */
function writeStoredTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage disabled — silent degradation
  }
}

/**
 * Get system color scheme preference.
 */
function getSystemTheme() {
  try {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // matchMedia not supported
  }
  return 'light';
}

/**
 * Apply theme class to <html> element.
 */
function applyTheme(theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
}

/**
 * Determine initial theme with priority:
 * 1. localStorage
 * 2. System preference
 * 3. Default: light
 */
function getInitialTheme() {
  const stored = readStoredTheme();
  if (stored) {
    return { theme: stored, source: 'user' };
  }
  const system = getSystemTheme();
  return { theme: system, source: 'system' };
}

export function useTheme() {
  const [themeState, setThemeState] = useState(() => {
    const initial = getInitialTheme();
    return initial;
  });

  const debounceTimerRef = useRef(null);
  const lastToggleTimeRef = useRef(0);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(themeState.theme);
  }, [themeState.theme]);

  // Listen for system theme changes (only follow if source is 'system')
  useEffect(() => {
    let mediaQuery;
    try {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    } catch {
      return;
    }

    const handler = (e) => {
      setThemeState((prev) => {
        // Only follow system if user hasn't manually set preference
        if (prev.source === 'user') {
          return prev;
        }
        const newTheme = e.matches ? 'dark' : 'light';
        return { theme: newTheme, source: 'system' };
      });
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);

  // Sync across tabs via storage event
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const newValue = e.newValue;
      if (newValue && VALID_THEMES.includes(newValue)) {
        setThemeState({ theme: newValue, source: 'user' });
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Toggle with debounce to prevent rapid flickering
  const toggleTheme = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < DEBOUNCE_MS) {
      // Clear any pending debounced toggle
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      // Schedule the toggle after debounce period
      debounceTimerRef.current = setTimeout(() => {
        lastToggleTimeRef.current = Date.now();
        setThemeState((prev) => {
          const newTheme = prev.theme === 'light' ? 'dark' : 'light';
          writeStoredTheme(newTheme);
          return { theme: newTheme, source: 'user' };
        });
      }, DEBOUNCE_MS);
      return;
    }

    lastToggleTimeRef.current = now;
    setThemeState((prev) => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      writeStoredTheme(newTheme);
      return { theme: newTheme, source: 'user' };
    });
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    theme: themeState.theme,
    source: themeState.source,
    toggleTheme,
  };
}
