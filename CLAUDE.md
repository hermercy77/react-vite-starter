# CLAUDE.md

## Project Overview

This is a React front-end project implementing a complete dark mode toggle feature with theme management.

## Tech Stack

- React (JSX)
- CSS Custom Properties (Design Tokens)
- Vanilla CSS (no CSS-in-JS)

## Project Structure

```
index.html                      # Entry HTML with inline FOUC-prevention script
src/
  main.jsx                      # React entry point
  index.css                     # Global styles & CSS custom properties (light/dark tokens)
  App.jsx                       # Root component, integrates Header and useTheme
  App.css
  hooks/
    useTheme.js                 # Core theme management hook (light/dark/system tri-state)
  components/
    Header.jsx + Header.css     # Sticky top bar with glassmorphism effect
    ThemeToggle.jsx + ThemeToggle.css  # Theme toggle button (☀️/🌙/💻)
```

## Architecture & Key Concepts

### Theme System (Tri-State: light / dark / system)

- **FOUC Prevention**: `index.html` contains a synchronous inline script that reads `localStorage` and system preference to set `<html>` class (`light` or `dark`) before first paint.
- **CSS Tokens**: All colors are driven by CSS custom properties under `html.light` and `html.dark` selectors. Contrast ratios meet WCAG AA (≥ 4.5:1).
- **`useTheme` Hook** (`src/hooks/useTheme.js`):
  - Initialization priority: `localStorage` → system preference → default `light`
  - Persists to `localStorage` with graceful degradation
  - Listens to `prefers-color-scheme` media query changes (active only in `system` mode)
  - Cross-tab sync via `storage` event
  - 300ms debounce to prevent rapid toggle clicks

### Components

- **ThemeToggle**: Displays ☀️ (light) / 🌙 (dark) / 💻 (system) icons. Shows "auto" badge in system mode. Full `aria-label`, keyboard support (Enter/Space), and `focus-visible` styling.
- **Header**: Sticky top bar with backdrop-filter glassmorphism effect; hosts ThemeToggle on the right.

## Development Notes

- Theme preference key in localStorage: check `useTheme.js` for the exact key name.
- To add new theme-aware colors, define custom properties under both `html.light` and `html.dark` in `src/index.css`.
- The inline script in `index.html` must stay synchronous (`<script>`, not `<script defer>`) to prevent theme flash.