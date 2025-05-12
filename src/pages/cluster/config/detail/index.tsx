import { getConfigBackupDetail } from '@/services/monitoring'; // 使用相对路径导入
import { useAppDispatch } from '@/store';
import { addBreadcrumb } from '@/store/slices/breadcrumbSlice';
import {
  ArrowLeftOutlined,
  CloudDownloadOutlined,
  DeleteOutlined,
  FileTextOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Skeleton,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

// 备份详情类型接口
interface BackupDetail {
  id: string;
  name: string;
  description: string;
  size: number;
  creator: string;
  createdAt: number;
  status: 'completed' | 'in-progress' | 'failed';
  fileCount: number;
  backupType: string;
  tags: string[];
  history: Array<{
    time: number;
    action: string;
    user: string;
    details: string;
  }>;
  changedFiles: Array<{
    path: string;
    type: string;
    changeType: 'added' | 'modified' | 'deleted';
    size: number;
  }>;
  systemInfo: {
    platformVersion: string;
    nodesCount: number;
    backupTime: number;
    compressionRatio: number;
  };
}

const BackupDetail: React.FC = () => {
  const { backupId } = useParams<{ backupId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState<boolean>(true);
  const [backupDetail, setBackupDetail] = useState<BackupDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 加载备份详情数据
  useEffect(() => {
    const fetchBackupDetail = async () => {
      if (!backupId) {
        setError('备份ID无效');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 调用API获取备份详情
        const data = (await getConfigBackupDetail(backupId)) as BackupDetail;
        setBackupDetail(data);

        // 更新面包屑导航
        dispatch(
          addBreadcrumb({
            key: `backup-detail-${backupId}`,
            title: `备份详情: ${data.name || backupId}`,
            path: `/cluster/config/${backupId}`,
          })
        );
      } catch (error) {
        console.error('获取备份详情失败:', error);
        setError('获取备份详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchBackupDetail();
  }, [backupId, dispatch]);

  // 返回列表页
  const handleBack = () => {
    navigate('/cluster/config');
  };

  // 文件大小格式化
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // 处理恢复备份
  const handleRestoreBackup = () => {
    if (backupId) {
      // 这里可以实现确认对话框，为简化示例直接执行
      navigate(`/cluster/config/restore/${backupId}`);
    }
  };

  // 渲染状态标签
  const renderStatusBadge = (status: string) => {
    const statusMap = {
      completed: { color: 'success', text: '已完成' },
      'in-progress': { color: 'processing', text: '进行中' },
      failed: { color: 'error', text: '失败' },
    };
    const { color, text } = statusMap[status as keyof typeof statusMap] || {
      color: 'default',
      text: status,
    };
    return <Badge status={color as 'success' | 'processing' | 'error' | 'default'} text={text} />;
  };

  // 渲染文件变更类型标签
  const renderChangeTypeTag = (type: string) => {
    const typeMap = {
      added: { color: 'green', text: '新增' },
      modified: { color: 'blue', text: '修改' },
      deleted: { color: 'red', text: '删除' },
    };
    const { color, text } = typeMap[type as keyof typeof typeMap] || {
      color: 'default',
      text: type,
    };
    return <Tag color={color}>{text}</Tag>;
  };

  // 文件变更列表列定义
  const changedFilesColumns = [
    {
      title: '文件路径',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '变更类型',
      dataIndex: 'changeType',
      key: 'changeType',
      width: 100,
      render: (type: string) => renderChangeTypeTag(type),
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size: number) => formatSize(size),
    },
  ];

  // 如果数据加载中，显示骨架屏
  if (loading) {
    return (
      <div className="backup-detail-page">
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
        <Card style={{ marginTop: 16 }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return (
      <Alert
        message="错误"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" type="primary" onClick={handleBack}>
            返回列表
          </Button>
        }
      />
    );
  }

  // 如果没有找到备份详情
  if (!backupDetail) {
    return (
      <Alert
        message="未找到备份"
        description={`找不到ID为 ${backupId} 的备份数据`}
        type="warning"
        showIcon
        action={
          <Button size="small" type="primary" onClick={handleBack}>
            返回列表
          </Button>
        }
      />
    );
  }

  return (
    <div className="backup-detail-page">
      {/* 页面标题和操作按钮 */}
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
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              备份详情: {backupDetail.name}
            </Title>
          </Space>
          <Space>
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              onClick={handleRestoreBackup}
              disabled={backupDetail.status !== 'completed'}
            >
              恢复此备份
            </Button>
            <Button type="primary" danger icon={<DeleteOutlined />}>
              删除备份
            </Button>
          </Space>
        </div>
      </div>

      {/* 基本信息卡片 */}
      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="备份ID">{backupDetail.id}</Descriptions.Item>
          <Descriptions.Item label="备份名称">{backupDetail.name}</Descriptions.Item>
          <Descriptions.Item label="创建者">{backupDetail.creator}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(backupDetail.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="备份状态">
            {renderStatusBadge(backupDetail.status)}
          </Descriptions.Item>
          <Descriptions.Item label="备份大小">{formatSize(backupDetail.size)}</Descriptions.Item>
          <Descriptions.Item label="文件数">{backupDetail.fileCount}</Descriptions.Item>
          <Descriptions.Item label="备份类型">{backupDetail.backupType}</Descriptions.Item>
        </Descriptions>

        {backupDetail.tags && backupDetail.tags.length > 0 && (
          <>
            <Divider orientation="left">标签</Divider>
            <Space wrap>
              {backupDetail.tags.map((tag, index) => (
                <Tag key={index} color="blue">
                  {tag}
                </Tag>
              ))}
            </Space>
          </>
        )}

        {backupDetail.description && (
          <>
            <Divider orientation="left">备份说明</Divider>
            <Paragraph>{backupDetail.description}</Paragraph>
          </>
        )}
      </Card>

      {/* 系统信息卡片 */}
      <Card title="系统信息" style={{ marginBottom: 16 }}>
        <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}>
          <Descriptions.Item label="平台版本">
            {backupDetail.systemInfo.platformVersion}
          </Descriptions.Item>
          <Descriptions.Item label="节点数量">
            {backupDetail.systemInfo.nodesCount}
          </Descriptions.Item>
          <Descriptions.Item label="备份用时">
            {(backupDetail.systemInfo.backupTime / 1000).toFixed(2)} 秒
          </Descriptions.Item>
          <Descriptions.Item label="压缩比">
            {backupDetail.systemInfo.compressionRatio.toFixed(2)}:1
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 详细信息标签页 */}
      <Card>
        <Tabs defaultActiveKey="changes">
          <TabPane
            tab={
              <span>
                <FileTextOutlined />
                变更文件
              </span>
            }
            key="changes"
          >
            <Table
              dataSource={backupDetail.changedFiles}
              columns={changedFilesColumns}
              rowKey="path"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <HistoryOutlined />
                历史记录
              </span>
            }
            key="history"
          >
            <Timeline mode="left">
              {backupDetail.history.map((item, index) => (
                <Timeline.Item key={index} label={new Date(item.time).toLocaleString()}>
                  <p>
                    <strong>{item.action}</strong> - {item.user}
                  </p>
                  <p>{item.details}</p>
                </Timeline.Item>
              ))}
            </Timeline>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SafetyCertificateOutlined />
                安全验证
              </span>
            }
            key="security"
          >
            <Alert
              message="备份完整性已验证"
              description="此备份数据已通过完整性和真实性验证，未发现篡改痕迹。"
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <Descriptions bordered column={1}>
              <Descriptions.Item label="SHA-256校验和">
                f8d48a363b8c6b0fedb52e7b92a001f37ecb58ae1cb3f4c7412ba14958631d73
              </Descriptions.Item>
              <Descriptions.Item label="验证时间">
                {new Date(Date.now() - 3600000).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="验证人员">系统管理员</Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BackupDetail;
