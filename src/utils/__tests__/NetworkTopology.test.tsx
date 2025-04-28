/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 14:47:00
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 16:20:54
 * @FilePath: /virtualization-platform/src/utils/__tests__/NetworkTopology.test.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import NetworkTopology from '../../components/NetworkTopology';
import { Network } from 'vis-network';

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
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('creates Network instance with correct props', () => {
    render(<NetworkTopology {...mockProps} />);

    // 验证 Network 构造函数被调用
    const NetworkMock = Network as jest.MockedFunction<typeof Network>;
    expect(NetworkMock).toHaveBeenCalled();
  });

  it('destroys Network instance on unmount', () => {
    const { unmount } = render(<NetworkTopology {...mockProps} />);
    unmount();

    // 使用正确的导入方式获取 mock 实例
    const NetworkMock = Network as jest.MockedFunction<typeof Network>;
    const mockNetworkInstance = NetworkMock.mock.results[0].value;

    expect(mockNetworkInstance.destroy).toHaveBeenCalled();
  });

  it('has control buttons', () => {
    render(<NetworkTopology {...mockProps} />);

    // 检查四个控制按钮是否存在（使用他们的工具提示文本）
    expect(screen.getByTitle('放大')).toBeInTheDocument();
    expect(screen.getByTitle('缩小')).toBeInTheDocument();
    expect(screen.getByTitle('重置视图')).toBeInTheDocument();
    expect(screen.getByTitle('全屏')).toBeInTheDocument();
  });
});
