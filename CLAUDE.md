# CLAUDE.md

## Project Overview

This is a React front-end project with a complete dark mode toggle feature.

## Tech Stack

- React (with JSX)
- CSS Custom Properties (Design Tokens) for theming
- Vite (entry point: `index.html` → `src/main.jsx`)

## Project Structure

```
index.html                  # HTML entry, includes inline script to prevent FOUC
src/
  main.jsx                  # React entry point
  index.css                 # Global CSS reset, design tokens (light/dark color schemes, WCAG AA compliant)
  App.jsx                   # Root component, integrates useTheme + Header
  App.css
  hooks/
    useTheme.js             # Core theme hook — manages light/dark/system preference
  components/
    Header.jsx + .css       # Sticky nav bar with glassmorphism effect, hosts ThemeToggle
    ThemeToggle.jsx + .css  # Accessible toggle button (🌙/☀️) with transition animation
```

## Key Conventions

### Theme System

- **Storage key:** `theme-preference` (stored in `localStorage`)
- **Three-state preference:** `light` | `dark` | `system`
- **Resolved theme** (applied to `<html>` class): `light` or `dark`
- **Initialization priority:** `localStorage` → system preference → `light` (default)
- **FOUC prevention:** Synchronous inline script in `<head>` reads `localStorage` and sets `<html>` class before first paint
- **Cross-tab sync:** Listens to `storage` event to keep tabs in sync
- **Debounced toggle:** 80ms debounce to prevent rapid-click flicker
- **Graceful degradation:** Falls back silently if `localStorage` is unavailable

### Accessibility

- All color contrast ratios meet WCAG AA (≥4.5:1)
- `ThemeToggle` uses dynamic `aria-label` for screen readers
- Keyboard operable (native `<button>` supports Enter/Space)

### CSS Architecture

- Design tokens defined as CSS custom properties on `.light` / `.dark` classes
- Global reset and base styles in `src/index.css`
- Component-scoped CSS files co-located with components