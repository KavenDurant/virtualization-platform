import { message } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import http from '../../services/http';
import * as networkService from '../../services/network';

// 模拟依赖
vi.mock('../../services/http', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('antd', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Network Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNetworks', () => {
    it('should return networks when API call is successful', async () => {
      const mockNetworks = [
        {
          id: '1',
          name: '默认网络',
          type: 'nat',
          status: 'active',
          bridge: 'virbr0',
          subnet: '192.168.122.0/24',
          gateway: '192.168.122.1',
          dhcp: true,
          vmCount: 5,
          createdAt: '2023-01-15 09:30:00',
        },
      ];

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockNetworks);

      const result = await networkService.getNetworks();

      expect(http.get).toHaveBeenCalledWith('/network');
      expect(result).toEqual(mockNetworks);
    });

    it('should return empty array and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Network error'));

      const result = await networkService.getNetworks();

      expect(http.get).toHaveBeenCalledWith('/network');
      expect(message.error).toHaveBeenCalledWith('获取网络列表失败');
      expect(result).toEqual([]);
    });
  });

  describe('createNetwork', () => {
    it('should return created network and show success message when API call is successful', async () => {
      const mockParams = {
        name: '测试网络',
        type: 'bridge' as const,
      };

      const mockResponse = {
        id: '123',
        name: '测试网络',
        type: 'bridge',
        status: 'inactive',
        bridge: 'br0',
        subnet: '',
        gateway: '',
        dhcp: false,
        vmCount: 0,
        createdAt: '2025-04-28 10:00:00',
      };

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await networkService.createNetwork(mockParams);

      expect(http.post).toHaveBeenCalledWith('/network', mockParams);
      expect(message.success).toHaveBeenCalledWith('创建网络成功');
      expect(result).toEqual(mockResponse);
    });

    it('should return null and show error message when API call fails', async () => {
      const mockParams = {
        name: '测试网络',
        type: 'bridge' as const,
      };

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('Network error'));

      const result = await networkService.createNetwork(mockParams);

      expect(http.post).toHaveBeenCalledWith('/network', mockParams);
      expect(message.error).toHaveBeenCalledWith('创建网络失败');
      expect(result).toBeNull();
    });
  });

  describe('updateNetwork', () => {
    it('should return true and show success message when API call is successful', async () => {
      const mockParams = {
        id: '123',
        name: '更新的网络',
      };

      // 模拟成功响应
      vi.mocked(http.put).mockResolvedValue({});

      const result = await networkService.updateNetwork(mockParams);

      expect(http.put).toHaveBeenCalledWith(`/network/${mockParams.id}`, mockParams);
      expect(message.success).toHaveBeenCalledWith('更新网络成功');
      expect(result).toBe(true);
    });

    it('should return false and show error message when API call fails', async () => {
      const mockParams = {
        id: '123',
        name: '更新的网络',
      };

      // 模拟失败响应
      vi.mocked(http.put).mockRejectedValue(new Error('Network error'));

      const result = await networkService.updateNetwork(mockParams);

      expect(http.put).toHaveBeenCalledWith(`/network/${mockParams.id}`, mockParams);
      expect(message.error).toHaveBeenCalledWith('更新网络失败');
      expect(result).toBe(false);
    });
  });

  // 网络拓扑图数据相关测试
  describe('getNetworkTopology', () => {
    it('should return topology data when API call is successful', async () => {
      const mockResponse = {
        nodes: [{ id: 'node-1', label: '节点1', group: 'network' }],
        edges: [{ id: 'edge-1', from: 'node-1', to: 'node-2' }],
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockResponse);

      const result = await networkService.getNetworkTopology();

      expect(http.get).toHaveBeenCalledWith('/api/network/topology', { params: undefined });
      expect(result).toEqual(mockResponse);
    });

    it('should return null and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Network error'));

      const result = await networkService.getNetworkTopology();

      expect(http.get).toHaveBeenCalledWith('/api/network/topology', { params: undefined });
      expect(message.error).toHaveBeenCalledWith('获取网络拓扑图数据失败');
      expect(result).toBeNull();
    });
  });

  describe('transformTopologyData', () => {
    it('should transform backend data to frontend format correctly', () => {
      const mockBackendData = {
        nodes: [
          {
            id: 'network-1',
            label: '默认网络',
            group: 'network',
            metadata: {
              networkType: 'nat',
              subnet: '192.168.122.0/24',
              status: 'active',
            },
          },
        ],
        edges: [
          {
            id: 'edge-1',
            from: 'vm-1',
            to: 'network-1',
            status: 'up',
            metadata: {
              interfaceName: 'eth0',
              ipAddress: '192.168.122.100',
            },
          },
        ],
      };

      const result = networkService.transformTopologyData(mockBackendData);

      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result.nodes[0]).toHaveProperty('id', 'network-1');
      expect(result.nodes[0]).toHaveProperty('label', '默认网络');
      expect(result.edges[0]).toHaveProperty('id', 'edge-1');
      expect(result.edges[0]).toHaveProperty('from', 'vm-1');
      expect(result.edges[0]).toHaveProperty('to', 'network-1');
      expect(result.edges[0]).toHaveProperty('dashes', false); // status: 'up'
    });

    it('should return empty arrays when input is null', () => {
      const result = networkService.transformTopologyData(null);

      expect(result).toEqual({ nodes: [], edges: [] });
    });
  });
});
