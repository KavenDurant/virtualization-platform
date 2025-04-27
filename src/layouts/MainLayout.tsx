import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Dropdown, Avatar, Button, Drawer, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  BellOutlined,
  AppstoreOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import '../styles/layout.less';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 监听窗口大小变化
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 576);
      setIsSmall(window.innerWidth < 992 && window.innerWidth >= 576);
      if (window.innerWidth < 992) {
        setCollapsed(true);
      }
    };

    // 初始检查
    checkScreenSize();

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // 菜单项配置
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/virtual-machines',
      icon: <DesktopOutlined />,
      label: '虚拟机管理',
    },
    {
      key: '/storage',
      icon: <DatabaseOutlined />,
      label: '存储管理',
    },
    {
      key: '/network',
      icon: <GlobalOutlined />,
      label: '网络管理',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 根据当前路径生成面包屑项
  const getBreadcrumbItems = () => {
    // 将菜单项转换为映射，方便查找
    const menuMap = menuItems.reduce(
      (acc, item) => {
        acc[item.key] = item.label;
        return acc;
      },
      {} as Record<string, string>
    );

    // 如果是首页或仪表盘
    if (location.pathname === '/' || location.pathname === '/dashboard') {
      return [
        {
          title: (
            <span>
              <HomeOutlined /> 首页
            </span>
          ),
          key: 'home',
        },
      ];
    }

    // 解析当前路径
    const pathParts = location.pathname.split('/').filter(Boolean);
    let currentPath = '';

    // 生成面包屑项
    const breadcrumbItems = [
      {
        title: (
          <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <HomeOutlined /> 首页
          </span>
        ),
        key: 'home',
      },
    ];

    // 添加路径部分
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;

      // 如果在菜单映射中存在
      if (menuMap[currentPath]) {
        breadcrumbItems.push({
          title:
            index === pathParts.length - 1 ? (
              <span>{menuMap[currentPath]}</span>
            ) : (
              <span onClick={() => navigate(currentPath)} style={{ cursor: 'pointer' }}>
                {menuMap[currentPath]}
              </span>
            ),
          key: part,
        });
      } else {
        // 未知路径，添加格式化的标题
        const formattedTitle = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
        breadcrumbItems.push({
          title: <span>{formattedTitle}</span>,
          key: part,
        });
      }
    });

    return breadcrumbItems;
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: '1',
      label: '个人资料',
      icon: <UserOutlined />,
    },
    {
      key: '2',
      label: '系统设置',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider' as const,
    },
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  const handleUserMenuClick = (e: { key: string }) => {
    if (e.key === '3') {
      // 退出登录逻辑
      navigate('/login');
    } else if (e.key === '2') {
      navigate('/settings');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 非移动设备时显示侧边栏 */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme="dark"
          className="main-sider"
          breakpoint="lg"
          onBreakpoint={broken => {
            setCollapsed(broken);
          }}
        >
          <div className="logo">
            <h1>{collapsed ? 'VP' : '虚拟化平台'}</h1>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={e => {
              handleMenuClick(e);
              if (isSmall) {
                setCollapsed(true);
              }
            }}
          />
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            border: '1px solid #cccece',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <div className="header-container">
            {/* 非移动设备时显示折叠按钮 */}
            {!isMobile && (
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="trigger-button"
              />
            )}

            {/* 移动设备时显示菜单按钮 */}
            {isMobile && (
              <Button
                type="text"
                icon={<AppstoreOutlined />}
                onClick={() => setDrawerOpen(true)}
                className="mobile-menu-button"
              />
            )}

            {/* LOGO - 仅在移动设备上显示 */}
            {isMobile && (
              <div className="mobile-logo">
                <h2>虚拟化平台</h2>
              </div>
            )}

            <div className="header-right">
              <Button type="text" icon={<BellOutlined />} className="notification-button" />
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: handleUserMenuClick,
                }}
                placement="bottomRight"
              >
                <div className="user-info">
                  <Avatar icon={<UserOutlined />} />
                  <span className="username">管理员</span>
                </div>
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className="content-container"
          style={{
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
            height: 'calc(100vh - 64px)', // 88px = header(64px) + margin(24px)
          }}
        >
          <div className="breadcrumb-container">
            <Breadcrumb items={getBreadcrumbItems()} />
          </div>
          <div className="content-inner" style={{ marginTop: 16 }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      {/* 移动设备上的抽屉式菜单 */}
      {isMobile && (
        <Drawer
          title="菜单"
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={250}
          styles={{ body: { padding: 0 } }}
        >
          <div className="drawer-logo" style={{ padding: '16px', textAlign: 'center' }}>
            <h3>虚拟化平台</h3>
          </div>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={e => {
              handleMenuClick(e);
              setDrawerOpen(false);
            }}
          />
        </Drawer>
      )}
    </Layout>
  );
};

export default MainLayout;
