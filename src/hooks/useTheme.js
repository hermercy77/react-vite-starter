import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'theme-preference';
const DARK_MQ = '(prefers-color-scheme: dark)';

/**
 * Read stored preference from localStorage.
 * Returns 'light', 'dark', or 'system' (if no stored value).
 */
function readStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // localStorage unavailable (SSR, private browsing, etc.)
  }
  return 'system';
}

/**
 * Persist preference to localStorage.
 * NOTE: 'system' is stored as absence-of-key (removeItem) rather than
 * the literal string 'system', to keep the FOUC inline script simple.
 * When reading back, a missing key is interpreted as 'system'.
 */
function writeStoredPreference(value) {
  try {
    if (value === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // localStorage unavailable
  }
}

/**
 * Query current system (OS-level) color scheme.
 * @returns {'light' | 'dark'}
 */
function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(DARK_MQ).matches ? 'dark' : 'light';
}

/**
 * Resolve a preference to an actual theme.
 * @param {'light' | 'dark' | 'system'} preference
 * @param {'light' | 'dark'} systemTheme
 * @returns {'light' | 'dark'}
 */
function resolveTheme(preference, systemTheme) {
  return preference === 'system' ? systemTheme : preference;
}

/**
 * Apply the resolved theme to the document root element.
 * Sets `data-theme` attribute and `color-scheme` CSS property.
 * @param {'light' | 'dark'} theme
 */
function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  root.style.colorScheme = theme;
}

/**
 * Custom hook for theme management.
 *
 * Provides three-layer model:
 * - `preference`: what the user chose ('light' | 'dark' | 'system')
 * - `resolved`: the actual applied theme ('light' | 'dark')
 * - `source`: where the current theme comes from ('user' | 'system')
 *
 * Features:
 * - Persists user preference to localStorage
 * - Follows OS color scheme when preference is 'system'
 * - Syncs across browser tabs via storage events
 * - Debounces persistence on rapid toggles
 *
 * @returns {{ preference: string, resolved: string, source: string, toggleTheme: Function, setPreference: Function }}
 */
export function useTheme() {
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const [preference, setPreferenceState] = useState(readStoredPreference);

  const resolved = resolveTheme(preference, systemTheme);
  const source = preference === 'system' ? 'system' : 'user';

  // Keep a ref to the latest preference for debounced persistence
  const latestPreferenceRef = useRef(preference);
  useEffect(() => {
    latestPreferenceRef.current = preference;
  }, [preference]);

  // Apply theme to DOM whenever resolved theme changes
  useEffect(() => {
    applyThemeToDOM(resolved);
  }, [resolved]);

  // Listen for OS color scheme changes
  useEffect(() => {
    const mq = window.matchMedia(DARK_MQ);
    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Listen for cross-tab storage changes
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== STORAGE_KEY) return;
      // null means key was removed → 'system'
      const newPref = e.newValue === 'light' || e.newValue === 'dark'
        ? e.newValue
        : 'system';
      setPreferenceState(newPref);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Debounce ref for persistence
  const debounceRef = useRef(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Toggle between light and dark.
   * Debounced: rapid clicks within 80ms only apply the final state.
   * UI updates immediately via setState; only persistence is debounced.
   */
  const toggleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      const currentResolved = prev === 'system' ? systemTheme : prev;
      return currentResolved === 'dark' ? 'light' : 'dark';
    });
    // Debounce only the persistence, not the UI update
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      writeStoredPreference(latestPreferenceRef.current);
      debounceRef.current = null;
    }, 80);
  }, [systemTheme]);

  /**
   * Set an explicit preference ('light', 'dark', or 'system').
   * Persists immediately (no debounce).
   */
  const setPreference = useCallback((newPref) => {
    if (newPref !== 'light' && newPref !== 'dark' && newPref !== 'system') {
      console.warn(`useTheme: invalid preference "${newPref}", ignoring.`);
      return;
    }
    setPreferenceState(newPref);
    writeStoredPreference(newPref);
  }, []);

  return {
    preference,
    resolved,
    source,
    toggleTheme,
    setPreference,
  };
}

export default useTheme;
