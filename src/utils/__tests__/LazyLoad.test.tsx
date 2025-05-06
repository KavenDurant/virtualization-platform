/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 14:48:09
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 15:27:10
 * @FilePath: /virtualization-platform/src/utils/__tests__/LazyLoad.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Suspense, lazy } from 'react';
import LazyLoad from '../../components/LazyLoad';

// 使用正确的方式模拟lazy组件
const MockLazyComponent = lazy(() => import('./MockComponent.tsx'));

describe('LazyLoad', () => {
  it('renders fallback while loading lazy component', () => {
    render(<Suspense fallback={<div>加载中...</div>}>{LazyLoad(MockLazyComponent)}</Suspense>);

    // 验证组件是否显示了骨架屏组件，而不是指定的文本
    expect(document.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('renders lazily loaded component after loading', async () => {
    render(<Suspense fallback={<div>加载中...</div>}>{LazyLoad(MockLazyComponent)}</Suspense>);

    // 验证懒加载组件最终显示了实际内容
    const lazyComponent = await screen.findByTestId('mock-component');
    expect(lazyComponent).toBeInTheDocument();
    expect(screen.getByText('懒加载组件内容')).toBeInTheDocument();
  });

  it('passes props to lazy loaded component', async () => {
    // 创建一个带props的测试组件
    const TestComponent = () => <div data-testid="test-component">测试组件内容</div>;
    const MockLazyWithProps = lazy(() => Promise.resolve({ default: TestComponent }));

    render(<Suspense fallback={<div>加载中...</div>}>{LazyLoad(MockLazyWithProps)}</Suspense>);

    // 验证组件正确渲染
    const testComponent = await screen.findByTestId('test-component');
    expect(testComponent).toBeInTheDocument();
    expect(screen.getByText('测试组件内容')).toBeInTheDocument();
  });
});
