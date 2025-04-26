import { message } from 'antd';
import http from './http';

// 网络类型定义
export interface Network {
  id: string;
  name: string;
  type: 'bridge' | 'nat' | 'isolated' | 'direct';
  status: 'active' | 'inactive' | 'error';
  bridge: string;
  subnet: string;
  gateway: string;
  dhcp: boolean;
  vlan?: number;
  vmCount: number;
  createdAt: string;
  description?: string;
}

// 网卡类型定义
export interface NetworkInterface {
  id: string;
  name: string;
  vmId: string;
  vmName: string;
  mac: string;
  networkId: string;
  network: string;
  type: 'virtio' | 'e1000' | 'rtl8139';
  ipAddress: string;
  status: 'up' | 'down';
  vlanId?: number;
}

// 创建网络参数
export interface CreateNetworkParams {
  name: string;
  type: 'bridge' | 'nat' | 'isolated' | 'direct';
  bridge?: string;
  interface?: string;
  subnet?: string;
  gateway?: string;
  dhcp?: boolean;
  dhcpStart?: string;
  dhcpEnd?: string;
  existingBridge?: boolean;
  mode?: 'bridge' | 'vepa' | 'private' | 'passthrough';
  vlan?: boolean;
  vlanId?: number;
  description?: string;
}

// 创建网卡参数
export interface CreateNetworkInterfaceParams {
  vmId: string;
  networkId: string;
  type: 'virtio' | 'e1000' | 'rtl8139';
  mac?: string;
  vlanId?: number;
}

// 获取网络列表
export const getNetworks = async (): Promise<Network[]> => {
  try {
    const response = await http.get<Network[]>('/network');
    return response;
  } catch (error) {
    console.error('获取网络列表失败:', error);
    message.error('获取网络列表失败');
    return [];
  }
};

// 获取网络详情
export const getNetwork = async (id: string): Promise<Network | null> => {
  try {
    const response = await http.get<Network>(`/network/${id}`);
    return response;
  } catch (error) {
    console.error('获取网络详情失败:', error);
    message.error('获取网络详情失败');
    return null;
  }
};

// 创建网络
export const createNetwork = async (params: CreateNetworkParams): Promise<Network | null> => {
  try {
    const response = await http.post<Network>('/network', params);
    message.success('创建网络成功');
    return response;
  } catch (error) {
    console.error('创建网络失败:', error);
    message.error('创建网络失败');
    return null;
  }
};

// 启动网络
export const startNetwork = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/network/${id}/start`);
    message.success('启动网络成功');
    return true;
  } catch (error) {
    console.error('启动网络失败:', error);
    message.error('启动网络失败');
    return false;
  }
};

// 停止网络
export const stopNetwork = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/network/${id}/stop`);
    message.success('停止网络成功');
    return true;
  } catch (error) {
    console.error('停止网络失败:', error);
    message.error('停止网络失败');
    return false;
  }
};

// 删除网络
export const deleteNetwork = async (id: string): Promise<boolean> => {
  try {
    await http.delete(`/network/${id}`);
    message.success('删除网络成功');
    return true;
  } catch (error) {
    console.error('删除网络失败:', error);
    message.error('删除网络失败');
    return false;
  }
};

// 编辑网络参数
export interface UpdateNetworkParams {
  id: string;
  name?: string;
  dhcp?: boolean;
  dhcpStart?: string;
  dhcpEnd?: string;
  description?: string;
}

// 编辑网络
export const updateNetwork = async (params: UpdateNetworkParams): Promise<boolean> => {
  try {
    await http.put(`/network/${params.id}`, params);
    message.success('更新网络成功');
    return true;
  } catch (error) {
    console.error('更新网络失败:', error);
    message.error('更新网络失败');
    return false;
  }
};

// 获取网卡列表
export const getNetworkInterfaces = async (): Promise<NetworkInterface[]> => {
  try {
    const response = await http.get<NetworkInterface[]>('/network/interfaces');
    return response;
  } catch (error) {
    console.error('获取网卡列表失败:', error);
    message.error('获取网卡列表失败');
    return [];
  }
};

// 获取虚拟机网卡列表
export const getVMNetworkInterfaces = async (vmId: string): Promise<NetworkInterface[]> => {
  try {
    const response = await http.get<NetworkInterface[]>(`/vm/${vmId}/interfaces`);
    return response;
  } catch (error) {
    console.error('获取虚拟机网卡列表失败:', error);
    message.error('获取虚拟机网卡列表失败');
    return [];
  }
};

// 创建网卡
export const createNetworkInterface = async (
  params: CreateNetworkInterfaceParams
): Promise<NetworkInterface | null> => {
  try {
    const response = await http.post<NetworkInterface>('/network/interfaces', params);
    message.success('创建网卡成功');
    return response;
  } catch (error) {
    console.error('创建网卡失败:', error);
    message.error('创建网卡失败');
    return null;
  }
};

// 删除网卡
export const deleteNetworkInterface = async (id: string): Promise<boolean> => {
  try {
    await http.delete(`/network/interfaces/${id}`);
    message.success('删除网卡成功');
    return true;
  } catch (error) {
    console.error('删除网卡失败:', error);
    message.error('删除网卡失败');
    return false;
  }
};

// 连接网卡
export const connectNetworkInterface = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/network/interfaces/${id}/connect`);
    message.success('连接网卡成功');
    return true;
  } catch (error) {
    console.error('连接网卡失败:', error);
    message.error('连接网卡失败');
    return false;
  }
};

// 断开网卡
export const disconnectNetworkInterface = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/network/interfaces/${id}/disconnect`);
    message.success('断开网卡成功');
    return true;
  } catch (error) {
    console.error('断开网卡失败:', error);
    message.error('断开网卡失败');
    return false;
  }
};

// 更新网卡参数
export interface UpdateNetworkInterfaceParams {
  id: string;
  networkId?: string;
  type?: 'virtio' | 'e1000' | 'rtl8139';
  vlanId?: number;
}

// 更新网卡
export const updateNetworkInterface = async (
  params: UpdateNetworkInterfaceParams
): Promise<boolean> => {
  try {
    await http.put(`/network/interfaces/${params.id}`, params);
    message.success('更新网卡成功');
    return true;
  } catch (error) {
    console.error('更新网卡失败:', error);
    message.error('更新网卡失败');
    return false;
  }
};
