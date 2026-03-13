# CLAUDE.md

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
  pages/
    Home.tsx
    Home.module.css
  types/          # Type declarations for untyped libraries
  index.css       # Global styles
```

## Tech Stack

- React + TypeScript
- react-router-dom
- CSS Modules
- TypeScript migration in progress — all new files must use `.tsx`

## Routing Rules

- Use `useNavigate` hook or `<Link>` component for navigation
- **Do NOT use `window.location.href`** for internal navigation

```tsx
// ✅ Correct
import { useNavigate, Link } from 'react-router-dom';
const navigate = useNavigate();
navigate('/path');
<Link to="/path">Click</Link>

// ❌ Wrong
window.location.href = '/path';
```

## Style Rules

- Use CSS Modules for component styles (`.module.css`)
- Global styles go in `index.css`
- CSS Modules class names: camelCase
- Font-family declaration must use the following stack:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
  'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji';
```

## Animation Rules

- Use `will-change` only on elements that are actively animating; remove after animation completes
- Use `animationend` event to clean up animation classes/properties
- Exception: `:hover` transitions do not require `will-change` cleanup

## Accessibility Rules

- Do NOT use `<a role="button">` — use `<button>` instead
- Do NOT add duplicate `aria-label` attributes on the same element
- All interactive elements must be keyboard accessible (`Tab`, `Enter`, `Space`)

## TypeScript Rules

- All new files must use `.tsx` extension
- **Prohibit `any`** — use proper types or `unknown`
- **Prohibit `@ts-ignore`** — fix the underlying type issue instead
- Use `interface` (not `type`) for component props
- Place type declarations for untyped third-party libraries in `src/types/`