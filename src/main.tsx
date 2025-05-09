import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import './index.css';
import routes from './routers/routes';
import { persistor, store } from './store';

// 创建路由
const router = createBrowserRouter(routes);

// 渲染应用
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          locale={zhCN}
          theme={{
            token: {
              colorPrimary: '#1890ff',
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
