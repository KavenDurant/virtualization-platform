import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as monitoringService from '../../services/monitoring';
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

describe('Monitoring Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSystemStats', () => {
    it('should return system stats when API call is successful', async () => {
      const mockStats = {
        cpu: {
          usage: 25.5,
          cores: 8,
          model: 'Intel Core i7-10700K',
          loadAvg: [1.5, 1.2, 1.0],
        },
        memory: {
          total: 16384,
          used: 8192,
          free: 8192,
          usagePercent: 50.0,
        },
        uptime: 1209600, // 14 days in seconds
        vmCount: 12,
        activeVmCount: 8,
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockStats);

      const result = await monitoringService.getSystemStats();

      expect(http.get).toHaveBeenCalledWith('/monitoring/system');
      expect(result).toEqual(mockStats);
    });

    it('should return null and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.getSystemStats();

      expect(http.get).toHaveBeenCalledWith('/monitoring/system');
      expect(message.error).toHaveBeenCalledWith('获取系统监控数据失败');
      expect(result).toBeNull();
    });
  });

  describe('getVirtualMachineStats', () => {
    it('should return VM stats when API call is successful', async () => {
      const vmId = '1';
      const mockStats = {
        cpu: {
          usage: 35.2,
          cores: 2,
        },
        memory: {
          total: 4096,
          used: 2048,
          usagePercent: 50.0,
        },
        disk: {
          read: 1024,
          write: 512,
          readSpeed: 50,
          writeSpeed: 25,
        },
        network: {
          received: 8192,
          transmitted: 4096,
          rxSpeed: 1024,
          txSpeed: 512,
        },
        uptime: 259200, // 3 days in seconds
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockStats);

      const result = await monitoringService.getVirtualMachineStats(vmId);

      expect(http.get).toHaveBeenCalledWith(`/monitoring/vm/${vmId}`);
      expect(result).toEqual(mockStats);
    });

    it('should return null and show error message when API call fails', async () => {
      const vmId = '1';

      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.getVirtualMachineStats(vmId);

      expect(http.get).toHaveBeenCalledWith(`/monitoring/vm/${vmId}`);
      expect(message.error).toHaveBeenCalledWith('获取虚拟机监控数据失败');
      expect(result).toBeNull();
    });
  });

  describe('getHostPerformanceHistory', () => {
    it('should return host performance history when API call is successful', async () => {
      const params = {
        metric: 'cpu',
        timeRange: '24h',
      };

      const mockHistory = {
        times: ['2025-04-27T10:00:00Z', '2025-04-27T11:00:00Z', '2025-04-27T12:00:00Z'],
        values: [22.5, 28.2, 24.7],
        metric: 'cpu',
        unit: '%',
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockHistory);

      const result = await monitoringService.getHostPerformanceHistory(params);

      expect(http.get).toHaveBeenCalledWith('/monitoring/history/host', { params });
      expect(result).toEqual(mockHistory);
    });

    it('should return null and show error message when API call fails', async () => {
      const params = {
        metric: 'cpu',
        timeRange: '24h',
      };

      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.getHostPerformanceHistory(params);

      expect(http.get).toHaveBeenCalledWith('/monitoring/history/host', { params });
      expect(message.error).toHaveBeenCalledWith('获取主机性能历史数据失败');
      expect(result).toBeNull();
    });
  });

  describe('getVmPerformanceHistory', () => {
    it('should return VM performance history when API call is successful', async () => {
      const vmId = '1';
      const params = {
        metric: 'memory',
        timeRange: '24h',
      };

      const mockHistory = {
        times: ['2025-04-27T10:00:00Z', '2025-04-27T11:00:00Z', '2025-04-27T12:00:00Z'],
        values: [1800, 2100, 1950],
        metric: 'memory',
        unit: 'MB',
      };

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockHistory);

      const result = await monitoringService.getVmPerformanceHistory(vmId, params);

      expect(http.get).toHaveBeenCalledWith(`/monitoring/history/vm/${vmId}`, { params });
      expect(result).toEqual(mockHistory);
    });

    it('should return null and show error message when API call fails', async () => {
      const vmId = '1';
      const params = {
        metric: 'memory',
        timeRange: '24h',
      };

      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.getVmPerformanceHistory(vmId, params);

      expect(http.get).toHaveBeenCalledWith(`/monitoring/history/vm/${vmId}`, { params });
      expect(message.error).toHaveBeenCalledWith('获取虚拟机性能历史数据失败');
      expect(result).toBeNull();
    });
  });

  describe('getAlerts', () => {
    it('should return alerts when API call is successful', async () => {
      const mockAlerts = [
        {
          id: '1',
          target: 'host',
          targetId: 'host-1',
          targetName: '主机服务器',
          type: 'cpu_high',
          severity: 'warning',
          message: 'CPU 使用率超过 80%',
          value: 85.2,
          threshold: 80,
          time: '2025-04-27T15:30:00Z',
          acknowledged: false,
        },
        {
          id: '2',
          target: 'vm',
          targetId: 'vm-3',
          targetName: 'Web服务器-01',
          type: 'memory_high',
          severity: 'critical',
          message: '内存使用率超过 90%',
          value: 92.5,
          threshold: 90,
          time: '2025-04-27T16:15:00Z',
          acknowledged: true,
        },
      ];

      // 模拟成功响应
      vi.mocked(http.get).mockResolvedValue(mockAlerts);

      const result = await monitoringService.getAlerts();

      expect(http.get).toHaveBeenCalledWith('/monitoring/alerts');
      expect(result).toEqual(mockAlerts);
    });

    it('should return empty array and show error message when API call fails', async () => {
      // 模拟失败响应
      vi.mocked(http.get).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.getAlerts();

      expect(http.get).toHaveBeenCalledWith('/monitoring/alerts');
      expect(message.error).toHaveBeenCalledWith('获取告警信息失败');
      expect(result).toEqual([]);
    });
  });

  describe('acknowledgeAlert', () => {
    it('should return true and show success message when API call is successful', async () => {
      const alertId = '1';

      // 模拟成功响应
      vi.mocked(http.post).mockResolvedValue({});

      const result = await monitoringService.acknowledgeAlert(alertId);

      expect(http.post).toHaveBeenCalledWith(`/monitoring/alerts/${alertId}/acknowledge`);
      expect(message.success).toHaveBeenCalledWith('确认告警成功');
      expect(result).toBe(true);
    });

    it('should return false and show error message when API call fails', async () => {
      const alertId = '1';

      // 模拟失败响应
      vi.mocked(http.post).mockRejectedValue(new Error('Monitoring error'));

      const result = await monitoringService.acknowledgeAlert(alertId);

      expect(http.post).toHaveBeenCalledWith(`/monitoring/alerts/${alertId}/acknowledge`);
      expect(message.error).toHaveBeenCalledWith('确认告警失败');
      expect(result).toBe(false);
    });
  });
});
