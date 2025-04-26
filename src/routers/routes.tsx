import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LazyLoad from '@/components/LazyLoad';

// 懒加载页面组件
const Dashboard = lazy(() => import('@/pages/dashboard'));
const VirtualMachines = lazy(() => import('@/pages/virtual-machines'));
const StorageManagement = lazy(() => import('@/pages/storage'));
const NetworkManagement = lazy(() => import('@/pages/network'));
const UserManagement = lazy(() => import('@/pages/users'));
const Settings = lazy(() => import('@/pages/settings'));
const Login = lazy(() => import('@/pages/login'));
const NotFound = lazy(() => import('@/pages/404'));

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
      {
        path: '/settings',
        element: LazyLoad(Settings),
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
