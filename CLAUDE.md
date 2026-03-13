# CLAUDE.md

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server (Vite) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build output locally |

---

## Project Overview

This is a React front-end project with a complete dark mode theming system.

---

## Tech Stack

- React (with JSX, migrating to TypeScript — see [TypeScript Rules](#typescript-rules) below)
- CSS Custom Properties (Design Tokens) for theming
- CSS Modules for component-scoped styles
- react-router-dom for client-side routing
- Vite (entry: `src/main.jsx`)

---

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
  pages/
    Home.tsx             # Home page component (landing page)
    Home.module.css      # Home page scoped styles (CSS Module)
  types/                 # TypeScript declaration files for untyped third-party libs
```

---

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

---

## Routing Rules

The project uses `react-router-dom` for all client-side navigation.

### Programmatic Navigation

Use `useNavigate()` from react-router-dom.

✅ Correct:
```tsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const handleClick = () => navigate('/dashboard');
  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

❌ Wrong:
```tsx
// NEVER use window.location.href for in-app navigation
window.location.href = '/dashboard';
```

### Declarative Navigation

Use `<Link>` from react-router-dom.

✅ Correct:
```tsx
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>
```

❌ Wrong:
```tsx
<a href="/about">About</a>  // Causes full page reload
```

> ⚠️ 禁止：Do **not** use `window.location.href` for any in-app navigation. It bypasses the React router, destroys client-side state, and causes a full page reload. External links (opening a third-party URL) are the only acceptable use of `window.location.href` or `<a href>`.

---

## Style Rules

### CSS Modules

Component-scoped styles use CSS Modules (`[ComponentName].module.css`).

✅ Correct:
```tsx
import styles from './MyComponent.module.css';

function MyComponent() {
  return <div className={styles.container}>Hello</div>;
}
```

❌ Wrong:
```tsx
// Do not import a plain .css file for component-specific styles
import './MyComponent.css';
```

**Naming convention:** The CSS Module file name must match the component file name.
- `Home.tsx` → `Home.module.css`
- `Header.tsx` → `Header.module.css`

> ⚠️ 禁止：Do **not** write global selectors inside `.module.css` files. If `:global` is absolutely necessary, add a comment explaining why.

### Global Styles

Global styles (CSS reset, CSS custom properties / design tokens, font declarations) belong exclusively in `src/index.css`.

- Do not add global styles in component files.
- All theme-dependent colors must reference CSS custom properties defined in `index.css`.

### Font Rules

`font-family` is declared **once** on the `body` selector in `src/index.css`.

Font stack:
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
}
```

> ⚠️ 禁止：Do **not** redeclare `font-family` in component-level styles (`.module.css` or otherwise). If a component genuinely needs a different font (e.g., monospace for a code block), add a comment explaining the reason:

```css
/* Override: code block requires monospace font */
.codeBlock {
  font-family: 'Fira Code', 'Courier New', monospace;
}
```

---

## Animation Rules

### `will-change` Usage

`will-change` promotes elements to their own compositor layer. Misuse wastes GPU memory.

**Rule: Remove `will-change` after one-shot animations finish.**

✅ Correct — remove via `animationend` event:
```tsx
function FadeIn({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = () => {
      el.style.willChange = 'auto';
    };
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, []);

  return <div ref={ref} style={{ willChange: 'transform, opacity' }}>{children}</div>;
}
```

❌ Wrong — permanent `will-change` on a static element:
```css
/* BAD: element is not continuously animating */
.card {
  will-change: transform;
}
```

> ⚠️ 禁止：Do **not** leave `will-change: transform` (or similar) permanently on static elements. It forces the browser to maintain a compositor layer indefinitely, increasing memory usage.

**Exception:** Continuous interaction animations (e.g., hover effects) may use `will-change` within the `:hover` pseudo-class — this is acceptable because the layer is only promoted during interaction:

```css
.button:hover {
  will-change: transform;
  transform: scale(1.05);
}
```

Whenever `will-change` is used, add a comment describing the animation scenario it supports.

---

## Accessibility Rules (a11y)

### Semantic HTML

> ⚠️ 禁止：Do **not** add `role="button"` to `<a>` elements. Choose the correct element based on semantics:

- **Action / command** → `<button>`
- **Navigation to a URL** → `<a href="...">`

✅ Correct:
```tsx
<button onClick={handleSave}>Save</button>
<a href="https://example.com">Visit Example</a>
```

❌ Wrong:
```tsx
<a role="button" onClick={handleSave}>Save</a>
```

### `aria-label` Usage

> ⚠️ 禁止：Do **not** set `aria-label` to the same text that is already visible on the element. Screen readers will read the content twice.

❌ Wrong:
```tsx
<button aria-label="Save">Save</button>
```

✅ Correct — icon-only button (no visible text, so `aria-label` is needed):
```tsx
<button aria-label="Close dialog" onClick={onClose}>
  <CloseIcon />
</button>
```

✅ Correct — button with visible text (no `aria-label` needed):
```tsx
<button onClick={onSave}>Save</button>
```

### Keyboard Accessibility

All interactive elements must be:
1. **Focusable** via `Tab` key
2. **Activatable** via `Enter` and/or `Space` key

Native `<button>` and `<a>` elements satisfy this by default. If you build a custom interactive component, ensure keyboard support is implemented and tested.

---

## TypeScript Rules

The project is migrating to TypeScript. **All new component files must use `.tsx` extension.**

### Strict Typing

> ⚠️ 禁止：Do **not** use `any` type. Use `unknown` with type guards instead.

✅ Correct:
```tsx
function processValue(value: unknown): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return String(value);
}
```

❌ Wrong:
```tsx
function processValue(value: any): string {
  return value.toUpperCase(); // unsafe, no type checking
}
```

### Props Typing

Define component props using `interface` and export it:

```tsx
export interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
```

### `@ts-ignore` / `@ts-expect-error`

> ⚠️ 禁止：Do **not** use `// @ts-ignore`. If type suppression is truly necessary, use `// @ts-expect-error` with a reason comment:

```tsx
// @ts-expect-error — library v3 types are missing the `onResize` callback
thirdPartyComponent.onResize = handler;
```

### Third-Party Type Declarations

When a third-party library lacks type definitions, create a declaration file in `src/types/` rather than using `any`:

```ts
// src/types/untyped-lib.d.ts
declare module 'untyped-lib' {
  export function doSomething(input: string): number;
}
```
