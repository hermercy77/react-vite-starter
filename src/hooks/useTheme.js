import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'theme-preference';
const VALID_PREFERENCES = ['light', 'dark', 'system'];

/**
 * Safely read from localStorage.
 */
function readStoredPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_PREFERENCES.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage unavailable — graceful degradation
  }
  return null;
}

/**
 * Safely write to localStorage.
 */
function writeStoredPreference(value) {
  try {
    if (value === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // localStorage unavailable — graceful degradation
  }
}

/**
 * Get the system's current color scheme preference.
 */
function getSystemTheme() {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }
  return 'light';
}

/**
 * Resolve the actual theme to apply from a preference value.
 */
function resolveTheme(preference) {
  if (preference === 'light' || preference === 'dark') {
    return preference;
  }
  return getSystemTheme();
}

/**
 * Apply the resolved theme to the <html> element.
 */
function applyTheme(resolved) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

/**
 * useTheme — manages theme state with persistence, system detection,
 * cross-tab sync, and debounced toggling.
 *
 * Returns { preference, resolved, source, toggleTheme, setPreference }
 */
export function useTheme() {
  const [preference, setPreferenceState] = useState(() => {
    return readStoredPreference() || 'system';
  });

  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolved = preference === 'system' ? systemTheme : preference;
  const source = preference === 'system' ? 'system' : 'user';

  // Debounce ref to prevent rapid toggle jitter
  const debounceRef = useRef(null);
  const pendingResolvedRef = useRef(resolved);

  // Keep pendingResolvedRef in sync
  useEffect(() => {
    pendingResolvedRef.current = resolved;
  }, [resolved]);

  // Apply theme to DOM whenever resolved changes
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // Listen for system theme changes
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Cross-tab sync via storage event
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue && VALID_PREFERENCES.includes(e.newValue)) {
          setPreferenceState(e.newValue);
        } else {
          // Key was removed or invalid — revert to system
          setPreferenceState('system');
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  /**
   * Set preference explicitly.
   */
  const setPreference = useCallback((newPref) => {
    if (!VALID_PREFERENCES.includes(newPref)) return;
    setPreferenceState(newPref);
    writeStoredPreference(newPref);
  }, []);

  /**
   * Toggle between light and dark.
   * Debounced: rapid clicks within 300ms only apply the final state.
   */
  const toggleTheme = useCallback(() => {
    // Calculate next resolved based on current pending
    const currentResolved = pendingResolvedRef.current;
    const nextResolved = currentResolved === 'dark' ? 'light' : 'dark';
    pendingResolvedRef.current = nextResolved;

    // Clear any pending debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      const finalTheme = pendingResolvedRef.current;
      setPreferenceState(finalTheme);
      writeStoredPreference(finalTheme);
      debounceRef.current = null;
    }, 80);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    preference,
    resolved,
    source,
    toggleTheme,
    setPreference,
  };
}
