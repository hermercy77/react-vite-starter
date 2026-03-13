# CLAUDE.md

## Project Overview

React 项目，实现了完整的深色模式（Dark Mode）切换功能。

## Tech Stack

- React (JSX)
- CSS Custom Properties (Design Tokens)
- Vite (入口文件为 `src/main.jsx`)

## Project Structure

```
index.html                      # HTML 入口，含防 FOUC 内联脚本
src/
  main.jsx                      # 应用入口，导入全局样式
  App.jsx / App.css             # 根组件，集成 Header 和 useTheme
  index.css                     # 全局样式 & CSS Custom Properties（light/dark 两套色值，WCAG AA）
  hooks/
    useTheme.js                 # 主题管理 Hook（localStorage、系统偏好、跨标签页同步、防抖）
  components/
    Header.jsx / Header.css     # 粘性顶部导航栏，右侧放置主题切换按钮
    ThemeToggle.jsx / ThemeToggle.css  # 主题切换按钮（无障碍：aria-label、键盘操作、focus-visible）
```

## Key Patterns

### 主题管理 (`useTheme.js`)

- **初始化优先级**：localStorage → 系统偏好（`prefers-color-scheme`）→ 默认 light
- **localStorage** 读写带 try/catch 静默降级
- **系统偏好跟随**：仅在用户未手动设置时实时响应系统主题变化
- **跨标签页同步**：通过 `storage` 事件监听
- **防抖**：300ms，防止快速连续点击导致闪烁

### 防 FOUC（Flash of Unstyled Content）

`index.html` 的 `<head>` 中包含同步内联脚本，在 React 渲染前读取 localStorage / 系统偏好并设置 `<html>` class。

### 无障碍（Accessibility）

- 所有颜色满足 WCAG AA 对比度要求（≥ 4.5:1）
- ThemeToggle 支持动态 `aria-label`、键盘操作（Enter / Space）、`focus-visible` 样式