import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Tabs,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

const { Option } = Select;

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'paused' | 'error';
  os: string;
  cpu: number;
  memory: number;
  storage: number;
  ip: string;
  createdAt: string;
}

const VirtualMachines: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 模拟数据
  const data: VirtualMachine[] = [
    {
      id: '1',
      name: 'Web服务器-01',
      status: 'running',
      os: 'CentOS 8',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.101',
      createdAt: '2023-04-15 09:30:00',
    },
    {
      id: '2',
      name: '数据库服务器-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.102',
      createdAt: '2023-04-10 11:20:15',
    },
    {
      id: '3',
      name: '测试服务器-01',
      status: 'stopped',
      os: 'Windows Server 2019',
      cpu: 2,
      memory: 4,
      storage: 100,
      ip: '192.168.1.103',
      createdAt: '2023-03-25 15:45:30',
    },
    {
      id: '4',
      name: '开发服务器-01',
      status: 'paused',
      os: 'Debian 11',
      cpu: 4,
      memory: 8,
      storage: 120,
      ip: '192.168.1.104',
      createdAt: '2023-03-20 10:15:00',
    },
    {
      id: '5',
      name: '备份服务器-01',
      status: 'error',
      os: 'CentOS 7',
      cpu: 2,
      memory: 4,
      storage: 500,
      ip: '192.168.1.105',
      createdAt: '2023-02-15 08:30:45',
    },
    {
      id: '6',
      name: 'Web服务器-02',
      status: 'running',
      os: 'CentOS 8',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.106',
      createdAt: '2023-04-18 08:45:00',
    },
    {
      id: '7',
      name: '数据库服务器-02',
      status: 'stopped',
      os: 'Ubuntu 20.04',
      cpu: 8,
      memory: 16,
      storage: 300,
      ip: '192.168.1.107',
      createdAt: '2023-04-05 14:30:20',
    },
    {
      id: '8',
      name: '测试服务器-02',
      status: 'running',
      os: 'Windows Server 2022',
      cpu: 4,
      memory: 8,
      storage: 150,
      ip: '192.168.1.108',
      createdAt: '2023-04-02 16:25:10',
    },
    {
      id: '9',
      name: '开发服务器-02',
      status: 'error',
      os: 'Debian 11',
      cpu: 4,
      memory: 8,
      storage: 120,
      ip: '192.168.1.109',
      createdAt: '2023-03-18 09:15:30',
    },
    {
      id: '10',
      name: '应用服务器-01',
      status: 'running',
      os: 'RedHat 8',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.110',
      createdAt: '2023-03-15 11:40:00',
    },
    {
      id: '11',
      name: 'Web服务器-03',
      status: 'paused',
      os: 'CentOS 8',
      cpu: 2,
      memory: 4,
      storage: 80,
      ip: '192.168.1.111',
      createdAt: '2023-03-12 13:20:45',
    },
    {
      id: '12',
      name: '文件服务器-01',
      status: 'running',
      os: 'Ubuntu 18.04',
      cpu: 2,
      memory: 4,
      storage: 2000,
      ip: '192.168.1.112',
      createdAt: '2023-03-08 10:15:30',
    },
    {
      id: '13',
      name: '监控服务器-01',
      status: 'running',
      os: 'CentOS 8',
      cpu: 4,
      memory: 8,
      storage: 120,
      ip: '192.168.1.113',
      createdAt: '2023-03-05 08:45:15',
    },
    {
      id: '14',
      name: '邮件服务器-01',
      status: 'stopped',
      os: 'Debian 10',
      cpu: 2,
      memory: 4,
      storage: 100,
      ip: '192.168.1.114',
      createdAt: '2023-03-01 16:30:00',
    },
    {
      id: '15',
      name: '日志服务器-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 4,
      memory: 8,
      storage: 500,
      ip: '192.168.1.115',
      createdAt: '2023-02-25 14:20:10',
    },
    {
      id: '16',
      name: 'Docker主机-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 8,
      memory: 16,
      storage: 300,
      ip: '192.168.1.116',
      createdAt: '2023-02-20 09:10:05',
    },
    {
      id: '17',
      name: 'Kubernetes节点-01',
      status: 'running',
      os: 'CentOS 8',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.117',
      createdAt: '2023-02-18 11:25:30',
    },
    {
      id: '18',
      name: 'Kubernetes节点-02',
      status: 'running',
      os: 'CentOS 8',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.118',
      createdAt: '2023-02-18 11:30:45',
    },
    {
      id: '19',
      name: 'Kubernetes节点-03',
      status: 'error',
      os: 'CentOS 8',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.119',
      createdAt: '2023-02-18 11:35:50',
    },
    {
      id: '20',
      name: 'Jenkins服务器-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 4,
      memory: 8,
      storage: 150,
      ip: '192.168.1.120',
      createdAt: '2023-02-15 14:40:25',
    },
    {
      id: '21',
      name: 'GitLab服务器-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.121',
      createdAt: '2023-02-10 13:15:30',
    },
    {
      id: '22',
      name: '内网DNS服务器-01',
      status: 'running',
      os: 'CentOS 8',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.122',
      createdAt: '2023-02-05 10:20:15',
    },
    {
      id: '23',
      name: 'VPN服务器-01',
      status: 'paused',
      os: 'Ubuntu 20.04',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.123',
      createdAt: '2023-02-01 09:45:00',
    },
    {
      id: '24',
      name: '代理服务器-01',
      status: 'running',
      os: 'Debian 11',
      cpu: 2,
      memory: 4,
      storage: 80,
      ip: '192.168.1.124',
      createdAt: '2023-01-28 16:30:20',
    },
    {
      id: '25',
      name: '缓存服务器-01',
      status: 'running',
      os: 'Redis OS',
      cpu: 4,
      memory: 16,
      storage: 100,
      ip: '192.168.1.125',
      createdAt: '2023-01-25 14:15:10',
    },
    {
      id: '26',
      name: '负载均衡器-01',
      status: 'running',
      os: 'NGINX OS',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.126',
      createdAt: '2023-01-20 11:10:30',
    },
    {
      id: '27',
      name: '负载均衡器-02',
      status: 'stopped',
      os: 'NGINX OS',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.127',
      createdAt: '2023-01-20 11:20:45',
    },
    {
      id: '28',
      name: '防火墙-01',
      status: 'running',
      os: 'OPNsense',
      cpu: 2,
      memory: 4,
      storage: 40,
      ip: '192.168.1.128',
      createdAt: '2023-01-15 09:30:15',
    },
    {
      id: '29',
      name: '数据分析服务器-01',
      status: 'running',
      os: 'Ubuntu 20.04',
      cpu: 16,
      memory: 64,
      storage: 1000,
      ip: '192.168.1.129',
      createdAt: '2023-01-10 08:25:30',
    },
    {
      id: '30',
      name: '人工智能训练服务器-01',
      status: 'paused',
      os: 'Ubuntu 20.04',
      cpu: 32,
      memory: 128,
      storage: 2000,
      ip: '192.168.1.130',
      createdAt: '2023-01-05 10:15:45',
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(values => {
        console.log('表单提交:', values);
        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleAction = (action: string, record: VirtualMachine) => {
    console.log(`执行操作: ${action}，虚拟机: ${record.name}`);
    // 在实际应用中，这里应该调用API来执行相应的操作
  };

  const renderStatusTag = (status: string) => {
    let color = 'green';
    let text = '运行中';

    if (status === 'stopped') {
      color = 'default';
      text = '已停止';
    } else if (status === 'paused') {
      color = 'orange';
      text = '已暂停';
    } else if (status === 'error') {
      color = 'red';
      text = '错误';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<VirtualMachine> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderStatusTag(status),
      filters: [
        { text: '运行中', value: 'running' },
        { text: '已停止', value: 'stopped' },
        { text: '已暂停', value: 'paused' },
        { text: '错误', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      render: cpu => `${cpu} 核`,
      sorter: (a, b) => a.cpu - b.cpu,
    },
    {
      title: '内存',
      dataIndex: 'memory',
      key: 'memory',
      render: memory => `${memory} GB`,
      sorter: (a, b) => a.memory - b.memory,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'stopped' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleAction('启动', record)}
              title="启动"
            />
          )}
          {record.status === 'running' && (
            <>
              <Button
                type="text"
                icon={<PauseCircleOutlined />}
                onClick={() => handleAction('暂停', record)}
                title="暂停"
              />
              <Button
                type="text"
                icon={<PoweroffOutlined />}
                onClick={() => handleAction('停止', record)}
                title="停止"
              />
            </>
          )}
          {record.status === 'paused' && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => handleAction('恢复', record)}
              title="恢复"
            />
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAction('编辑', record)}
            title="编辑"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleAction('删除', record)}
            title="删除"
          />
        </Space>
      ),
    },
  ];

  // 定义 Tabs 的 items 属性
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <Badge count={2} offset={[10, 0]}>
            全部虚拟机
          </Badge>
        </span>
      ),
      children: (
        <>
          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                创建虚拟机
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 10 }} />
        </>
      ),
    },
    {
      key: '2',
      label: '我的虚拟机',
      children: '我的虚拟机内容',
    },
    {
      key: '3',
      label: '模板',
      children: '虚拟机模板内容',
    },
  ];

  return (
    <div className="virtual-machines-container">
      <h1>虚拟机管理</h1>

      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>

      {/* 创建虚拟机表单 */}
      <Modal
        title="创建虚拟机"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          name="createVirtualMachineForm"
          initialValues={{
            os: 'CentOS 8',
            cpu: 2,
            memory: 4,
            storage: 50,
          }}
        >
          <Form.Item
            name="name"
            label="虚拟机名称"
            rules={[{ required: true, message: '请输入虚拟机名称' }]}
          >
            <Input placeholder="请输入虚拟机名称" />
          </Form.Item>

          <Form.Item
            name="os"
            label="操作系统"
            rules={[{ required: true, message: '请选择操作系统' }]}
          >
            <Select placeholder="请选择操作系统">
              <Option value="CentOS 8">CentOS 8</Option>
              <Option value="Ubuntu 20.04">Ubuntu 20.04</Option>
              <Option value="Debian 11">Debian 11</Option>
              <Option value="Windows Server 2019">Windows Server 2019</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cpu"
            label="CPU核心数"
            rules={[{ required: true, message: '请输入CPU核心数' }]}
          >
            <InputNumber min={1} max={32} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="memory"
            label="内存大小(GB)"
            rules={[{ required: true, message: '请输入内存大小' }]}
          >
            <InputNumber min={1} max={128} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="storage"
            label="存储容量(GB)"
            rules={[{ required: true, message: '请输入存储容量' }]}
          >
            <InputNumber min={10} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="network"
            label="网络设置"
            rules={[{ required: true, message: '请选择网络设置' }]}
          >
            <Select placeholder="请选择网络设置">
              <Option value="default">默认网络</Option>
              <Option value="isolated">隔离网络</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={4} placeholder="请输入虚拟机描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VirtualMachines;
