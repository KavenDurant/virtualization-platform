/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-27 18:39:19
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 15:28:51
 * @FilePath: /virtualization-platform/src/test/setup.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 模拟 window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // 已弃用
    removeListener: vi.fn(), // 已弃用
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 此外，许多 UI 组件在测试环境中使用 ResizeObserver，也需要模拟
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
