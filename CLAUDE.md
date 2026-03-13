# CLAUDE.md

## Project Structure

- `src/App.jsx` — 主应用组件，采用 flexbox 布局（`min-height: 100vh`），确保 footer 在内容不足时沉底
- `src/App.css` — App 组件样式
- `src/index.css` — 全局样式及 design tokens（含 `--color-text-secondary`、`--color-border`，支持 light/dark 双主题）
- `src/components/Footer.jsx` — Footer 组件，语义化 `<footer>` 标签（`role="contentinfo"`），动态显示当前年份版权声明
- `src/components/Footer.css` — Footer 样式，使用 CSS 自定义属性，满足 WCAG AA 对比度，含移动端媒体查询适配

## Design Tokens

全局 CSS 自定义属性定义在 `src/index.css`，支持 light/dark 双主题：

- `--color-text-secondary`
- `--color-border`

组件样式应使用这些 token，不硬编码颜色值。

## Conventions

- 年份等动态值通过 JS 运行时获取（如 `new Date().getFullYear()`），不硬编码
- 语义化 HTML 标签 + ARIA role 确保无障碍访问
- 样式需满足 WCAG AA 对比度要求
- 移动端通过媒体查询适配