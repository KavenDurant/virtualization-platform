import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  InputNumber,
  Space,
  message,
  Upload,
  Divider,
  Typography,
  Radio,
  Row,
  Col,
} from 'antd';
import {
  SettingOutlined,
  SecurityScanOutlined,
  MailOutlined,
  CloudServerOutlined,
  SafetyOutlined,
  UploadOutlined,
  SaveOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { TabsProps } from 'antd';
import type { UploadFile, UploadChangeParam } from 'antd/es/upload/interface';

const { Option } = Select;
const { Title, Paragraph } = Typography;

// 定义表单值的接口
interface GeneralFormValues {
  systemName: string;
  systemLogo?: UploadFile[];
  adminEmail: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  sessionTimeout: number;
  showWelcome: boolean;
}

interface SecurityFormValues {
  useHttps: boolean;
  tlsVersion?: string;
  sslCert?: UploadFile[];
  sslKey?: UploadFile[];
  passwordPolicy: string;
  minPasswordLength: number;
  passwordExpireDays: number;
  lockAfterFailures: number;
  useTwoFactor: boolean;
  twoFactorMethod?: string;
  allowedIpRanges?: string;
  enableFirewall: boolean;
  auditLogRetention: number;
}

interface EmailFormValues {
  smtpServer: string;
  smtpPort: number;
  smtpSecure: string;
  smtpUser: string;
  smtpPassword: string;
  emailFrom: string;
  enableEmailAlerts: boolean;
}

interface BackupFormValues {
  enableAutoBackup: boolean;
  backupFrequency: string;
  backupTime: string;
  backupType: string;
  backupPath?: string;
  nfsServer?: string;
  nfsPath?: string;
  ftpServer?: string;
  ftpUser?: string;
  ftpPassword?: string;
  ftpPath?: string;
  s3Endpoint?: string;
  s3Bucket?: string;
  s3AccessKey?: string;
  s3SecretKey?: string;
  s3Region?: string;
  retentionCount: number;
  compressBackup: boolean;
}

const Settings: React.FC = () => {
  const [generalForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [backupForm] = Form.useForm();

  const [logoFile, setLogoFile] = useState<UploadFile[]>([]);
  const [useHttps, setUseHttps] = useState(true);
  const [useTwoFactor, setUseTwoFactor] = useState(false);
  const [backupType, setBackupType] = useState('local');

  // 处理表单提交
  const handleGeneralSubmit = (values: GeneralFormValues) => {
    console.log('提交一般设置:', values);
    message.success('一般设置已保存');
  };

  const handleSecuritySubmit = (values: SecurityFormValues) => {
    console.log('提交安全设置:', values);
    message.success('安全设置已保存');
  };

  const handleEmailSubmit = (values: EmailFormValues) => {
    console.log('提交邮件设置:', values);
    message.success('邮件设置已保存');
  };

  const handleBackupSubmit = (values: BackupFormValues) => {
    console.log('提交备份设置:', values);
    message.success('备份设置已保存');
  };

  // 测试邮件连接
  const handleTestEmail = () => {
    message.loading('正在发送测试邮件...', 1.5).then(() => message.success('测试邮件发送成功!'));
  };

  // 测试备份连接
  const handleTestBackup = () => {
    message.loading('正在测试备份连接...', 1.5).then(() => message.success('备份连接测试成功!'));
  };

  // 手动备份
  const handleManualBackup = () => {
    message.loading('正在执行备份...', 2).then(() => message.success('备份执行成功!'));
  };

  // 上传处理
  const handleLogoChange = (info: UploadChangeParam) => {
    setLogoFile(info.fileList);

    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 表单项的布局
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  // 表单按钮的布局
  const buttonItemLayout = {
    wrapperCol: { span: 14, offset: 6 },
  };

  // 标签页配置
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: (
        <span>
          <SettingOutlined />
          基本设置
        </span>
      ),
      children: (
        <Form
          {...formItemLayout}
          form={generalForm}
          onFinish={handleGeneralSubmit}
          initialValues={{
            systemName: '虚拟化平台',
            adminEmail: 'admin@example.com',
            language: 'zh_CN',
            timezone: 'Asia/Shanghai',
            dateFormat: 'YYYY-MM-DD',
            timeFormat: 'HH:mm:ss',
            sessionTimeout: 30,
            showWelcome: true,
          }}
        >
          <Title level={4}>基本设置</Title>
          <Paragraph>配置系统的基本参数</Paragraph>
          <Divider />

          <Form.Item
            name="systemName"
            label="系统名称"
            rules={[{ required: true, message: '请输入系统名称' }]}
          >
            <Input placeholder="请输入系统名称" />
          </Form.Item>

          <Form.Item name="systemLogo" label="系统Logo">
            <Upload
              action="/api/upload/logo"
              listType="picture"
              maxCount={1}
              fileList={logoFile}
              onChange={handleLogoChange}
            >
              <Button icon={<UploadOutlined />}>上传Logo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="adminEmail"
            label="管理员邮箱"
            rules={[
              { required: true, message: '请输入管理员邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入管理员邮箱" />
          </Form.Item>

          <Form.Item
            name="language"
            label="系统语言"
            rules={[{ required: true, message: '请选择系统语言' }]}
          >
            <Select placeholder="请选择系统语言">
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="timezone"
            label="时区"
            rules={[{ required: true, message: '请选择时区' }]}
          >
            <Select placeholder="请选择时区">
              <Option value="Asia/Shanghai">中国标准时间 (UTC+8)</Option>
              <Option value="America/New_York">美国东部时间</Option>
              <Option value="Europe/London">格林威治标准时间</Option>
              <Option value="Asia/Tokyo">日本标准时间</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="dateFormat"
            label="日期格式"
            rules={[{ required: true, message: '请选择日期格式' }]}
          >
            <Select placeholder="请选择日期格式">
              <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
              <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
              <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="timeFormat"
            label="时间格式"
            rules={[{ required: true, message: '请选择时间格式' }]}
          >
            <Select placeholder="请选择时间格式">
              <Option value="HH:mm:ss">24小时制 (HH:mm:ss)</Option>
              <Option value="hh:mm:ss a">12小时制 (hh:mm:ss a)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sessionTimeout"
            label="会话超时(分钟)"
            rules={[{ required: true, message: '请输入会话超时时间' }]}
          >
            <InputNumber min={5} max={120} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="showWelcome" label="显示欢迎信息" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <SecurityScanOutlined />
          安全设置
        </span>
      ),
      children: (
        <Form
          {...formItemLayout}
          form={securityForm}
          onFinish={handleSecuritySubmit}
          initialValues={{
            useHttps: true,
            tlsVersion: 'TLSv1.3',
            passwordPolicy: 'medium',
            minPasswordLength: 8,
            passwordExpireDays: 90,
            lockAfterFailures: 5,
            useTwoFactor: false,
            twoFactorMethod: 'totp',
            allowedIpRanges: '',
            enableFirewall: true,
            auditLogRetention: 365,
          }}
        >
          <Title level={4}>安全设置</Title>
          <Paragraph>配置系统的安全参数，确保符合国保测要求</Paragraph>
          <Divider />

          <Form.Item name="useHttps" label="使用HTTPS" valuePropName="checked">
            <Switch checked={useHttps} onChange={setUseHttps} />
          </Form.Item>

          {useHttps && (
            <>
              <Form.Item
                name="tlsVersion"
                label="TLS版本"
                rules={[{ required: true, message: '请选择TLS版本' }]}
              >
                <Select placeholder="请选择TLS版本">
                  <Option value="TLSv1.2">TLS 1.2</Option>
                  <Option value="TLSv1.3">TLS 1.3 (推荐)</Option>
                </Select>
              </Form.Item>

              <Form.Item name="sslCert" label="SSL证书">
                <Upload action="/api/upload/cert" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传SSL证书</Button>
                </Upload>
              </Form.Item>

              <Form.Item name="sslKey" label="SSL私钥">
                <Upload action="/api/upload/key" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传SSL私钥</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          <Form.Item
            name="passwordPolicy"
            label="密码策略"
            rules={[{ required: true, message: '请选择密码策略' }]}
          >
            <Select placeholder="请选择密码策略">
              <Option value="weak">弱 (仅长度限制)</Option>
              <Option value="medium">中 (包含字母和数字)</Option>
              <Option value="strong">强 (包含大小写字母、数字和特殊字符)</Option>
              <Option value="custom">自定义</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="minPasswordLength"
            label="最小密码长度"
            rules={[{ required: true, message: '请输入最小密码长度' }]}
          >
            <InputNumber min={6} max={16} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="passwordExpireDays"
            label="密码过期天数"
            rules={[{ required: true, message: '请输入密码过期天数' }]}
          >
            <InputNumber min={0} max={365} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="lockAfterFailures"
            label="失败锁定次数"
            rules={[{ required: true, message: '请输入失败锁定次数' }]}
            tooltip="连续登录失败指定次数后锁定账户，0表示不锁定"
          >
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="useTwoFactor" label="双因素认证" valuePropName="checked">
            <Switch checked={useTwoFactor} onChange={setUseTwoFactor} />
          </Form.Item>

          {useTwoFactor && (
            <Form.Item
              name="twoFactorMethod"
              label="认证方式"
              rules={[{ required: true, message: '请选择双因素认证方式' }]}
            >
              <Radio.Group>
                <Radio value="totp">TOTP (时间密码)</Radio>
                <Radio value="sms">短信验证码</Radio>
                <Radio value="email">邮件验证码</Radio>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item
            name="allowedIpRanges"
            label="允许的IP范围"
            tooltip="多个IP/范围请用逗号分隔，留空表示允许所有IP"
          >
            <Input placeholder="例如: 192.168.1.0/24,10.0.0.1" />
          </Form.Item>

          <Form.Item name="enableFirewall" label="启用防火墙" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="auditLogRetention"
            label="审计日志保留天数"
            rules={[{ required: true, message: '请输入审计日志保留天数' }]}
          >
            <InputNumber min={30} max={3650} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} danger>
              保存安全设置
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <MailOutlined />
          邮件设置
        </span>
      ),
      children: (
        <Form
          {...formItemLayout}
          form={emailForm}
          onFinish={handleEmailSubmit}
          initialValues={{
            smtpServer: 'smtp.example.com',
            smtpPort: 587,
            smtpSecure: 'tls',
            smtpUser: 'system@example.com',
            emailFrom: 'system@example.com',
            enableEmailAlerts: true,
          }}
        >
          <Title level={4}>邮件设置</Title>
          <Paragraph>配置系统的邮件服务器参数</Paragraph>
          <Divider />

          <Form.Item
            name="smtpServer"
            label="SMTP服务器"
            rules={[{ required: true, message: '请输入SMTP服务器' }]}
          >
            <Input placeholder="请输入SMTP服务器地址" />
          </Form.Item>

          <Form.Item
            name="smtpPort"
            label="SMTP端口"
            rules={[{ required: true, message: '请输入SMTP端口' }]}
          >
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="smtpSecure"
            label="连接安全"
            rules={[{ required: true, message: '请选择连接安全类型' }]}
          >
            <Select placeholder="请选择连接安全类型">
              <Option value="none">无</Option>
              <Option value="ssl">SSL</Option>
              <Option value="tls">TLS</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="smtpUser"
            label="SMTP用户名"
            rules={[{ required: true, message: '请输入SMTP用户名' }]}
          >
            <Input placeholder="请输入SMTP用户名" />
          </Form.Item>

          <Form.Item
            name="smtpPassword"
            label="SMTP密码"
            rules={[{ required: true, message: '请输入SMTP密码' }]}
          >
            <Input.Password placeholder="请输入SMTP密码" />
          </Form.Item>

          <Form.Item
            name="emailFrom"
            label="发件人地址"
            rules={[
              { required: true, message: '请输入发件人地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input placeholder="请输入发件人地址" />
          </Form.Item>

          <Form.Item name="enableEmailAlerts" label="启用邮件警报" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button onClick={handleTestEmail} icon={<MailOutlined />}>
                发送测试邮件
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <CloudServerOutlined />
          备份设置
        </span>
      ),
      children: (
        <Form
          {...formItemLayout}
          form={backupForm}
          onFinish={handleBackupSubmit}
          initialValues={{
            enableAutoBackup: true,
            backupFrequency: 'daily',
            backupTime: '02:00',
            backupType: 'local',
            backupPath: '/var/backups/virtualization-platform',
            retentionCount: 7,
            compressBackup: true,
          }}
        >
          <Title level={4}>备份设置</Title>
          <Paragraph>配置系统的自动备份参数</Paragraph>
          <Divider />

          <Form.Item name="enableAutoBackup" label="启用自动备份" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            name="backupFrequency"
            label="备份频率"
            rules={[{ required: true, message: '请选择备份频率' }]}
          >
            <Select placeholder="请选择备份频率">
              <Option value="hourly">每小时</Option>
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="backupTime"
            label="备份时间"
            rules={[{ required: true, message: '请输入备份时间' }]}
          >
            <Input placeholder="请输入备份时间，例如: 02:00" />
          </Form.Item>

          <Form.Item
            name="backupType"
            label="备份类型"
            rules={[{ required: true, message: '请选择备份类型' }]}
          >
            <Select placeholder="请选择备份类型" value={backupType} onChange={setBackupType}>
              <Option value="local">本地备份</Option>
              <Option value="nfs">NFS</Option>
              <Option value="ftp">FTP</Option>
              <Option value="s3">S3兼容存储</Option>
            </Select>
          </Form.Item>

          {backupType === 'local' && (
            <Form.Item
              name="backupPath"
              label="备份路径"
              rules={[{ required: true, message: '请输入备份路径' }]}
            >
              <Input placeholder="请输入本地备份路径" />
            </Form.Item>
          )}

          {backupType === 'nfs' && (
            <>
              <Form.Item
                name="nfsServer"
                label="NFS服务器"
                rules={[{ required: true, message: '请输入NFS服务器' }]}
              >
                <Input placeholder="请输入NFS服务器地址" />
              </Form.Item>
              <Form.Item
                name="nfsPath"
                label="NFS路径"
                rules={[{ required: true, message: '请输入NFS路径' }]}
              >
                <Input placeholder="请输入NFS导出路径" />
              </Form.Item>
            </>
          )}

          {backupType === 'ftp' && (
            <>
              <Form.Item
                name="ftpServer"
                label="FTP服务器"
                rules={[{ required: true, message: '请输入FTP服务器' }]}
              >
                <Input placeholder="请输入FTP服务器地址" />
              </Form.Item>
              <Form.Item
                name="ftpUser"
                label="FTP用户名"
                rules={[{ required: true, message: '请输入FTP用户名' }]}
              >
                <Input placeholder="请输入FTP用户名" />
              </Form.Item>
              <Form.Item
                name="ftpPassword"
                label="FTP密码"
                rules={[{ required: true, message: '请输入FTP密码' }]}
              >
                <Input.Password placeholder="请输入FTP密码" />
              </Form.Item>
              <Form.Item
                name="ftpPath"
                label="FTP路径"
                rules={[{ required: true, message: '请输入FTP路径' }]}
              >
                <Input placeholder="请输入FTP目录路径" />
              </Form.Item>
            </>
          )}

          {backupType === 's3' && (
            <>
              <Form.Item
                name="s3Endpoint"
                label="S3端点"
                rules={[{ required: true, message: '请输入S3端点' }]}
              >
                <Input placeholder="请输入S3端点URL" />
              </Form.Item>
              <Form.Item
                name="s3Bucket"
                label="S3存储桶"
                rules={[{ required: true, message: '请输入S3存储桶' }]}
              >
                <Input placeholder="请输入S3存储桶名称" />
              </Form.Item>
              <Form.Item
                name="s3AccessKey"
                label="访问密钥ID"
                rules={[{ required: true, message: '请输入访问密钥ID' }]}
              >
                <Input placeholder="请输入访问密钥ID" />
              </Form.Item>
              <Form.Item
                name="s3SecretKey"
                label="秘密访问密钥"
                rules={[{ required: true, message: '请输入秘密访问密钥' }]}
              >
                <Input.Password placeholder="请输入秘密访问密钥" />
              </Form.Item>
              <Form.Item name="s3Region" label="区域">
                <Input placeholder="请输入S3区域（可选）" />
              </Form.Item>
            </>
          )}

          <Form.Item
            name="retentionCount"
            label="保留备份数量"
            rules={[{ required: true, message: '请输入保留备份数量' }]}
          >
            <InputNumber min={1} max={365} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="compressBackup" label="压缩备份" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item {...buttonItemLayout}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                保存设置
              </Button>
              <Button onClick={handleTestBackup} icon={<QuestionCircleOutlined />}>
                测试连接
              </Button>
              <Button onClick={handleManualBackup} icon={<SyncOutlined />}>
                立即备份
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: '5',
      label: (
        <span>
          <SafetyOutlined />
          安全扫描
        </span>
      ),
      children: (
        <div style={{ padding: '0 24px' }}>
          <Title level={4}>安全扫描</Title>
          <Paragraph>对系统进行安全性检查，确保符合国保测要求</Paragraph>
          <Divider />

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="漏洞扫描">
                <p>对系统进行漏洞扫描，发现潜在安全隐患</p>
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary">开始扫描</Button>
                  <Button>查看历史报告</Button>
                </Space>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="安全合规检查">
                <p>检查系统是否符合国保测要求和安全最佳实践</p>
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary">开始检查</Button>
                  <Button>查看最后报告</Button>
                </Space>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="安全加固">
                <p>根据安全扫描结果，对系统进行自动加固</p>
                <Space style={{ marginTop: 16 }}>
                  <Button type="primary" danger>
                    一键加固
                  </Button>
                  <Button>查看加固历史</Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="settings-container">
      <Card>
        <Tabs defaultActiveKey="1" items={items} type="card" />
      </Card>
    </div>
  );
};

export default Settings;
