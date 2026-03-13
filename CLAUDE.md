# CLAUDE.md

## Project Overview

This is a React front-end project with a complete dark mode theming system.

## Tech Stack

- React (with JSX)
- CSS Custom Properties (Design Tokens) for theming
- Vite (entry: `src/main.jsx`)

## Project Structure

```
index.html              # HTML entry, includes inline script to prevent FOUC
src/
  main.jsx              # App entry point, imports index.css
  App.jsx               # Root component, integrates Header and useTheme
  App.css
  index.css             # Global CSS custom properties (design tokens) for light/dark themes
  hooks/
    useTheme.js          # Theme management hook
  components/
    Header.jsx + .css    # Sticky header with title and theme toggle
    ThemeToggle.jsx + .css  # 🌙/☀️ icon button for theme switching
```

## Theming System

### How It Works

- Theme is controlled by toggling `light` / `dark` class on the `<html>` element.
- CSS custom properties defined in `src/index.css` (`:root`/`html.light` for light, `html.dark` for dark) drive all colors globally.
- Color contrast meets WCAG AA standard (≥ 4.5:1).

### Theme Initialization Priority

1. `localStorage` key: `theme-preference`
2. System `prefers-color-scheme`
3. Default: `light`

### FOUC Prevention

`index.html` contains a synchronous inline `<script>` in `<head>` that reads localStorage / system preference and sets the `<html>` class **before first render**.

### `useTheme` Hook (`src/hooks/useTheme.js`)

- Manages theme state with the priority above.
- Persists to `localStorage` (with graceful degradation if storage is disabled).
- Follows system theme changes in real time when user has not manually set a preference.
- Syncs across multiple tabs via `storage` event listener.

### ThemeToggle Component

- Displays 🌙 (dark) / ☀️ (light) icon.
- `aria-label` updates with current state for accessibility.
- Supports keyboard activation (Enter / Space).

### Key Conventions

- localStorage key: `theme-preference`
- Theme switch response time: < 100ms
- All theme-dependent styling must use CSS custom properties from `src/index.css`.