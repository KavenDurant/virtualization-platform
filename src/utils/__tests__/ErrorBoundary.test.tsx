/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 14:47:20
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 14:58:42
 * @FilePath: /virtualization-platform/src/utils/__tests__/ErrorBoundary.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// 创建一个会抛出错误的组件
const ErrorComponent = () => {
  throw new Error('测试错误');
};

// 模拟控制台错误方法，避免测试输出错误日志
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

// 修复 afterEach 函数，移除未使用的参数
afterEach(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">正常显示的内容</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('正常显示的内容')).toBeInTheDocument();
  });

  it('renders fallback UI when child component throws error', () => {
    // 使用 spyOn 来绕过 React 的错误边界测试限制
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // 检查是否显示了错误提示
    expect(screen.getByText(/出错了/i)).toBeInTheDocument();
    expect(screen.getByText(/请尝试刷新页面/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  it('shows details when user clicks "显示详情"', async () => {
    // 使用 spyOn 来绕过 React 的错误边界测试限制
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    // 点击"显示详情"按钮
    const showDetailsButton = screen.getByText('显示详情');
    await showDetailsButton.click();

    // 验证显示了错误详情
    expect(screen.getByText(/错误详情/i)).toBeInTheDocument();
    expect(screen.getByText(/测试错误/i)).toBeInTheDocument();

    spy.mockRestore();
  });
});
// This function definition should be removed entirely since afterEach
// is already imported from vitest at the top of the file
