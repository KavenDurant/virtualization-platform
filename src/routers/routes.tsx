/*
 * @Author: KavenDurant luojiaxin888@gmail.com
 * @Date: 2025-04-27 09:06:01
 * @LastEditors: KavenDurant luojiaxin888@gmail.com
 * @LastEditTime: 2025-05-07 14:30:00
 * @FilePath: /virtualization-platform/src/routers/routes.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import LazyLoad from '@/components/LazyLoad';
import MainLayout from '@/layouts/MainLayout';
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/dashboard'));
const VirtualMachines = lazy(() => import('@/pages/virtual-machines'));
const StorageManagement = lazy(() => import('@/pages/storage'));
const NetworkManagement = lazy(() => import('@/pages/network'));
const UserManagement = lazy(() => import('@/pages/users'));
const Settings = lazy(() => import('@/pages/settings'));
const Login = lazy(() => import('@/pages/login'));
const NotFound = lazy(() => import('@/pages/404'));
const ServerError = lazy(() => import('@/pages/500'));

// 集群管理相关页面
const ClusterMonitoring = lazy(() => import('@/pages/cluster/monitoring'));
const ClusterFailover = lazy(() => import('@/pages/cluster/failover'));
const ClusterAlerts = lazy(() => import('@/pages/cluster/alerts'));
const ClusterConfig = lazy(() => import('@/pages/cluster/config'));
// 备份详情页面
const BackupDetail = lazy(() => import('@/pages/cluster/config/detail'));

// 路由配置
const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: LazyLoad(Dashboard),
      },
      {
        path: '/virtual-machines',
        element: LazyLoad(VirtualMachines),
      },
      {
        path: '/storage',
        element: LazyLoad(StorageManagement),
      },
      {
        path: '/network',
        element: LazyLoad(NetworkManagement),
      },
      {
        path: '/users',
        element: LazyLoad(UserManagement),
      },
      // 集群管理路由
      {
        path: '/cluster/monitoring',
        element: LazyLoad(ClusterMonitoring),
      },
      {
        path: '/cluster/failover',
        element: LazyLoad(ClusterFailover),
      },
      {
        path: '/cluster/alerts',
        element: LazyLoad(ClusterAlerts),
      },
      {
        path: '/cluster/config',
        element: LazyLoad(ClusterConfig),
      },
      // 添加备份详情页路由
      {
        path: '/cluster/config/:backupId',
        element: LazyLoad(BackupDetail),
      },
      {
        path: '/settings',
        element: LazyLoad(Settings),
      },
      {
        path: '/500',
        element: LazyLoad(ServerError),
      },
      {
        path: '*',
        element: LazyLoad(NotFound),
      },
    ],
  },
  {
    path: '/login',
    element: LazyLoad(Login),
  },
];

export default routes;
