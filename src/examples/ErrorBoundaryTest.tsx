import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { DataTable } from '../components/DataTable/DataTable';
import type { Column } from '../components/DataTable/DataTable';
import { FileUploader } from '../components/FileUploader/FileUploader';
import type { UploadFile } from '../components/FileUploader/FileUploader';
import { VirtualList } from '../components/VirtualList/VirtualList';
import { ThemeToggle } from '../components/ThemeToggle/ThemeToggle';
import { Button } from '../components/Button/Button';
import { useErrorBoundaryEnhanced } from '@/hooks/useErrorBoundaryEnhanced';
import { DefaultErrorFallback } from '@/hooks/useErrorBoundary';

// 错误触发组件 - 在渲染时抛出错误
interface ErrorTriggerProps {
  children: ReactNode;
  shouldError: boolean;
  componentName: string;
}

const ErrorTrigger: React.FC<ErrorTriggerProps> = ({
  children,
  shouldError,
  componentName,
}) => {
  if (shouldError) {
    throw new Error(`${componentName} 测试错误：组件渲染失败`);
  }
  return <>{children}</>;
};

// 测试数据类型定义
interface TestDataItem extends Record<string, unknown> {
  id: number;
  name: string;
  age: number;
  email: string;
}

interface VirtualListItem {
  id: number;
  content: string;
}

// 测试数据
const testData: TestDataItem[] = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
];

const testColumns: Column<TestDataItem>[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: '姓名', sortable: true },
  { key: 'age', title: '年龄', sortable: true },
  { key: 'email', title: '邮箱', sortable: false },
];

const virtualListItems: VirtualListItem[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: i,
    content: `虚拟列表项 ${i + 1}`,
  })
);

export const ErrorBoundaryTest: React.FC = () => {
  const [dataTableError, setDataTableError] = useState(false);
  const [fileUploaderError, setFileUploaderError] = useState(false);
  const [virtualListError, setVirtualListError] = useState(false);
  const [themeToggleError, setThemeToggleError] = useState(false);

  const resetAllErrors = () => {
    setDataTableError(false);
    setFileUploaderError(false);
    setVirtualListError(false);
    setThemeToggleError(false);
  };

  // ==================== 错误边界 ====================
  const { ErrorBoundary } = useErrorBoundaryEnhanced(DefaultErrorFallback, {
    maxRetries: 3,
    onError: (error, errorInfo) => {
      console.error('VirtualList 组件发生错误:', { error, errorInfo });
    },
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>错误边界测试页面</h1>
      <p>点击下方按钮可以故意触发各个组件的错误，测试错误边界是否正常工作。</p>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={() => setDataTableError(!dataTableError)}
          variant={dataTableError ? 'ghost' : 'primary'}
        >
          {dataTableError ? '恢复' : '触发'} DataTable 错误
        </Button>

        <Button
          onClick={() => setFileUploaderError(!fileUploaderError)}
          variant={fileUploaderError ? 'ghost' : 'primary'}
        >
          {fileUploaderError ? '恢复' : '触发'} FileUploader 错误
        </Button>

        <Button
          onClick={() => setVirtualListError(!virtualListError)}
          variant={virtualListError ? 'ghost' : 'primary'}
        >
          {virtualListError ? '恢复' : '触发'} VirtualList 错误
        </Button>

        <Button
          onClick={() => setThemeToggleError(!themeToggleError)}
          variant={themeToggleError ? 'ghost' : 'primary'}
        >
          {themeToggleError ? '恢复' : '触发'} ThemeToggle 错误
        </Button>

        <Button onClick={resetAllErrors} variant="secondary">
          重置所有错误
        </Button>
      </div>

      <div style={{ display: 'grid', gap: '30px' }}>
        {/* DataTable 测试 */}
        <section>
          <h2>DataTable 组件测试</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <ErrorBoundary>
              <ErrorTrigger
                shouldError={dataTableError}
                componentName="DataTable"
              >
                <DataTable<TestDataItem>
                  data={testData}
                  columns={testColumns}
                  rowKey="id"
                  loading={false}
                  onRowSelect={(selectedRows: TestDataItem[]) =>
                    console.log('选择:', selectedRows)
                  }
                  selectable={true}
                />
              </ErrorTrigger>
            </ErrorBoundary>
          </div>
        </section>

        {/* FileUploader 测试 */}
        <section>
          <h2>FileUploader 组件测试</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <ErrorTrigger
              shouldError={fileUploaderError}
              componentName="FileUploader"
            >
              <FileUploader
                action="/api/upload"
                urls={{
                  check: '/api/upload/check',
                  chunk: '/api/upload/chunk',
                  merge: '/api/upload/merge',
                }}
                onSuccess={(file: UploadFile, response: unknown) =>
                  console.log('上传完成:', file, response)
                }
                onError={(file: UploadFile, error: Error) =>
                  console.log('上传错误:', file, error)
                }
                maxSize={10 * 1024 * 1024}
                accept="image/*,.pdf,.doc,.docx"
                multiple={true}
              />
            </ErrorTrigger>
          </div>
        </section>

        {/* VirtualList 测试 */}
        <section>
          <h2>VirtualList 组件测试</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
              height: '300px',
            }}
          >
            <ErrorTrigger
              shouldError={virtualListError}
              componentName="VirtualList"
            >
              <VirtualList<VirtualListItem>
                data={virtualListItems}
                containerHeight={250}
                itemHeight={40}
                renderItem={(item: VirtualListItem) => (
                  <div key={item.id}>{item.content}</div>
                )}
                getKey={(item: VirtualListItem) => item.id}
              />
            </ErrorTrigger>
          </div>
        </section>

        {/* ThemeToggle 测试 */}
        <section>
          <h2>ThemeToggle 组件测试</h2>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <ErrorTrigger
              shouldError={themeToggleError}
              componentName="ThemeToggle"
            >
              <ThemeToggle />
            </ErrorTrigger>
          </div>
        </section>
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
        }}
      >
        <h3>测试说明</h3>
        <ul>
          <li>每个组件都已经用 ErrorBoundary 包裹</li>
          <li>点击对应的触发按钮会在组件外层抛出错误</li>
          <li>错误会被组件内部的错误边界捕获并显示错误回退界面</li>
          <li>错误边界支持重试功能（最多3次）</li>
          <li>查看浏览器控制台可以看到详细的错误信息</li>
          <li>
            点击"恢复"按钮可以恢复组件正常状态，点击"重置所有错误"可以一次性恢复所有组件
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorBoundaryTest;
