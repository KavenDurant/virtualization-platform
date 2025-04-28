import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as storageService from '../../services/storage';
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

describe('Storage Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStoragePools', () => {
    it('should return storage pools when API call is successful', async () => {
      const mockStoragePools = [
        {
          id: '1',
          name: '默认存储池',
          type: 'dir',
          status: 'active',
          capacity: 500,
          available: 300,
          used: 200,
          path: '/var/lib/libvirt/images',
          createdAt: '2025-01-15 09:30:00',
        },
      ];

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockStoragePools);

      const result = await storageService.getStoragePools();

      expect(http.get).toHaveBeenCalledWith('/storage/pools');
      expect(result).toEqual(mockStoragePools);
    });

    it('should return empty array and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Storage error'));

      const result = await storageService.getStoragePools();

      expect(http.get).toHaveBeenCalledWith('/storage/pools');
      expect(message.error).toHaveBeenCalledWith('获取存储池列表失败');
      expect(result).toEqual([]);
    });
  });

  describe('getStoragePoolDetails', () => {
    it('should return storage pool details when API call is successful', async () => {
      const poolId = '1';
      const mockPool = {
        id: '1',
        name: '默认存储池',
        type: 'dir',
        status: 'active',
        capacity: 500,
        available: 300,
        used: 200,
        path: '/var/lib/libvirt/images',
        createdAt: '2025-01-15 09:30:00',
        description: '默认存储位置',
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockPool);

      const result = await storageService.getStoragePoolDetails(poolId);

      expect(http.get).toHaveBeenCalledWith(`/storage/pools/${poolId}`);
      expect(result).toEqual(mockPool);
    });

    it('should return null and show error message when API call fails', async () => {
      const poolId = '1';

      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Storage error'));

      const result = await storageService.getStoragePoolDetails(poolId);

      expect(http.get).toHaveBeenCalledWith(`/storage/pools/${poolId}`);
      expect(message.error).toHaveBeenCalledWith('获取存储池详情失败');
      expect(result).toBeNull();
    });
  });

  describe('createStoragePool', () => {
    it('should return created storage pool and show success message when API call is successful', async () => {
      const mockParams = {
        name: '测试存储池',
        type: 'dir',
        path: '/data/test',
      };

      const mockResponse = {
        id: '123',
        name: '测试存储池',
        type: 'dir',
        status: 'inactive',
        capacity: 1000,
        available: 1000,
        used: 0,
        path: '/data/test',
        createdAt: '2025-04-28 10:00:00',
      };

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await storageService.createStoragePool(mockParams);

      expect(http.post).toHaveBeenCalledWith('/storage/pools', mockParams);
      expect(message.success).toHaveBeenCalledWith('创建存储池成功');
      expect(result).toEqual(mockResponse);
    });

    it('should return null and show error message when API call fails', async () => {
      const mockParams = {
        name: '测试存储池',
        type: 'dir',
        path: '/data/test',
      };

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('Storage error'));

      const result = await storageService.createStoragePool(mockParams);

      expect(http.post).toHaveBeenCalledWith('/storage/pools', mockParams);
      expect(message.error).toHaveBeenCalledWith('创建存储池失败');
      expect(result).toBeNull();
    });
  });

  describe('startStoragePool', () => {
    it('should return true and show success message when API call is successful', async () => {
      const poolId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await storageService.startStoragePool(poolId);

      expect(http.post).toHaveBeenCalledWith(`/storage/pools/${poolId}/start`);
      expect(message.success).toHaveBeenCalledWith('启动存储池成功');
      expect(result).toBe(true);
    });

    it('should return false and show error message when API call fails', async () => {
      const poolId = '1';

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('Storage error'));

      const result = await storageService.startStoragePool(poolId);

      expect(http.post).toHaveBeenCalledWith(`/storage/pools/${poolId}/start`);
      expect(message.error).toHaveBeenCalledWith('启动存储池失败');
      expect(result).toBe(false);
    });
  });

  describe('stopStoragePool', () => {
    it('should return true and show success message when API call is successful', async () => {
      const poolId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await storageService.stopStoragePool(poolId);

      expect(http.post).toHaveBeenCalledWith(`/storage/pools/${poolId}/stop`);
      expect(message.success).toHaveBeenCalledWith('停止存储池成功');
      expect(result).toBe(true);
    });
  });

  describe('deleteStoragePool', () => {
    it('should return true and show success message when API call is successful', async () => {
      const poolId = '1';

      // 模拟成功响应
      vi.mocked(http.delete).mockResolvedValue({});

      const result = await storageService.deleteStoragePool(poolId);

      expect(http.delete).toHaveBeenCalledWith(`/storage/pools/${poolId}`);
      expect(message.success).toHaveBeenCalledWith('删除存储池成功');
      expect(result).toBe(true);
    });
  });

  describe('getStorageVolumes', () => {
    it('should return storage volumes when API call is successful', async () => {
      const poolId = '1';
      const mockVolumes = [
        {
          id: '1',
          name: 'vm-disk-1.qcow2',
          path: '/var/lib/libvirt/images/vm-disk-1.qcow2',
          format: 'qcow2',
          capacity: 20,
          allocation: 5,
          vmName: 'Web服务器-01',
          createdAt: '2025-01-15 10:30:00',
        },
      ];

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockVolumes);

      const result = await storageService.getStorageVolumes(poolId);

      expect(http.get).toHaveBeenCalledWith(`/storage/pools/${poolId}/volumes`);
      expect(result).toEqual(mockVolumes);
    });
  });

  describe('createStorageVolume', () => {
    it('should return created volume and show success message when API call is successful', async () => {
      const poolId = '1';
      const mockParams = {
        name: 'test-volume.qcow2',
        capacity: 50,
        format: 'qcow2',
      };

      const mockResponse = {
        id: '123',
        name: 'test-volume.qcow2',
        path: '/var/lib/libvirt/images/test-volume.qcow2',
        format: 'qcow2',
        capacity: 50,
        allocation: 0,
        vmName: null,
        createdAt: '2025-04-28 10:00:00',
      };

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue(mockResponse);

      const result = await storageService.createStorageVolume(poolId, mockParams);

      expect(http.post).toHaveBeenCalledWith(`/storage/pools/${poolId}/volumes`, mockParams);
      expect(message.success).toHaveBeenCalledWith('创建存储卷成功');
      expect(result).toEqual(mockResponse);
    });
  });
});
