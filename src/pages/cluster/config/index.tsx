import {
  ConfigBackup,
  createConfigBackup,
  deleteConfigBackup,
  getConfigBackups,
  restoreConfigBackup,
} from '@/services/monitoring';
import {
  CloudDownloadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  HistoryOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  Alert as AntdAlert,
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Progress,
  Space,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import KeepAliveTest from '@/components/KeepAliveTest';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 添加类型定义
interface NodeConfig {
  id: number;
  name: string;
  syncStatus: 'synced' | 'pending' | 'failed';
  lastSyncTime: number;
}

interface CreateBackupValues {
  name: string;
  description?: string;
}

const ConfigSyncBackup: React.FC = () => {
  const [backups, setBackups] = useState<ConfigBackup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [restoring, setRestoring] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [restoringBackupId, setRestoringBackupId] = useState<string | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [form] = Form.useForm();

  // 加载配置备份
  const loadBackups = async () => {
    setLoading(true);
    try {
      const data = await getConfigBackups();
      setBackups(data);
    } catch (error) {
      console.error('加载配置备份失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  // 创建新备份
  const handleCreateBackup = async (values: CreateBackupValues) => {
    setCreating(true);
    try {
      const success = await createConfigBackup(values.name, values.description || '');
      if (success) {
        setCreateModalVisible(false);
        form.resetFields();
        loadBackups();
      }
    } catch (error) {
      console.error('创建配置备份失败:', error);
    } finally {
      setCreating(false);
    }
  };

  // 恢复备份
  const handleRestoreBackup = async (backupId: string) => {
    setRestoring(true);
    setRestoringBackupId(backupId);

    // 模拟进度
    const interval = setInterval(() => {
      setProgressPercent(prev => {
        const newPercent = prev + Math.floor(Math.random() * 10);
        return newPercent >= 100 ? 100 : newPercent;
      });
    }, 300);

    try {
      await restoreConfigBackup(backupId);
      // 确保进度达到100%
      setProgressPercent(100);
      // 等待进度条显示完毕
      setTimeout(() => {
        setRestoring(false);
        setRestoringBackupId(null);
        setProgressPercent(0);
        clearInterval(interval);
        loadBackups();
      }, 1000);
    } catch (error) {
      console.error('恢复配置备份失败:', error);
      setRestoring(false);
      setRestoringBackupId(null);
      setProgressPercent(0);
      clearInterval(interval);
    }
  };

  // 删除备份
  const handleDeleteBackup = async (backupId: string) => {
    try {
      const success = await deleteConfigBackup(backupId);
      if (success) {
        loadBackups();
      }
    } catch (error) {
      console.error('删除配置备份失败:', error);
    }
  };

  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // 表格列配置
  const columns = [
    {
      title: '备份名称',
      dataIndex: 'name',
      key: 'name',
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: {
        showTitle: false,
      },
      render: (description: string) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatSize(size),
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      key: 'creator',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
      sorter: (a: ConfigBackup, b: ConfigBackup) => a.createdAt - b.createdAt,
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap = {
          completed: { color: 'success', text: '已完成' },
          'in-progress': { color: 'processing', text: '进行中' },
          failed: { color: 'error', text: '失败' },
        };
        const { color, text } = statusMap[status as keyof typeof statusMap] || {
          color: 'default',
          text: status,
        };
        return (
          <Badge status={color as 'success' | 'processing' | 'error' | 'default'} text={text} />
        );
      },
      filters: [
        { text: '已完成', value: 'completed' },
        { text: '进行中', value: 'in-progress' },
        { text: '失败', value: 'failed' },
      ],
      onFilter: (value: unknown, record: ConfigBackup) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: ConfigBackup) => (
        <Space size="small">
          <Popconfirm
            title="确定要恢复此备份吗？"
            description="恢复操作将覆盖当前系统配置，请谨慎操作！"
            okText="确定"
            cancelText="取消"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleRestoreBackup(record.id)}
            disabled={restoring || record.status !== 'completed'}
          >
            <Button
              type="text"
              size="small"
              icon={<CloudDownloadOutlined />}
              disabled={restoring || record.status !== 'completed'}
            >
              恢复
            </Button>
          </Popconfirm>
          <Button
            type="text"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => console.log('查看详情', record)}
          >
            详情
          </Button>
          <Popconfirm
            title="确定要删除此备份吗？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => handleDeleteBackup(record.id)}
            disabled={record.status === 'in-progress'}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.status === 'in-progress'}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 节点配置同步状态表格列定义
  const syncColumns = [
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '同步状态',
      dataIndex: 'syncStatus',
      key: 'syncStatus',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          synced: { color: 'green', text: '已同步' },
          pending: { color: 'orange', text: '待同步' },
          failed: { color: 'red', text: '同步失败' },
        };
        const { color, text } = statusMap[status] || { color: 'default', text: status };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最后同步时间',
      dataIndex: 'lastSyncTime',
      key: 'lastSyncTime',
      render: (time: number) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: NodeConfig) => (
        <Button type="text" icon={<SyncOutlined />} onClick={() => console.log('同步节点', record)}>
          同步
        </Button>
      ),
    },
  ];

  // 渲染恢复进度
  const renderRestoreProgress = () => {
    if (!restoring) return null;

    return (
      <div style={{ marginBottom: 16 }}>
        <AntdAlert
          message="配置恢复进行中"
          description={
            <div>
              <Paragraph>正在恢复配置备份，请勿刷新页面或关闭浏览器...</Paragraph>
              <Progress percent={progressPercent} status="active" />
            </div>
          }
          type="info"
          showIcon
        />
      </div>
    );
  };

  return (
    <div className="config-sync-backup-page">
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
          <Title level={2}>配置同步与备份</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建备份icon
          </Button>
        </div>
        <Text type="secondary">管理系统配置的备份和恢复，确保配置的一致性和可恢复性。</Text>
      </div>

      {renderRestoreProgress()}

      <Card title="配置备份列表">
        {loading ? (
          <div style={{ textAlign: 'center', padding: 50 }}>
            <Spin tip="加载备份数据..." />
          </div>
        ) : backups.length === 0 ? (
          <Empty description="暂无备份数据" />
        ) : (
          <div className="table-responsive">
            <Table
              columns={columns}
              dataSource={backups}
              rowKey="id"
              pagination={false}
              rowClassName={record => (record.id === restoringBackupId ? 'restoring-row' : '')}
              scroll={{ x: 'max-content' }}
            />
          </div>
        )}
      </Card>

      <Divider orientation="left">配置同步</Divider>

      <Card title="节点配置同步状态">
        <div className="table-responsive">
          <Table
            columns={syncColumns}
            dataSource={[
              { id: 1, name: '节点 1', syncStatus: 'synced', lastSyncTime: Date.now() - 3600000 },
              { id: 2, name: '节点 2', syncStatus: 'synced', lastSyncTime: Date.now() - 7200000 },
              { id: 3, name: '节点 3', syncStatus: 'pending', lastSyncTime: Date.now() - 86400000 },
              { id: 4, name: '节点 4', syncStatus: 'failed', lastSyncTime: Date.now() - 172800000 },
            ]}
            rowKey="id"
            pagination={false}
            scroll={{ x: 800 }}
          />
        </div>
      </Card>
      <Divider orientation="left">测试 Keep-Alive</Divider>
      <Card title="Keep-Alive 连接测试">
        <KeepAliveTest />
      </Card>
      <Modal
        title="创建新备份"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleCreateBackup}>
          <Form.Item
            name="name"
            label="备份名称"
            rules={[{ required: true, message: '请输入备份名称' }]}
          >
            <Input
              placeholder="请输入备份名称"
              defaultValue={`配置备份 ${new Date().toLocaleDateString()}`}
            />
          </Form.Item>

          <Form.Item name="description" label="备份描述">
            <TextArea
              rows={4}
              placeholder="请输入备份描述"
              defaultValue={`系统配置备份 - ${new Date().toLocaleString()}`}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setCreateModalVisible(false)} style={{ marginRight: 8 }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={creating}>
                创建
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConfigSyncBackup;
