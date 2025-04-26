import { message } from 'antd';
import http from './http';

// 存储池类型定义
export interface StoragePool {
  id: string;
  name: string;
  type: 'local' | 'iscsi' | 'nfs' | 'ceph';
  status: 'active' | 'inactive' | 'error';
  totalCapacity: number;
  usedCapacity: number;
  path: string;
  createdAt: string;
  description?: string;
}

// 存储卷类型定义
export interface StorageVolume {
  id: string;
  name: string;
  poolId: string;
  poolName: string;
  size: number;
  format: 'qcow2' | 'raw' | 'vmdk';
  status: 'available' | 'in-use' | 'error';
  attachedTo: string;
  createdAt: string;
  description?: string;
}

// 创建存储池参数
export interface CreateStoragePoolParams {
  name: string;
  type: 'local' | 'iscsi' | 'nfs' | 'ceph';
  path?: string;
  host?: string;
  target?: string;
  existingBridge?: boolean;
  monHosts?: string;
  pool?: string;
  user?: string;
  description?: string;
}

// 创建存储卷参数
export interface CreateStorageVolumeParams {
  name: string;
  poolId: string;
  size: number;
  format: 'qcow2' | 'raw' | 'vmdk';
  preallocation?: 'off' | 'metadata' | 'full';
  description?: string;
}

// 获取存储池列表
export const getStoragePools = async (): Promise<StoragePool[]> => {
  try {
    const response = await http.get<StoragePool[]>('/storage/pools');
    return response;
  } catch (error) {
    console.error('获取存储池列表失败:', error);
    message.error('获取存储池列表失败');
    return [];
  }
};

// 获取存储池详情
export const getStoragePool = async (id: string): Promise<StoragePool | null> => {
  try {
    const response = await http.get<StoragePool>(`/storage/pools/${id}`);
    return response;
  } catch (error) {
    console.error('获取存储池详情失败:', error);
    message.error('获取存储池详情失败');
    return null;
  }
};

// 创建存储池
export const createStoragePool = async (params: CreateStoragePoolParams): Promise<StoragePool | null> => {
  try {
    const response = await http.post<StoragePool>('/storage/pools', params);
    message.success('创建存储池成功');
    return response;
  } catch (error) {
    console.error('创建存储池失败:', error);
    message.error('创建存储池失败');
    return null;
  }
};

// 激活存储池
export const activateStoragePool = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/storage/pools/${id}/activate`);
    message.success('激活存储池成功');
    return true;
  } catch (error) {
    console.error('激活存储池失败:', error);
    message.error('激活存储池失败');
    return false;
  }
};

// 停用存储池
export const deactivateStoragePool = async (id: string): Promise<boolean> => {
  try {
    await http.post(`/storage/pools/${id}/deactivate`);
    message.success('停用存储池成功');
    return true;
  } catch (error) {
    console.error('停用存储池失败:', error);
    message.error('停用存储池失败');
    return false;
  }
};

// 删除存储池
export const deleteStoragePool = async (id: string): Promise<boolean> => {
  try {
    await http.delete(`/storage/pools/${id}`);
    message.success('删除存储池成功');
    return true;
  } catch (error) {
    console.error('删除存储池失败:', error);
    message.error('删除存储池失败');
    return false;
  }
};

// 获取存储卷列表
export const getStorageVolumes = async (): Promise<StorageVolume[]> => {
  try {
    const response = await http.get<StorageVolume[]>('/storage/volumes');
    return response;
  } catch (error) {
    console.error('获取存储卷列表失败:', error);
    message.error('获取存储卷列表失败');
    return [];
  }
};

// 获取指定存储池的存储卷列表
export const getStoragePoolVolumes = async (poolId: string): Promise<StorageVolume[]> => {
  try {
    const response = await http.get<StorageVolume[]>(`/storage/pools/${poolId}/volumes`);
    return response;
  } catch (error) {
    console.error('获取存储池卷列表失败:', error);
    message.error('获取存储池卷列表失败');
    return [];
  }
};

// 获取存储卷详情
export const getStorageVolume = async (id: string): Promise<StorageVolume | null> => {
  try {
    const response = await http.get<StorageVolume>(`/storage/volumes/${id}`);
    return response;
  } catch (error) {
    console.error('获取存储卷详情失败:', error);
    message.error('获取存储卷详情失败');
    return null;
  }
};

// 创建存储卷
export const createStorageVolume = async (params: CreateStorageVolumeParams): Promise<StorageVolume | null> => {
  try {
    const response = await http.post<StorageVolume>('/storage/volumes', params);
    message.success('创建存储卷成功');
    return response;
  } catch (error) {
    console.error('创建存储卷失败:', error);
    message.error('创建存储卷失败');
    return null;
  }
};

// 删除存储卷
export const deleteStorageVolume = async (id: string): Promise<boolean> => {
  try {
    await http.delete(`/storage/volumes/${id}`);
    message.success('删除存储卷成功');
    return true;
  } catch (error) {
    console.error('删除存储卷失败:', error);
    message.error('删除存储卷失败');
    return false;
  }
};

// 挂载存储卷到虚拟机
export const attachVolumeToVM = async (volumeId: string, vmId: string, device?: string): Promise<boolean> => {
  try {
    await http.post(`/storage/volumes/${volumeId}/attach`, { vmId, device });
    message.success('挂载存储卷成功');
    return true;
  } catch (error) {
    console.error('挂载存储卷失败:', error);
    message.error('挂载存储卷失败');
    return false;
  }
};

// 从虚拟机卸载存储卷
export const detachVolumeFromVM = async (volumeId: string): Promise<boolean> => {
  try {
    await http.post(`/storage/volumes/${volumeId}/detach`);
    message.success('卸载存储卷成功');
    return true;
  } catch (error) {
    console.error('卸载存储卷失败:', error);
    message.error('卸载存储卷失败');
    return false;
  }
};

// 调整存储卷大小
export const resizeStorageVolume = async (id: string, newSize: number): Promise<boolean> => {
  try {
    await http.post(`/storage/volumes/${id}/resize`, { size: newSize });
    message.success('调整存储卷大小成功');
    return true;
  } catch (error) {
    console.error('调整存储卷大小失败:', error);
    message.error('调整存储卷大小失败');
    return false;
  }
};

// 上传镜像到存储池
export interface UploadImageParams {
  poolId: string;
  name: string;
  format: 'qcow2' | 'raw' | 'vmdk' | 'iso';
  file: File;
  description?: string;
}

export const uploadImage = async (params: UploadImageParams, onProgress?: (percent: number) => void): Promise<StorageVolume | null> => {
  try {
    const formData = new FormData();
    formData.append('poolId', params.poolId);
    formData.append('name', params.name);
    formData.append('format', params.format);
    formData.append('file', params.file);
    if (params.description) {
      formData.append('description', params.description);
    }
    
    const response = await http.post<StorageVolume>('/storage/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        onProgress(percentCompleted);
      } : undefined,
    });
    
    message.success('上传镜像成功');
    return response;
  } catch (error) {
    console.error('上传镜像失败:', error);
    message.error('上传镜像失败');
    return null;
  }
};