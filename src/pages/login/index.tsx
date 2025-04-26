import React from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.less';

interface LoginFormValues {
  username: string;
  password: string;
  captcha: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: LoginFormValues) => {
    console.log('登录表单提交:', values);
    // 这里应该添加实际的登录API调用
    // 模拟登录成功
    message.success('登录成功！');
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <Card className="login-card">
        <div className="login-header">
          <h1>虚拟化平台</h1>
          <p>符合国保测标准的企业级虚拟化管理系统</p>
        </div>

        <Form
          name="login_form"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item name="captcha" rules={[{ required: true, message: '请输入验证码!' }]}>
            <div className="captcha-container">
              <Input prefix={<SafetyOutlined />} placeholder="验证码" size="large" />
              <div className="captcha-image">
                {/* 验证码图片区域 */}
                <div className="mock-captcha">1234</div>
              </div>
            </div>
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <a className="login-form-forgot" href="#">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              登录
            </Button>
          </Form.Item>

          <div className="login-footer">
            <p>Copyright © {new Date().getFullYear()} 虚拟化平台</p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
