import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'theme-preference';

/**
 * Read the stored preference from localStorage.
 * Missing key (or invalid value) → 'system'.
 */
function readStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage may be unavailable
  }
  return 'system';
}

/**
 * Persist the preference.
 * 'system' is represented by *removing* the key so that the FOUC script
 * (which treats a missing key as "follow OS") stays in sync.
 */
function writeStoredPreference(pref) {
  try {
    if (pref === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, pref);
    }
  } catch {
    // ignore
  }
}

/**
 * Resolve the current OS color-scheme.
 */
function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Apply the resolved theme to the DOM so CSS `[data-theme]` selectors work.
 */
function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
}

/**
 * Custom hook that manages light / dark / system theme preference.
 *
 * Returns { theme, resolvedTheme, toggleTheme }
 *  - theme: 'light' | 'dark' | 'system'
 *  - resolvedTheme: 'light' | 'dark'
 *  - toggleTheme: () => void  (cycles between light ↔ dark)
 */
export function useTheme() {
  const [preferenceState, setPreferenceState] = useState(readStoredPreference);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Keep a ref to systemTheme so toggleTheme never goes stale.
  const systemThemeRef = useRef(systemTheme);
  useEffect(() => {
    systemThemeRef.current = systemTheme;
  }, [systemTheme]);

  // Keep a ref to the latest preference for the debounced write.
  const latestPreferenceRef = useRef(preferenceState);
  useEffect(() => {
    latestPreferenceRef.current = preferenceState;
  }, [preferenceState]);

  const debounceRef = useRef(null);

  // Resolve the effective theme.
  const resolvedTheme =
    preferenceState === 'system' ? systemTheme : preferenceState;

  // Apply to DOM whenever resolved theme changes.
  useEffect(() => {
    applyThemeToDOM(resolvedTheme);
  }, [resolvedTheme]);

  // Listen for OS theme changes.
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Cleanup debounce timer on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Toggle between light and dark.
   * UI updates immediately (setState); localStorage write is debounced.
   */
  const toggleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      const currentResolved =
        prev === 'system' ? systemThemeRef.current : prev;
      return currentResolved === 'dark' ? 'light' : 'dark';
    });

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeStoredPreference(latestPreferenceRef.current);
      debounceRef.current = null;
    }, 80);
  }, []); // stable reference — no deps needed

  return {
    theme: preferenceState,
    resolvedTheme,
    toggleTheme,
  };
}
