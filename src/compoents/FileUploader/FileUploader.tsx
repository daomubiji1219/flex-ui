// FileUploader组件核心实现
// import type { ReactNode } from 'react';
import React, { useState, useRef} from 'react';
// import crypto from 'crypto-js';
import './FileUploader.css'

interface UploadUrls {
  check: string;    // 检查已上传分片的接口URL
  chunk: string;    // 上传分片的接口URL
  merge: string;    // 合并分片的接口URL
}

export interface UploadFile {
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

interface FileUploaderProps {
  action: string;
  urls?: UploadUrls;
  multiple?: boolean;//上传多个文件
  chunkSize?: number; // 默认2MB
  maxConcurrent?: number; // 最大并发数
  accept?: string;
  maxSize?: number;
  onProgress?: (file: UploadFile, progress: number) => void;
  onSuccess?: (file: UploadFile, response: unknown) => void;
  onError?: (file: UploadFile, error: Error) => void;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  className?: string;
  theme?: 'light' | 'dark' | 'auto';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  action,
  urls,
  multiple = false,
  chunkSize = 2 * 1024 * 1024, // 2MB
  maxConcurrent = 3,
  accept,
  maxSize,
  onProgress,
  onSuccess,
  onError,
  beforeUpload,
  className = '',
  theme = 'auto'
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);//非受控组件
  const uploadQueueRef = useRef<Map<string, AbortController>>(new Map());//避免重新渲染

  // 主题检测
  const getThemeClass = () => {
    if (theme === 'dark') return 'dark';
    if (theme === 'light') return '';
    // auto模式：检测系统主题
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return '';
  };

  const themeClass = getThemeClass();

  const getApiUrl = (type: keyof UploadUrls) => {
    if (urls) {
      return urls[type]; // 使用用户自定义的URL
    }
    // 否则使用默认拼接（保持原有兼容）
    return `${action}/${type}`;
  };

  // 生成文件哈希
  const generateFileHash = async (file: File): Promise<string> => {
    try {
      // 需要先安装crypto-js依赖: npm install crypto-js @types/crypto-js
      const crypto = await import('crypto-js') as typeof import('crypto-js');//动态导入
      return new Promise((resolve, reject) => {
        const reader = new FileReader();//浏览器环境提供的API
        reader.onload = (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer; //arrayBuffer:二进制原始文件，类型断言
            const wordArray = crypto.lib.WordArray.create(arrayBuffer);//将二进制文件转化为可加密的文件类型
            const hash = crypto.MD5(wordArray).toString();//将加密后的文件转化为字符串
            resolve(hash);
          } catch (error) {
            console.error(`文件 ${file.name} 哈希生成失败:`, error);
            reject(error);
          }
        };
        reader.onerror = (error) => {
          console.error(`文件 ${file.name} 读取失败:`, error);
          reject(error);
        };
        reader.readAsArrayBuffer(file);//以二进制方式读取
      });
    } catch (error) {
      console.error(`导入crypto-js失败:`, error);
      throw error;
    }
  };

  // 文件分片
  const createFileChunks = (file: File): Blob[] => {
    const chunks: Blob[] = [];//Blob类文件对象
    let start = 0;
    
    while (start < file.size) {
      const end = Math.min(start + chunkSize, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }
    
    return chunks;
  };

  // 检查已上传的分片
  const checkUploadedChunks = async (hash: string): Promise<number[]> => {
    try {
      const response = await fetch(getApiUrl('check'), {//fetch请求结构
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hash })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.uploadedChunks || [];//返回已上传的分片索引

      }
    } catch (error) {
      console.warn('检查已上传分片失败:', error);
    }
    
    return [];
  };

  // 上传单个分片
  const uploadChunk = async (
    file: UploadFile,
    chunkIndex: number,
    chunk: Blob,
    controller: AbortController
  ): Promise<boolean> => {
    const formData = new FormData();//表单数据对象

    formData.append('chunk', chunk);
    formData.append('hash', file.hash!);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('totalChunks', file.chunks!.length.toString());
    formData.append('filename', file.name);

    try {
      const response = await fetch(getApiUrl('chunk'), {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      if (response.ok) {
        // 更新分片上传状态
        setFiles(prev => prev.map(f => {
          if (f.uid === file.uid) {
            const newUploadedChunks = [...(f.uploadedChunks || [])];
            newUploadedChunks[chunkIndex] = true;
            const progress = (newUploadedChunks.filter(Boolean).length / f.chunks!.length) * 100;
            
            onProgress?.(f, progress);
            
            return {
              ...f,
              uploadedChunks: newUploadedChunks,
              progress
            };
          }
          return f;
        }));
        
        return true;
      }
    } catch (error: unknown) {
      if(error instanceof Error) {
        if (error.name !== 'AbortError') {
          console.error('分片上传失败:', error);
        }
      }
    }
    
    return false;
  };

  // 重新上传缺失的分片
  const retryMissingChunks = async (file: UploadFile): Promise<void> => {
    // 检查哪些分片已上传
    const uploadedChunkIndexes = await checkUploadedChunks(file.hash!);
    const uploadedChunks = new Array(file.chunks!.length).fill(false);
    uploadedChunkIndexes.forEach(index => {
      uploadedChunks[index] = true;
    });
    
    // 找出缺失的分片
    const missingChunks: number[] = [];
    for (let i = 0; i < file.chunks!.length; i++) {
      if (!uploadedChunks[i]) {
        missingChunks.push(i);
      }
    }
    
    console.log(`发现 ${missingChunks.length} 个缺失分片: [${missingChunks.join(', ')}]`);
    
    if (missingChunks.length > 0) {
      const controller = new AbortController();
      uploadQueueRef.current.set(file.uid, controller);
      
      // 只重新上传缺失的分片
      const uploadPromises: Promise<boolean>[] = [];
      for (const chunkIndex of missingChunks) {
        const uploadPromise = uploadChunk(file, chunkIndex, file.chunks![chunkIndex], controller);
        uploadPromises.push(uploadPromise);
      }
      
      await Promise.all(uploadPromises);
      uploadQueueRef.current.delete(file.uid);
      
      console.log(`重新上传 ${missingChunks.length} 个分片完成`);
    }
  };

  // 合并分片（带重试机制）
  const mergeChunks = async (file: UploadFile, retryCount = 0): Promise<void> => {
    const maxRetries = 5;
    
    try {
      const response = await fetch(getApiUrl('merge'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          hash: file.hash,
          filename: file.name,
          totalChunks: file.chunks!.length
        })
      });

      if (response.ok) {
        const result = await response.json();
        setFiles(prev => prev.map(f => 
          f.uid === file.uid 
            ? { ...f, status: 'success' as const, progress: 100 }
            : f
        ));
        onSuccess?.(file, result);
      } else {
        // 处理HTTP错误状态码
        const errorText = await response.text().catch(() => '未知错误');
        
        // 检查是否是分片丢失错误
        if (response.status === 500 && errorText.includes('分片') && errorText.includes('不存在')) {
          if (retryCount < maxRetries) {
            console.warn(`检测到分片丢失，正在重新上传并重试合并 (${retryCount + 1}/${maxRetries + 1})`);
            
            // 重新上传缺失的分片
            await retryMissingChunks(file);
            
            // 递归重试合并
            return await mergeChunks(file, retryCount + 1);
          }
        }
        
        const errorMessage = `文件"${file.name}"合并分片失败: HTTP ${response.status} - ${errorText}`;
        console.error(errorMessage);
        alert(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '合并分片时发生未知错误';
      
      // 如果不是HTTP错误（已经在上面处理过alert），则显示网络错误提示
      if (error instanceof Error && !error.message.includes('HTTP')) {
        const networkErrorMessage = `文件"${file.name}"合并分片失败: ${errorMessage}`;
        console.error(networkErrorMessage);
        alert(networkErrorMessage);
      }
      
      setFiles(prev => prev.map(f => 
        f.uid === file.uid 
          ? { ...f, status: 'error' as const }
          : f
      ));
      onError?.(file, error as Error);
    }
  };

  // 上传文件主逻辑
  const uploadFile = async (file: UploadFile) => {
    console.log(`开始上传文件: ${file.name}, 大小: ${file.size} bytes, 类型: ${file.type}`);
    try {
      setFiles(prev => prev.map(f => 
        f.uid === file.uid 
          ? { ...f, status: 'uploading' as const }
          : f
      ));

      // 生成文件哈希
      console.log(`正在为文件 ${file.name} 生成哈希...`);
      const hash = await generateFileHash(file.file);
      
      // 验证哈希生成是否成功
      if (!hash || hash.trim() === '') {
        throw new Error(`文件 ${file.name} 哈希生成失败，无法继续上传`);
      }
      
      console.log(`文件 ${file.name} 哈希生成成功: ${hash}`);
      const chunks = createFileChunks(file.file);
      
      // 检查已上传的分片
      const uploadedChunkIndexes = await checkUploadedChunks(hash);
      const uploadedChunks = new Array(chunks.length).fill(false);
      uploadedChunkIndexes.forEach(index => {
        uploadedChunks[index] = true;
      });

      // 更新文件信息
      const updatedFile = {
        ...file,
        hash,
        chunks,
        uploadedChunks,
        progress: (uploadedChunkIndexes.length / chunks.length) * 100
      };

      setFiles(prev => prev.map(f => f.uid === file.uid ? updatedFile : f));

      // 如果所有分片都已上传，直接合并
      if (uploadedChunkIndexes.length === chunks.length) {
        await mergeChunks(updatedFile);
        return;
      }

      // 创建上传控制器
      const controller = new AbortController();
      uploadQueueRef.current.set(file.uid, controller);

      // 并发上传未完成的分片
      const uploadPromises: Promise<boolean>[] = [];
      let currentConcurrent = 0;
      
      for (let i = 0; i < chunks.length; i++) {
        if (uploadedChunks[i]) continue;
        
        if (currentConcurrent >= maxConcurrent) {
          await Promise.race(uploadPromises);
          currentConcurrent--;
        }
        
        const uploadPromise = uploadChunk(updatedFile, i, chunks[i], controller)
          .finally(() => {
            currentConcurrent--;
          });
          
        uploadPromises.push(uploadPromise);
        currentConcurrent++;
      }

      // 等待所有分片上传完成
      await Promise.all(uploadPromises);

      // 合并分片
      await mergeChunks(updatedFile);
      
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.uid === file.uid 
          ? { ...f, status: 'error' as const }
          : f
      ));
      onError?.(file, error as Error);
    } finally {
      uploadQueueRef.current.delete(file.uid);
    }
  };

  // 添加文件
  const addFiles = async (newFiles: FileList | File[]) => {
    const validFiles: UploadFile[] = [];
    
    for (const file of Array.from(newFiles)) {
      // 文件大小检查
      if (maxSize && file.size > maxSize) {
        console.warn(`文件 ${file.name} 超过最大大小限制`);
        continue;
      }
      
      // 文件类型检查
      if (accept) {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            // 扩展名检查
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          } else {
            // MIME类型检查
            return file.type.includes(type) || file.type === type;
          }
        });
        
        if (!isAccepted) {
          console.warn(`文件 ${file.name} 类型不支持，文件类型: ${file.type}`);
          continue;
        }
      }
      
      // beforeUpload检查
      if (beforeUpload) {
        const result = await beforeUpload(file);
        if (!result) continue;
      }
      
      const uploadFile: UploadFile = {
        uid: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'ready',
        progress: 0,
        file
      };
      
      validFiles.push(uploadFile);
    }
    
    setFiles(prev => [...prev, ...validFiles]);
    
    // 自动开始上传
    validFiles.forEach(file => {
      uploadFile(file);
    });
  };

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {//悬停在有效区域触发
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {//离开有效区域触发
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {//有效区域释放触发
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  // 获取状态对应的样式
  const getStatusStyles = (status: UploadFile['status']) => {
    const baseStyles = {
      ready: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      uploading: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
      success: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      error: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      paused: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return baseStyles[status] || 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  };

  const getProgressStyles = (status: UploadFile['status']) => {
    const progressStyles = {
      ready: 'bg-gradient-to-r from-blue-500 to-blue-400',
      uploading: 'bg-gradient-to-r from-blue-500 to-blue-400',
      success: 'bg-gradient-to-r from-green-500 to-green-400',
      error: 'bg-gradient-to-r from-red-500 to-red-400',
      paused: 'bg-gradient-to-r from-purple-500 to-purple-400'
    };
    return progressStyles[status] || 'bg-gradient-to-r from-blue-500 to-blue-400';
  };

  return (
    <div className={`${themeClass} ${className}`}>
      <div className="w-full max-w-2xl mx-auto font-sans">
        {/* 拖拽区域 */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
            transition-all duration-300 ease-in-out mb-6 relative overflow-hidden
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 transform scale-105'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {isDragging && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent animate-pulse" />
          )}
          <p className={`m-0 text-base font-medium transition-colors ${
            isDragging 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
          }`}>
            点击或拖拽文件到此处上传
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                addFiles(e.target.files);
              }
            }}
          />
        </div>

        {/* 文件列表 */}
        <div className="flex flex-col gap-3">
          {files.map(file => (
            <div 
              key={file.uid} 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-bottom-4"
            >
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100 flex-1 min-w-0 truncate">
                  {file.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide ${getStatusStyles(file.status)}`}>
                  {file.status}
                </span>
              </div>
              
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3 relative">
                <div
                  className={`h-full rounded-full transition-all duration-300 relative ${getProgressStyles(file.status)}`}
                  style={{ width: `${file.progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
              
              <div className="flex gap-2">
                {file.status === 'uploading' && (
                  <button
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    onClick={() => {
                      const controller = uploadQueueRef.current.get(file.uid);
                      controller?.abort();
                      uploadQueueRef.current.delete(file.uid);
                      setFiles(prev => prev.map(f => 
                        f.uid === file.uid 
                          ? { ...f, status: 'paused' as const }
                          : f
                      ));
                    }}
                  >
                    暂停
                  </button>
                )}
                {file.status === 'paused' && (
                  <button 
                    className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
                    onClick={() => uploadFile(file)}
                  >
                    继续
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export type { FileUploaderProps }
export default FileUploader