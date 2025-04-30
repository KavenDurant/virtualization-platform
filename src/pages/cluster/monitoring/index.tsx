import {
  ClusterNode,
  ClusterStatus,
  getClusterNodes,
  getClusterStatus,
  startClusterMonitoring,
} from '@/services/monitoring';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tooltip,
  Typography,
} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, { useCallback, useEffect, useState } from 'react';

const { Title, Text } = Typography;

// 添加服务类型定义
interface ClusterService {
  name: string;
  status: 'running' | 'stopped' | 'warning' | 'failed';
  uptime?: number;
}

// 格式化运行时间
const formatUptime = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}天 ${hours}小时`;
  }
  if (hours > 0) {
    return `${hours}小时 ${minutes}分钟`;
  }
  return `${minutes}分钟`;
};

// 状态映射到颜色
const statusColorMap = {
  online: 'success',
  offline: 'error',
  warning: 'warning',
  maintenance: 'processing',
} as const;

// 服务状态映射到颜色
const serviceStatusColorMap = {
  running: 'success',
  stopped: 'default',
  warning: 'warning',
  failed: 'error',
} as const;

const ClusterMonitoring: React.FC = () => {
  const [clusterStatus, setClusterStatus] = useState<ClusterStatus | null>(null);
  const [nodes, setNodes] = useState<ClusterNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // 加载集群状态数据
  const loadClusterData = useCallback(async () => {
    setLoading(true);
    try {
      const status = await getClusterStatus();
      const nodesData = await getClusterNodes();
      setClusterStatus(status);
      setNodes(nodesData);
    } catch (error) {
      console.error('加载集群数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 开始实时监控
  const startRealTimeMonitoring = useCallback(() => {
    // WebSocket方式
    const cleanup = startClusterMonitoring(
      nodesData => {
        setNodes(nodesData);
        // 更新集群状态
        getClusterStatus().then(status => {
          setClusterStatus(status);
        });
      },
      error => {
        console.error('实时监控错误:', error);
      }
    );

    // 保存清理函数以便在组件卸载时调用
    return cleanup;
  }, []);

  useEffect(() => {
    // 初始加载数据
    loadClusterData();

    // 设置实时监控
    const cleanup = startRealTimeMonitoring();

    // 组件卸载时清理
    return () => {
      cleanup();
    };
  }, [loadClusterData, startRealTimeMonitoring]); // 添加缺少的依赖项

  // 手动刷新数据
  const handleRefresh = () => {
    loadClusterData();
  };

  // 集群状态指示器
  const renderHealthStatus = (health: 'healthy' | 'warning' | 'critical') => {
    const statusMap = {
      healthy: { icon: <CheckCircleOutlined />, color: 'green', text: '健康' },
      warning: { icon: <WarningOutlined />, color: 'orange', text: '警告' },
      critical: { icon: <CloseCircleOutlined />, color: 'red', text: '严重' },
    };

    const { icon, color, text } = statusMap[health];

    return (
      <Space>
        {React.cloneElement(icon, { style: { color } })}
        <Text style={{ color }}>{text}</Text>
      </Space>
    );
  };

  // 节点表格列定义
  const nodeColumns = [
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const roleMap = {
          master: '主节点',
          slave: '从节点',
          worker: '工作节点',
        };
        return roleMap[role as keyof typeof roleMap] || role;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'online' | 'offline' | 'warning' | 'maintenance') => {
        const statusTextMap = {
          online: '在线',
          offline: '离线',
          warning: '警告',
          maintenance: '维护中',
        };

        return <Badge status={statusColorMap[status]} text={statusTextMap[status]} />;
      },
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime: number) => formatUptime(uptime),
    },
    {
      title: 'CPU使用率',
      dataIndex: 'cpuUsage',
      key: 'cpuUsage',
      render: (usage: number) => {
        let color = 'green';
        if (usage > 80) color = 'red';
        else if (usage > 60) color = 'orange';

        return <Progress percent={Math.round(usage)} size="small" strokeColor={color} />;
      },
    },
    {
      title: '内存使用率',
      dataIndex: 'memoryUsage',
      key: 'memoryUsage',
      render: (usage: number) => {
        let color = 'green';
        if (usage > 80) color = 'red';
        else if (usage > 60) color = 'orange';

        return <Progress percent={Math.round(usage)} size="small" strokeColor={color} />;
      },
    },
    {
      title: '磁盘使用率',
      dataIndex: 'diskUsage',
      key: 'diskUsage',
      render: (usage: number) => {
        let color = 'green';
        if (usage > 80) color = 'red';
        else if (usage > 60) color = 'orange';

        return <Progress percent={Math.round(usage)} size="small" strokeColor={color} />;
      },
    },
    {
      title: '网络使用率',
      dataIndex: 'networkUsage',
      key: 'networkUsage',
      render: (usage: number) => {
        let color = 'green';
        if (usage > 80) color = 'red';
        else if (usage > 60) color = 'orange';

        return <Progress percent={Math.round(usage)} size="small" strokeColor={color} />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ClusterNode) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button type="text" size="small" onClick={() => console.log('查看节点详情', record)}>
              详情
            </Button>
          </Tooltip>
          <Tooltip title="查看服务">
            <Button type="text" size="small" onClick={() => console.log('查看节点服务', record)}>
              服务
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 服务状态表格列定义
  const serviceColumns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'running' | 'stopped' | 'warning' | 'failed') => {
        const statusTextMap = {
          running: '运行中',
          stopped: '已停止',
          warning: '警告',
          failed: '失败',
        };

        return <Badge status={serviceStatusColorMap[status]} text={statusTextMap[status]} />;
      },
    },
    {
      title: '运行时间',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (uptime?: number) => (uptime ? formatUptime(uptime) : '-'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ClusterService) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            disabled={record.status === 'running'}
            onClick={() => console.log('启动服务', record)}
          >
            启动
          </Button>
          <Button
            type="link"
            size="small"
            danger
            disabled={record.status !== 'running'}
            onClick={() => console.log('停止服务', record)}
          >
            停止
          </Button>
          <Button type="link" size="small" onClick={() => console.log('重启服务', record)}>
            重启
          </Button>
        </Space>
      ),
    },
  ];

  // 绘制集群资源使用图表选项
  const getClusterResourceOptions = () => {
    const cpuData = nodes.map(node => node.cpuUsage);
    const memoryData = nodes.map(node => node.memoryUsage);
    const diskData = nodes.map(node => node.diskUsage);
    const networkData = nodes.map(node => node.networkUsage);
    const nodeNames = nodes.map(node => node.name);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: ['CPU', '内存', '磁盘', '网络'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        axisLabel: {
          formatter: '{value}%',
        },
      },
      yAxis: {
        type: 'category',
        data: nodeNames,
      },
      series: [
        {
          name: 'CPU',
          type: 'bar',
          data: cpuData,
        },
        {
          name: '内存',
          type: 'bar',
          data: memoryData,
        },
        {
          name: '磁盘',
          type: 'bar',
          data: diskData,
        },
        {
          name: '网络',
          type: 'bar',
          data: networkData,
        },
      ],
    };
  };

  // 绘制节点状态分布图表选项
  const getNodeStatusOptions = () => {
    // 统计各状态节点数量
    const statusCount = nodes.reduce(
      (acc, node) => {
        acc[node.status] = (acc[node.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const statusTextMap = {
      online: '在线',
      offline: '离线',
      warning: '警告',
      maintenance: '维护中',
    };

    const data = Object.keys(statusCount).map(status => ({
      name: statusTextMap[status as keyof typeof statusTextMap],
      value: statusCount[status],
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: data.map(item => item.name),
      },
      series: [
        {
          name: '节点状态',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: data,
        },
      ],
    };
  };

  return (
    <div className="cluster-monitoring-page">
      <div className="page-header" style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} sm={18} md={16} lg={12}>
            <Title level={2}>集群状态监控</Title>
          </Col>
          <Col xs={24} sm={6} md={8} lg={12} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              刷新
            </Button>
          </Col>
        </Row>
      </div>

      {loading && !nodes.length ? (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" tip="加载集群数据..." />
        </div>
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: '集群概览',
              children: clusterStatus && (
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="集群健康状态"
                        value={clusterStatus.health}
                        valueRender={() => renderHealthStatus(clusterStatus.health)}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="总节点数"
                        value={clusterStatus.totalNodes}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="故障节点"
                        value={clusterStatus?.faultyNodes}
                        valueStyle={{
                          color:
                            clusterStatus?.faultyNodes && clusterStatus.faultyNodes > 0
                              ? '#ff4d4f'
                              : '#52c41a',
                        }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Card>
                      <Statistic
                        title="维护中节点"
                        value={clusterStatus.maintenanceNodes}
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="资源使用情况">
                      {nodes.length > 0 && (
                        <ReactECharts
                          option={getClusterResourceOptions()}
                          style={{ height: 400 }}
                          opts={{ renderer: 'canvas' }}
                        />
                      )}
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card title="节点状态分布">
                      {nodes.length > 0 && (
                        <ReactECharts
                          option={getNodeStatusOptions()}
                          style={{ height: 400 }}
                          opts={{ renderer: 'canvas' }}
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              ),
            },
            {
              key: 'nodes',
              label: '节点列表',
              children: (
                <Card>
                  <div className="table-responsive">
                    <Table
                      columns={nodeColumns}
                      dataSource={nodes}
                      rowKey="id"
                      pagination={{
                        responsive: true,
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        pageSizeOptions: ['5', '10', '20', '50'],
                      }}
                      scroll={{ x: 1200 }}
                      size="middle"
                      expandable={{
                        expandedRowRender: record => (
                          <div style={{ margin: 0 }}>
                            <Title level={5}>服务状态</Title>
                            <Table
                              columns={serviceColumns}
                              dataSource={record.services}
                              rowKey="name"
                              pagination={false}
                              size="small"
                              scroll={{ x: 800 }}
                            />
                          </div>
                        ),
                      }}
                    />
                  </div>
                </Card>
              ),
            },
          ]}
        />
      )}
    </div>
  );
};

export default ClusterMonitoring;
