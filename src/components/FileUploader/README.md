# FileUploader 文件上传组件

一个功能强大的文件上传组件，支持大文件分片上传、断点续传、拖拽上传等高级特性，适用于各种文件上传场景。

## 特性

- ✅ 大文件分片上传
- ✅ 断点续传
- ✅ 文件哈希校验
- ✅ 拖拽上传
- ✅ 多文件上传
- ✅ 上传进度显示
- ✅ 暂停/继续上传
- ✅ 文件类型和大小限制
- ✅ 并发上传控制
- ✅ 自定义上传前校验
- ✅ 完整的错误处理
- ✅ TypeScript 类型支持

## 安装

```bash
pnpm add flexi-ui
```

## 基础用法

```tsx
import { FileUploader } from 'flexi-ui';

function App() {
  return (
    <FileUploader
      action="/api/upload"
      onSuccess={(file, response) => {
        console.log('上传成功:', file.name, response);
      }}
      onError={(file, error) => {
        console.error('上传失败:', file.name, error);
      }}
    />
  );
}
```

## API

### FileUploaderProps

| 属性          | 类型                                            | 默认值            | 说明                      |
| ------------- | ----------------------------------------------- | ----------------- | ------------------------- |
| action        | `string`                                        | -                 | 上传接口基础URL           |
| urls          | `UploadUrls`                                    | -                 | 自定义上传接口URL配置     |
| multiple      | `boolean`                                       | `false`           | 是否支持多文件上传        |
| chunkSize     | `number`                                        | `2 * 1024 * 1024` | 分片大小（字节），默认2MB |
| maxConcurrent | `number`                                        | `3`               | 最大并发上传数            |
| accept        | `string`                                        | -                 | 接受的文件类型            |
| maxSize       | `number`                                        | -                 | 最大文件大小（字节）      |
| onProgress    | `(file: UploadFile, progress: number) => void`  | -                 | 上传进度回调              |
| onSuccess     | `(file: UploadFile, response: unknown) => void` | -                 | 上传成功回调              |
| onError       | `(file: UploadFile, error: Error) => void`      | -                 | 上传失败回调              |
| beforeUpload  | `(file: File) => boolean \| Promise<boolean>`   | -                 | 上传前校验函数            |

### UploadUrls

| 属性  | 类型     | 说明                    |
| ----- | -------- | ----------------------- |
| check | `string` | 检查已上传分片的接口URL |
| chunk | `string` | 上传分片的接口URL       |
| merge | `string` | 合并分片的接口URL       |

### UploadFile

| 属性           | 类型                                                         | 说明               |
| -------------- | ------------------------------------------------------------ | ------------------ |
| uid            | `string`                                                     | 文件唯一标识       |
| name           | `string`                                                     | 文件名             |
| size           | `number`                                                     | 文件大小（字节）   |
| type           | `string`                                                     | 文件MIME类型       |
| status         | `'ready' \| 'uploading' \| 'success' \| 'error' \| 'paused'` | 文件上传状态       |
| progress       | `number`                                                     | 上传进度（0-100）  |
| file           | `File`                                                       | 原始文件对象       |
| chunks         | `Blob[]`                                                     | 文件分片数组       |
| uploadedChunks | `boolean[]`                                                  | 已上传分片状态数组 |
| hash           | `string`                                                     | 文件哈希值         |

## 高级用法

### 多文件上传

```tsx
<FileUploader
  action="/api/upload"
  multiple
  maxConcurrent={5}
  onProgress={(file, progress) => {
    console.log(`${file.name} 上传进度: ${progress}%`);
  }}
  onSuccess={(file, response) => {
    console.log(`${file.name} 上传成功:`, response);
  }}
/>
```

### 文件类型和大小限制

```tsx
<FileUploader
  action="/api/upload"
  accept=".jpg,.png,.pdf,.doc,.docx"
  maxSize={100 * 1024 * 1024} // 100MB
  beforeUpload={file => {
    if (file.size > 50 * 1024 * 1024) {
      alert('文件大小不能超过50MB');
      return false;
    }
    return true;
  }}
/>
```

### 自定义接口URL

```tsx
<FileUploader
  action="/api/upload"
  urls={{
    check: '/api/upload/check',
    chunk: '/api/upload/chunk',
    merge: '/api/upload/merge',
  }}
  chunkSize={5 * 1024 * 1024} // 5MB分片
/>
```

### 自定义上传进度UI

```tsx
function CustomProgressUploader() {
  const [files, setFiles] = useState<
    Record<string, { name: string; progress: number; status: string }>
  >({});

  const handleProgress = (file: UploadFile, progress: number) => {
    setFiles(prev => ({
      ...prev,
      [file.uid]: {
        name: file.name,
        progress,
        status: file.status,
      },
    }));
  };

  const handleSuccess = (file: UploadFile) => {
    setFiles(prev => ({
      ...prev,
      [file.uid]: {
        ...prev[file.uid],
        status: 'success',
      },
    }));
  };

  const handleError = (file: UploadFile) => {
    setFiles(prev => ({
      ...prev,
      [file.uid]: {
        ...prev[file.uid],
        status: 'error',
      },
    }));
  };

  return (
    <div>
      <FileUploader
        action="/api/upload"
        multiple
        onProgress={handleProgress}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <div className="upload-progress-list">
        {Object.entries(files).map(([uid, file]) => (
          <div key={uid} className="upload-progress-item">
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-status">{file.status}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className={`progress-bar ${file.status}`}
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <div className="progress-text">{file.progress.toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 集成到表单

```tsx
import { useForm } from 'react-hook-form';

function UploadForm() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [fileUrl, setFileUrl] = useState('');

  const onSubmit = data => {
    console.log('表单数据:', {
      ...data,
      attachment: fileUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>标题</label>
        <input {...register('title', { required: true })} />
      </div>

      <div className="form-group">
        <label>描述</label>
        <textarea {...register('description')} />
      </div>

      <div className="form-group">
        <label>附件</label>
        <FileUploader
          action="/api/upload"
          accept=".pdf,.doc,.docx"
          onSuccess={(file, response) => {
            // 假设响应中包含文件URL
            const fileUrl = response.url;
            setFileUrl(fileUrl);
            setValue('attachment', fileUrl);
          }}
        />
        {fileUrl && (
          <div className="uploaded-file">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              查看已上传文件
            </a>
          </div>
        )}
      </div>

      <button type="submit">提交</button>
    </form>
  );
}
```

### 图片上传预览

```tsx
function ImageUploader() {
  const [images, setImages] = useState<string[]>([]);

  const handleSuccess = (file: UploadFile, response: any) => {
    // 假设响应中包含图片URL
    const imageUrl = response.url;
    setImages(prev => [...prev, imageUrl]);
  };

  return (
    <div>
      <FileUploader
        action="/api/upload/image"
        accept="image/*"
        multiple
        beforeUpload={file => {
          const isImage = file.type.startsWith('image/');
          if (!isImage) {
            alert('只能上传图片文件!');
          }
          return isImage;
        }}
        onSuccess={handleSuccess}
      />

      <div className="image-preview-container">
        {images.map((url, index) => (
          <div key={index} className="image-preview-item">
            <img src={url} alt={`上传图片 ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 完整配置示例

```tsx
<FileUploader
  action="/api/upload"
  urls={{
    check: '/api/upload/check',
    chunk: '/api/upload/chunk',
    merge: '/api/upload/merge',
  }}
  multiple
  accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
  maxSize={200 * 1024 * 1024} // 200MB
  chunkSize={2 * 1024 * 1024} // 2MB
  maxConcurrent={3}
  beforeUpload={async file => {
    // 可以进行异步校验
    const isValid = await validateFile(file);
    if (!isValid) {
      alert('文件验证失败');
      return false;
    }
    return true;
  }}
  onProgress={(file, progress) => {
    console.log(`${file.name}: ${progress}%`);
  }}
  onSuccess={(file, response) => {
    console.log('上传成功:', response);
    // 更新UI或状态
    updateFileList(file.uid, { status: 'success', url: response.url });
  }}
  onError={(file, error) => {
    console.error('上传失败:', error.message);
    // 更新UI或状态
    updateFileList(file.uid, { status: 'error', errorMessage: error.message });
  }}
/>
```

## 后端接口要求

组件需要后端提供三个接口：

### 1. 检查已上传分片接口

**请求：**

```http
POST /api/upload/check
Content-Type: application/json

{
  "hash": "文件哈希值"
}
```

**响应：**

```json
{
  "uploadedChunks": [0, 1, 3] // 已上传的分片索引
}
```

### 2. 上传分片接口

**请求：**

```http
POST /api/upload/chunk
Content-Type: multipart/form-data

// FormData 格式
chunk: Blob           // 分片数据
hash: string          // 文件哈希
chunkIndex: number    // 分片索引
totalChunks: number   // 总分片数
filename: string      // 文件名
```

**响应：**

```json
{
  "success": true
}
```

### 3. 合并分片接口

**请求：**

```http
POST /api/upload/merge
Content-Type: application/json

{
  "hash": "文件哈希值",
  "filename": "文件名",
  "totalChunks": 10
}
```

**响应：**

```json
{
  "url": "文件访问URL",
  "filename": "文件名"
}
```

## 后端实现示例

### Node.js + Express 实现

```javascript
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');

// 确保目录存在
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// 配置 multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const hash = req.body.hash;
    const chunkDir = path.join(tempDir, hash);
    if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);
    cb(null, chunkDir);
  },
  filename: (req, file, cb) => {
    const chunkIndex = req.body.chunkIndex;
    cb(null, `${chunkIndex}`);
  },
});

const upload = multer({ storage });

// 检查已上传分片
app.post('/api/upload/check', (req, res) => {
  const { hash } = req.body;
  const chunkDir = path.join(tempDir, hash);

  if (!fs.existsSync(chunkDir)) {
    return res.json({ uploadedChunks: [] });
  }

  const uploadedChunks = fs
    .readdirSync(chunkDir)
    .map(filename => parseInt(filename))
    .filter(index => !isNaN(index));

  res.json({ uploadedChunks });
});

// 上传分片
app.post('/api/upload/chunk', upload.single('chunk'), (req, res) => {
  res.json({ success: true });
});

// 合并分片
app.post('/api/upload/merge', async (req, res) => {
  const { hash, filename, totalChunks } = req.body;
  const chunkDir = path.join(tempDir, hash);
  const filePath = path.join(uploadsDir, filename);

  // 检查所有分片是否存在
  const chunks = [];
  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(chunkDir, i.toString());
    if (!fs.existsSync(chunkPath)) {
      return res.status(500).send(`分片 ${i} 不存在`);
    }
    chunks.push(chunkPath);
  }

  // 合并分片
  const writeStream = fs.createWriteStream(filePath);

  for (const chunkPath of chunks) {
    const buffer = fs.readFileSync(chunkPath);
    writeStream.write(buffer);
  }

  writeStream.end();

  // 等待文件写入完成
  await new Promise(resolve => writeStream.on('finish', resolve));

  // 清理临时分片
  fs.rmdirSync(chunkDir, { recursive: true });

  // 返回文件URL
  const fileUrl = `/uploads/${filename}`;
  res.json({ url: fileUrl, filename });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 样式定制

### CSS 变量

```css
:root {
  --uploader-border-color: #d9d9d9;
  --uploader-border-color-hover: #40a9ff;
  --uploader-bg-color: #fafafa;
  --uploader-bg-color-drag: #f0f8ff;
  --uploader-text-color: #666;
  --uploader-progress-color: #52c41a;
  --uploader-error-color: #ff4d4f;
}
```

### 自定义样式

```css
.file-uploader .upload-area {
  border: 2px dashed var(--uploader-border-color);
  padding: 40px;
  text-align: center;
  cursor: pointer;
  background-color: var(--uploader-bg-color);
  transition: all 0.3s;
}

.file-uploader .upload-area:hover {
  border-color: var(--uploader-border-color-hover);
}

.file-uploader .upload-area.dragging {
  background-color: var(--uploader-bg-color-drag);
  border-color: var(--uploader-border-color-hover);
}

.file-uploader .file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-top: 8px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.file-uploader .file-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
}

.file-uploader .progress-bar {
  height: 4px;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
}

.file-uploader .progress {
  height: 100%;
  background-color: var(--uploader-progress-color);
  transition: width 0.3s;
}

.file-uploader .progress.error {
  background-color: var(--uploader-error-color);
}
```

## 可访问性

```tsx
<FileUploader
  action="/api/upload"
  aria-label="文件上传区域"
  aria-describedby="upload-description"
  accept=".jpg,.png,.pdf"
/>
<div id="upload-description" className="sr-only">
  点击或拖拽文件到此处上传。支持JPG、PNG和PDF格式，最大文件大小为10MB。
</div>
```

## 性能优化

### 大文件处理

```tsx
// 优化分片大小
<FileUploader
  action="/api/upload"
  chunkSize={5 * 1024 * 1024} // 根据网络环境调整分片大小
  maxConcurrent={3} // 根据网络环境调整并发数
/>
```

### 内存优化

```tsx
// 使用 Web Worker 计算文件哈希
const generateFileHash = file => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('/hash-worker.js');

    worker.onmessage = e => {
      resolve(e.data.hash);
      worker.terminate();
    };

    worker.onerror = error => {
      reject(error);
      worker.terminate();
    };

    worker.postMessage({ file });
  });
};
```

## 测试

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUploader } from './FileUploader';

// Mock fetch API
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

test('renders upload area', () => {
  render(<FileUploader action="/api/upload" />);

  expect(screen.getByText('点击或拖拽文件到此处上传')).toBeInTheDocument();
});

test('handles file selection', async () => {
  const onSuccess = jest.fn();
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

  // Mock successful responses
  global.fetch.mockImplementation(url => {
    if (url.includes('/check')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ uploadedChunks: [] }),
      });
    } else if (url.includes('/chunk')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    } else if (url.includes('/merge')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ url: '/uploads/test.txt', filename: 'test.txt' }),
      });
    }
  });

  render(<FileUploader action="/api/upload" onSuccess={onSuccess} />);

  // Simulate file selection
  const input = screen.getByRole('button').querySelector('input[type="file"]');
  fireEvent.change(input, { target: { files: [file] } });

  // Wait for upload to complete
  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
  });
});
```

## 故障排除

### 常见问题

**Q: 上传失败，没有错误提示？**
A: 检查网络请求是否正确发送，后端接口是否按照要求实现，以及是否正确处理了错误回调。

**Q: 大文件上传很慢？**
A: 调整 `chunkSize` 和 `maxConcurrent` 参数，根据网络环境找到最佳配置。

**Q: 文件哈希计算耗时长？**
A: 考虑使用 Web Worker 进行哈希计算，避免阻塞主线程。

**Q: 断点续传不工作？**
A: 确保后端正确实现了检查分片接口，并返回已上传的分片索引。

### 调试技巧

```tsx
// 添加调试信息
<FileUploader
  action="/api/upload"
  onProgress={(file, progress) => {
    console.log(`上传进度: ${file.name} - ${progress}%`);
  }}
  beforeUpload={file => {
    console.log('准备上传文件:', file);
    return true;
  }}
  onSuccess={(file, response) => {
    console.log('上传成功:', file, response);
  }}
  onError={(file, error) => {
    console.error('上传失败:', file, error);
  }}
/>
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持基础文件上传功能

### v1.1.0

- 添加分片上传功能
- 添加断点续传支持

### v1.2.0

- 添加文件哈希校验
- 优化上传性能
- 添加暂停/继续功能

## 相关组件

- [ImageUploader](../ImageUploader/README.md) - 图片上传组件
- [FileList](../FileList/README.md) - 文件列表组件
- [FilePreview](../FilePreview/README.md) - 文件预览组件

## 许可证

MIT License
