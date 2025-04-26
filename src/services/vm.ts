import { message } from 'antd';
import http from './http';

// 虚拟机类型定义
export interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  os: string;
  cpu: number;
  memory: number;
  storage: number;
  ip: string;
  mac?: string;
  createdAt: string;
  description?: string;
}

// 虚拟机创建参数
export interface CreateVMParams {
  name: string;
  os: string;
  cpu: number;
  memory: number;
  storage: number;
  network: string;
  description?: string;
}

// 获取虚拟机列表
export const getVirtualMachines = async (): Promise<VirtualMachine[]> => {
  try {
    const response = await http.get<VirtualMachine[]>('/vm');
    return response;
  } catch (error) {
    console.error('获取虚拟机列表失败:', error);
    message.error('获取虚拟机列表失败');
    return [];
  }
};

// 获取虚拟机详情
export const getVirtualMachine = async (id: string): Promise<VirtualMachine | null> => {
  try {
    const response = await http.get<VirtualMachine>(`/vm/${id}`);
    return response;
  } catch (error) {
    console.error('获取虚拟机详情失败:', error);
    message.error('获取虚拟机详情失败');
    return null;
  }
};

// 创建虚拟机
export const createVirtualMachine = async (params: CreateVMParams): Promise<VirtualMachine | null> => {
  try {
    const response = await http.post<VirtualMachine>('/vm', params);
    message.success('创建虚拟机成功');
    return response;
  } catch (error) {
    console.error('创建虚拟机失败:', error);
    message.error('创建虚拟机失败');
    return null;
  }
};

// 启动虚拟机
export const startVirtualMachine = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/start`);
    message.success('启动虚拟机成功');
    return true;
  } catch (error) {
    console.error('启动虚拟机失败:', error);
    message.error('启动虚拟机失败');
    return false;
  }
};

// 停止虚拟机
export const stopVirtualMachine = async (id: string, force: boolean = false): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/stop`, { force });
    message.success('停止虚拟机成功');
    return true;
  } catch (error) {
    console.error('停止虚拟机失败:', error);
    message.error('停止虚拟机失败');
    return false;
  }
};

// 暂停虚拟机
export const pauseVirtualMachine = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/pause`);
    message.success('暂停虚拟机成功');
    return true;
  } catch (error) {
    console.error('暂停虚拟机失败:', error);
    message.error('暂停虚拟机失败');
    return false;
  }
};

// 恢复虚拟机
export const resumeVirtualMachine = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/resume`);
    message.success('恢复虚拟机成功');
    return true;
  } catch (error) {
    console.error('恢复虚拟机失败:', error);
    message.error('恢复虚拟机失败');
    return false;
  }
};

// 重启虚拟机
export const rebootVirtualMachine = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/reboot`);
    message.success('重启虚拟机成功');
    return true;
  } catch (error) {
    console.error('重启虚拟机失败:', error);
    message.error('重启虚拟机失败');
    return false;
  }
};

// 删除虚拟机
export const deleteVirtualMachine = async (id: string): Promise<boolean> => {
  try {
    await http.delete(`/vm/${id}`);
    message.success('删除虚拟机成功');
    return true;
  } catch (error) {
    console.error('删除虚拟机失败:', error);
    message.error('删除虚拟机失败');
    return false;
  }
};

// 修改虚拟机配置
export interface UpdateVMConfigParams {
  id: string;
  cpu?: number;
  memory?: number;
  description?: string;
}

export const updateVirtualMachineConfig = async (params: UpdateVMConfigParams): Promise<boolean> => {
  try {
    await http.put(`/vm/${params.id}/config`, params);
    message.success('更新虚拟机配置成功');
    return true;
  } catch (error) {
    console.error('更新虚拟机配置失败:', error);
    message.error('更新虚拟机配置失败');
    return false;
  }
};

// 创建虚拟机快照
export const createVirtualMachineSnapshot = async (id: string, name: string, description?: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${id}/snapshot`, { name, description });
    message.success('创建快照成功');
    return true;
  } catch (error) {
    console.error('创建快照失败:', error);
    message.error('创建快照失败');
    return false;
  }
};

// 获取虚拟机快照列表
export interface VMSnapshot {
  id: string;
  vmId: string;
  name: string;
  description?: string;
  createdAt: string;
  size: number;
}

export const getVirtualMachineSnapshots = async (vmId: string): Promise<VMSnapshot[]> => {
  try {
    const response = await http.get<VMSnapshot[]>(`/vm/${vmId}/snapshot`);
    return response;
  } catch (error) {
    console.error('获取虚拟机快照列表失败:', error);
    message.error('获取虚拟机快照列表失败');
    return [];
  }
};

// 恢复虚拟机快照
export const restoreVirtualMachineSnapshot = async (vmId: string, snapshotId: string): Promise<boolean> => {
  try {
    await http.post(`/vm/${vmId}/snapshot/${snapshotId}/restore`);
    message.success('恢复快照成功');
    return true;
  } catch (error) {
    console.error('恢复快照失败:', error);
    message.error('恢复快照失败');
    return false;
  }
};

// 删除虚拟机快照
export const deleteVirtualMachineSnapshot = async (vmId: string, snapshotId: string): Promise<boolean> => {
  try {
    await http.delete(`/vm/${vmId}/snapshot/${snapshotId}`);
    message.success('删除快照成功');
    return true;
  } catch (error) {
    console.error('删除快照失败:', error);
    message.error('删除快照失败');
    return false;
  }
};