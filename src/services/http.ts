import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

// 创建axios实例
const instance = axios.create({
  baseURL: '/api', // API的基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 从本地存储中获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 添加国保测相关的安全头部信息
    config.headers['X-Security-Token'] = generateSecurityToken();
    config.headers['X-Request-ID'] = generateRequestId();
    
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 验证响应数据的完整性和安全性
    if (!validateResponseSecurity(response)) {
      return Promise.reject(new Error('响应数据安全校验失败'));
    }
    
    return response.data;
  },
  (error: AxiosError) => {
    let errorMessage = '服务器错误，请稍后重试';
    
    if (error.response) {
      const status = error.response.status;
      
      // 根据状态码处理不同的错误情况
      switch (status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '用户未授权，请重新登录';
          // 跳转到登录页
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器错误';
          break;
        default:
          errorMessage = `请求错误 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '无法连接到服务器，请检查网络';
    }
    
    // 显示错误提示
    message.error(errorMessage);
    
    // 记录错误日志（可对接到日志系统）
    console.error('API请求错误:', error);
    
    return Promise.reject(error);
  }
);

// 生成安全令牌（模拟）
function generateSecurityToken(): string {
  // 在实际项目中，这应该基于某种算法，如HMAC
  return `ST-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

// 生成请求ID
function generateRequestId(): string {
  return `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

// 验证响应安全性（模拟）
function validateResponseSecurity(response: AxiosResponse): boolean {
  // 在实际项目中，应该检查响应的完整性和真实性
  // 例如，校验签名、检查时间戳等
  return true;
}

// 封装GET请求
export function get<T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.get(url, { params, ...config });
}

// 封装POST请求
export function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.post(url, data, config);
}

// 封装PUT请求
export function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return instance.put(url, data, config);
}

// 封装DELETE请求
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return instance.delete(url, config);
}

// 导出API服务
export default {
  get,
  post,
  put,
  delete: del,
};