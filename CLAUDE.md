# CLAUDE.md

## 项目简介

React + Vite 前端启动模板，提供开箱即用的现代化 React 开发环境，适合作为新项目的基础脚手架。

## 技术栈

- **React 18** — UI 框架
- **Vite 5** — 构建工具与开发服务器
- **@vitejs/plugin-react** — Vite 的 React 支持插件
- **ES Module** — 模块化方案

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动开发服务器（默认 localhost:3000） |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 本地预览生产构建 |

## 目录结构

```
react-vite-starter/
├── .github/workflows/   # CI/CD 工作流配置
├── src/
│   ├── components/      # 可复用组件
│   ├── pages/           # 页面级组件
│   ├── main.jsx         # React 挂载入口
│   ├── App.jsx          # 根组件
│   ├── App.css          # 根组件样式
│   └── index.css        # 全局样式
├── index.html           # HTML 入口文件
├── vite.config.js       # Vite 配置文件
└── package.json         # 项目依赖与脚本
```

## 关键文件说明

- **index.html** — 应用的 HTML 入口，Vite 以此为起点进行模块解析和打包。
- **vite.config.js** — Vite 构建配置，包含插件注册、开发服务器端口等设置。
- **src/main.jsx** — React 应用挂载点，将根组件渲染到 DOM。
- **src/App.jsx** — 应用根组件，所有页面和组件从此处组织。
- **src/components/** — 存放可复用的 UI 组件。
- **src/pages/** — 存放页面级组件，便于后续接入路由。
- **.github/workflows/** — GitHub Actions 自动化工作流配置。

## 注意事项

- 项目使用 ES Module（`"type": "module"`），所有配置文件需遵循 ESM 语法。
- 无内置测试框架和路由，可按需添加 `vitest`、`react-router-dom` 等依赖。