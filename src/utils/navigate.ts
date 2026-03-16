/**
 * 轻量客户端路由工具
 * 使用 History API 实现 SPA 页面跳转，无需 react-router-dom。
 */

const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // e.g. '/react-vite-starter'

/**
 * 跳转到应用内路由（如 '/test'）
 * 会触发 popstate 事件，驱动 App 内的路由状态更新。
 */
export function navigate(to: string): void {
  const fullPath = base + to;
  window.history.pushState({}, '', fullPath);
  // 手动派发 popstate，让监听器捕获到变化
  window.dispatchEvent(new PopStateEvent('popstate', { state: {} }));
}

/**
 * 获取当前应用内路由（去掉 base 前缀后的路径）
 */
export function getCurrentRoute(): string {
  const path = window.location.pathname;
  const route = path.replace(base, '');
  return route || '/';
}
