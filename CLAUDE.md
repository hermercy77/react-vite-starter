# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a React + Vite starter project with theme switching (light/dark mode) support.

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Architecture
- React 18 with functional components and hooks
- Vite as build tool
- CSS custom properties for theming
- BEM naming convention for CSS classes
- Component-based structure under `src/components/`

## Code Style
- Use functional components with hooks
- CSS custom properties (variables) for all theme-dependent colors
- BEM naming for CSS classes (e.g., `.footer__text`)
- Store user preferences in localStorage
- Mobile-first responsive design
