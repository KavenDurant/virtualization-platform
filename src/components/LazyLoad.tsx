import React, { Suspense } from 'react';
import { Skeleton, Card, Row, Col } from 'antd';
import ErrorBoundary from './ErrorBoundary';

// 通用骨架屏
const GenericSkeleton: React.FC = () => (
  <div className="generic-skeleton" style={{ padding: '20px' }}>
    <Card>
      <Skeleton active paragraph={{ rows: 10 }} />
    </Card>
  </div>
);

// 仪表盘骨架屏
const DashboardSkeleton: React.FC = () => (
  <div className="dashboard-skeleton" style={{ padding: '20px' }}>
    {/* 顶部统计卡片 */}
    <Row gutter={[16, 16]}>
      {[1, 2, 3, 4].map(i => (
        <Col xs={24} sm={12} md={6} key={i}>
          <Card variant="borderless">
            <Skeleton active paragraph={{ rows: 1 }} />
          </Card>
        </Col>
      ))}
    </Row>

    {/* 资源使用情况 */}
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} md={12}>
        <Card>
          <Skeleton.Avatar
            active
            size={100}
            shape="circle"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <Skeleton active paragraph={{ rows: 1 }} style={{ marginTop: 16 }} />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <Skeleton.Avatar
            active
            size={100}
            shape="circle"
            style={{ margin: '0 auto', display: 'block' }}
          />
          <Skeleton active paragraph={{ rows: 1 }} style={{ marginTop: 16 }} />
        </Card>
      </Col>
    </Row>

    {/* 虚拟机列表 */}
    <Card style={{ marginTop: 16 }}>
      <Skeleton active paragraph={{ rows: 8 }} />
    </Card>
  </div>
);

// 管理页面骨架屏 (适用于虚拟机、存储、网络、用户管理)
const ManagementPageSkeleton: React.FC = () => (
  <div className="management-skeleton" style={{ padding: '20px' }}>
    {/* 概览卡片 */}
    <Card style={{ marginBottom: 16 }}>
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>

    {/* 标签页与表格 */}
    <Card>
      <Skeleton.Button active size="large" style={{ width: 100, marginRight: 10 }} />
      <Skeleton.Button active size="large" style={{ width: 100, marginRight: 10 }} />
      <Skeleton.Button active size="large" style={{ width: 100 }} />

      <div style={{ marginTop: 16, marginBottom: 16 }}>
        <Skeleton.Button active size="small" style={{ width: 80, marginRight: 8 }} />
        <Skeleton.Button active size="small" style={{ width: 80 }} />
      </div>

      <Skeleton active paragraph={{ rows: 8 }} />
    </Card>
  </div>
);

// 设置页面骨架屏
const SettingsSkeleton: React.FC = () => (
  <div className="settings-skeleton" style={{ padding: '20px' }}>
    <Card>
      <Skeleton.Button active size="large" style={{ width: 120, marginRight: 10 }} />
      <Skeleton.Button active size="large" style={{ width: 120, marginRight: 10 }} />
      <Skeleton.Button active size="large" style={{ width: 120, marginRight: 10 }} />
      <Skeleton.Button active size="large" style={{ width: 120 }} />

      <div style={{ marginTop: 20 }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
          <Col span={18}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
          <Col span={18}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
          <Col span={18}>
            <Skeleton active paragraph={{ rows: 1 }} />
          </Col>
        </Row>
      </div>
    </Card>
  </div>
);

// 登录页骨架屏
const LoginSkeleton: React.FC = () => (
  <div
    className="login-skeleton"
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
  >
    <Card style={{ width: 360, padding: '20px' }}>
      <Skeleton.Avatar
        active
        size={64}
        shape="circle"
        style={{ margin: '0 auto 20px', display: 'block' }}
      />
      <Skeleton active paragraph={{ rows: 3 }} />
    </Card>
  </div>
);

// 使用路径来决定显示哪种骨架屏
const getSkeletonByPathname = (pathname: string) => {
  if (pathname === '/dashboard') {
    return <DashboardSkeleton />;
  } else if (pathname === '/login') {
    return <LoginSkeleton />;
  } else if (pathname === '/settings') {
    return <SettingsSkeleton />;
  } else if (
    pathname === '/virtual-machines' ||
    pathname === '/storage' ||
    pathname === '/network' ||
    pathname === '/users'
  ) {
    return <ManagementPageSkeleton />;
  } else {
    return <GenericSkeleton />;
  }
};

// 路由加载组件
const LazyLoad = (
  Component:
    | React.LazyExoticComponent<React.FC<object>>
    | React.LazyExoticComponent<React.ComponentType<unknown>>
) => {
  // 由于无法在这里获取真实路由路径，我们使用路由配置中的路径推断
  // 推断组件可能的路径
  const getDefaultPathname = (): string => {
    const componentStr = Component.toString();

    if (componentStr.includes('Dashboard')) return '/dashboard';
    if (componentStr.includes('VirtualMachines')) return '/virtual-machines';
    if (componentStr.includes('StorageManagement')) return '/storage';
    if (componentStr.includes('NetworkManagement')) return '/network';
    if (componentStr.includes('UserManagement')) return '/users';
    if (componentStr.includes('Settings')) return '/settings';
    if (componentStr.includes('Login')) return '/login';

    return '/dashboard'; // 默认显示仪表盘骨架屏
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={getSkeletonByPathname(getDefaultPathname())}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyLoad;
