import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

// 增强的错误边界 props 类型
interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback: (
    error: Error,
    resetError: () => void,
    retryCount: number
  ) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
}

// 增强的错误边界组件
export class EnhancedErrorBoundaryComponent extends Component<EnhancedErrorBoundaryProps> {
  state = {
    error: null as Error | null,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 调用外部错误处理函数
    this.props.onError?.(error, errorInfo);

    // 记录错误日志
    console.error('Enhanced ErrorBoundary caught an error:', {
      error,
      errorInfo,
      timestamp: new Date(),
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    const { error, retryCount } = this.state;
    const { children, fallback, maxRetries = 3 } = this.props;

    if (error) {
      const resetError = () => {
        if (retryCount < maxRetries) {
          this.setState({
            error: null,
            retryCount: retryCount + 1,
          });
        } else {
          // 达到最大重试次数，重置计数器
          this.setState({
            error: null,
            retryCount: 0,
          });
        }
      };

      return fallback(error, resetError, retryCount);
    }

    return children;
  }
}

// 预设的错误回退组件
export const DefaultErrorFallback = (
  error: Error,
  resetError: () => void,
  retryCount: number
) => (
  <div
    className="error-boundary-fallback"
    style={{
      padding: '20px',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      margin: '10px 0',
    }}
  >
    <h3 style={{ color: '#d63031', margin: '0 0 10px 0' }}>组件渲染出错</h3>
    <p style={{ color: '#636e72', margin: '0 0 10px 0' }}>{error.message}</p>
    {retryCount > 0 && (
      <p style={{ color: '#fdcb6e', fontSize: '14px' }}>
        已重试 {retryCount} 次
      </p>
    )}
    <button
      onClick={resetError}
      style={{
        padding: '8px 16px',
        backgroundColor: '#0984e3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      重新尝试
    </button>
  </div>
);
