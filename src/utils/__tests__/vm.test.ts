import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vmService from '../../services/vm';
import http from '../../services/http';
import { message } from 'antd';

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

describe('VM Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getVirtualMachines', () => {
    it('should return virtual machines when API call is successful', async () => {
      const mockVMs = [
        {
          id: '1',
          name: 'Web服务器-01',
          status: 'running',
          cpu: 2,
          memory: 4,
          disk: 50,
          os: 'Ubuntu 22.04',
          ipAddress: '192.168.122.101',
          createdAt: '2025-01-15 09:30:00',
        },
      ];

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockVMs);

      const result = await vmService.getVirtualMachines();

      expect(http.get).toHaveBeenCalledWith('/vm');
      expect(result).toEqual(mockVMs);
    });

    it('should return empty array and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('VM error'));

      const result = await vmService.getVirtualMachines();

      expect(http.get).toHaveBeenCalledWith('/vm');
      expect(message.error).toHaveBeenCalledWith('获取虚拟机列表失败');
      expect(result).toEqual([]);
    });
  });

  describe('getVirtualMachineDetails', () => {
    it('should return VM details when API call is successful', async () => {
      const vmId = '1';
      const mockVM = {
        id: '1',
        name: 'Web服务器-01',
        status: 'running',
        cpu: 2,
        memory: 4,
        disk: 50,
        os: 'Ubuntu 22.04',
        ipAddress: '192.168.122.101',
        createdAt: '2025-01-15 09:30:00',
        description: '网站前端服务器',
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockVM);

      const result = await vmService.getVirtualMachineDetails(vmId);

      expect(http.get).toHaveBeenCalledWith(`/vm/${vmId}`);
      expect(result).toEqual(mockVM);
    });

    it('should return null and show error message when API call fails', async () => {
      const vmId = '1';

      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('VM error'));

      const result = await vmService.getVirtualMachineDetails(vmId);

      expect(http.get).toHaveBeenCalledWith(`/vm/${vmId}`);
      expect(message.error).toHaveBeenCalledWith('获取虚拟机详情失败');
      expect(result).toBeNull();
    });
  });

  describe('createVirtualMachine', () => {
    it('should return created VM and show success message when API call is successful', async () => {
      const mockParams = {
        name: '测试服务器',
        cpu: 2,
        memory: 4,
        disk: 50,
        os: 'Ubuntu 22.04',
      };

      const mockResponse = {
        id: '123',
        name: '测试服务器',
        status: 'stopped',
        cpu: 2,
        memory: 4,
        disk: 50,
        os: 'Ubuntu 22.04',
        ipAddress: '',
        createdAt: '2025-04-28 10:00:00',
      };

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await vmService.createVirtualMachine(mockParams);

      expect(http.post).toHaveBeenCalledWith('/vm', mockParams);
      expect(message.success).toHaveBeenCalledWith('创建虚拟机成功');
      expect(result).toEqual(mockResponse);
    });

    it('should return null and show error message when API call fails', async () => {
      const mockParams = {
        name: '测试服务器',
        cpu: 2,
        memory: 4,
        disk: 50,
        os: 'Ubuntu 22.04',
      };

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('VM error'));

      const result = await vmService.createVirtualMachine(mockParams);

      expect(http.post).toHaveBeenCalledWith('/vm', mockParams);
      expect(message.error).toHaveBeenCalledWith('创建虚拟机失败');
      expect(result).toBeNull();
    });
  });

  describe('startVirtualMachine', () => {
    it('should return true and show success message when API call is successful', async () => {
      const vmId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await vmService.startVirtualMachine(vmId);

      expect(http.post).toHaveBeenCalledWith(`/vm/${vmId}/start`);
      expect(message.success).toHaveBeenCalledWith('启动虚拟机成功');
      expect(result).toBe(true);
    });

    it('should return false and show error message when API call fails', async () => {
      const vmId = '1';

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('VM error'));

      const result = await vmService.startVirtualMachine(vmId);

      expect(http.post).toHaveBeenCalledWith(`/vm/${vmId}/start`);
      expect(message.error).toHaveBeenCalledWith('启动虚拟机失败');
      expect(result).toBe(false);
    });
  });

  describe('stopVirtualMachine', () => {
    it('should return true and show success message when API call is successful', async () => {
      const vmId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await vmService.stopVirtualMachine(vmId);

      expect(http.post).toHaveBeenCalledWith(`/vm/${vmId}/stop`);
      expect(message.success).toHaveBeenCalledWith('停止虚拟机成功');
      expect(result).toBe(true);
    });

    it('should return false and show error message when API call fails', async () => {
      const vmId = '1';

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('VM error'));

      const result = await vmService.stopVirtualMachine(vmId);

      expect(http.post).toHaveBeenCalledWith(`/vm/${vmId}/stop`);
      expect(message.error).toHaveBeenCalledWith('停止虚拟机失败');
      expect(result).toBe(false);
    });
  });

  describe('restartVirtualMachine', () => {
    it('should return true and show success message when API call is successful', async () => {
      const vmId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await vmService.restartVirtualMachine(vmId);

      expect(http.post).toHaveBeenCalledWith(`/vm/${vmId}/restart`);
      expect(message.success).toHaveBeenCalledWith('重启虚拟机成功');
      expect(result).toBe(true);
    });
  });

  describe('deleteVirtualMachine', () => {
    it('should return true and show success message when API call is successful', async () => {
      const vmId = '1';

      // 模拟成功响应
      vi.mocked(http.delete).mockResolvedValue({});

      const result = await vmService.deleteVirtualMachine(vmId);

      expect(http.delete).toHaveBeenCalledWith(`/vm/${vmId}`);
      expect(message.success).toHaveBeenCalledWith('删除虚拟机成功');
      expect(result).toBe(true);
    });
  });
});
