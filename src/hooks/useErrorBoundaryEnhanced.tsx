import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { EnhancedErrorBoundaryComponent } from './useErrorBoundary';

// 错误日志接口
interface ErrorLog {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: Date;
  componentStack: string | undefined | null;
}

// 增强的自定义 Hook
export function useErrorBoundaryEnhanced(
  fallback: (
    error: Error,
    resetError: () => void,
    retryCount: number
  ) => ReactNode,
  options?: {
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    maxRetries?: number;
  }
) {
  const [error, setError] = useState<Error | null>(null);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);

  // 使用 ref 保持 options 的最新引用，避免依赖变化导致 handleError 重建
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // 重置错误状态
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // 手动触发错误（用于测试）
  const triggerError = useCallback((error: Error) => {
    setError(error);
  }, []);

  // 错误处理函数
  const handleError = useCallback((error: Error, errorInfo: ErrorInfo) => {
    const errorLog: ErrorLog = {
      error,
      errorInfo,
      timestamp: new Date(),
      componentStack: errorInfo.componentStack,
    };

    setErrorLogs(prev => [...prev, errorLog]);
    setError(error);

    // 调用外部错误处理
    optionsRef.current?.onError?.(error, errorInfo);
  }, []);

  // 错误边界组件
  const ErrorBoundary = useMemo(() => {
    const Component = (props: { children: ReactNode }) => (
      <EnhancedErrorBoundaryComponent
        fallback={fallback}
        onError={handleError}
        maxRetries={options?.maxRetries}
        {...props}
      />
    );
    return Component;
  }, [fallback, handleError, options?.maxRetries]);

  return {
    ErrorBoundary,
    error,
    errorLogs,
    resetError,
    triggerError,
  };
}

// 使用示例
/*
function MyComponent() {
  const { ErrorBoundary, errorLogs } = useErrorBoundaryEnhanced(
    DefaultErrorFallback,
    {
      maxRetries: 3,
      onError: (error, errorInfo) => {
        // 发送错误到监控服务
        console.log('发送错误报告:', { error, errorInfo });
      }
    }
  );

  // return (
  //   <div>
  //     <h1>My App</h1>
  //     <ErrorBoundary>
  //       <ComplexComponent />
  //     </ErrorBoundary>
      
  //     {/* 开发环境下显示错误日志 */
//       {process.env.NODE_ENV === 'development' && errorLogs.length > 0 && (
//         <details>
//           <summary>错误日志 ({errorLogs.length})</summary>
//           {errorLogs.map((log, index) => (
//             <pre key={index}>{JSON.stringify(log, null, 2)}</pre>
//           ))}
//         </details>
//       )}
//     </div>
//   );
// }
// */
