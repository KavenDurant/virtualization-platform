import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, Statistic, Progress, Table, Tag, Menu, message, App } from 'antd';
import {
  DesktopOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ReloadOutlined,
  DeleteOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';
import { calculateMenuPosition } from '../../utils/contextMenuUtils';

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
  // 创建消息API
  const [messageApi, contextHolder] = message.useMessage();

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
    {
      key: '5',
      name: 'Web服务器-02',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 50,
      ip: '192.168.1.105',
    },
    {
      key: '6',
      name: '数据库服务器-02',
      status: 'running',
      cpu: 8,
      memory: 16,
      storage: 500,
      ip: '192.168.1.106',
    },
    {
      key: '7',
      name: '负载均衡器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 20,
      ip: '192.168.1.107',
    },
    {
      key: '8',
      name: '缓存服务器-01',
      status: 'running',
      cpu: 4,
      memory: 8,
      storage: 100,
      ip: '192.168.1.108',
    },
    {
      key: '9',
      name: '监控系统-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 80,
      ip: '192.168.1.109',
    },
    {
      key: '10',
      name: '备份服务器-01',
      status: 'stopped',
      cpu: 2,
      memory: 4,
      storage: 1000,
      ip: '192.168.1.110',
    },
    {
      key: '11',
      name: '测试服务器-02',
      status: 'stopped',
      cpu: 1,
      memory: 2,
      storage: 40,
      ip: '192.168.1.111',
    },
    {
      key: '12',
      name: '开发服务器-02',
      status: 'running',
      cpu: 4,
      memory: 8,
      storage: 120,
      ip: '192.168.1.112',
    },
    {
      key: '13',
      name: '应用服务器-01',
      status: 'running',
      cpu: 4,
      memory: 8,
      storage: 160,
      ip: '192.168.1.113',
    },
    {
      key: '14',
      name: '应用服务器-02',
      status: 'error',
      cpu: 4,
      memory: 8,
      storage: 160,
      ip: '192.168.1.114',
    },
    {
      key: '15',
      name: '日志服务器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 500,
      ip: '192.168.1.115',
    },
    {
      key: '16',
      name: '文件服务器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 2000,
      ip: '192.168.1.116',
    },
    {
      key: '17',
      name: '邮件服务器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 200,
      ip: '192.168.1.117',
    },
    {
      key: '18',
      name: 'CI/CD服务器-01',
      status: 'running',
      cpu: 4,
      memory: 8,
      storage: 150,
      ip: '192.168.1.118',
    },
    {
      key: '19',
      name: '代理服务器-01',
      status: 'running',
      cpu: 2,
      memory: 4,
      storage: 30,
      ip: '192.168.1.119',
    },
    {
      key: '20',
      name: '数据分析服务器-01',
      status: 'stopped',
      cpu: 8,
      memory: 16,
      storage: 800,
      ip: '192.168.1.120',
    },
    {
      key: '21',
      name: '数据仓库-01',
      status: 'running',
      cpu: 8,
      memory: 32,
      storage: 1500,
      ip: '192.168.1.121',
    },
    {
      key: '22',
      name: '测试环境-UAT',
      status: 'error',
      cpu: 4,
      memory: 8,
      storage: 200,
      ip: '192.168.1.122',
    },
  ];

  // 添加状态管理
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedVM, setSelectedVM] = useState<VirtualMachine | null>(null);

  // 创建菜单引用，用于获取菜单的实际尺寸
  const menuRef = useRef<HTMLDivElement>(null);
  // 定义菜单默认尺寸
  const [menuSize, setMenuSize] = useState({ width: 160, height: 300 });

  // 当菜单显示时，测量其实际尺寸
  useEffect(() => {
    if (contextMenuVisible && menuRef.current) {
      // 获取菜单的实际尺寸
      const rect = menuRef.current.getBoundingClientRect();
      const actualWidth = rect.width;
      const actualHeight = rect.height;

      // 更新菜单尺寸状态，供下次使用
      if (actualWidth > 0 && actualHeight > 0) {
        setMenuSize({ width: actualWidth, height: actualHeight });
      }

      // 重新计算位置，确保不超出屏幕
      const event = {
        clientX: contextMenuPosition.x,
        clientY: contextMenuPosition.y,
      } as MouseEvent;

      const newPosition = calculateMenuPosition(event, actualWidth, actualHeight);

      // 如果计算出的新位置与当前位置不同，则更新位置
      if (newPosition.x !== contextMenuPosition.x || newPosition.y !== contextMenuPosition.y) {
        setContextMenuPosition(newPosition);
      }
    }
  }, [contextMenuVisible, contextMenuPosition]);

  // 右键菜单项
  const contextMenuItems: MenuProps['items'] = [
    {
      key: 'details',
      label: '查看详情',
      icon: <InfoCircleOutlined />,
    },
    {
      key: 'start',
      label: '启动',
      icon: <PlayCircleOutlined />,
      disabled: selectedVM?.status === 'running',
    },
    {
      key: 'stop',
      label: '停止',
      icon: <PauseCircleOutlined />,
      disabled: selectedVM?.status === 'stopped',
    },
    {
      key: 'restart',
      label: '重启',
      icon: <ReloadOutlined />,
      disabled: selectedVM?.status === 'stopped',
    },
    {
      type: 'divider',
    },
    {
      key: 'settings',
      label: '设置',
      icon: <SettingOutlined />,
    },
    {
      key: 'delete',
      label: '删除',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // 处理右键菜单点击
  const handleContextMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (!selectedVM) return;

    // 处理不同的菜单项点击
    switch (key) {
      case 'details':
        messageApi.info(`查看虚拟机详情: ${selectedVM.name}`);
        break;
      case 'start':
        messageApi.success(`启动虚拟机: ${selectedVM.name}`);
        break;
      case 'stop':
        messageApi.success(`停止虚拟机: ${selectedVM.name}`);
        break;
      case 'restart':
        messageApi.success(`重启虚拟机: ${selectedVM.name}`);
        break;
      case 'settings':
        messageApi.info(`修改虚拟机设置: ${selectedVM.name}`);
        break;
      case 'delete':
        messageApi.warning(`删除虚拟机: ${selectedVM.name}`);
        break;
      default:
        break;
    }

    // 隐藏右键菜单
    setContextMenuVisible(false);
  };

  // 处理表格行的右键点击
  const handleRowContextMenu = (record: VirtualMachine, event: React.MouseEvent) => {
    // 阻止表格行上的默认右键菜单
    event.preventDefault();
    event.stopPropagation();
    console.log(record, event, '-------');

    // 更新菜单位置和选中的虚拟机
    setContextMenuPosition(calculateMenuPosition(event, menuSize.width, menuSize.height));
    setSelectedVM(record);
    console.log(selectedVM, 'selectedVM');

    setContextMenuVisible(true);
  };

  // 处理表格行点击
  const handleRowClick = (record: VirtualMachine) => {
    console.log('Row clicked:', record);
    // 使用messageApi
    messageApi.info(`选中虚拟机: ${record.name}`);
  };

  // 点击页面其他地方隐藏右键菜单
  const handleClickOutside = () => {
    setContextMenuVisible(false);
  };

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
    <App>
      <div className="dashboard-container">
        {/* 添加消息提示的上下文持有者 */}
        {contextHolder}

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
        <Card
          title="虚拟机状态"
          style={{ marginTop: 16 }}
          onContextMenu={e => {
            // 阻止Card区域的默认右键菜单
            e.preventDefault();

            // 检查是否是表格行内的右击，如果不是则关闭已打开的菜单
            const target = e.target as HTMLElement;
            const isTableRow = target.closest('tr[data-row-key]') !== null;

            if (!isTableRow) {
              // 不是表格行内的右击，关闭已打开的菜单
              setContextMenuVisible(false);
            }
            // 不做额外处理，让事件冒泡到表格行的处理函数
          }}
        >
          <div>
            <Table
              columns={columns}
              dataSource={vmData}
              pagination={{ pageSize: 10 }}
              onRow={record => ({
                onClick: () => handleRowClick(record),
                onContextMenu: event => handleRowContextMenu(record, event),
              })}
            />
          </div>
        </Card>

        {/* 右键菜单 */}
        {contextMenuVisible && (
          <div
            onClick={handleClickOutside}
            onContextMenu={e => {
              // 阻止默认的右键菜单行为
              e.preventDefault();

              // 获取事件目标元素
              const target = e.target as HTMLElement;

              // 检查是否点击在菜单上
              const isMenuOrChild = target.closest('.custom-context-menu') !== null;

              if (isMenuOrChild) {
                // 如果在菜单内部右击，阻止事件冒泡
                e.stopPropagation();
              } else {
                // 检查是否在表格行上右击
                const rowElement = target.closest('tr[data-row-key]');
                if (rowElement) {
                  // 在表格行上右击，找到并处理对应的数据
                  const rowKey = rowElement.getAttribute('data-row-key');
                  const record = vmData.find(item => item.key === rowKey);

                  if (record) {
                    // 先关闭当前菜单
                    setContextMenuVisible(false);

                    // 使用setTimeout确保状态更新后再显示新菜单
                    setTimeout(() => {
                      // 更新菜单位置和选中的虚拟机
                      setContextMenuPosition(
                        calculateMenuPosition(e, menuSize.width, menuSize.height)
                      );
                      setSelectedVM(record);
                      setContextMenuVisible(true);
                    }, 0);
                  }
                } else {
                  // 不是在表格行上右击，关闭菜单
                  setContextMenuVisible(false);
                }
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9998,
            }}
          >
            <div
              ref={menuRef}
              className="custom-context-menu"
              style={{
                position: 'absolute',
                zIndex: 9999,
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
                boxShadow:
                  '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                borderRadius: '2px',
                backgroundColor: '#fff',
              }}
              onClick={e => e.stopPropagation()}
              onContextMenu={e => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Menu
                items={contextMenuItems}
                onClick={handleContextMenuClick}
                style={{ minWidth: 160 }}
              />
            </div>
          </div>
        )}
      </div>
    </App>
  );
};

export default Dashboard;
