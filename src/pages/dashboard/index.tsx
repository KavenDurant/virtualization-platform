import React from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag } from 'antd';
import {
  DesktopOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface VirtualMachine {
  key: string;
  name: string;
  status: 'running' | 'stopped' | 'error';
  cpu: number;
  memory: number;
  storage: number;
  ip: string;
}

const Dashboard: React.FC = () => {
  // 模拟数据
  const vmData: VirtualMachine[] = [
    {
      key: '1',
      name: 'Web服务器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.101',
    },
    {
      key: '2',
      name: '数据库服务器-01',
      status: 'running',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.102',
    },
    {
      key: '3',
      name: '测试服务器-01',
      status: 'stopped',
      cpu: 2,
      memory: 4,
      storage: 100,
      ip: '192.168.1.103',
    },
    {
      key: '4',
      name: '开发服务器-01',
      status: 'error',
      cpu: 4,
      memory: 8,
      storage: 120,
      ip: '192.168.1.104',
    },
  ];

  const columns: ColumnsType<VirtualMachine> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'green';
        let text = '运行中';
        if (status === 'stopped') {
          color = 'orange';
          text = '已停止';
        } else if (status === 'error') {
          color = 'red';
          text = '错误';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'CPU',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (cpu: number) => `${cpu} 核`,
    },
    {
      title: '内存',
      dataIndex: 'memory',
      key: 'memory',
      render: (memory: number) => `${memory} GB`,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
  ];

  return (
    <div className="dashboard-container">
      <h1>系统仪表盘</h1>

      {/* 系统概览统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="虚拟机总数"
              value={24}
              prefix={<DesktopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="存储总容量"
              value={2048}
              suffix="GB"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="网络连接数"
              value={156}
              prefix={<ApiOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless">
            <Statistic
              title="系统运行时间"
              value={72}
              suffix="小时"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 资源使用情况 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="CPU使用率" variant="borderless">
            <div style={{ textAlign: 'center' }}>
              <Progress type="dashboard" percent={42} />
              <div style={{ marginTop: 10 }}>总使用率: 42%</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="内存使用率" variant="borderless">
            <div style={{ textAlign: 'center' }}>
              <Progress type="dashboard" percent={68} strokeColor="#faad14" />
              <div style={{ marginTop: 10 }}>总使用率: 68%</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 虚拟机列表 */}
      <Card title="虚拟机状态" style={{ marginTop: 16 }}>
        <Table columns={columns} dataSource={vmData} pagination={false} />
      </Card>
    </div>
  );
};

export default Dashboard;
