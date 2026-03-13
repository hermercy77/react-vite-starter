import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'theme-preference';
const DEBOUNCE_MS = 300;

/**
 * Reads the stored preference from localStorage.
 * Returns 'light', 'dark', 'system', or null if nothing stored / storage unavailable.
 */
function getStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. incognito in some browsers)
  }
  return null;
}

/**
 * Persists preference to localStorage with graceful degradation.
 */
function setStoredPreference(value) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Silently fail — feature still works, just won't persist
  }
}

/**
 * Returns the system's preferred color scheme.
 */
function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Resolves the effective theme ('light' | 'dark') from a preference.
 */
function resolveTheme(preference) {
  if (preference === 'dark' || preference === 'light') {
    return preference;
  }
  // 'system' or null/undefined
  return getSystemTheme();
}

/**
 * Applies the resolved theme class to <html> element.
 */
function applyTheme(resolvedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
}

/**
 * useTheme — manages dark/light/system theme with:
 *  - localStorage persistence
 *  - System theme real-time sync (when preference is 'system')
 *  - Cross-tab sync via storage event
 *  - 300ms debounce on toggle to prevent rapid switching
 *
 * Returns:
 *  - theme: 'light' | 'dark' (the resolved/applied theme)
 *  - preference: 'light' | 'dark' | 'system' (what the user chose)
 *  - setPreference: (pref: 'light' | 'dark' | 'system') => void
 *  - toggleTheme: () => void (cycles light -> dark -> system -> light)
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState(() => {
    return getStoredPreference() || 'system';
  });

  const [theme, setTheme] = useState(() => {
    return resolveTheme(preference);
  });

  // Debounce ref for toggle
  const lastToggleTime = useRef(0);

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Set preference (public API)
  const setPreference = useCallback((newPref) => {
    if (newPref !== 'light' && newPref !== 'dark' && newPref !== 'system') {
      return;
    }
    setPreferenceState(newPref);
    setStoredPreference(newPref);
    setTheme(resolveTheme(newPref));
  }, []);

  // Toggle: light -> dark -> system -> light
  const toggleTheme = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTime.current < DEBOUNCE_MS) {
      return; // Debounce: ignore rapid clicks
    }
    lastToggleTime.current = now;

    setPreferenceState((prev) => {
      let next;
      if (prev === 'light') {
        next = 'dark';
      } else if (prev === 'dark') {
        next = 'system';
      } else {
        next = 'light';
      }
      setStoredPreference(next);
      setTheme(resolveTheme(next));
      return next;
    });
  }, []);

  // Listen for system theme changes (only matters when preference is 'system')
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e) => {
      // Only auto-sync if user preference is 'system'
      setPreferenceState((currentPref) => {
        if (currentPref === 'system') {
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
        }
        return currentPref;
      });
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const newPref = e.newValue;
      if (
        newPref === 'light' ||
        newPref === 'dark' ||
        newPref === 'system'
      ) {
        setPreferenceState(newPref);
        setTheme(resolveTheme(newPref));
      } else if (newPref === null) {
        // Storage was cleared
        setPreferenceState('system');
        setTheme(getSystemTheme());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { theme, preference, setPreference, toggleTheme };
}
