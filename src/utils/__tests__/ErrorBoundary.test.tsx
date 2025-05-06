/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 14:47:20
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 14:58:42
 * @FilePath: /virtualization-platform/src/utils/__tests__/ErrorBoundary.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    expect(screen.getByText(/组件出现错误/i)).toBeInTheDocument();
    expect(screen.getByText(/测试错误/i)).toBeInTheDocument();

    spy.mockRestore();
  });

  it('resets error state when clicking "重 试" button', async () => {
    // 使用一个状态变量来控制是否抛出错误
    let shouldThrowError = true;
    const TestComponent = () => {
      if (shouldThrowError) {
        throw new Error('测试错误');
      }
      return <div data-testid="recovered">已恢复的内容</div>;
    };

    // 使用 spyOn 来绕过 React 的错误边界测试限制
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    const { rerender } = render(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // 确认错误UI已显示
    expect(screen.getByText(/组件出现错误/i)).toBeInTheDocument();
    expect(screen.getByText(/测试错误/i)).toBeInTheDocument();

    // 点击"重 试"按钮（注意：Ant Design 按钮文本中有空格）
    const retryButton = screen.getByText('重 试');

    // 在点击之前，更改状态使组件不再抛出错误
    shouldThrowError = false;

    // 触发按钮点击
    fireEvent.click(retryButton);

    // 重新渲染，以反映状态变化
    rerender(
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );

    // 验证组件已恢复正常渲染
    expect(screen.getByTestId('recovered')).toBeInTheDocument();
    expect(screen.getByText('已恢复的内容')).toBeInTheDocument();

    spy.mockRestore();
  });
});
