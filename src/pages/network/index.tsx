import NetworkTopology, { NetworkTopologyData } from '@/components/NetworkTopology';
import {
  ApiOutlined,
  DeleteOutlined,
  EditOutlined,
  GlobalOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  Badge,
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useState } from 'react';

const { Option } = Select;
const { Title, Text } = Typography;
// 网络类型定义
interface Network {
  id: string;
  name: string;
  type: 'bridge' | 'nat' | 'isolated' | 'direct';
  status: 'active' | 'inactive' | 'error';
  bridge: string;
  subnet: string;
  gateway: string;
  dhcp: boolean;
  vmCount: number;
  createdAt: string;
}

// 网卡类型定义
interface NetworkInterface {
  id: string;
  name: string;
  vmName: string;
  mac: string;
  network: string;
  type: 'virtio' | 'e1000' | 'rtl8139';
  ipAddress: string;
  status: 'up' | 'down';
  vlanId?: number;
}

const Network: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isNetworkModalVisible, setIsNetworkModalVisible] = useState(false);
  const [networkForm] = Form.useForm();

  // 模拟网络数据
  const networkData: Network[] = [
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
    {
      id: '2',
      name: '生产网络',
      type: 'bridge',
      status: 'active',
      bridge: 'br0',
      subnet: '10.0.0.0/24',
      gateway: '10.0.0.1',
      dhcp: false,
      vmCount: 10,
      createdAt: '2023-02-10 11:20:15',
    },
    {
      id: '3',
      name: '隔离网络',
      type: 'isolated',
      status: 'active',
      bridge: 'virbr1',
      subnet: '192.168.200.0/24',
      gateway: '192.168.200.1',
      dhcp: true,
      vmCount: 3,
      createdAt: '2023-03-05 15:45:30',
    },
    {
      id: '4',
      name: '直连网络',
      type: 'direct',
      status: 'inactive',
      bridge: 'enp2s0',
      subnet: '',
      gateway: '',
      dhcp: false,
      vmCount: 0,
      createdAt: '2023-03-20 10:15:00',
    },
  ];

  // 模拟网卡数据
  const interfaceData: NetworkInterface[] = [
    {
      id: '1',
      name: 'eth0',
      vmName: 'Web服务器-01',
      mac: '52:54:00:12:34:56',
      network: '默认网络',
      type: 'virtio',
      ipAddress: '192.168.122.101',
      status: 'up',
    },
    {
      id: '2',
      name: 'eth0',
      vmName: '数据库服务器-02',
      mac: '52:54:00:12:34:57',
      network: '生产网络',
      type: 'virtio',
      ipAddress: '10.0.0.10',
      status: 'up',
    },
    {
      id: '3',
      name: 'eth1',
      vmName: '数据库服务器-03',
      mac: '52:54:00:12:34:58',
      network: '隔离网络',
      type: 'virtio',
      ipAddress: '192.168.200.10',
      status: 'up',
      vlanId: 100,
    },
    {
      id: '4',
      name: 'eth0',
      vmName: '测试服务器-04',
      mac: '52:54:00:12:34:59',
      network: '默认网络',
      type: 'e1000',
      ipAddress: '192.168.122.102',
      status: 'down',
    },
  ];

  // 模拟拓扑图数据
  const generateTopologyData = (): NetworkTopologyData => {
    // 创建网络节点
    const networkNodes = networkData.map(network => ({
      id: `network-${network.id}`,
      label: network.name,
      title: `类型: ${
        network.type === 'nat'
          ? 'NAT'
          : network.type === 'bridge'
            ? '桥接'
            : network.type === 'isolated'
              ? '隔离'
              : '直连'
      }<br/>
        子网: ${network.subnet || '无'}<br/>
        网关: ${network.gateway || '无'}<br/>
        DHCP: ${network.dhcp ? '启用' : '禁用'}<br/>
        状态: ${
          network.status === 'active' ? '活跃' : network.status === 'inactive' ? '未激活' : '错误'
        }`,
      group: 'network',
    }));

    // 创建路由器节点
    const routerNode = {
      id: 'router-1',
      label: '主路由器',
      title: 'IP: 192.168.1.1<br/>连接到外部网络',
      group: 'router',
    };

    // 创建交换机节点
    const switchNodes = [
      {
        id: 'switch-1',
        label: '核心交换机',
        title: '连接所有网络',
        group: 'switch',
      },
      {
        id: 'switch-2',
        label: '生产交换机',
        title: '连接生产网络',
        group: 'switch',
      },
    ];

    // 创建虚拟机节点
    const vmNodes = interfaceData
      .reduce((uniqueVMs, intf) => {
        if (!uniqueVMs.some(vm => vm.vmName === intf.vmName)) {
          uniqueVMs.push(intf);
        }
        return uniqueVMs;
      }, [] as NetworkInterface[])
      .map(vm => ({
        id: `vm-${vm.id.split('-')[0]}`,
        label: vm.vmName,
        title: `${vm.vmName}<br/>IP: ${vm.ipAddress}<br/>状态: ${vm.status === 'up' ? '在线' : '离线'}`,
        group: 'vm',
      }));

    // 创建所有节点的集合
    const nodes = [...networkNodes, routerNode, ...switchNodes, ...vmNodes];

    // 创建边（连接关系）
    const edges: {
      id: string;
      from: string;
      to: string;
      width?: number;
      title?: string;
      arrows?: {
        to: {
          enabled: boolean;
        };
      };
      dashes?: boolean;
      color?:
        | {
            color: string;
          }
        | undefined;
    }[] = [];

    // 路由器连接到核心交换机
    edges.push({
      id: 'edge-router-switch',
      from: 'router-1',
      to: 'switch-1',
      width: 3,
      title: '上行链路',
      arrows: {
        to: { enabled: false },
      },
    });

    // 交换机之间的连接
    edges.push({
      id: 'edge-switch-switch',
      from: 'switch-1',
      to: 'switch-2',
      width: 2,
      title: '交换机连接',
      arrows: {
        to: { enabled: false },
      },
    });

    // 交换机到网络的连接
    networkNodes.forEach(network => {
      if (network.label.includes('生产')) {
        edges.push({
          id: `edge-switch2-${network.id}`,
          from: 'switch-2',
          to: network.id,
          title: '网络连接',
          arrows: {
            to: { enabled: false },
          },
        });
      } else {
        edges.push({
          id: `edge-switch1-${network.id}`,
          from: 'switch-1',
          to: network.id,
          title: '网络连接',
          arrows: {
            to: { enabled: false },
          },
        });
      }
    });

    // 虚拟机到网络的连接
    interfaceData.forEach(intf => {
      const networkNode = networkNodes.find(n => n.label === intf.network);
      const vmNode = vmNodes.find(vm => vm.label === intf.vmName);

      if (networkNode && vmNode) {
        edges.push({
          id: `edge-${vmNode.id}-${networkNode.id}`,
          from: vmNode.id,
          to: networkNode.id,
          title: `网卡: ${intf.name}<br/>MAC: ${intf.mac}<br/>IP: ${intf.ipAddress}`,
          dashes: intf.status === 'down',
          color: intf.status === 'down' ? { color: '#f5222d' } : undefined,
        });
      }
    });

    return {
      nodes,
      edges,
    };
  };

  // 生成拓扑图数据
  const topologyData = generateTopologyData();

  // 处理节点点击
  const handleNodeClick = (nodeId: string) => {
    console.log(`点击了节点: ${nodeId}`);
    messageApi.info(`选择了: ${nodeId}`);
  };

  // 处理边点击
  const handleEdgeClick = (edgeId: string) => {
    console.log(`点击了边: ${edgeId}`);
    messageApi.info(`选择了连接: ${edgeId}`);
  };

  // 显示创建网络模态框
  const showNetworkModal = () => {
    setIsNetworkModalVisible(true);
  };

  // 处理创建网络
  const handleNetworkOk = () => {
    networkForm
      .validateFields()
      .then(values => {
        console.log('表单提交-网络:', values);
        networkForm.resetFields();
        setIsNetworkModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭网络模态框
  const handleNetworkCancel = () => {
    networkForm.resetFields();
    setIsNetworkModalVisible(false);
  };

  // 处理操作
  const handleAction = (
    action: string,
    type: 'network' | 'interface',
    record: Network | NetworkInterface
  ) => {
    console.log(`执行操作: ${action}，类型: ${type}，名称: ${record.name}`);
    // 在实际应用中，这里应该调用API来执行相应的操作
  };

  // 渲染网络状态标签
  const renderNetworkStatusTag = (status: string) => {
    let color = 'green';
    let text = '活跃';

    if (status === 'inactive') {
      color = 'orange';
      text = '未激活';
    } else if (status === 'error') {
      color = 'red';
      text = '错误';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染网卡状态标签
  const renderInterfaceStatusTag = (status: string) => {
    let color = 'green';
    let text = '连接';

    if (status === 'down') {
      color = 'orange';
      text = '断开';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 网络表格列定义
  const networkColumns: ColumnsType<Network> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: type => {
        const typeMap: Record<string, string> = {
          bridge: '桥接',
          nat: 'NAT',
          isolated: '隔离',
          direct: '直连',
        };
        return typeMap[type] || type;
      },
      filters: [
        { text: '桥接', value: 'bridge' },
        { text: 'NAT', value: 'nat' },
        { text: '隔离', value: 'isolated' },
        { text: '直连', value: 'direct' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderNetworkStatusTag(status),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '未激活', value: 'inactive' },
        { text: '错误', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '子网',
      dataIndex: 'subnet',
      key: 'subnet',
      render: subnet => subnet || '-',
    },
    {
      title: '网关',
      dataIndex: 'gateway',
      key: 'gateway',
      render: gateway => gateway || '-',
    },
    {
      title: 'DHCP',
      dataIndex: 'dhcp',
      key: 'dhcp',
      render: dhcp => (dhcp ? <Tag color="green">启用</Tag> : <Tag color="orange">禁用</Tag>),
      filters: [
        { text: '启用', value: true },
        { text: '禁用', value: false },
      ],
      onFilter: (value, record) => record.dhcp === value,
    },
    {
      title: '虚拟机数',
      dataIndex: 'vmCount',
      key: 'vmCount',
      sorter: (a, b) => a.vmCount - b.vmCount,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAction('编辑', 'network', record)}
            title="编辑"
          />
          {record.status !== 'active' ? (
            <Button
              type="text"
              style={{ color: 'green' }}
              onClick={() => handleAction('启动', 'network', record)}
              title="启动"
            >
              启动
            </Button>
          ) : (
            <Button
              type="text"
              style={{ color: 'orange' }}
              onClick={() => handleAction('停止', 'network', record)}
              title="停止"
            >
              停止
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleAction('删除', 'network', record)}
            title="删除"
            disabled={record.vmCount > 0}
          />
        </Space>
      ),
    },
  ];

  // 网卡表格列定义
  const interfaceColumns: ColumnsType<NetworkInterface> = [
    {
      title: '虚拟机',
      dataIndex: 'vmName',
      key: 'vmName',
      sorter: (a, b) => a.vmName.localeCompare(b.vmName),
    },
    {
      title: '网卡名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'MAC地址',
      dataIndex: 'mac',
      key: 'mac',
    },
    {
      title: '网络',
      dataIndex: 'network',
      key: 'network',
      filters: networkData.map(network => ({ text: network.name, value: network.name })),
      onFilter: (value, record) => record.network === value,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'virtio', value: 'virtio' },
        { text: 'e1000', value: 'e1000' },
        { text: 'rtl8139', value: 'rtl8139' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: ipAddress => ipAddress || '-',
    },
    {
      title: 'VLAN ID',
      dataIndex: 'vlanId',
      key: 'vlanId',
      render: vlanId => vlanId || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderInterfaceStatusTag(status),
      filters: [
        { text: '连接', value: 'up' },
        { text: '断开', value: 'down' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'down' ? (
            <Button
              type="text"
              style={{ color: 'green' }}
              onClick={() => handleAction('连接', 'interface', record)}
              title="连接"
            >
              连接
            </Button>
          ) : (
            <Button
              type="text"
              style={{ color: 'orange' }}
              onClick={() => handleAction('断开', 'interface', record)}
              title="断开"
            >
              断开
            </Button>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAction('编辑', 'interface', record)}
            title="编辑"
          />
        </Space>
      ),
    },
  ];

  // 标签页配置
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <GlobalOutlined />
          <Badge count={networkData.length} offset={[10, 0]}>
            网络
          </Badge>
        </span>
      ),
      children: (
        <>
          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showNetworkModal}>
                创建网络
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table
            columns={networkColumns}
            dataSource={networkData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <ApiOutlined />
          <Badge count={interfaceData.length} offset={[10, 0]}>
            网卡
          </Badge>
        </span>
      ),
      children: (
        <>
          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table
            columns={interfaceColumns}
            dataSource={interfaceData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </>
      ),
    },
  ];

  // 渲染网络概览
  const renderNetworkOverview = () => {
    const activeNetworks = networkData.filter(network => network.status === 'active').length;
    const totalVms = networkData.reduce((sum, network) => sum + network.vmCount, 0);

    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <Title level={4}>网络概览</Title>
            <div style={{ display: 'flex', gap: 16 }}>
              <Text>总网络数: {networkData.length}</Text>
              <Text>活跃网络: {activeNetworks}</Text>
              <Text>连接的虚拟机: {totalVms}</Text>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 渲染拓扑图
  const renderTopology = () => {
    return (
      <NetworkTopology
        data={topologyData}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
      />
    );
  };

  return (
    <div className="network-container">
      {renderNetworkOverview()}
      {contextHolder}

      {/* 标签页 */}
      <Card style={{ marginBottom: 16 }}>
        <Tabs items={tabItems} />
      </Card>

      <Card>{renderTopology()}</Card>

      {/* 创建网络表单 */}
      <Modal
        title="创建网络"
        open={isNetworkModalVisible}
        onOk={handleNetworkOk}
        onCancel={handleNetworkCancel}
        width={600}
      >
        <Form
          form={networkForm}
          layout="vertical"
          name="createNetworkForm"
          initialValues={{
            type: 'nat',
            dhcp: true,
          }}
        >
          <Form.Item
            name="name"
            label="网络名称"
            rules={[{ required: true, message: '请输入网络名称' }]}
          >
            <Input placeholder="请输入网络名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label={
              <span>
                网络类型
                <Tooltip title="桥接：直接连接到物理网络；NAT：使用网络地址转换；隔离：仅内部通信；直连：直接连接到物理接口">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '请选择网络类型' }]}
          >
            <Select placeholder="请选择网络类型">
              <Option value="bridge">桥接网络</Option>
              <Option value="nat">NAT网络</Option>
              <Option value="isolated">隔离网络</Option>
              <Option value="direct">直连网络</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');

              if (type === 'bridge') {
                return (
                  <>
                    <Form.Item
                      name="bridge"
                      label="桥接接口"
                      rules={[{ required: true, message: '请输入桥接接口名称' }]}
                    >
                      <Input placeholder="请输入桥接接口名称，例如: br0" />
                    </Form.Item>
                    <Form.Item name="existingBridge" label="使用现有桥接" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </>
                );
              }

              if (type === 'direct') {
                return (
                  <>
                    <Form.Item
                      name="interface"
                      label="物理接口"
                      rules={[{ required: true, message: '请输入物理接口名称' }]}
                    >
                      <Input placeholder="请输入物理接口名称，例如: eth0" />
                    </Form.Item>
                    <Form.Item
                      name="mode"
                      label="模式"
                      rules={[{ required: true, message: '请选择模式' }]}
                    >
                      <Select placeholder="请选择模式">
                        <Option value="bridge">桥接</Option>
                        <Option value="vepa">VEPA</Option>
                        <Option value="private">私有</Option>
                        <Option value="passthrough">直通</Option>
                      </Select>
                    </Form.Item>
                  </>
                );
              }

              if (type === 'nat' || type === 'isolated') {
                return (
                  <>
                    <Form.Item
                      name="subnet"
                      label="子网"
                      rules={[{ required: true, message: '请输入子网' }]}
                    >
                      <Input placeholder="请输入子网，例如: 192.168.100.0/24" />
                    </Form.Item>
                    <Form.Item
                      name="gateway"
                      label="网关"
                      rules={[{ required: true, message: '请输入网关' }]}
                    >
                      <Input placeholder="请输入网关，例如: 192.168.100.1" />
                    </Form.Item>
                    <Form.Item name="dhcp" label="DHCP" valuePropName="checked">
                      <Switch defaultChecked />
                    </Form.Item>

                    <Form.Item
                      noStyle
                      shouldUpdate={(prevValues, currentValues) =>
                        prevValues.dhcp !== currentValues.dhcp
                      }
                    >
                      {({ getFieldValue }) => {
                        const dhcp = getFieldValue('dhcp');

                        if (dhcp) {
                          return (
                            <>
                              <Form.Item
                                name="dhcpStart"
                                label="DHCP开始地址"
                                rules={[{ required: true, message: '请输入DHCP开始地址' }]}
                              >
                                <Input placeholder="请输入DHCP开始地址，例如: 192.168.100.100" />
                              </Form.Item>
                              <Form.Item
                                name="dhcpEnd"
                                label="DHCP结束地址"
                                rules={[{ required: true, message: '请输入DHCP结束地址' }]}
                              >
                                <Input placeholder="请输入DHCP结束地址，例如: 192.168.100.200" />
                              </Form.Item>
                            </>
                          );
                        }

                        return null;
                      }}
                    </Form.Item>
                  </>
                );
              }

              return null;
            }}
          </Form.Item>

          <Divider />

          <Form.Item name="vlan" label="启用VLAN" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.vlan !== currentValues.vlan}
          >
            {({ getFieldValue }) => {
              const vlan = getFieldValue('vlan');

              if (vlan) {
                return (
                  <Form.Item
                    name="vlanId"
                    label="VLAN ID"
                    rules={[{ required: true, message: '请输入VLAN ID' }]}
                  >
                    <InputNumber
                      min={1}
                      max={4094}
                      style={{ width: '100%' }}
                      placeholder="请输入VLAN ID (1-4094)"
                    />
                  </Form.Item>
                );
              }

              return null;
            }}
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入网络描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Network;
