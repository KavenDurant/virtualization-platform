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
  Switch,
  Tabs,
  Badge,
  Typography,
  Avatar,
  Popconfirm,
  TabsProps,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';

const { Option } = Select;
const { Title, Text } = Typography;
const { Password } = Input;

// 用户类型定义
interface User {
  id: string;
  username: string;
  realName: string;
  email: string;
  phone: string;
  role: 'admin' | 'operator' | 'user';
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  createdAt: string;
}

// 用户组类型定义
interface UserGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
  createdAt: string;
}

const Users: React.FC = () => {
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);
  const [isGroupModalVisible, setIsGroupModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userForm] = Form.useForm();
  const [groupForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // 模拟用户数据
  const userData: User[] = [
    {
      id: '1',
      username: 'admin',
      realName: '系统管理员',
      email: 'admin@example.com',
      phone: '13800138000',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-04-26 09:30:00',
      createdAt: '2023-01-01 00:00:00',
    },
    {
      id: '2',
      username: 'operator1',
      realName: '运维人员1',
      email: 'operator1@example.com',
      phone: '13800138001',
      role: 'operator',
      status: 'active',
      lastLogin: '2023-04-25 14:20:15',
      createdAt: '2023-01-10 10:15:30',
    },
    {
      id: '3',
      username: 'user1',
      realName: '普通用户1',
      email: 'user1@example.com',
      phone: '13800138002',
      role: 'user',
      status: 'inactive',
      lastLogin: '2023-04-15 08:30:45',
      createdAt: '2023-02-05 09:20:10',
    },
    {
      id: '4',
      username: 'user2',
      realName: '普通用户2',
      email: 'user2@example.com',
      phone: '13800138003',
      role: 'user',
      status: 'locked',
      lastLogin: '2023-03-10 16:45:20',
      createdAt: '2023-02-10 11:30:00',
    },
  ];

  // 模拟用户组数据
  const groupData: UserGroup[] = [
    {
      id: '1',
      name: '管理员组',
      description: '系统管理员组，拥有所有权限',
      memberCount: 1,
      permissions: ['system:all'],
      createdAt: '2023-01-01 00:00:00',
    },
    {
      id: '2',
      name: '运维组',
      description: '系统运维人员，拥有虚拟机、存储和网络管理权限',
      memberCount: 1,
      permissions: ['vm:all', 'storage:all', 'network:all'],
      createdAt: '2023-01-10 10:15:30',
    },
    {
      id: '3',
      name: '普通用户组',
      description: '普通用户，仅拥有虚拟机使用权限',
      memberCount: 2,
      permissions: ['vm:view', 'vm:use'],
      createdAt: '2023-02-05 09:20:10',
    },
  ];

  // 显示创建用户模态框
  const showUserModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      userForm.setFieldsValue({
        username: user.username,
        realName: user.realName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
    } else {
      setSelectedUser(null);
      userForm.resetFields();
    }
    setIsUserModalVisible(true);
  };

  // 处理创建/编辑用户
  const handleUserOk = () => {
    userForm
      .validateFields()
      .then(values => {
        console.log('表单提交-用户:', values);
        userForm.resetFields();
        setIsUserModalVisible(false);
        setSelectedUser(null);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭用户模态框
  const handleUserCancel = () => {
    userForm.resetFields();
    setIsUserModalVisible(false);
    setSelectedUser(null);
  };

  // 显示创建用户组模态框
  const showGroupModal = () => {
    setIsGroupModalVisible(true);
  };

  // 处理创建用户组
  const handleGroupOk = () => {
    groupForm
      .validateFields()
      .then(values => {
        console.log('表单提交-用户组:', values);
        groupForm.resetFields();
        setIsGroupModalVisible(false);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭用户组模态框
  const handleGroupCancel = () => {
    groupForm.resetFields();
    setIsGroupModalVisible(false);
  };

  // 显示修改密码模态框
  const showPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsPasswordModalVisible(true);
  };

  // 处理修改密码
  const handlePasswordOk = () => {
    passwordForm
      .validateFields()
      .then(values => {
        console.log('表单提交-密码修改:', values);
        passwordForm.resetFields();
        setIsPasswordModalVisible(false);
        setSelectedUser(null);
      })
      .catch(info => {
        console.log('表单验证失败:', info);
      });
  };

  // 关闭密码模态框
  const handlePasswordCancel = () => {
    passwordForm.resetFields();
    setIsPasswordModalVisible(false);
    setSelectedUser(null);
  };

  // 处理用户操作
  const handleUserAction = (action: string, user: User) => {
    console.log(`执行操作: ${action}，用户: ${user.username}`);
    // 在实际应用中，这里应该调用API来执行相应的操作
  };

  // 处理用户组操作
  const handleGroupAction = (action: string, group: UserGroup) => {
    console.log(`执行操作: ${action}，用户组: ${group.name}`);
    // 在实际应用中，这里应该调用API来执行相应的操作
  };

  // 渲染用户状态标签
  const renderUserStatusTag = (status: string) => {
    let color = 'green';
    let text = '活跃';

    if (status === 'inactive') {
      color = 'orange';
      text = '未激活';
    } else if (status === 'locked') {
      color = 'red';
      text = '已锁定';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 渲染用户角色标签
  const renderUserRoleTag = (role: string) => {
    let color = 'blue';
    let text = '用户';

    if (role === 'admin') {
      color = 'purple';
      text = '管理员';
    } else if (role === 'operator') {
      color = 'cyan';
      text = '运维人员';
    }

    return <Tag color={color}>{text}</Tag>;
  };

  // 用户表格列定义
  const userColumns: ColumnsType<User> = [
    {
      title: '用户名',
      key: 'username',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text>{record.username}</Text>
        </Space>
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: role => renderUserRoleTag(role),
      filters: [
        { text: '管理员', value: 'admin' },
        { text: '运维人员', value: 'operator' },
        { text: '用户', value: 'user' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: status => renderUserStatusTag(status),
      filters: [
        { text: '活跃', value: 'active' },
        { text: '未激活', value: 'inactive' },
        { text: '已锁定', value: 'locked' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      sorter: (a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showUserModal(record)}
            title="编辑"
          />
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => showPasswordModal(record)}
            title="修改密码"
          />
          {record.status === 'active' ? (
            <Button
              type="text"
              icon={<LockOutlined />}
              style={{ color: 'orange' }}
              onClick={() => handleUserAction('锁定', record)}
              title="锁定"
            />
          ) : record.status === 'locked' ? (
            <Button
              type="text"
              icon={<UnlockOutlined />}
              style={{ color: 'green' }}
              onClick={() => handleUserAction('解锁', record)}
              title="解锁"
            />
          ) : (
            <Button
              type="text"
              style={{ color: 'green' }}
              onClick={() => handleUserAction('激活', record)}
              title="激活"
            >
              激活
            </Button>
          )}
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleUserAction('删除', record)}
            okText="确定"
            cancelText="取消"
            disabled={record.username === 'admin'}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.username === 'admin'}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 用户组表格列定义
  const groupColumns: ColumnsType<UserGroup> = [
    {
      title: '组名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '成员数量',
      dataIndex: 'memberCount',
      key: 'memberCount',
      sorter: (a, b) => a.memberCount - b.memberCount,
    },
    {
      title: '权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: permissions => (
        <Space wrap>
          {permissions.map((perm: string) => (
            <Tag key={perm} color="blue">
              {perm}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleGroupAction('编辑', record)}
            title="编辑"
          />
          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={() => handleGroupAction('管理成员', record)}
            title="管理成员"
          />
          <Popconfirm
            title="确定要删除这个用户组吗？"
            onConfirm={() => handleGroupAction('删除', record)}
            okText="确定"
            cancelText="取消"
            disabled={record.name === '管理员组'}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              disabled={record.name === '管理员组'}
              title="删除"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 渲染用户概览
  const renderUserOverview = () => {
    const activeUsers = userData.filter(user => user.status === 'active').length;
    const inactiveUsers = userData.filter(user => user.status === 'inactive').length;
    const lockedUsers = userData.filter(user => user.status === 'locked').length;

    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 32 }}>
          <div>
            <Title level={4}>用户概览</Title>
            <div style={{ display: 'flex', gap: 16 }}>
              <Text>总用户数: {userData.length}</Text>
              <Text>活跃用户: {activeUsers}</Text>
              <Text>未激活: {inactiveUsers}</Text>
              <Text>已锁定: {lockedUsers}</Text>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  // 定义 Tabs 的 items 属性
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined />
          <Badge count={userData.length} offset={[10, 0]}>
            用户列表
          </Badge>
        </span>
      ),
      children: (
        <>
          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={() => showUserModal()}>
                创建用户
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table
            columns={userColumns}
            dataSource={userData}
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
          <TeamOutlined />
          <Badge count={groupData.length} offset={[10, 0]}>
            用户组
          </Badge>
        </span>
      ),
      children: (
        <>
          <div className="table-operations">
            <Space style={{ marginBottom: 16 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={showGroupModal}>
                创建用户组
              </Button>
              <Button icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </div>

          <Table
            columns={groupColumns}
            dataSource={groupData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="users-container">
      <h1>用户管理</h1>

      {renderUserOverview()}

      <Card>
        <Tabs defaultActiveKey="1" items={tabItems} />
      </Card>

      {/* 创建/编辑用户表单 */}
      <Modal
        title={selectedUser ? '编辑用户' : '创建用户'}
        open={isUserModalVisible}
        onOk={handleUserOk}
        onCancel={handleUserCancel}
        width={600}
      >
        <Form
          form={userForm}
          layout="vertical"
          name="userForm"
          initialValues={{
            role: 'user',
            status: 'active',
          }}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线' },
            ]}
          >
            <Input placeholder="请输入用户名" disabled={!!selectedUser} />
          </Form.Item>

          {!selectedUser && (
            <Form.Item
              name="password"
              label="密码"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, message: '密码至少8个字符' },
              ]}
            >
              <Password
                placeholder="请输入密码"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
              <Password
                placeholder="请输入密码"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          )}

          {!selectedUser && (
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Password
                placeholder="请确认密码"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
          )}

          <Form.Item
            name="realName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="电子邮箱"
            rules={[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱地址' },
            ]}
          >
            <Input placeholder="请输入电子邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              { required: true, message: '请输入手机号码' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' },
            ]}
          >
            <Input placeholder="请输入手机号码" />
          </Form.Item>

          <Form.Item name="role" label="角色" rules={[{ required: true, message: '请选择角色' }]}>
            <Select placeholder="请选择角色">
              <Option value="admin">管理员</Option>
              <Option value="operator">运维人员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态">
              <Option value="active">活跃</Option>
              <Option value="inactive">未激活</Option>
              <Option value="locked">已锁定</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建用户组表单 */}
      <Modal
        title="创建用户组"
        open={isGroupModalVisible}
        onOk={handleGroupOk}
        onCancel={handleGroupCancel}
        width={600}
      >
        <Form form={groupForm} layout="vertical" name="groupForm">
          <Form.Item
            name="name"
            label="组名称"
            rules={[{ required: true, message: '请输入组名称' }]}
          >
            <Input placeholder="请输入组名称" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="请输入组描述" />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="权限"
            rules={[{ required: true, message: '请选择至少一个权限' }]}
          >
            <Select mode="multiple" placeholder="请选择权限" style={{ width: '100%' }}>
              <Option value="system:all">系统管理权限（所有）</Option>
              <Option value="vm:all">虚拟机管理（所有）</Option>
              <Option value="vm:view">虚拟机查看</Option>
              <Option value="vm:create">虚拟机创建</Option>
              <Option value="vm:edit">虚拟机编辑</Option>
              <Option value="vm:delete">虚拟机删除</Option>
              <Option value="vm:use">虚拟机使用</Option>
              <Option value="storage:all">存储管理（所有）</Option>
              <Option value="storage:view">存储查看</Option>
              <Option value="storage:create">存储创建</Option>
              <Option value="storage:edit">存储编辑</Option>
              <Option value="storage:delete">存储删除</Option>
              <Option value="network:all">网络管理（所有）</Option>
              <Option value="network:view">网络查看</Option>
              <Option value="network:create">网络创建</Option>
              <Option value="network:edit">网络编辑</Option>
              <Option value="network:delete">网络删除</Option>
              <Option value="user:all">用户管理（所有）</Option>
              <Option value="user:view">用户查看</Option>
              <Option value="user:create">用户创建</Option>
              <Option value="user:edit">用户编辑</Option>
              <Option value="user:delete">用户删除</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码表单 */}
      <Modal
        title={`修改密码 - ${selectedUser?.username}`}
        open={isPasswordModalVisible}
        onOk={handlePasswordOk}
        onCancel={handlePasswordCancel}
        width={400}
      >
        <Form form={passwordForm} layout="vertical" name="passwordForm">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码至少8个字符' },
            ]}
          >
            <Password
              placeholder="请输入新密码"
              iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="确认新密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Password
              placeholder="请确认新密码"
              iconRender={visible => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item name="forceReset" valuePropName="checked">
            <Switch
              checkedChildren="下次登录需要修改密码"
              unCheckedChildren="下次登录需要修改密码"
              defaultChecked
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
