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
}): Promise<HostPerformanceData[] | null> => {
  try {
    const response = await http.get<HostPerformanceData[]>('/monitoring/history/host', { params });
    return response;
  } catch (error) {
    console.error('获取主机性能历史数据失败:', error);
    message.error('获取主机性能历史数据失败');
    return null;
  }
};

// 获取虚拟机性能历史数据
export const getVmPerformanceHistory = async (
  vmId: string,
  params: { metric: string; timeRange: string }
): Promise<VMPerformanceData[] | null> => {
  try {
    const response = await http.get<VMPerformanceData[]>(`/monitoring/history/vm/${vmId}`, {
      params,
    });
    return response;
  } catch (error) {
    console.error('获取虚拟机性能历史数据失败:', error);
    message.error('获取虚拟机性能历史数据失败');
    return null;
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

// 集群节点数据类型
export interface ClusterNode {
  id: string;
  name: string;
  ip: string;
  role: 'master' | 'slave' | 'worker';
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  uptime: number; // 运行时间（秒）
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  services: ServiceStatus[];
  lastUpdated: number;
}

// 服务状态类型
export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'warning' | 'failed';
  uptime?: number;
}

// 集群总体状态
export interface ClusterStatus {
  maintenanceNodes: number;
  id: string;
  name: string;
  nodesTotal: number;
  nodesOnline: number;
  health: 'healthy' | 'warning' | 'critical';
  avgLoad: number;
  timestamp: number;
  totalNodes?: number; // 可选属性，表示集群中的节点总数
  faultyNodes?: number; // 可选属性，表示故障节点的数量
}

// 故障转移策略
export interface FailoverPolicy {
  id: string;
  name: string;
  enabled: boolean;
  triggerConditions: {
    cpuThreshold?: number;
    memoryThreshold?: number;
    responseTimeout?: number;
    serviceFailures?: string[];
  };
  actions: ('restart-service' | 'migrate-vm' | 'failover-node' | 'notify')[];
  priority: number;
  cooldownPeriod: number; // 冷却期（秒）
  lastTriggered?: number;
}

// 告警通知配置
export interface NotificationConfig {
  id: string;
  type: 'email' | 'sms' | 'webhook' | 'app';
  name: string;
  enabled: boolean;
  config: {
    recipients?: string[];
    webhookUrl?: string;
    template?: string;
  };
  severityLevels: ('info' | 'warning' | 'error' | 'critical')[];
}

// 配置备份记录
export interface ConfigBackup {
  id: string;
  name: string;
  description: string;
  size: number;
  createdAt: number;
  creator: string;
  status: 'completed' | 'failed' | 'in-progress';
}

// 获取所有集群节点状态
export const getClusterNodes = async (): Promise<ClusterNode[]> => {
  try {
    const response = await http.get<ClusterNode[]>('/monitoring/cluster/nodes');
    return response;
  } catch (error) {
    console.error('获取集群节点状态失败:', error);
    message.error('获取集群节点状态失败');
    // 返回模拟数据以防接口失败
    return Array(5)
      .fill(0)
      .map((_, index) => ({
        id: `node-${index + 1}`,
        name: `节点 ${index + 1}`,
        ip: `192.168.1.${10 + index}`,
        role:
          index === 0
            ? 'master'
            : ((index < 3 ? 'slave' : 'worker') as 'master' | 'slave' | 'worker'),
        status:
          Math.random() > 0.9
            ? 'warning'
            : ('online' as 'online' | 'offline' | 'warning' | 'maintenance'),
        uptime: Math.floor(Math.random() * 30 * 24 * 3600), // 0-30天的随机运行时间
        cpuUsage: 20 + Math.random() * 60,
        memoryUsage: 30 + Math.random() * 50,
        diskUsage: 40 + Math.random() * 40,
        networkUsage: 10 + Math.random() * 60,
        services: [
          {
            name: 'Hypervisor',
            status:
              Math.random() > 0.95
                ? 'warning'
                : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
            uptime: Math.floor(Math.random() * 30 * 24 * 3600),
          },
          {
            name: 'Network Service',
            status:
              Math.random() > 0.95
                ? 'warning'
                : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
            uptime: Math.floor(Math.random() * 30 * 24 * 3600),
          },
          {
            name: 'Storage Service',
            status:
              Math.random() > 0.95
                ? 'warning'
                : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
            uptime: Math.floor(Math.random() * 30 * 24 * 3600),
          },
        ],
        lastUpdated: Date.now(),
      }));
  }
};

// 获取集群总体状态
export const getClusterStatus = async (): Promise<ClusterStatus> => {
  try {
    const response = await http.get<ClusterStatus>('/monitoring/cluster/status');
    return response;
  } catch (error) {
    console.error('获取集群状态失败:', error);
    message.error('获取集群状态失败');
    // 返回模拟数据
    return {
      id: 'cluster-1',
      name: '主生产集群',
      nodesTotal: 5,
      nodesOnline: 4,
      maintenanceNodes: 1,
      health: Math.random() > 0.9 ? 'warning' : ('healthy' as 'healthy' | 'warning' | 'critical'),
      avgLoad: 45 + Math.random() * 30,
      timestamp: Date.now(),
    };
  }
};

// 获取节点详细历史数据
export const getNodeHistoricalData = async (
  nodeId: string,
  metric: string,
  startTime: number,
  endTime: number,
  interval: string = '5m'
): Promise<{ timestamp: number; value: number }[]> => {
  try {
    const response = await http.get<{ timestamp: number; value: number }[]>(
      `/monitoring/cluster/nodes/${nodeId}/history`,
      { params: { metric, startTime, endTime, interval } }
    );
    return response;
  } catch (error) {
    console.error('获取节点历史数据失败:', error);
    message.error('获取节点历史数据失败');
    // 返回模拟数据
    const data: { timestamp: number; value: number }[] = [];
    const points = 20;
    const timeSpan = endTime - startTime;
    const step = timeSpan / points;

    for (let i = 0; i < points; i++) {
      data.push({
        timestamp: startTime + i * step,
        value: 20 + Math.random() * 60,
      });
    }
    return data;
  }
};

// 获取故障转移策略列表
export const getFailoverPolicies = async (): Promise<FailoverPolicy[]> => {
  try {
    const response = await http.get<FailoverPolicy[]>('/monitoring/failover/policies');
    return response;
  } catch (error) {
    console.error('获取故障转移策略失败:', error);
    message.error('获取故障转移策略失败');
    // 返回模拟数据
    return [
      {
        id: 'policy-1',
        name: '高可用主服务器故障转移',
        enabled: true,
        triggerConditions: {
          cpuThreshold: 90,
          memoryThreshold: 95,
          responseTimeout: 30,
        },
        actions: ['restart-service', 'failover-node', 'notify'],
        priority: 1,
        cooldownPeriod: 300,
        lastTriggered: Date.now() - 2 * 24 * 3600 * 1000,
      },
      {
        id: 'policy-2',
        name: '存储服务故障恢复',
        enabled: true,
        triggerConditions: {
          serviceFailures: ['storage-service'],
        },
        actions: ['restart-service', 'notify'],
        priority: 2,
        cooldownPeriod: 180,
      },
    ];
  }
};

// 创建或更新故障转移策略
export const saveFailoverPolicy = async (policy: FailoverPolicy): Promise<boolean> => {
  try {
    if (policy.id) {
      await http.put(
        `/monitoring/failover/policies/${policy.id}`,
        policy as unknown as Record<string, unknown>
      );
    } else {
      await http.post(
        '/monitoring/failover/policies',
        policy as unknown as Record<string, unknown>
      );
    }
    message.success('保存故障转移策略成功');
    return true;
  } catch (error) {
    console.error('保存故障转移策略失败:', error);
    message.error('保存故障转移策略失败');
    return false;
  }
};

// 删除故障转移策略
export const deleteFailoverPolicy = async (policyId: string): Promise<boolean> => {
  try {
    await http.delete(`/monitoring/failover/policies/${policyId}`);
    message.success('删除故障转移策略成功');
    return true;
  } catch (error) {
    console.error('删除故障转移策略失败:', error);
    message.error('删除故障转移策略失败');
    return false;
  }
};

// 获取告警通知配置
export const getNotificationConfigs = async (): Promise<NotificationConfig[]> => {
  try {
    const response = await http.get<NotificationConfig[]>('/monitoring/notifications/configs');
    return response;
  } catch (error) {
    console.error('获取告警通知配置失败:', error);
    message.error('获取告警通知配置失败');
    // 返回模拟数据
    return [
      {
        id: 'notification-1',
        type: 'email',
        name: '管理员邮件通知',
        enabled: true,
        config: {
          recipients: ['admin@example.com', 'ops@example.com'],
        },
        severityLevels: ['warning', 'error', 'critical'],
      },
      {
        id: 'notification-2',
        type: 'webhook',
        name: '企业微信通知',
        enabled: true,
        config: {
          webhookUrl: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=abcdef',
        },
        severityLevels: ['error', 'critical'],
      },
    ];
  }
};

// 保存告警通知配置
export const saveNotificationConfig = async (config: NotificationConfig): Promise<boolean> => {
  try {
    if (config.id) {
      await http.put(
        `/monitoring/notifications/configs/${config.id}`,
        config as unknown as Record<string, unknown>
      );
    } else {
      await http.post(
        '/monitoring/notifications/configs',
        config as unknown as Record<string, unknown>
      );
    }
    message.success('保存告警通知配置成功');
    return true;
  } catch (error) {
    console.error('保存告警通知配置失败:', error);
    message.error('保存告警通知配置失败');
    return false;
  }
};

// 删除告警通知配置
export const deleteNotificationConfig = async (configId: string): Promise<boolean> => {
  try {
    await http.delete(`/monitoring/notifications/configs/${configId}`);
    message.success('删除告警通知配置成功');
    return true;
  } catch (error) {
    console.error('删除告警通知配置失败:', error);
    message.error('删除告警通知配置失败');
    return false;
  }
};

// 获取配置备份列表
export const getConfigBackups = async (): Promise<ConfigBackup[]> => {
  try {
    const response = await http.get<ConfigBackup[]>('/monitoring/config/backups');
    return response;
  } catch (error) {
    console.error('获取配置备份列表失败:', error);
    message.error('获取配置备份列表失败');
    // 返回模拟数据
    return Array(5)
      .fill(0)
      .map((_, index) => ({
        id: `backup-${Math.floor(Math.random() * 1000)}`, //取整
        name: `系统配置备份 ${new Date(Date.now() - index * 24 * 3600 * 1000).toLocaleDateString()}`,
        description: `每日自动备份 #${index + 1}`,
        size: Math.floor(Math.random() * 10 + 1) * 1024 * 1024, // 1-10MB
        createdAt: Date.now() - index * 24 * 3600 * 1000,
        creator: index % 2 === 0 ? '系统自动' : '管理员',
        status: 'completed' as 'completed' | 'failed' | 'in-progress',
      }));
  }
};

// 创建新的配置备份
export const createConfigBackup = async (name: string, description: string): Promise<boolean> => {
  try {
    await http.post('/monitoring/config/backups', { name, description });
    message.success('创建配置备份成功');
    return true;
  } catch (error) {
    console.error('创建配置备份失败:', error);
    message.error('创建配置备份失败');
    return false;
  }
};

// 恢复配置备份
export const restoreConfigBackup = async (backupId: string): Promise<boolean> => {
  try {
    await http.post(`/monitoring/config/backups/${backupId}/restore`);
    message.success('恢复配置备份成功');
    return true;
  } catch (error) {
    console.error('恢复配置备份失败:', error);
    message.error('恢复配置备份失败');
    return false;
  }
};

// 删除配置备份
export const deleteConfigBackup = async (backupId: string): Promise<boolean> => {
  try {
    await http.delete(`/monitoring/config/backups/${backupId}`);
    message.success('删除配置备份成功');
    return true;
  } catch (error) {
    console.error('删除配置备份失败:', error);
    message.error('删除配置备份失败');
    return false;
  }
};

/**
 * 获取配置备份详情
 * @param backupId 备份ID
 * @returns 备份详情数据
 */
export const getConfigBackupDetail = async (backupId: string) => {
  try {
    // const response = await http.get<any>(`/api/config/backups/${backupId}`);
    // return response;

    // 模拟数据，实际项目中应使用上面的API调用
    await new Promise(resolve => setTimeout(resolve, 800)); // 模拟网络延迟

    return {
      id: backupId,
      name: `系统配置备份 #${backupId.slice(0, 5)}`,
      description:
        '此备份包含了完整的系统配置信息，包括网络设置、存储配置、安全策略和用户权限等核心数据。',
      size: 15728640, // 15MB
      creator: '系统管理员',
      createdAt: Date.now() - 86400000 * 2, // 2天前
      status: 'completed',
      fileCount: 128,
      backupType: '完整备份',
      tags: ['系统配置', '定期备份', '高优先级'],
      history: [
        {
          time: Date.now() - 86400000 * 2,
          action: '创建备份',
          user: '系统管理员',
          details: '初始创建完整系统配置备份',
        },
        {
          time: Date.now() - 86400000 * 2 + 3600000,
          action: '验证备份',
          user: '系统',
          details: '自动完成备份完整性验证',
        },
        {
          time: Date.now() - 86400000,
          action: '下载备份',
          user: '运维人员',
          details: '备份文件已下载用于存档',
        },
      ],
      changedFiles: [
        {
          path: '/etc/network/interfaces',
          type: '配置文件',
          changeType: 'modified',
          size: 2048,
        },
        {
          path: '/etc/hosts',
          type: '配置文件',
          changeType: 'modified',
          size: 1024,
        },
        {
          path: '/etc/security/access.conf',
          type: '安全配置',
          changeType: 'added',
          size: 4096,
        },
        {
          path: '/var/lib/libvirt/images/vm1.qcow2',
          type: '虚拟机镜像',
          changeType: 'modified',
          size: 10485760,
        },
        {
          path: '/etc/deprecated/old-config.xml',
          type: '配置文件',
          changeType: 'deleted',
          size: 0,
        },
      ],
      systemInfo: {
        platformVersion: 'v2.5.3',
        nodesCount: 4,
        backupTime: 12500, // 毫秒
        compressionRatio: 3.2,
      },
    };
  } catch (error) {
    console.error('获取备份详情失败:', error);
    throw error;
  }
};

// 启动实时集群监控 WebSocket 连接
export const startClusterMonitoring = (
  onData: (data: ClusterNode[]) => void,
  onError: (error: Error) => void
): (() => void) => {
  // 这里应该使用实际的 WebSocket 连接
  // 以下是模拟实现
  const intervalId = setInterval(() => {
    try {
      // 模拟实时数据
      const mockData: ClusterNode[] = Array(5)
        .fill(0)
        .map((_, index) => ({
          id: `node-${index + 1}`,
          name: `节点 ${index + 1}`,
          ip: `192.168.1.${10 + index}`,
          role:
            index === 0
              ? 'master'
              : ((index < 3 ? 'slave' : 'worker') as 'master' | 'slave' | 'worker'),
          status:
            Math.random() > 0.9
              ? 'warning'
              : ('online' as 'online' | 'offline' | 'warning' | 'maintenance'),
          uptime: Math.floor(Math.random() * 30 * 24 * 3600), // 0-30天的随机运行时间
          cpuUsage: 20 + Math.random() * 60,
          memoryUsage: 30 + Math.random() * 50,
          diskUsage: 40 + Math.random() * 40,
          networkUsage: 10 + Math.random() * 60,
          services: [
            {
              name: 'Hypervisor',
              status:
                Math.random() > 0.95
                  ? 'warning'
                  : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
              uptime: Math.floor(Math.random() * 30 * 24 * 3600),
            },
            {
              name: 'Network Service',
              status:
                Math.random() > 0.95
                  ? 'warning'
                  : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
              uptime: Math.floor(Math.random() * 30 * 24 * 3600),
            },
            {
              name: 'Storage Service',
              status:
                Math.random() > 0.95
                  ? 'warning'
                  : ('running' as 'running' | 'stopped' | 'warning' | 'failed'),
              uptime: Math.floor(Math.random() * 30 * 24 * 3600),
            },
          ],
          lastUpdated: Date.now(),
        }));

      // 模拟随机错误
      if (Math.random() > 0.95) {
        throw new Error('模拟的网络连接错误');
      }

      onData(mockData);
    } catch (error) {
      // 确保使用错误处理函数
      onError(error instanceof Error ? error : new Error('未知错误'));
    }
  }, 5000); // 每5秒更新一次

  // 返回清理函数
  return () => clearInterval(intervalId);
};
