/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-28 11:39:27
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-04-28 11:42:26
 * @FilePath: /virtualization-platform/src/pages/500/index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

const ServerError: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Result
        status="500"
        title="500"
        subTitle="抱歉，服务器出错了"
        extra={[
          <Button type="primary" key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
            返回首页
          </Button>,
          <Button key="reload" icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
            重新加载
          </Button>,
        ]}
      />
      <div style={{ marginTop: 20, color: 'rgba(0, 0, 0, 0.45)' }}>
        错误代码: 500 - 服务器内部错误
      </div>
    </div>
  );
};

export default ServerError;
