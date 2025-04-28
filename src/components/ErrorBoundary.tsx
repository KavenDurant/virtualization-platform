import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * 错误边界组件
 * 用于捕获子组件树中的 JavaScript 错误，记录错误并显示备用 UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state，下次渲染时使用备用 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以在此处将错误日志上报给服务
    console.error('错误边界捕获到错误:', error, errorInfo);

    // 如果提供了错误处理回调，则调用
    this.props.onError?.(error, errorInfo);
  }

  // 尝试恢复应用
  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义的降级UI，则使用它
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误显示UI
      return (
        <Result
          status="error"
          title="组件出现错误"
          subTitle={this.state.error?.message || '渲染过程中发生了错误'}
          extra={[
            <Button type="primary" key="retry" onClick={this.handleRetry}>
              重试
            </Button>,
          ]}
        />
      );
    }

    // 正常渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;
