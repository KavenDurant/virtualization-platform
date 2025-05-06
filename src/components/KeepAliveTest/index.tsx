import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Switch,
} from 'antd';
import React, { useEffect, useState } from 'react';
import keepalive, { KeepAliveOptions } from '../../utils/keepalive';

/**
 * KeepAliveTest组件，用于测试和控制keepalive功能
 */
const KeepAliveTest: React.FC = () => {
  // 状态管理
  const [isActive, setIsActive] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{ success: boolean; time: Date } | null>(null);
  const [form] = Form.useForm();

  // 初始化时获取keepalive状态
  useEffect(() => {
    const status = keepalive.getStatus();
    setIsActive(status.active);
    setRetryCount(status.retryCount);

    // 定期更新状态
    const intervalId = setInterval(() => {
      const currentStatus = keepalive.getStatus();
      setIsActive(currentStatus.active);
      setRetryCount(currentStatus.retryCount);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      // 确保在组件卸载时停止keepalive以防止内存泄漏
      keepalive.stop();
    };
  }, []);

  // 开始keepalive
  const handleStart = () => {
    keepalive.start();
    setIsActive(true);
    setLastHeartbeat(new Date());
  };

  // 停止keepalive
  const handleStop = () => {
    keepalive.stop();
    setIsActive(false);
  };

  // 立即发送一次ping
  const handlePing = async () => {
    const result = await keepalive.ping();
    setPingResult({
      success: result,
      time: new Date(),
    });

    if (result) {
      setLastHeartbeat(new Date());
    }

    // 3秒后清除结果
    setTimeout(() => {
      setPingResult(null);
    }, 3000);
  };

  // 应用设置
  const handleApplySettings = (values: KeepAliveOptions) => {
    const wasActive = isActive;

    // 如果正在运行，先停止
    if (wasActive) {
      keepalive.stop();
    }

    // 更新选项
    keepalive.setOptions(values);

    // 如果之前在运行，则重新启动
    if (wasActive) {
      keepalive.start();
      setLastHeartbeat(new Date());
    }

    setShowSettings(false);
  };

  // 渲染心跳状态
  const renderHeartbeatStatus = () => {
    let status: 'success' | 'processing' | 'error' | 'warning' | 'default' = 'default';
    let statusText = '未启动';

    if (isActive) {
      if (retryCount === 0) {
        status = 'success';
        statusText = '正常';
      } else {
        status = 'warning';
        statusText = `重试中 (${retryCount})`;
      }
    }

    return <Badge status={status} text={statusText} />;
  };

  return (
    <div className="keepalive-test">
      {/* 控制面板 */}
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 状态显示 */}
        <Descriptions title="连接状态" bordered size="small">
          <Descriptions.Item label="心跳状态" span={3}>
            {renderHeartbeatStatus()}
          </Descriptions.Item>
          <Descriptions.Item label="服务状态" span={3}>
            {isActive ? (
              <Badge status="processing" text="运行中" />
            ) : (
              <Badge status="default" text="已停止" />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="上次心跳时间" span={3}>
            {lastHeartbeat ? lastHeartbeat.toLocaleString() : '无记录'}
          </Descriptions.Item>
        </Descriptions>

        {/* Ping结果显示 */}
        {pingResult && (
          <Alert
            message={pingResult.success ? 'Ping成功' : 'Ping失败'}
            description={`请求时间: ${pingResult.time.toLocaleTimeString()}`}
            type={pingResult.success ? 'success' : 'error'}
            showIcon
            closable
          />
        )}

        {/* 控制按钮 */}
        <div style={{ marginTop: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStart}
              disabled={isActive}
            >
              启动
            </Button>
            <Button danger icon={<PauseCircleOutlined />} onClick={handleStop} disabled={!isActive}>
              停止
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handlePing}>
              立即Ping
            </Button>
            <Button icon={<SettingOutlined />} onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? '隐藏设置' : '显示设置'}
            </Button>
          </Space>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <Card title="Keep-Alive 设置" style={{ marginTop: 16 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleApplySettings}
              initialValues={{
                interval: 30000,
                url: '/api/keepalive',
                maxRetries: 3,
                retryInterval: 5000,
                showErrorMessage: false,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="interval"
                    label="心跳间隔 (毫秒)"
                    rules={[{ required: true, message: '请输入心跳间隔' }]}
                  >
                    <InputNumber min={1000} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="url"
                    label="心跳请求URL"
                    rules={[{ required: true, message: '请输入心跳URL' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="maxRetries"
                    label="最大重试次数"
                    rules={[{ required: true, message: '请输入最大重试次数' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="retryInterval"
                    label="重试间隔 (毫秒)"
                    rules={[{ required: true, message: '请输入重试间隔' }]}
                  >
                    <InputNumber min={1000} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item name="showErrorMessage" valuePropName="checked" label="显示错误消息">
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  应用设置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        <Divider orientation="left">测试说明</Divider>
        <Alert
          message="心跳测试使用说明"
          description={
            <ul>
              <li>点击"启动"开始发送心跳包，系统将按设定的间隔定时发送</li>
              <li>点击"停止"结束心跳发送</li>
              <li>点击"立即Ping"可以立即发送一次心跳请求，测试连接</li>
              <li>通过"显示设置"可以调整心跳参数，包括间隔时间、URL等</li>
              <li>当心跳失败时，系统会自动重试，达到最大重试次数后停止</li>
              <li>当前示例中，心跳请求会发送到模拟的API端点</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </Space>
    </div>
  );
};

export default KeepAliveTest;
