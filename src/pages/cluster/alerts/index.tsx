import {
  Alert,
  NotificationConfig,
  acknowledgeAlert,
  deleteNotificationConfig,
  getNotificationConfigs,
  saveNotificationConfig,
} from '@/services/monitoring';
import {
  ApiOutlined,
  BellOutlined,
  DeleteOutlined,
  EditOutlined,
  MailOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 定义值的类型
type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
type AlertType = 'system' | 'vm';
type NotificationType = 'email' | 'sms' | 'webhook' | 'app';

interface FilterValues {
  severity?: AlertSeverity[];
  type?: AlertType[];
  acknowledged?: boolean;
  timeRange?: [moment.Moment, moment.Moment];
  keyword?: string;
}

interface ConfigFormValues {
  name: string;
  type: NotificationType;
  enabled: boolean;
  severityLevels: AlertSeverity[];
  recipients?: string;
  webhookUrl?: string;
  template?: string;
}

const AlertNotificationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('alerts');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [notificationConfigs, setNotificationConfigs] = useState<NotificationConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [configModalVisible, setConfigModalVisible] = useState<boolean>(false);
  const [editingConfig, setEditingConfig] = useState<NotificationConfig | null>(null);
  const [filterForm] = Form.useForm();
  const [configForm] = Form.useForm();
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  // 定义表格行选择配置
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Alert[]) => {
      setSelectedAlerts(selectedRowKeys as string[]);
      console.log('选中的告警:', selectedRows);
    },
    selectedRowKeys: selectedAlerts,
  };

  // 使用 useMemo 来缓存 mockAlerts，这样不会在每次渲染时重新创建
  const mockAlerts = useMemo<Alert[]>(
    () => [
      {
        id: 'alert-1',
        type: 'system',
        severity: 'critical',
        message: '集群主节点 CPU 使用率超过 90%',
        timestamp: Date.now() - 5 * 60 * 1000,
        acknowledged: false,
        resourceId: 'node-1',
      },
      {
        id: 'alert-2',
        type: 'vm',
        severity: 'error',
        message: '虚拟机 Web-Server-01 内存使用率超过 85%',
        timestamp: Date.now() - 15 * 60 * 1000,
        acknowledged: false,
        resourceId: 'vm-1',
      },
      {
        id: 'alert-3',
        type: 'system',
        severity: 'warning',
        message: '存储池 pool-1 可用空间低于 20%',
        timestamp: Date.now() - 30 * 60 * 1000,
        acknowledged: true,
        resourceId: 'pool-1',
      },
      {
        id: 'alert-4',
        type: 'vm',
        severity: 'info',
        message: '虚拟机 DB-Server-01 已成功备份',
        timestamp: Date.now() - 2 * 60 * 60 * 1000,
        acknowledged: true,
        resourceId: 'vm-2',
      },
      {
        id: 'alert-5',
        type: 'system',
        severity: 'error',
        message: '节点 node-3 网络连接异常',
        timestamp: Date.now() - 45 * 60 * 1000,
        acknowledged: false,
        resourceId: 'node-3',
      },
      {
        id: 'alert-6',
        type: 'vm',
        severity: 'warning',
        message: '虚拟机 App-Server-01 磁盘I/O较高',
        timestamp: Date.now() - 25 * 60 * 1000,
        acknowledged: false,
        resourceId: 'vm-3',
      },
      {
        id: 'alert-7',
        type: 'system',
        severity: 'critical',
        message: '存储节点 storage-2 离线',
        timestamp: Date.now() - 10 * 60 * 1000,
        acknowledged: false,
        resourceId: 'storage-2',
      },
      {
        id: 'alert-8',
        type: 'vm',
        severity: 'error',
        message: '虚拟机 Cache-Server-01 异常关机',
        timestamp: Date.now() - 20 * 60 * 1000,
        acknowledged: true,
        resourceId: 'vm-4',
      },
      {
        id: 'alert-9',
        type: 'system',
        severity: 'warning',
        message: '节点 node-2 CPU 温度过高',
        timestamp: Date.now() - 35 * 60 * 1000,
        acknowledged: false,
        resourceId: 'node-2',
      },
      {
        id: 'alert-10',
        type: 'vm',
        severity: 'info',
        message: '虚拟机 Log-Server-01 已完成迁移',
        timestamp: Date.now() - 40 * 60 * 1000,
        acknowledged: true,
        resourceId: 'vm-5',
      },
      {
        id: 'alert-11',
        type: 'system',
        severity: 'critical',
        message: '主存储池性能下降',
        timestamp: Date.now() - 15 * 60 * 1000,
        acknowledged: false,
        resourceId: 'pool-main',
      },
      {
        id: 'alert-12',
        type: 'vm',
        severity: 'error',
        message: '虚拟机 Mail-Server-01 网络连接丢失',
        timestamp: Date.now() - 50 * 60 * 1000,
        acknowledged: false,
        resourceId: 'vm-6',
      },
      {
        id: 'alert-13',
        type: 'system',
        severity: 'warning',
        message: '备份存储池空间使用率超过 75%',
        timestamp: Date.now() - 55 * 60 * 1000,
        acknowledged: true,
        resourceId: 'pool-backup',
      },
      {
        id: 'alert-14',
        type: 'vm',
        severity: 'info',
        message: '虚拟机 Dev-Server-01 已完成创建',
        timestamp: Date.now() - 3 * 60 * 60 * 1000,
        acknowledged: true,
        resourceId: 'vm-7',
      },
      {
        id: 'alert-15',
        type: 'system',
        severity: 'error',
        message: '网络交换机 switch-1 端口异常',
        timestamp: Date.now() - 1 * 60 * 60 * 1000,
        acknowledged: false,
        resourceId: 'switch-1',
      },
    ],
    []
  ); // 空依赖数组，只计算一次

  // 修改 loadAlerts 函数使用模拟数据
  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      // 在实际应用中，这里应该调用 getAlerts()
      // const data = await getAlerts();
      const data = mockAlerts; // 使用模拟数据
      setAlerts(data);
      setFilteredAlerts(data);
    } catch (error) {
      console.error('加载告警数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [mockAlerts]);

  // 加载通知配置
  const loadNotificationConfigs = async () => {
    setLoading(true);
    try {
      const data = await getNotificationConfigs();
      setNotificationConfigs(data);
    } catch (error) {
      console.error('加载通知配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 修复useEffect依赖
  useEffect(() => {
    if (activeTab === 'alerts') {
      loadAlerts();
    } else if (activeTab === 'notifications') {
      loadNotificationConfigs();
    }
  }, [activeTab, loadAlerts]); // 添加 loadAlerts 作为依赖项

  // 确认告警
  const handleAcknowledgeAlert = async (alertId: string) => {
    try {
      const success = await acknowledgeAlert(alertId);
      if (success) {
        loadAlerts();
      }
    } catch (error) {
      console.error('确认告警失败:', error);
    }
  };

  // 过滤告警
  const handleFilterAlerts = (values: FilterValues) => {
    let filtered = [...alerts];

    if (values.severity && values.severity.length > 0) {
      filtered = filtered.filter(alert => values.severity!.includes(alert.severity));
    }

    if (values.type && values.type.length > 0) {
      filtered = filtered.filter(alert => values.type!.includes(alert.type));
    }

    if (values.acknowledged !== undefined) {
      filtered = filtered.filter(alert => alert.acknowledged === values.acknowledged);
    }

    if (values.timeRange && values.timeRange.length === 2) {
      const startTime = values.timeRange[0].valueOf();
      const endTime = values.timeRange[1].valueOf();
      filtered = filtered.filter(
        alert => alert.timestamp >= startTime && alert.timestamp <= endTime
      );
    }

    if (values.keyword) {
      const keyword = values.keyword.toLowerCase();
      filtered = filtered.filter(alert => alert.message.toLowerCase().includes(keyword));
    }

    setFilteredAlerts(filtered);
  };

  // 重置过滤器
  const resetFilters = () => {
    filterForm.resetFields();
    setFilteredAlerts(alerts);
  };

  // 打开编辑配置模态框
  const openConfigModal = (config?: NotificationConfig) => {
    setEditingConfig(config || null);

    if (config) {
      // 编辑已有配置
      configForm.setFieldsValue({
        name: config.name,
        type: config.type,
        enabled: config.enabled,
        severityLevels: config.severityLevels,
        recipients: config.config.recipients?.join(','),
        webhookUrl: config.config.webhookUrl,
        template: config.config.template,
      });
    } else {
      // 创建新配置
      configForm.resetFields();
      configForm.setFieldsValue({
        enabled: true,
        type: 'email',
        severityLevels: ['error', 'critical'],
      });
    }

    setConfigModalVisible(true);
  };

  // 保存通知配置
  const handleSaveConfig = async (values: ConfigFormValues) => {
    const configData: NotificationConfig = {
      id: editingConfig?.id || '',
      name: values.name,
      type: values.type,
      enabled: values.enabled,
      severityLevels: values.severityLevels,
      config: {
        ...(values.recipients
          ? { recipients: values.recipients.split(',').map((e: string) => e.trim()) }
          : {}),
        ...(values.webhookUrl ? { webhookUrl: values.webhookUrl } : {}),
        ...(values.template ? { template: values.template } : {}),
      },
    };

    try {
      const success = await saveNotificationConfig(configData);
      if (success) {
        setConfigModalVisible(false);
        loadNotificationConfigs();
      }
    } catch (error) {
      console.error('保存通知配置失败:', error);
    }
  };

  // 删除通知配置
  const handleDeleteConfig = async (configId: string) => {
    try {
      const success = await deleteNotificationConfig(configId);
      if (success) {
        loadNotificationConfigs();
      }
    } catch (error) {
      console.error('删除通知配置失败:', error);
    }
  };

  // 切换配置启用状态
  const handleToggleEnabled = async (config: NotificationConfig, enabled: boolean) => {
    const updatedConfig = { ...config, enabled };
    try {
      const success = await saveNotificationConfig(updatedConfig);
      if (success) {
        loadNotificationConfigs();
      }
    } catch (error) {
      console.error('更新配置状态失败:', error);
    }
  };

  // 操作列的类型定义
  const handleAction = (record: Alert) => {
    console.log('查看详情', record);
  };

  // 告警列配置
  const alertColumns: TableColumnsType<Alert> = [
    {
      title: '严重程度',
      dataIndex: 'severity',
      key: 'severity',
      width: 120,
      render: (severity: string) => {
        const severityMap = {
          info: { color: 'blue', text: '信息' },
          warning: { color: 'orange', text: '警告' },
          error: { color: 'red', text: '错误' },
          critical: { color: 'purple', text: '严重' },
        };
        const { color, text } = severityMap[severity as keyof typeof severityMap] || {
          color: 'default',
          text: severity,
        };
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: '信息', value: 'info' },
        { text: '警告', value: 'warning' },
        { text: '错误', value: 'error' },
        { text: '严重', value: 'critical' },
      ],
      onFilter: (value: React.Key | boolean, record: Alert) => record.severity === value.toString(),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        return <Tag>{type === 'system' ? '系统' : '虚拟机'}</Tag>;
      },
      filters: [
        { text: '系统', value: 'system' },
        { text: '虚拟机', value: 'vm' },
      ],
      onFilter: (value: React.Key | boolean, record: Alert) => record.type === value.toString(),
    },
    {
      title: '资源ID',
      dataIndex: 'resourceId',
      key: 'resourceId',
      width: 120,
      render: (resourceId?: string) => resourceId || '-',
    },
    {
      title: '告警内容',
      dataIndex: 'message',
      key: 'message',
      ellipsis: {
        showTitle: false,
      },
      render: (message: string) => (
        <Tooltip placement="topLeft" title={message}>
          {message}
        </Tooltip>
      ),
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
      sorter: (a: Alert, b: Alert) => a.timestamp - b.timestamp,
      defaultSortOrder: 'descend',
    },
    {
      title: '状态',
      dataIndex: 'acknowledged',
      key: 'acknowledged',
      width: 100,
      render: (acknowledged: boolean) =>
        acknowledged ? (
          <Badge status="success" text="已确认" />
        ) : (
          <Badge status="processing" text="未确认" />
        ),
      filters: [
        { text: '已确认', value: true },
        { text: '未确认', value: false },
      ],
      onFilter: (value: React.Key | boolean, record: Alert) =>
        record.acknowledged === (value === 'true' ? true : false),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: unknown, record: Alert) => (
        <Space size="small">
          {!record.acknowledged && (
            <Button type="text" size="small" onClick={() => handleAcknowledgeAlert(record.id)}>
              确认
            </Button>
          )}
          <Button type="text" size="small" onClick={() => handleAction(record)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 通知配置列
  const notificationColumns: TableColumnsType<NotificationConfig> = [
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          email: { icon: <MailOutlined />, text: '邮件' },
          sms: { icon: <MessageOutlined />, text: '短信' },
          webhook: { icon: <ApiOutlined />, text: 'Webhook' },
          app: { icon: <BellOutlined />, text: '应用通知' },
        };
        const { icon, text } = typeMap[type as keyof typeof typeMap] || {
          icon: <QuestionCircleOutlined />,
          text: type,
        };
        return (
          <Space>
            {icon}
            {text}
          </Space>
        );
      },
    },
    {
      title: '启用状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: NotificationConfig) => (
        <Switch checked={enabled} onChange={checked => handleToggleEnabled(record, checked)} />
      ),
    },
    {
      title: '严重级别',
      dataIndex: 'severityLevels',
      key: 'severityLevels',
      width: 250,
      render: (levels: string[]) => {
        const severityMap = {
          info: { color: 'blue', text: '信息' },
          warning: { color: 'orange', text: '警告' },
          error: { color: 'red', text: '错误' },
          critical: { color: 'purple', text: '严重' },
        };

        return (
          <Space>
            {levels.map(level => {
              const { color, text } = severityMap[level as keyof typeof severityMap] || {
                color: 'default',
                text: level,
              };
              return (
                <Tag key={level} color={color}>
                  {text}
                </Tag>
              );
            })}
          </Space>
        );
      },
    },
    {
      title: '配置详情',
      key: 'config',
      render: (_: unknown, record: NotificationConfig) => {
        let content = '';
        if (record.type === 'email' && record.config.recipients) {
          content = `收件人: ${record.config.recipients.join(', ')}`;
        } else if (record.type === 'webhook' && record.config.webhookUrl) {
          content = `Webhook URL: ${record.config.webhookUrl}`;
        }

        return content ? (
          <Tooltip title={content}>
            <Paragraph ellipsis={{ rows: 1 }}>{content}</Paragraph>
          </Tooltip>
        ) : (
          '-'
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: NotificationConfig) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => openConfigModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此通知配置吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDeleteConfig(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 定义 tabs items
  const tabItems: TabsProps['items'] = [
    {
      key: 'alerts',
      label: (
        <span>
          <BellOutlined style={{ marginRight: '5px' }} />
          <span>告警列表</span>
        </span>
      ),
      children: (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Form
              form={filterForm}
              layout="inline"
              onFinish={handleFilterAlerts}
              style={{ marginBottom: 16 }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
                <Form.Item name="keyword" style={{ marginBottom: '8px' }}>
                  <Input
                    placeholder="关键词搜索"
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                  />
                </Form.Item>
                <Form.Item name="severity" style={{ marginBottom: '8px' }}>
                  <Select mode="multiple" placeholder="严重程度" style={{ width: 200 }} allowClear>
                    <Option value="info">信息</Option>
                    <Option value="warning">警告</Option>
                    <Option value="error">错误</Option>
                    <Option value="critical">严重</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="type" style={{ marginBottom: '8px' }}>
                  <Select mode="multiple" placeholder="告警类型" style={{ width: 150 }} allowClear>
                    <Option value="system">系统</Option>
                    <Option value="vm">虚拟机</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="acknowledged" style={{ marginBottom: '8px' }}>
                  <Select placeholder="确认状态" style={{ width: 150 }} allowClear>
                    <Option value={true}>已确认</Option>
                    <Option value={false}>未确认</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="timeRange" style={{ marginBottom: '8px' }}>
                  <RangePicker showTime />
                </Form.Item>
                <Form.Item style={{ marginBottom: '8px' }}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      筛选
                    </Button>
                    <Button onClick={resetFilters}>重置</Button>
                  </Space>
                </Form.Item>
              </div>
            </Form>
          </Card>

          <Card>
            <div className="table-responsive">
              <Table
                columns={alertColumns}
                dataSource={filteredAlerts}
                rowKey="id"
                loading={activeTab === 'alerts' && loading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
              />
            </div>
          </Card>
        </>
      ),
    },
    {
      key: 'notifications',
      label: (
        <span>
          <SettingOutlined style={{ marginRight: '5px' }} />
          通知配置
        </span>
      ),
      children: (
        <Card
          title="通知渠道配置"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openConfigModal()}>
              添加配置
            </Button>
          }
        >
          <div className="table-responsive">
            <Table
              columns={notificationColumns}
              dataSource={notificationConfigs}
              rowKey="id"
              loading={activeTab === 'notifications' && loading}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div className="alerts-notifications-page">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <Title level={2}>告警与通知管理</Title>
        <Text type="secondary">
          监控系统告警，配置告警通知方式，支持邮件、短信、Webhook等多种通知渠道。
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {/* 通知配置模态框 */}
      <Modal
        title={`${editingConfig ? '编辑' : '添加'}通知配置`}
        open={configModalVisible}
        onCancel={() => setConfigModalVisible(false)}
        footer={null}
        width={600}
        destroyOnClose
      >
        <Form form={configForm} layout="vertical" onFinish={handleSaveConfig}>
          <Form.Item
            name="name"
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input placeholder="请输入配置名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="通知类型"
            rules={[{ required: true, message: '请选择通知类型' }]}
          >
            <Radio.Group>
              <Radio value="email">邮件</Radio>
              <Radio value="sms">短信</Radio>
              <Radio value="webhook">Webhook</Radio>
              <Radio value="app">应用通知</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="enabled" label="启用状态" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="severityLevels"
            label="告警级别"
            rules={[{ required: true, message: '请选择告警级别' }]}
          >
            <Select mode="multiple" placeholder="选择需要通知的告警级别">
              <Option value="info">信息</Option>
              <Option value="warning">警告</Option>
              <Option value="error">错误</Option>
              <Option value="critical">严重</Option>
            </Select>
          </Form.Item>

          {/* 动态表单项，根据通知类型显示不同的配置 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              if (type === 'email') {
                return (
                  <Form.Item
                    name="recipients"
                    label="收件人"
                    rules={[{ required: true, message: '请输入收件人' }]}
                    tooltip="多个邮箱地址请用英文逗号分隔"
                  >
                    <Input placeholder="例如: admin@example.com, ops@example.com" />
                  </Form.Item>
                );
              }
              if (type === 'sms') {
                return (
                  <Form.Item
                    name="recipients"
                    label="接收手机号"
                    rules={[{ required: true, message: '请输入接收手机号' }]}
                    tooltip="多个手机号请用英文逗号分隔"
                  >
                    <Input placeholder="例如: 13800000000, 13900000000" />
                  </Form.Item>
                );
              }
              if (type === 'webhook') {
                return (
                  <Form.Item
                    name="webhookUrl"
                    label="Webhook URL"
                    rules={[{ required: true, message: '请输入Webhook URL' }]}
                  >
                    <Input placeholder="例如: https://api.example.com/webhook" />
                  </Form.Item>
                );
              }
              return null;
            }}
          </Form.Item>

          <Form.Item
            name="template"
            label="通知模板"
            tooltip="可选，支持使用变量: ${severity}, ${message}, ${timestamp}, ${resourceId}"
          >
            <TextArea
              rows={4}
              placeholder="例如: 告警级别: ${severity}, 时间: ${timestamp}, 内容: ${message}"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setConfigModalVisible(false)} style={{ marginRight: 8 }}>
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

export default AlertNotificationManagement;
