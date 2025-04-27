import React, { useState } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Progress,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Tabs,
  Badge,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  HddOutlined,
  InboxOutlined,
  CloudUploadOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { Title, Text } = Typography;

// 存储池类型定义
interface StoragePool {
  id: string;
  name: string;
  type: 'local' | 'iscsi' | 'nfs' | 'ceph';
  status: 'active' | 'inactive' | 'error';
  totalCapacity: number;
  usedCapacity: number;
  path: string;
  createdAt: string;
}

// 存储卷类型定义
interface StorageVolume {
  id: string;
  name: string;
  poolName: string;
  size: number;
  format: 'qcow2' | 'raw' | 'vmdk';
  status: 'available' | 'in-use' | 'error';
  attachedTo: string;
  createdAt: string;
}

const Storage: React.FC = () => {
  const [isPoolModalVisible, setIsPoolModalVisible] = useState(false);
  const [isVolumeModalVisible, setIsVolumeModalVisible] = useState(false);
  const [poolForm] = Form.useForm();
  const [volumeForm] = Form.useForm();

  // 模拟存储池数据
  const poolData: StoragePool[] = [
    {
      id: '1',
      name: '本地存储池',
      type: 'local',
      status: 'active',
      totalCapacity: 1024,
      usedCapacity: 286,
      path: '/var/lib/libvirt/images',
      createdAt: '2023-04-15 09:30:00',
    },
    {
      id: '2',
      name: 'iSCSI存储池',
      type: 'iscsi',
      status: 'active',
      totalCapacity: 2048,
      usedCapacity: 512,
      path: 'iqn.2023-04.com.example:storage',
      createdAt: '2023-04-10 11:20:15',
    },
    {
      id: '3',
      name: 'NFS存储池',
      type: 'nfs',
      status: 'inactive',
      totalCapacity: 4096,
      usedCapacity: 1024,
      path: '192.168.1.100:/exports/nfs',
      createdAt: '2023-03-25 15:45:30',
    },
    {
      id: '4',
      name: 'Ceph存储池',
      type: 'ceph',
      status: 'error',
      totalCapacity: 8192,
      usedCapacity: 2048,
      path: 'ceph.pool',
      createdAt: '2023-03-20 10:15:00',
    },
  ];

  // 模拟存储卷数据
  const volumeData: StorageVolume[] = [
    {
      id: '1',
      name: 'web-server-disk-01',
      poolName: '本地存储池',
      size: 50,
      format: 'qcow2',
      status: 'in-use',
      attachedTo: 'Web服务器-01',
      createdAt: '2023-04-15 10:30:00',
    },
    {
      id: '2',
      name: 'db-server-disk-01',
      poolName: '本地存储池',
      size: 200,
      format: 'qcow2',
      status: 'in-use',
      attachedTo: '数据库服务器-01',
      createdAt: '2023-04-15 10:35:00',
    },
    {
      id: '3',
      name: 'backup-volume-01',
      poolName: 'NFS存储池',
      size: 500,
      format: 'raw',
      status: 'available',
      attachedTo: '',
      createdAt: '2023-04-10 09:15:00',
    },
    {
      id: '4',
      name: 'test-volume-01',
      poolName: 'iSCSI存储池',
      size: 100,
      format: 'vmdk',
      status: 'error',
      attachedTo: '',
      createdAt: '2023-04-05 14:20:00',
    },
  ];

  // 显示创建存储池模态框
  const showPoolModal = () => {
    setIsPoolModalVisible(true);
  };

  // 处理创建存储池
  const handlePoolOk = () => {
    poolForm
      .validateFields()
      .then(values => {
        console.log('表单提交-存储池:', values);
        poolForm.resetFields();
        setIsPoolModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭存储池模态框
  const handlePoolCancel = () => {
    poolForm.resetFields();
    setIsPoolModalVisible(false);
  };

  // 显示创建存储卷模态框
  const showVolumeModal = () => {
    setIsVolumeModalVisible(true);
  };

  // 处理创建存储卷
  const handleVolumeOk = () => {
    volumeForm
      .validateFields()
      .then(values => {
        console.log('表单提交-存储卷:', values);
        volumeForm.resetFields();
        setIsVolumeModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭存储卷模态框
  const handleVolumeCancel = () => {
    volumeForm.resetFields();
    setIsVolumeModalVisible(false);
  };

  // 处理操作
  const handleAction = (
    action: string,
    type: 'pool' | 'volume',
    record: StoragePool | StorageVolume
  ) => {
    console.log(`执行操作: ${action}，类型: ${type}，名称: ${record.name}`);
    // 在实际应用中，这里应该调用API来执行相应的操作
  };

  // 渲染存储池状态标签
  const renderPoolStatusTag = (status: string) => {
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

  // 渲染存储卷状态标签
  const renderVolumeStatusTag = (status: string) => {
    let color = 'green';
    let text = '可用';

    if (status === 'in-use') {
      color = 'blue';
      text = '使用中';
    } else if (status === 'error') {
      color = 'red';
      text = '错误';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 存储池表格列定义
  const poolColumns: ColumnsType<StoragePool> = [
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
          local: '本地存储',
          iscsi: 'iSCSI',
          nfs: 'NFS',
          ceph: 'Ceph',
        };
        return typeMap[type] || type;
      },
      filters: [
        { text: '本地存储', value: 'local' },
        { text: 'iSCSI', value: 'iscsi' },
        { text: 'NFS', value: 'nfs' },
        { text: 'Ceph', value: 'ceph' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderPoolStatusTag(status),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '未激活', value: 'inactive' },
        { text: '错误', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '容量',
      key: 'capacity',
      render: (_, record) => {
        const usagePercentage = Math.round((record.usedCapacity / record.totalCapacity) * 100);
        return (
          <div>
            <Progress
              percent={usagePercentage}
              size="small"
              status={usagePercentage > 80 ? 'exception' : undefined}
            />
            <div>
              {record.usedCapacity} GB / {record.totalCapacity} GB
            </div>
          </div>
        );
      },
      sorter: (a, b) => a.usedCapacity / a.totalCapacity - b.usedCapacity / b.totalCapacity,
    },
    {
      title: '路径/目标',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAction('编辑', 'pool', record)}
            title="编辑"
          />
          {record.status !== 'active' ? (
            <Button
              type="text"
              style={{ color: 'green' }}
              onClick={() => handleAction('激活', 'pool', record)}
              title="激活"
            >
              激活
            </Button>
          ) : (
            <Button
              type="text"
              style={{ color: 'orange' }}
              onClick={() => handleAction('停用', 'pool', record)}
              title="停用"
            >
              停用
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleAction('删除', 'pool', record)}
            title="删除"
          />
        </Space>
      ),
    },
  ];

  // 存储卷表格列定义
  const volumeColumns: ColumnsType<StorageVolume> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '存储池',
      dataIndex: 'poolName',
      key: 'poolName',
      filters: poolData.map(pool => ({ text: pool.name, value: pool.name })),
      onFilter: (value, record) => record.poolName === value,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: size => `${size} GB`,
      sorter: (a, b) => a.size - b.size,
    },
    {
      title: '格式',
      dataIndex: 'format',
      key: 'format',
      filters: [
        { text: 'qcow2', value: 'qcow2' },
        { text: 'raw', value: 'raw' },
        { text: 'vmdk', value: 'vmdk' },
      ],
      onFilter: (value, record) => record.format === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderVolumeStatusTag(status),
      filters: [
        { text: '可用', value: 'available' },
        { text: '使用中', value: 'in-use' },
        { text: '错误', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '挂载到',
      dataIndex: 'attachedTo',
      key: 'attachedTo',
      render: attachedTo => attachedTo || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'available' && (
            <Button
              type="text"
              style={{ color: 'blue' }}
              onClick={() => handleAction('挂载', 'volume', record)}
              title="挂载"
            >
              挂载
            </Button>
          )}
          {record.status === 'in-use' && (
            <Button
              type="text"
              style={{ color: 'orange' }}
              onClick={() => handleAction('卸载', 'volume', record)}
              title="卸载"
            >
              卸载
            </Button>
          )}
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleAction('编辑', 'volume', record)}
            title="编辑"
            disabled={record.status === 'in-use'}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleAction('删除', 'volume', record)}
            title="删除"
            disabled={record.status === 'in-use'}
          />
        </Space>
      ),
    },
  ];

  // 渲染存储池使用概览
  const renderStoragePoolOverview = () => {
    const totalCapacity = poolData.reduce((sum, pool) => sum + pool.totalCapacity, 0);
    const usedCapacity = poolData.reduce((sum, pool) => sum + pool.usedCapacity, 0);
    const usagePercentage = Math.round((usedCapacity / totalCapacity) * 100);

    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4}>存储池概览</Title>
            <div style={{ display: 'flex', gap: 16 }}>
              <Text>总容量: {totalCapacity} GB</Text>
              <Text>已使用: {usedCapacity} GB</Text>
              <Text>剩余: {totalCapacity - usedCapacity} GB</Text>
            </div>
          </div>
          <Progress
            type="circle"
            percent={usagePercentage}
            size={80}
            status={usagePercentage > 80 ? 'exception' : undefined}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="storage-container">
      {renderStoragePoolOverview()}

      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: (
                <span>
                  <HddOutlined />
                  <Badge count={poolData.length} offset={[10, 0]}>
                    存储池
                  </Badge>
                </span>
              ),
              children: (
                <>
                  <div className="table-operations">
                    <Space style={{ marginBottom: 16 }}>
                      <Button type="primary" icon={<PlusOutlined />} onClick={showPoolModal}>
                        创建存储池
                      </Button>
                      <Button icon={<ReloadOutlined />}>刷新</Button>
                    </Space>
                  </div>

                  <Table
                    columns={poolColumns}
                    dataSource={poolData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
            {
              key: '2',
              label: (
                <span>
                  <InboxOutlined />
                  <Badge count={volumeData.length} offset={[10, 0]}>
                    存储卷
                  </Badge>
                </span>
              ),
              children: (
                <>
                  <div className="table-operations">
                    <Space style={{ marginBottom: 16 }}>
                      <Button type="primary" icon={<PlusOutlined />} onClick={showVolumeModal}>
                        创建存储卷
                      </Button>
                      <Button icon={<CloudUploadOutlined />}>上传镜像</Button>
                      <Button icon={<ReloadOutlined />}>刷新</Button>
                    </Space>
                  </div>

                  <Table
                    columns={volumeColumns}
                    dataSource={volumeData}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </>
              ),
            },
          ]}
        />
      </Card>

      {/* 创建存储池表单 */}
      <Modal
        title="创建存储池"
        open={isPoolModalVisible}
        onOk={handlePoolOk}
        onCancel={handlePoolCancel}
        width={600}
      >
        <Form
          form={poolForm}
          layout="vertical"
          name="createStoragePoolForm"
          initialValues={{
            type: 'local',
          }}
        >
          <Form.Item
            name="name"
            label="存储池名称"
            rules={[{ required: true, message: '请输入存储池名称' }]}
          >
            <Input placeholder="请输入存储池名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="存储池类型"
            rules={[{ required: true, message: '请选择存储池类型' }]}
          >
            <Select placeholder="请选择存储池类型">
              <Option value="local">本地存储</Option>
              <Option value="iscsi">iSCSI</Option>
              <Option value="nfs">NFS</Option>
              <Option value="ceph">Ceph</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('type');

              if (type === 'local') {
                return (
                  <Form.Item
                    name="path"
                    label="存储路径"
                    rules={[{ required: true, message: '请输入存储路径' }]}
                  >
                    <Input placeholder="请输入本地存储路径，例如: /var/lib/libvirt/images" />
                  </Form.Item>
                );
              }

              if (type === 'iscsi') {
                return (
                  <>
                    <Form.Item
                      name="host"
                      label="iSCSI主机"
                      rules={[{ required: true, message: '请输入iSCSI主机地址' }]}
                    >
                      <Input placeholder="请输入iSCSI主机地址，例如: 192.168.1.100" />
                    </Form.Item>
                    <Form.Item
                      name="target"
                      label="iSCSI目标"
                      rules={[{ required: true, message: '请输入iSCSI目标' }]}
                    >
                      <Input placeholder="请输入iSCSI目标，例如: iqn.2023-04.com.example:storage" />
                    </Form.Item>
                  </>
                );
              }

              if (type === 'nfs') {
                return (
                  <>
                    <Form.Item
                      name="host"
                      label="NFS服务器"
                      rules={[{ required: true, message: '请输入NFS服务器地址' }]}
                    >
                      <Input placeholder="请输入NFS服务器地址，例如: 192.168.1.100" />
                    </Form.Item>
                    <Form.Item
                      name="path"
                      label="NFS导出路径"
                      rules={[{ required: true, message: '请输入NFS导出路径' }]}
                    >
                      <Input placeholder="请输入NFS导出路径，例如: /exports/nfs" />
                    </Form.Item>
                  </>
                );
              }

              if (type === 'ceph') {
                return (
                  <>
                    <Form.Item
                      name="monHosts"
                      label="Ceph监视器地址"
                      rules={[{ required: true, message: '请输入Ceph监视器地址' }]}
                    >
                      <Input placeholder="请输入Ceph监视器地址，例如: 192.168.1.101:6789,192.168.1.102:6789" />
                    </Form.Item>
                    <Form.Item
                      name="pool"
                      label="Ceph池名称"
                      rules={[{ required: true, message: '请输入Ceph池名称' }]}
                    >
                      <Input placeholder="请输入Ceph池名称，例如: libvirt-pool" />
                    </Form.Item>
                    <Form.Item
                      name="user"
                      label="Ceph用户名"
                      rules={[{ required: true, message: '请输入Ceph用户名' }]}
                    >
                      <Input placeholder="请输入Ceph用户名，例如: admin" />
                    </Form.Item>
                  </>
                );
              }

              return null;
            }}
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入存储池描述" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建存储卷表单 */}
      <Modal
        title="创建存储卷"
        open={isVolumeModalVisible}
        onOk={handleVolumeOk}
        onCancel={handleVolumeCancel}
        width={600}
      >
        <Form
          form={volumeForm}
          layout="vertical"
          name="createStorageVolumeForm"
          initialValues={{
            format: 'qcow2',
            size: 10,
          }}
        >
          <Form.Item
            name="name"
            label="存储卷名称"
            rules={[{ required: true, message: '请输入存储卷名称' }]}
          >
            <Input placeholder="请输入存储卷名称" />
          </Form.Item>

          <Form.Item
            name="poolId"
            label="存储池"
            rules={[{ required: true, message: '请选择存储池' }]}
          >
            <Select placeholder="请选择存储池">
              {poolData
                .filter(pool => pool.status === 'active')
                .map(pool => (
                  <Option key={pool.id} value={pool.id}>
                    {pool.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="size"
            label="大小 (GB)"
            rules={[{ required: true, message: '请输入存储卷大小' }]}
          >
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="format"
            label={
              <span>
                格式
                <Tooltip title="qcow2: 支持快照和精简配置，但性能略低；raw: 最佳性能但不支持快照；vmdk: 兼容VMware">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </span>
            }
            rules={[{ required: true, message: '请选择存储卷格式' }]}
          >
            <Select placeholder="请选择存储卷格式">
              <Option value="qcow2">qcow2</Option>
              <Option value="raw">raw</Option>
              <Option value="vmdk">vmdk</Option>
            </Select>
          </Form.Item>

          <Form.Item name="preallocation" label="预分配">
            <Select placeholder="请选择预分配方式" defaultValue="metadata">
              <Option value="off">关闭 (精简配置)</Option>
              <Option value="metadata">仅元数据</Option>
              <Option value="full">完全分配 (更好的性能)</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入存储卷描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Storage;
