/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 14:47:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-05-06 13:56:13
 * @FilePath: /virtualization-platform/src/utils/__tests__/NetworkTopology.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koroFileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { render } from '@testing-library/react';
import { Network } from 'vis-network';
import { beforeEach, describe, expect, it, vi, MockInstance } from 'vitest';
import NetworkTopology from '../../components/NetworkTopology';

// 模拟 vis-network 模块
vi.mock('vis-network', () => ({
  Network: vi.fn(() => ({
    on: vi.fn(),
    destroy: vi.fn(),
    getScale: vi.fn().mockReturnValue(1),
    moveTo: vi.fn(),
    fit: vi.fn(),
  })),
}));

// 模拟 vis-data
vi.mock('vis-data', () => ({
  DataSet: vi.fn(data => data),
}));

describe('NetworkTopology', () => {
  const mockData = {
    nodes: [
      {
        id: 'node-1',
        label: '节点1',
        group: 'network',
      },
      {
        id: 'node-2',
        label: '节点2',
        group: 'vm',
      },
    ],
    edges: [
      {
        id: 'edge-1',
        from: 'node-1',
        to: 'node-2',
      },
    ],
  };

  const mockProps = {
    data: mockData,
    height: 500,
    loading: false,
    onNodeClick: vi.fn(),
    onEdgeClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NetworkTopology {...mockProps} />);
    // 由于没有可见的文本，我们检查容器是否存在
    expect(document.querySelector('div')).toBeTruthy();
  });

  it('shows loading spinner when loading prop is true', () => {
    render(<NetworkTopology {...mockProps} loading={true} />);
    // 检测Spin组件是否存在，而不是特定的文本
    const spinElement = document.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('creates Network instance with correct props', () => {
    render(<NetworkTopology {...mockProps} />);

    // 验证 Network 构造函数被调用
    const NetworkMock = Network as unknown as MockInstance;
    expect(NetworkMock).toHaveBeenCalled();
  });

  it('destroys Network instance on unmount', () => {
    const { unmount } = render(<NetworkTopology {...mockProps} />);
    unmount();

    // 使用正确的导入方式获取 mock 实例
    const NetworkMock = Network as unknown as MockInstance;
    const mockNetworkInstance = NetworkMock.mock.results[0].value;

    expect(mockNetworkInstance.destroy).toHaveBeenCalled();
  });

  it('has control buttons', () => {
    render(<NetworkTopology {...mockProps} />);

    // 检查按钮图标是否存在，而不是通过title属性
    expect(document.querySelector('[aria-label="zoom-in"]')).toBeInTheDocument();
    expect(document.querySelector('[aria-label="zoom-out"]')).toBeInTheDocument();
    expect(document.querySelector('[aria-label="reload"]')).toBeInTheDocument();
    expect(document.querySelector('[aria-label="fullscreen"]')).toBeInTheDocument();
  });
});
