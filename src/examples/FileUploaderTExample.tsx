import React from 'react';
import { FileUploader } from '../components/FileUploader/FileUploader';
import { Button } from '../components/Button/Button';

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

const FileUploaderTExample: React.FC = () => {
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
    const allowedTypes = [
      'image/',
      'video/',
      'application/pdf',
      'text/',
      'application/zip',
      'application/x-pdf',
    ];
    const isAllowed = allowedTypes.some(type => file.type.startsWith(type));
    if (!isAllowed) {
      alert(`文件 ${file.name} 类型不支持`);
      return false;
    }

    return true;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        增强版文件上传组件示例
      </h1>

      {/* Button组件测试区域 */}
      <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Button组件测试
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <Button variant="primary" onClick={() => alert('Primary clicked!')}>
              Primary
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert('Secondary clicked!')}
            >
              Secondary
            </Button>
            <Button variant="outline" onClick={() => alert('Outline clicked!')}>
              Outline
            </Button>
            <Button variant="ghost" onClick={() => alert('Ghost clicked!')}>
              Ghost
            </Button>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button icon={<span>🚀</span>}>With Icon</Button>
          </div>
        </div>
      </div>

      <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          拖拽上传文件
        </h2>
        <p className="text-gray-600 mb-5">
          支持拖拽上传、分片上传、断点续传，美观的UI界面
        </p>
        <FileUploader
          action="http://localhost:3000/upload"
          urls={{
            check: 'http://localhost:3000/upload/check',
            chunk: 'http://localhost:3000/upload/chunk',
            merge: 'http://localhost:3000/upload/merge',
          }}
          multiple={true}
          chunkSize={2 * 1024 * 1024} // 2MB分片
          maxConcurrent={3} // 最大并发3个分片
          accept="image/*,video/*,.pdf,.txt,.zip"
          maxSize={100 * 1024 * 1024} // 100MB
          onProgress={handleProgress}
          onSuccess={handleSuccess}
          onError={handleError}
          beforeUpload={beforeUpload}
        />
      </div>

      <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">单文件上传</h2>
        <p className="text-gray-600 mb-5">只允许上传单个图片文件</p>
        <FileUploader
          action="http://localhost:3001/upload"
          urls={{
            check: 'http://localhost:3001/upload/check',
            chunk: 'http://localhost:3001/upload/chunk',
            merge: 'http://localhost:3001/upload/merge',
          }}
          multiple={false}
          chunkSize={1 * 1024 * 1024} // 1MB分片
          maxConcurrent={2}
          accept="image/*"
          maxSize={50 * 1024 * 1024} // 50MB
          onProgress={handleProgress}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>

      <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          文档文件上传
        </h2>
        <p className="text-gray-600 mb-5">仅支持PDF和文本文件上传</p>
        <FileUploader
          action="http://localhost:3002/upload"
          urls={{
            check: 'http://localhost:3002/upload/check',
            chunk: 'http://localhost:3002/upload/chunk',
            merge: 'http://localhost:3002/upload/merge',
          }}
          multiple={true}
          chunkSize={5 * 1024 * 1024} // 5MB分片
          maxConcurrent={4}
          accept=".pdf,.txt,application/pdf,text/plain"
          maxSize={200 * 1024 * 1024} // 200MB
          onProgress={handleProgress}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      </div>
    </div>
  );
};

export default FileUploaderTExample;
