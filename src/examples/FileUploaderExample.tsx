import React, { useState } from 'react';
import { FileUploader } from '../compoents/FileUploader/FileUploader';

interface UploadFile {
  uid: string;
  name: string;
  size: number;
  type: string;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
  progress: number;
  file: File;
  chunks?: Blob[];
  uploadedChunks?: boolean[];
  hash?: string;
}

const FileUploaderExample: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  // 主题切换
  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'auto'> = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // 上传进度回调
  const handleProgress = (file: UploadFile, progress: number) => {
    console.log(`文件 ${file.name} 上传进度: ${progress.toFixed(2)}%`);
  };

  // 上传成功回调
  const handleSuccess = (file: UploadFile, response: unknown) => {
    console.log(`文件 ${file.name} 上传成功:`, response);
    alert(`文件 ${file.name} 上传成功！`);
  };

  // 上传失败回调
  const handleError = (file: UploadFile, error: Error) => {
    console.error(`文件 ${file.name} 上传失败:`, error);
    alert(`文件 ${file.name} 上传失败: ${error.message}`);
  };

  // 上传前检查
  const beforeUpload = (file: File): boolean => {
    // 检查文件大小（限制为100MB）
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert(`文件 ${file.name} 大小超过100MB限制`);
      return false;
    }

    // 检查文件类型
    const allowedTypes = ['image/', 'video/', 'application/pdf', 'text/', 'application/zip','application/x-pdf','text/tsx','text/jsx'];
    const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowed) {
      alert(`文件 ${file.name} 类型不支持`);
      return false;
    }

    return true;
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-6">
          {/* 主题切换按钮 */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">文件上传组件示例</h1>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {theme === 'light' && (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  浅色
                </>
              )}
              {theme === 'dark' && (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  深色
                </>
              )}
              {theme === 'auto' && (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                  </svg>
                  自动
                </>
              )}
            </button>
          </div>
      
          <div className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">基础文件上传</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">支持拖拽上传、分片上传、断点续传</p>
            <FileUploader
              action="http://localhost:3000/upload"
              urls={{
                check: "http://localhost:3000/upload/check",
                chunk: "http://localhost:3000/upload/chunk",
                merge: "http://localhost:3000/upload/merge"
              }}
              multiple={true}
              chunkSize={2 * 1024 * 1024} // 2MB分片
              maxConcurrent={3} // 最大并发3个分片
              accept=".ts,.tsx,.js,.jsx,.html,.css"
              maxSize={100 * 1024 * 1024} // 100MB
              onProgress={handleProgress}
              onSuccess={handleSuccess}
              onError={handleError}
              beforeUpload={beforeUpload}
              theme={theme}
            />
          </div>

          <div className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">单文件上传</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">只允许上传单个文件</p>
            <FileUploader
              action="http://localhost:3001/upload"
              urls={{
                check: "http://localhost:3001/upload/check",
                chunk: "http://localhost:3001/upload/chunk",
                merge: "http://localhost:3001/upload/merge"
              }}
              multiple={false}
              chunkSize={1 * 1024 * 1024} // 1MB分片
              maxConcurrent={2}
              accept="image/*"
              maxSize={50 * 1024 * 1024} // 50MB
              onProgress={handleProgress}
              onSuccess={handleSuccess}
              onError={handleError}
              theme={theme}
            />
          </div>

          <div className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">大文件上传</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-5">专门用于大文件上传，使用更大的分片</p>
            <FileUploader
              action="http://localhost:3001/upload"
              urls={{
                check: "http://localhost:3001/upload/check",
                chunk: "http://localhost:3001/upload/chunk",
                merge: "http://localhost:3001/upload/merge"
              }}
              multiple={true}
              chunkSize={10 * 1024 * 1024} // 10MB分片
              maxConcurrent={5}
              accept="video/*,.zip,.rar,.7z"
              maxSize={1024 * 1024 * 1024} // 1GB
              onProgress={handleProgress}
              onSuccess={handleSuccess}
              onError={handleError}
              theme={theme}
              beforeUpload={(file) => {
                if (file.size < 100 * 1024 * 1024) {
                  alert('此上传器专用于大文件（>100MB），请使用基础上传器');
                  return false;
                }
                return true;
              }}
            />
          </div>

          <div className="mb-10 p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">使用说明</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong className="text-gray-800 dark:text-gray-100">拖拽上传：</strong>将文件拖拽到上传区域即可开始上传</li>
              <li><strong className="text-gray-800 dark:text-gray-100">点击上传：</strong>点击上传区域选择文件</li>
              <li><strong className="text-gray-800 dark:text-gray-100">分片上传：</strong>大文件会自动分片上传，提高上传成功率</li>
              <li><strong className="text-gray-800 dark:text-gray-100">断点续传：</strong>上传中断后可以继续上传，无需重新开始</li>
              <li><strong className="text-gray-800 dark:text-gray-100">并发控制：</strong>可以设置最大并发分片数，避免网络拥堵</li>
              <li><strong className="text-gray-800 dark:text-gray-100">进度监控：</strong>实时显示上传进度</li>
              <li><strong className="text-gray-800 dark:text-gray-100">暂停/继续：</strong>可以暂停和继续上传任务</li>
            </ul>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">后端API接口</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">使用此组件需要后端提供以下接口（当前运行在 http://localhost:3001）：</p>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">POST /upload/check</code> - 检查已上传的分片</li>
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">POST /upload/chunk</code> - 上传分片</li>
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">POST /upload/merge</code> - 合并分片</li>
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">GET /files</code> - 获取文件列表</li>
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">GET /files/:filename</code> - 下载文件</li>
              <li><code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">GET /health</code> - 健康检查</li>
            </ul>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
              💡 提示：确保后端服务已启动在 3001 端口，前端开发服务器运行在 5173 端口
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploaderExample;