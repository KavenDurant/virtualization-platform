import {
  FailoverPolicy,
  deleteFailoverPolicy,
  getFailoverPolicies,
  saveFailoverPolicy,
} from '@/services/monitoring';
import { ClockCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

// 添加类型定义
interface SavePolicyValues {
  name: string;
  enabled: boolean;
  priority: number;
  cpuThreshold?: number;
  memoryThreshold?: number;
  responseTimeout?: number;
  serviceFailures?: string[];
  actions: Array<'restart-service' | 'migrate-vm' | 'failover-node' | 'notify'>;
  cooldownPeriod: number;
}

const FailoverPolicyManagement: React.FC = () => {
  const [policies, setPolicies] = useState<FailoverPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPolicy, setEditingPolicy] = useState<FailoverPolicy | null>(null);
  const [form] = Form.useForm();

  // 加载故障转移策略
  const loadPolicies = async () => {
    setLoading(true);
    try {
      const data = await getFailoverPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('加载故障转移策略失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  // 打开编辑模态框
  const openEditModal = (policy?: FailoverPolicy) => {
    setEditingPolicy(policy || null);

    if (policy) {
      // 编辑已有策略
      form.setFieldsValue({
        name: policy.name,
        enabled: policy.enabled,
        priority: policy.priority,
        cpuThreshold: policy.triggerConditions.cpuThreshold,
        memoryThreshold: policy.triggerConditions.memoryThreshold,
        responseTimeout: policy.triggerConditions.responseTimeout,
        serviceFailures: policy.triggerConditions.serviceFailures || [],
        actions: policy.actions,
        cooldownPeriod: policy.cooldownPeriod,
      });
    } else {
      // 创建新策略
      form.resetFields();
      form.setFieldsValue({
        enabled: true,
        priority: 5,
        actions: ['notify'],
        cooldownPeriod: 300,
      });
    }

    setModalVisible(true);
  };

  // 修改保存策略函数的类型
  const handleSavePolicy = async (values: SavePolicyValues) => {
    const policyData: FailoverPolicy = {
      id: editingPolicy?.id || '',
      name: values.name,
      enabled: values.enabled,
      triggerConditions: {
        cpuThreshold: values.cpuThreshold,
        memoryThreshold: values.memoryThreshold,
        responseTimeout: values.responseTimeout,
        serviceFailures: values.serviceFailures,
      },
      actions: values.actions,
      priority: values.priority,
      cooldownPeriod: values.cooldownPeriod,
    };

    try {
      const success = await saveFailoverPolicy(policyData);
      if (success) {
        setModalVisible(false);
        loadPolicies();
      }
    } catch (error) {
      console.error('保存故障转移策略失败:', error);
    }
  };

  // 删除策略
  const handleDeletePolicy = async (policyId: string) => {
    try {
      const success = await deleteFailoverPolicy(policyId);
      if (success) {
        loadPolicies();
      }
    } catch (error) {
      console.error('删除故障转移策略失败:', error);
    }
  };

  // 切换策略启用状态
  const handleToggleEnabled = async (policy: FailoverPolicy, enabled: boolean) => {
    const updatedPolicy = { ...policy, enabled };
    try {
      const success = await saveFailoverPolicy(updatedPolicy);
      if (success) {
        loadPolicies();
      }
    } catch (error) {
      console.error('更新策略状态失败:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: FailoverPolicy) => (
        <Switch checked={enabled} onChange={checked => handleToggleEnabled(record, checked)} />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a: FailoverPolicy, b: FailoverPolicy) => a.priority - b.priority,
      render: (priority: number) => (
        <Tag color={priority <= 3 ? 'red' : priority <= 6 ? 'orange' : 'green'}>{priority}</Tag>
      ),
    },
    {
      title: '触发条件',
      key: 'triggers',
      render: (_: unknown, record: FailoverPolicy) => {
        const conditions = [];
        if (record.triggerConditions.cpuThreshold) {
          conditions.push(`CPU > ${record.triggerConditions.cpuThreshold}%`);
        }
        if (record.triggerConditions.memoryThreshold) {
          conditions.push(`内存 > ${record.triggerConditions.memoryThreshold}%`);
        }
        if (record.triggerConditions.responseTimeout) {
          conditions.push(`响应超时 > ${record.triggerConditions.responseTimeout}秒`);
        }
        if (record.triggerConditions.serviceFailures?.length) {
          conditions.push(`服务故障: ${record.triggerConditions.serviceFailures.join(', ')}`);
        }

        return conditions.map((condition, index) => (
          <Tag key={index} color="blue">
            {condition}
          </Tag>
        ));
      },
    },
    {
      title: '动作',
      key: 'actions',
      dataIndex: 'actions',
      render: (actions: string[]) => {
        const actionMap: Record<string, { text: string; color: string }> = {
          'restart-service': { text: '重启服务', color: 'purple' },
          'migrate-vm': { text: '迁移虚拟机', color: 'geekblue' },
          'failover-node': { text: '节点故障转移', color: 'red' },
          notify: { text: '通知', color: 'cyan' },
        };

        return actions.map(action => (
          <Tag key={action} color={actionMap[action]?.color || 'default'}>
            {actionMap[action]?.text || action}
          </Tag>
        ));
      },
    },
    {
      title: '冷却期',
      dataIndex: 'cooldownPeriod',
      key: 'cooldownPeriod',
      render: (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return (
          <Space>
            <ClockCircleOutlined />
            <span>{minutes}分钟</span>
          </Space>
        );
      },
    },
    {
      title: '最后触发',
      dataIndex: 'lastTriggered',
      key: 'lastTriggered',
      render: (timestamp?: number) => {
        if (!timestamp) return '-';
        return new Date(timestamp).toLocaleString();
      },
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: unknown, record: FailoverPolicy) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此策略吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDeletePolicy(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="failover-policy-page">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <Title level={2}>故障转移策略配置</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditModal()}>
            添加策略
          </Button>
        </div>
        <Text type="secondary">配置系统在故障发生时的自动转移策略，确保服务的高可用性。</Text>
      </div>

      <Card>
        <div className="table-responsive">
          <Table
            columns={columns}
            dataSource={policies}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </div>
      </Card>

      <Modal
        title={`${editingPolicy ? '编辑' : '添加'}故障转移策略`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSavePolicy}>
          <Form.Item
            name="name"
            label="策略名称"
            rules={[{ required: true, message: '请输入策略名称' }]}
          >
            <Input placeholder="请输入策略名称" />
          </Form.Item>

          <Form.Item name="enabled" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请设置优先级' }]}
            tooltip="数字越小，优先级越高"
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Divider>触发条件</Divider>

          <Form.Item name="cpuThreshold" label="CPU使用率阈值 (%)">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="memoryThreshold" label="内存使用率阈值 (%)">
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="responseTimeout" label="响应超时 (秒)">
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="serviceFailures" label="服务故障">
            <Select mode="multiple" placeholder="选择触发故障转移的服务">
              <Option value="hypervisor">Hypervisor</Option>
              <Option value="storage-service">存储服务</Option>
              <Option value="network-service">网络服务</Option>
              <Option value="monitoring-service">监控服务</Option>
            </Select>
          </Form.Item>

          <Divider>动作配置</Divider>

          <Form.Item
            name="actions"
            label="故障转移动作"
            rules={[{ required: true, message: '请至少选择一个动作' }]}
          >
            <Checkbox.Group>
              <Space direction="vertical">
                <Checkbox value="restart-service">重启服务</Checkbox>
                <Checkbox value="migrate-vm">迁移虚拟机</Checkbox>
                <Checkbox value="failover-node">节点故障转移</Checkbox>
                <Checkbox value="notify">发送通知</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="cooldownPeriod"
            label="冷却期 (秒)"
            tooltip="两次故障转移操作之间的最小间隔时间"
            rules={[{ required: true, message: '请设置冷却期' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FailoverPolicyManagement;
