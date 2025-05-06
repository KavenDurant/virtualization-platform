import { message } from 'antd';
import http from '../services/http';

/**
 * KeepAlive配置参数接口
 */
export interface KeepAliveOptions {
  /** 发送心跳间隔（毫秒），默认30秒 */
  interval?: number;
  /** 心跳请求的URL路径 */
  url?: string;
  /** 最大重试次数，默认3次 */
  maxRetries?: number;
  /** 重试间隔（毫秒），默认5秒 */
  retryInterval?: number;
  /** 心跳失败回调函数 */
  onFailure?: () => void;
  /** 心跳成功回调函数 */
  onSuccess?: () => void;
  /** 会话过期回调函数（达到最大重试次数后） */
  onExpired?: () => void;
  /** 是否显示错误消息，默认为false */
  showErrorMessage?: boolean;
  /** 额外的请求参数 */
  params?: Record<string, unknown>;
}

/**
 * KeepAlive服务类
 * 负责维护与服务器的连接活跃状态，防止会话超时
 */
export class KeepAliveService {
  private options: Required<KeepAliveOptions>;
  private timer: number | null = null;
  private retryCount = 0;
  private active = false;

  // 默认配置
  private static readonly defaultOptions: Required<KeepAliveOptions> = {
    interval: 30000, // 默认30秒
    // url: '/api/keepalive',
    url: 'https://reqres.in/api/users',
    maxRetries: 3,
    retryInterval: 5000,
    onFailure: () => {}, // 空函数作为默认值
    onSuccess: () => {}, // 空函数作为默认值
    onExpired: () => {
      // 默认会话过期处理：跳转到登录页
      message.error('会话已过期，请重新登录');
      window.location.href = '/login';
    },
    showErrorMessage: false,
    params: {},
  };

  /**
   * 构造函数
   * @param options KeepAlive配置选项
   */
  constructor(options?: KeepAliveOptions) {
    this.options = {
      ...KeepAliveService.defaultOptions,
      ...options,
    };
  }

  /**
   * 开始心跳检测
   * @returns 当前KeepAliveService实例，便于链式调用
   */
  public start(): KeepAliveService {
    if (this.active) {
      return this;
    }

    this.active = true;
    this.retryCount = 0;
    this.sendHeartbeat();
    return this;
  }

  /**
   * 停止心跳检测
   * @returns 当前KeepAliveService实例，便于链式调用
   */
  public stop(): KeepAliveService {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    this.active = false;
    return this;
  }

  /**
   * 立即发送一次心跳，不影响定时发送
   * @returns Promise<boolean> 心跳是否成功
   */
  public async ping(): Promise<boolean> {
    try {
      await this.sendHeartbeatRequest();
      return true;
    } catch (error) {
      console.error('心跳检测失败:', error);
      return false;
    }
  }

  /**
   * 设置配置选项
   * @param options 新的配置选项
   * @returns 当前KeepAliveService实例，便于链式调用
   */
  public setOptions(options: KeepAliveOptions): KeepAliveService {
    const wasActive = this.active;

    // 如果正在运行，先停止
    if (wasActive) {
      this.stop();
    }

    // 更新选项
    this.options = {
      ...this.options,
      ...options,
    };

    // 如果之前在运行，则重新启动
    if (wasActive) {
      this.start();
    }

    return this;
  }

  /**
   * 发送心跳请求
   * @returns Promise<void>
   */
  private async sendHeartbeatRequest(): Promise<void> {
    try {
      // 发送心跳请求
      await http.post(this.options.url, this.options.params);

      // 心跳成功，重置重试计数
      this.retryCount = 0;
      this.options.onSuccess();
    } catch (error) {
      // 心跳失败，增加重试计数
      console.error('Heart beat failed:', error);
      this.retryCount++;

      if (this.options.showErrorMessage) {
        message.error(`心跳检测失败，正在重试 (${this.retryCount}/${this.options.maxRetries})`);
      }

      // 调用失败回调
      this.options.onFailure();

      // 如果达到最大重试次数，调用过期回调
      if (this.retryCount >= this.options.maxRetries) {
        this.stop();
        this.options.onExpired();
        return;
      }

      // 重试
      this.timer = window.setTimeout(() => this.sendHeartbeat(), this.options.retryInterval);
      return;
    }

    // 设置下一次心跳
    if (this.active) {
      this.timer = window.setTimeout(() => this.sendHeartbeat(), this.options.interval);
    }
  }

  /**
   * 发送心跳
   */
  private sendHeartbeat(): void {
    this.sendHeartbeatRequest().catch(error => {
      console.error('发送心跳请求时发生错误:', error);
    });
  }

  /**
   * 获取当前服务状态
   * @returns 状态对象
   */
  public getStatus(): { active: boolean; retryCount: number } {
    return {
      active: this.active,
      retryCount: this.retryCount,
    };
  }
}

/**
 * 创建默认的KeepAliveService实例
 */
const defaultKeepAlive = new KeepAliveService();

/**
 * 创建一个KeepAliveService实例
 * @param options KeepAlive配置选项
 * @returns KeepAliveService实例
 */
export function createKeepAlive(options?: KeepAliveOptions): KeepAliveService {
  return new KeepAliveService(options);
}

export default defaultKeepAlive;
