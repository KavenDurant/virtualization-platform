import { NetworkTopologyData } from '@/components/NetworkTopology';
import { message } from 'antd';
import http from './http';

// 定义拓扑图节点类型
export interface TopologyNode {
  id: string;
  label: string;
  group: string;
  title?: string;
  isCluster?: boolean;
  nodeCount?: number;
  metadata?: {
    networkType?: string;
    subnet?: string;
    gateway?: string;
    dhcp?: boolean;
    status?: string;
    ipAddress?: string;
    region?: string;
    importance?: string;
    description?: string;
    [key: string]: string | number | boolean | undefined;
  };
}

// 定义拓扑图连线类型
export interface TopologyEdge {
  id: string;
  from: string;
  to: string;
  status?: 'up' | 'down';
  title?: string;
  metadata?: {
    interfaceName?: string;
    macAddress?: string;
    ipAddress?: string;
    bandwidth?: string;
    latency?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

// 定义拓扑图元数据类型
export interface TopologyMetadata {
  totalNodeCount: number;
  loadedNodeCount: number;
  regions: string[];
  nodeTypes: string[];
  lastUpdated: string;
}

// 定义拓扑图分页信息类型
export interface TopologyPagination {
  hasMore: boolean;
  nextPageToken: string;
}

// 定义拓扑图数据响应类型
export interface TopologyResponse {
  metadata?: TopologyMetadata;
  nodes: TopologyNode[];
  edges: TopologyEdge[];
  pagination?: TopologyPagination;
}

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
    const response = await http.post<Network>(
      '/network',
      params as unknown as Record<string, unknown>
    );
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
    await http.put(`/network/${params.id}`, params as unknown as Record<string, unknown>);
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
    const response = await http.post<NetworkInterface>(
      '/network/interfaces',
      params as unknown as Record<string, unknown>
    );
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
    await http.put(
      `/network/interfaces/${params.id}`,
      params as unknown as Record<string, unknown>
    );
    message.success('更新网卡成功');
    return true;
  } catch (error) {
    console.error('更新网卡失败:', error);
    message.error('更新网卡失败');
    return false;
  }
};

// 获取网络拓扑图数据
export async function getNetworkTopology(params?: {
  detail?: 'overview' | 'full' | 'custom';
  filter?: {
    nodeTypes?: string[];
    regionId?: string;
    searchTerm?: string;
  };
  pagination?: {
    pageSize?: number;
    pageToken?: string;
  };
}): Promise<TopologyResponse | null> {
  try {
    const response = await http.get<TopologyResponse>('/api/network/topology', { params });
    return response;
  } catch (error) {
    console.error('获取网络拓扑图数据失败:', error);
    message.error('获取网络拓扑图数据失败');
    return null;
  }
}

// 获取特定节点的详细信息
export async function getNodeDetails(nodeId: string): Promise<TopologyNode | null> {
  try {
    const response = await http.get<TopologyNode>(`/api/network/topology/nodes/${nodeId}`);
    return response;
  } catch (error) {
    console.error('获取节点详细信息失败:', error);
    message.error('获取节点详细信息失败');
    return null;
  }
}

// 获取网络拓扑图区域数据
export async function getTopologyRegions(): Promise<string[] | null> {
  try {
    const response = await http.get<string[]>('/api/network/topology/regions');
    return response;
  } catch (error) {
    console.error('获取网络拓扑图区域数据失败:', error);
    message.error('获取网络拓扑图区域数据失败');
    return null;
  }
}

// 获取子网络拓扑详情
export async function getSubNetworkTopology(networkId: string): Promise<TopologyResponse | null> {
  try {
    const response = await http.get<TopologyResponse>(
      `/api/network/topology/networks/${networkId}`
    );
    return response;
  } catch (error) {
    console.error('获取子网络拓扑详情失败:', error);
    message.error('获取子网络拓扑详情失败');
    return null;
  }
}

// 转换后端数据为前端可用的拓扑图数据格式
export function transformTopologyData(backendData: TopologyResponse | null): NetworkTopologyData {
  if (!backendData) {
    return { nodes: [], edges: [] };
  }

  // 基础节点属性映射
  const nodes = backendData.nodes.map((node: TopologyNode) => ({
    id: node.id,
    label: node.label,
    title: node.title || buildNodeTooltip(node),
    group: node.group,
    // 其他可能的属性根据 node.metadata 处理
  }));

  // 基础连接属性映射
  const edges = backendData.edges.map((edge: TopologyEdge) => ({
    id: edge.id,
    from: edge.from,
    to: edge.to,
    title: edge.title || buildEdgeTooltip(edge),
    dashes: edge.status === 'down',
    color: edge.status === 'down' ? { color: '#f5222d' } : undefined,
    // 其他属性处理
  }));

  return { nodes, edges };
}

// 生成节点提示信息
function buildNodeTooltip(node: TopologyNode): string {
  if (!node.metadata) return '';

  let tooltip = '';
  const md = node.metadata;

  if (node.group === 'network') {
    tooltip = `类型: ${md.networkType || '未知'}<br/>`;
    if (md.subnet) tooltip += `子网: ${md.subnet}<br/>`;
    if (md.gateway) tooltip += `网关: ${md.gateway}<br/>`;
    if (md.dhcp !== undefined) tooltip += `DHCP: ${md.dhcp ? '启用' : '禁用'}<br/>`;
    if (md.status) tooltip += `状态: ${md.status}`;
  } else if (node.group === 'vm') {
    tooltip = `${node.label}<br/>`;
    if (md.ipAddress) tooltip += `IP: ${md.ipAddress}<br/>`;
    if (md.status) tooltip += `状态: ${md.status === 'up' ? '在线' : '离线'}`;
  } else if (node.group === 'router' || node.group === 'switch') {
    if (md.ipAddress) tooltip += `IP: ${md.ipAddress}<br/>`;
    if (md.description) tooltip += md.description;
  }

  return tooltip;
}

// 生成连接提示信息
function buildEdgeTooltip(edge: TopologyEdge): string {
  if (!edge.metadata) return '';

  let tooltip = '';
  const md = edge.metadata;

  if (md.interfaceName) tooltip += `网卡: ${md.interfaceName}<br/>`;
  if (md.macAddress) tooltip += `MAC: ${md.macAddress}<br/>`;
  if (md.ipAddress) tooltip += `IP: ${md.ipAddress}<br/>`;
  if (md.bandwidth) tooltip += `带宽: ${md.bandwidth}<br/>`;
  if (md.latency) tooltip += `延迟: ${md.latency}ms`;

  return tooltip;
}
