/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-27 18:40:07
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-27 18:44:14
 * @FilePath: /virtualization-platform/src/utils/__tests__/contextMenuUtils.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  calculateMenuPosition,
  usePreventContextMenu,
  withPreventContextMenu,
} from '../contextMenuUtils';

describe('calculateMenuPosition', () => {
  it('returns correct position when menu fits in viewport', () => {
    const mockEvent = {
      clientX: 100,
      clientY: 100,
    } as MouseEvent;

    // 模拟窗口尺寸
    global.innerWidth = 1000;
    global.innerHeight = 1000;

    const result = calculateMenuPosition(mockEvent, 200, 200, 10);

    expect(result).toEqual({ x: 100, y: 100 });
  });

  it('adjusts position when menu would overflow viewport', () => {
    const mockEvent = {
      clientX: 900,
      clientY: 900,
    } as MouseEvent;

    // 模拟窗口尺寸
    global.innerWidth = 1000;
    global.innerHeight = 1000;

    const result = calculateMenuPosition(mockEvent, 200, 200, 10);

    // 应该调整位置以避免溢出
    expect(result.x).toBeLessThan(mockEvent.clientX);
    expect(result.y).toBeLessThan(mockEvent.clientY);
  });
});

describe('usePreventContextMenu', () => {
  it('returns an object with onContextMenu handler', () => {
    // 创建一个测试组件
    const TestComponent = () => {
      const contextMenuHandler = usePreventContextMenu();
      // 验证返回的是一个带有onContextMenu函数的对象
      expect(contextMenuHandler).toHaveProperty('onContextMenu');
      expect(typeof contextMenuHandler.onContextMenu).toBe('function');
      return <div>Test</div>;
    };

    render(<TestComponent />);
  });
});

describe('withPreventContextMenu', () => {
  it('wraps component and passes onContextMenu prop', () => {
    // 创建一个简单组件
    const SimpleComponent = (props: React.HTMLAttributes<HTMLDivElement>) => {
      // 验证props中包含onContextMenu函数
      expect(props.onContextMenu).toBeDefined();
      expect(typeof props.onContextMenu).toBe('function');
      return <div data-testid="simple" {...props} />;
    };

    // 使用HOC包装
    const WrappedComponent = withPreventContextMenu(SimpleComponent);

    render(<WrappedComponent />);
  });
});
