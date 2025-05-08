import {
  CloudUploadOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DesktopOutlined,
  DownloadOutlined,
  EditOutlined,
  ImportOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  PoweroffOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import {
  App,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tabs,
  Tag,
  message,
  Upload,
  notification,
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { RcFile } from 'antd/es/upload';
import React, { useState } from 'react';

const { Option } = Select;
const { Dragger } = Upload;

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

// 导入虚拟机的接口定义
interface ImportVirtualMachine {
  name: string;
  os: string;
  cpu: number;
  memory: number;
  storage: number;
  network: string;
  description?: string;
}

const VirtualMachines: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  // 添加表格大小的状态
  const [tableSize] = useState<TableProps<VirtualMachine>['size']>('middle');
  // 添加导入相关的状态
  const [importProgress, setImportProgress] = useState(0);
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [totalToImport, setTotalToImport] = useState(0);
  const [importNotificationKey, setImportNotificationKey] = useState<string | null>(null);

  // 统计数据（实际应用中应该从API获取）
  const statsData = {
    totalVMs: 30,
    runningVMs: 18,
    stoppedVMs: 7,
    pausedVMs: 3,
    errorVMs: 2,
    totalStorage: 8240, // GB
    cpuUsage: 57, // 百分比
    memoryUsage: 64, // 百分比
  };

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
    // ... 可以添加更多虚拟机数据
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
  ];

  // 定义行选择配置
  const rowSelections = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  // 显示导入模态框
  const showImportModal = () => {
    setIsImportModalVisible(true);
  };

  // 关闭导入模态框
  const handleImportCancel = () => {
    setIsImportModalVisible(false);
    // 如果正在导入，不应该直接关闭
    if (!importing) {
      // 重置导入相关状态
      setImportProgress(0);
      setImportedCount(0);
      setTotalToImport(0);
    }
  };

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
          <Badge count={statsData.errorVMs} offset={[10, 0]}>
            全部虚拟机
          </Badge>
        </span>
      ),
      children: (
        <>
          {/* 添加统计卡片 - 与仪表盘相似的响应式设计 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={6}>
              <Card variant="borderless">
                <Statistic
                  title="虚拟机总数"
                  value={statsData.totalVMs}
                  prefix={<DesktopOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant="borderless">
                <Statistic
                  title="运行中"
                  value={statsData.runningVMs}
                  prefix={<PlayCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant="borderless">
                <Statistic
                  title="已停止"
                  value={statsData.stoppedVMs}
                  prefix={<PoweroffOutlined />}
                  valueStyle={{ color: '#8c8c8c' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card variant="borderless">
                <Statistic
                  title="总存储容量"
                  value={(statsData.totalStorage / 1000).toFixed(1)}
                  suffix="TB"
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 资源使用情况 */}
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} md={12}>
              <Card title="CPU使用率" variant="borderless">
                <div style={{ textAlign: 'center' }}>
                  <Progress type="dashboard" percent={statsData.cpuUsage} />
                  <div style={{ marginTop: 10 }}>总使用率: {statsData.cpuUsage}%</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="内存使用率" variant="borderless">
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="dashboard"
                    percent={statsData.memoryUsage}
                    strokeColor={statsData.memoryUsage > 80 ? '#ff4d4f' : '#faad14'}
                  />
                  <div style={{ marginTop: 10 }}>总使用率: {statsData.memoryUsage}%</div>
                </div>
              </Card>
            </Col>
          </Row>

          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                创建虚拟机
              </Button>
              <Button icon={<ImportOutlined />} onClick={showImportModal}>
                导入虚拟机
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size={tableSize}
            scroll={{ x: 'max-content' }}
            tableLayout="fixed"
            rowSelection={rowSelections} // 添加行选择配置
          />
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

  // 处理文件上传前的校验
  const beforeUpload = (file: RcFile) => {
    const isJson = file.type === 'application/json';
    const isCsv = file.type === 'text/csv';

    if (!isJson && !isCsv) {
      messageApi.error('仅支持上传JSON或CSV文件!');
      return false;
    }
    return true;
  };

  // 下载导入模板
  const downloadTemplate = () => {
    const template = [
      {
        name: '虚拟机示例-01',
        os: 'CentOS 8',
        cpu: 2,
        memory: 4,
        storage: 50,
        network: 'default',
        description: '示例虚拟机描述',
      },
      {
        name: '虚拟机示例-02',
        os: 'Ubuntu 20.04',
        cpu: 4,
        memory: 8,
        storage: 100,
        network: 'isolated',
        description: '示例虚拟机描述',
      },
      {
        name: '虚拟机示例-03',
        os: 'CentOS 03',
        cpu: 3,
        memory: 34,
        storage: 67,
        network: 'default',
        description: '示例虚拟机描述',
      },
      {
        name: '虚拟机示例-04',
        os: 'Ubuntu 20.04',
        cpu: 12,
        memory: 64,
        storage: 84,
        network: 'isolated',
      },
    ];

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '虚拟机导入模板.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV解析为虚拟机数组
  const parseCsvToVirtualMachines = (csvContent: string): ImportVirtualMachine[] => {
    // 简单的CSV解析逻辑，实际应用中可以使用专业库如Papa Parse
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');

    return lines
      .slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',');
        const vm = {};

        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          if (header === 'cpu' || header === 'memory' || header === 'storage') {
            vm[header] = parseFloat(value);
          } else {
            vm[header] = value;
          }
        });

        return vm as ImportVirtualMachine;
      });
  };

  // 处理导入虚拟机
  const handleImport = async options => {
    const { file, onProgress, onSuccess, onError } = options;

    try {
      setImporting(true);

      // 显示通知，这里使用key以便后续可以更新同一个通知
      const notificationKey = `import-${Date.now()}`;
      setImportNotificationKey(notificationKey);

      notificationApi.open({
        key: notificationKey,
        message: '导入虚拟机正在执行中',
        description: <Progress percent={0} />,
        duration: 0,
        icon: <CloudUploadOutlined style={{ color: '#1890ff' }} />,
      });

      // 读取文件内容
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = async e => {
        try {
          let vmList: ImportVirtualMachine[] = [];

          if (file.type === 'application/json') {
            vmList = JSON.parse(e.target?.result as string);
          } else if (file.type === 'text/csv') {
            vmList = parseCsvToVirtualMachines(e.target?.result as string);
          }

          setTotalToImport(vmList.length);

          // 模拟导入进度
          // 实际应用中这里应该调用后端API进行批量导入
          for (let i = 0; i < vmList.length; i++) {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 更新进度
            const currentProgress = Math.round(((i + 1) / vmList.length) * 100);
            setImportProgress(currentProgress);
            setImportedCount(i + 1);

            // 更新通知中的进度条
            notificationApi.open({
              key: notificationKey,
              message: '导入虚拟机正在执行中',
              description: (
                <>
                  <Progress percent={currentProgress} />
                  <div>
                    已完成: {i + 1}/{vmList.length}
                  </div>
                </>
              ),
              duration: 0,
              icon: <CloudUploadOutlined style={{ color: '#1890ff' }} />,
            });

            onProgress({ percent: currentProgress });
          }

          // 导入完成
          onSuccess('导入成功');
          messageApi.success(`成功导入 ${vmList.length} 台虚拟机`);

          // 更新通知为成功状态
          notificationApi.open({
            key: notificationKey,
            message: '导入虚拟机完成',
            description: (
              <>
                <Progress percent={100} status="success" />
                <div>
                  已成功导入: {vmList.length}/{vmList.length}
                </div>
              </>
            ),
            duration: 5,
            icon: <CloudUploadOutlined style={{ color: '#52c41a' }} />,
          });

          // 刷新数据（实际应用中应该调用API获取最新数据）
          // fetchVirtualMachines();

          // 关闭导入模态框
          setIsImportModalVisible(false);
        } catch (error) {
          console.error('解析文件失败:', error);
          onError({ event: error });
          messageApi.error('解析文件失败');

          // 更新通知为错误状态
          notificationApi.open({
            key: notificationKey,
            message: '导入虚拟机失败',
            description: '解析文件失败，请检查文件格式是否正确',
            duration: 5,
            icon: <CloudUploadOutlined style={{ color: '#ff4d4f' }} />,
          });
        }
      };

      reader.onerror = error => {
        onError({ event: error });
        messageApi.error('读取文件失败');

        notificationApi.open({
          key: notificationKey,
          message: '导入虚拟机失败',
          description: '读取文件失败，请重试',
          duration: 5,
          icon: <CloudUploadOutlined style={{ color: '#ff4d4f' }} />,
        });
      };
    } catch (error) {
      console.error('导入过程中出错:', error);
      onError({ event: error });
      messageApi.error('导入过程中出错');

      if (importNotificationKey) {
        notificationApi.open({
          key: importNotificationKey,
          message: '导入虚拟机失败',
          description: '导入过程中出错，请重试',
          duration: 5,
          icon: <CloudUploadOutlined style={{ color: '#ff4d4f' }} />,
        });
      }
    } finally {
      setImporting(false);
    }
  };

  return (
    <App>
      <div className="virtual-machines-container">
        {contextHolder}
        {notificationContextHolder}
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
          // 在移动设备上使用全屏模式
          style={{ maxWidth: '100vw', margin: 0 }}
          // 移动设备上底部按钮使用固定位置
          bodyStyle={{
            maxHeight: 'calc(100vh - 200px)',
            overflow: 'auto',
          }}
          centered
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

        {/* 导入虚拟机模态框 */}
        <Modal
          title="导入虚拟机"
          open={isImportModalVisible}
          onCancel={handleImportCancel}
          footer={null}
          width={550}
          style={{ maxWidth: '100vw', margin: 0 }}
          centered
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ marginBottom: 20 }}>支持以JSON或CSV格式批量导入虚拟机</p>

            <Dragger
              name="file"
              multiple={false}
              customRequest={handleImport}
              beforeUpload={beforeUpload}
              showUploadList={false}
              disabled={importing}
              accept=".json,.csv"
              style={{ padding: '20px 0' }}
            >
              <p className="ant-upload-drag-icon">
                <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">支持JSON或CSV格式的虚拟机配置文件</p>
            </Dragger>

            <div style={{ marginTop: 15 }}>
              <Button type="link" onClick={downloadTemplate} icon={<DownloadOutlined />}>
                下载导入模板
              </Button>
            </div>

            {importing && (
              <div style={{ marginTop: 20 }}>
                <Progress
                  percent={importProgress}
                  status="active"
                  format={() => `${importedCount}/${totalToImport}`}
                />
                <div style={{ marginTop: 10 }}>正在导入中，请勿关闭窗口...</div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </App>
  );
};

export default VirtualMachines;
