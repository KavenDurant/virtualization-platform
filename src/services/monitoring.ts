import { message } from 'antd';
import http from './http';

// 虚拟机性能数据类型
export interface VMPerformanceData {
  vmId: string;
  cpuUsage: number;
  memoryUsage: number;
  diskIoRead: number;
  diskIoWrite: number;
  networkIoIn: number;
  networkIoOut: number;
  timestamp: number;
}

// 系统监控数据类型
export interface SystemStats {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkBandwidth: number;
  timestamp: number;
}

// 虚拟机监控数据类型
export interface VirtualMachineStats {
  vmId: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  status: string;
  timestamp: number;
}

// 告警信息类型
export interface Alert {
  id: string;
  type: 'system' | 'vm';
  resourceId?: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: number;
  acknowledged: boolean;
}

// 获取系统监控数据
export const getSystemStats = async (): Promise<SystemStats | null> => {
  try {
    const response = await http.get<SystemStats>('/monitoring/system');
    return response;
  } catch (error) {
    console.error('获取系统监控数据失败:', error);
    message.error('获取系统监控数据失败');
    return null;
  }
};

// 获取虚拟机监控数据
export const getVirtualMachineStats = async (vmId: string): Promise<VirtualMachineStats | null> => {
  try {
    const response = await http.get<VirtualMachineStats>(`/monitoring/vm/${vmId}`);
    return response;
  } catch (error) {
    console.error('获取虚拟机监控数据失败:', error);
    message.error('获取虚拟机监控数据失败');
    return null;
  }
};

// 获取告警信息
export const getAlerts = async (): Promise<Alert[]> => {
  try {
    const response = await http.get<Alert[]>('/monitoring/alerts');
    return response;
  } catch (error) {
    console.error('获取告警信息失败:', error);
    message.error('获取告警信息失败');
    return [];
  }
};

// 确认告警
export const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
  try {
    await http.post(`/monitoring/alerts/${alertId}/acknowledge`);
    message.success('确认告警成功');
    return true;
  } catch (error) {
    console.error('确认告警失败:', error);
    message.error('确认告警失败');
    return false;
  }
};

// 主机性能历史数据类型
export interface HostPerformanceData {
  timestamp: number;
  value: number;
}

// 获取主机性能历史数据
export const getHostPerformanceHistory = async (params: {
  metric: string;
  timeRange: string;
}): Promise<HostPerformanceData[]> => {
  try {
    const response = await http.get<HostPerformanceData[]>('/monitoring/history/host', { params });
    return response;
  } catch (error) {
    console.error('获取主机性能历史数据失败:', error);
    message.error('获取主机性能历史数据失败');
    return [];
  }
};

// 获取虚拟机性能历史数据
export const getVmPerformanceHistory = async (
  vmId: string,
  params: { metric: string; timeRange: string }
): Promise<VMPerformanceData[]> => {
  try {
    const response = await http.get<VMPerformanceData[]>(`/monitoring/history/vm/${vmId}`, {
      params,
    });
    return response;
  } catch (error) {
    console.error('获取虚拟机性能历史数据失败:', error);
    message.error('获取虚拟机性能历史数据失败');
    return [];
  }
};

// 获取单个虚拟机的实时性能数据
export const getVMRealTimePerformance = async (vmId: string): Promise<VMPerformanceData> => {
  try {
    const response = await http.get<VMPerformanceData>(`/vm/${vmId}/performance`);
    return response;
  } catch (error) {
    console.error('获取虚拟机实时性能数据失败:', error);
    message.error('获取虚拟机性能数据失败');
    // 返回模拟数据以防接口失败
    return {
      vmId,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskIoRead: Math.floor(Math.random() * 10000),
      diskIoWrite: Math.floor(Math.random() * 10000),
      networkIoIn: Math.floor(Math.random() * 10000),
      networkIoOut: Math.floor(Math.random() * 10000),
      timestamp: Date.now(),
    };
  }
};

// 获取多个虚拟机的性能数据
export const getBatchVMPerformance = async (vmIds: string[]): Promise<VMPerformanceData[]> => {
  try {
    const response = await http.post<VMPerformanceData[]>('/vm/batch-performance', { vmIds });
    return response;
  } catch (error) {
    console.error('获取批量虚拟机性能数据失败:', error);
    message.error('获取虚拟机性能数据失败');
    // 返回模拟数据以防接口失败
    return vmIds.map(vmId => ({
      vmId,
      cpuUsage: Math.random() * 100,
      memoryUsage: Math.random() * 100,
      diskIoRead: Math.floor(Math.random() * 10000),
      diskIoWrite: Math.floor(Math.random() * 10000),
      networkIoIn: Math.floor(Math.random() * 10000),
      networkIoOut: Math.floor(Math.random() * 10000),
      timestamp: Date.now(),
    }));
  }
};

// 获取虚拟机历史性能数据
export const getVMHistoricalPerformance = async (
  vmId: string,
  startTime: number,
  endTime: number,
  interval: string = '5m'
): Promise<VMPerformanceData[]> => {
  try {
    const response = await http.get<VMPerformanceData[]>(`/vm/${vmId}/historical-performance`, {
      params: { startTime, endTime, interval },
    });
    return response as VMPerformanceData[];
  } catch (error) {
    console.error('获取虚拟机历史性能数据失败:', error);
    message.error('获取虚拟机历史性能数据失败');

    // 返回模拟数据以防接口失败
    const data: VMPerformanceData[] = [];
    const points = 20; // 生成20个数据点
    const timeSpan = endTime - startTime;
    const step = timeSpan / points;

    for (let i = 0; i < points; i++) {
      data.push({
        vmId,
        cpuUsage: 20 + Math.random() * 60, // 20-80%范围内的CPU使用率
        memoryUsage: 30 + Math.random() * 50, // 30-80%范围内的内存使用率
        diskIoRead: 1000 + Math.floor(Math.random() * 9000),
        diskIoWrite: 1000 + Math.floor(Math.random() * 9000),
        networkIoIn: 500 + Math.floor(Math.random() * 9500),
        networkIoOut: 500 + Math.floor(Math.random() * 9500),
        timestamp: startTime + i * step,
      });
    }

    return data;
  }
};

// 设置虚拟机性能警报阈值
export interface VMAlertThreshold {
  vmId: string;
  cpuThreshold: number;
  memoryThreshold: number;
  diskIoThreshold?: number;
  networkIoThreshold?: number;
}

export const setVMAlertThreshold = async (threshold: VMAlertThreshold): Promise<boolean> => {
  try {
    await http.post('/vm/alert-threshold', threshold as unknown as Record<string, unknown>);
    message.success('设置警报阈值成功');
    return true;
  } catch (error) {
    console.error('设置虚拟机警报阈值失败:', error);
    message.error('设置警报阈值失败');
    return false;
  }
};

// 获取虚拟机性能警报阈值
export const getVMAlertThreshold = async (vmId: string): Promise<VMAlertThreshold> => {
  try {
    const response = await http.get<VMAlertThreshold>(`/vm/${vmId}/alert-threshold`);
    return response;
  } catch (error) {
    console.error('获取虚拟机警报阈值失败:', error);
    message.error('获取警报阈值失败');

    // 返回默认阈值
    return {
      vmId,
      cpuThreshold: 80,
      memoryThreshold: 80,
    };
  }
};
