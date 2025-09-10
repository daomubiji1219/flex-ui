# FileUploader 组件

一个功能强大的文件上传组件，支持大文件分片上传、断点续传、拖拽上传和多种主题。

## 特性

- 📁 支持单文件和多文件上传
- 🔄 大文件分片上传和断点续传
- 🎯 拖拽上传支持
- 🎨 多主题支持 (light/dark/auto)
- 📊 实时上传进度显示
- ⏸️ 上传暂停和恢复
- 🔒 文件类型和大小限制
- 🚀 并发上传控制
- 🔐 文件哈希校验
- 💾 上传前预处理

## 基础用法

```tsx
import { FileUploader } from '@flexi-ui/components'

function App() {
  const handleSuccess = (file, response) => {
    console.log('上传成功:', file.name, response)
  }

  const handleError = (file, error) => {
    console.error('上传失败:', file.name, error)
  }

  const handleProgress = (file, progress) => {
    console.log(`${file.name} 上传进度: ${progress}%`)
  }

  return (
    <FileUploader
      action="/api/upload"
      onSuccess={handleSuccess}
      onError={handleError}
      onProgress={handleProgress}
    />
  )
}
```

## 多文件上传

```tsx
<FileUploader
  action="/api/upload"
  multiple
  maxConcurrent={3}
  onSuccess={(file, response) => {
    console.log('文件上传成功:', file.name)
  }}
/>
```

## 分片上传配置

```tsx
<FileUploader
  action="/api/upload"
  urls={{
    check: '/api/upload/check',    // 检查已上传分片
    chunk: '/api/upload/chunk',    // 上传分片
    merge: '/api/upload/merge'     // 合并分片
  }}
  chunkSize={5 * 1024 * 1024}     // 5MB 分片大小
  maxConcurrent={5}               // 最大并发数
/>
```

## 文件限制

```tsx
<FileUploader
  action="/api/upload"
  accept=".jpg,.jpeg,.png,.gif"   // 只允许图片
  maxSize={10 * 1024 * 1024}      // 最大 10MB
  beforeUpload={(file) => {
    // 自定义验证逻辑
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB')
      return false
    }
    return true
  }}
/>
```

## 主题配置

```tsx
// 自动主题（跟随系统）
<FileUploader action="/api/upload" theme="auto" />

// 深色主题
<FileUploader action="/api/upload" theme="dark" />

// 浅色主题
<FileUploader action="/api/upload" theme="light" />
```

## 高级用法

### 断点续传

```tsx
function ResumableUploader() {
  return (
    <FileUploader
      action="/api/upload"
      urls={{
        check: '/api/upload/check',
        chunk: '/api/upload/chunk', 
        merge: '/api/upload/merge'
      }}
      chunkSize={2 * 1024 * 1024}  // 2MB 分片
      onProgress={(file, progress) => {
        console.log(`${file.name}: ${progress}%`)
      }}
      onError={(file, error) => {
        console.log('上传失败，可以重新上传继续之前的进度')
      }}
    />
  )
}
```

### 自定义样式

```tsx
<FileUploader
  action="/api/upload"
  className="custom-uploader"
  style={{
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '20px'
  }}
/>
```

## API

### FileUploaderProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| action | `string` | - | 上传接口地址 |
| urls | `UploadUrls` | - | 分片上传接口配置 |
| multiple | `boolean` | `false` | 是否支持多文件上传 |
| chunkSize | `number` | `2MB` | 分片大小（字节） |
| maxConcurrent | `number` | `3` | 最大并发上传数 |
| accept | `string` | - | 允许的文件类型 |
| maxSize | `number` | - | 文件大小限制（字节） |
| onProgress | `(file: UploadFile, progress: number) => void` | - | 上传进度回调 |
| onSuccess | `(file: UploadFile, response: unknown) => void` | - | 上传成功回调 |
| onError | `(file: UploadFile, error: Error) => void` | - | 上传失败回调 |
| beforeUpload | `(file: File) => boolean \| Promise<boolean>` | - | 上传前校验 |
| className | `string` | - | 自定义 CSS 类名 |
| theme | `'light' \| 'dark' \| 'auto'` | `'auto'` | 主题模式 |

### UploadUrls

| 属性 | 类型 | 描述 |
|------|------|------|
| check | `string` | 检查已上传分片的接口 |
| chunk | `string` | 上传分片的接口 |
| merge | `string` | 合并分片的接口 |

### UploadFile

| 属性 | 类型 | 描述 |
|------|------|------|
| uid | `string` | 文件唯一标识 |
| name | `string` | 文件名 |
| size | `number` | 文件大小 |
| type | `string` | 文件类型 |
| status | `'ready' \| 'uploading' \| 'success' \| 'error' \| 'paused'` | 上传状态 |
| progress | `number` | 上传进度 (0-100) |
| file | `File` | 原始文件对象 |
| hash | `string` | 文件哈希值 |

## 服务端接口

### 检查分片接口 (POST /api/upload/check)

**请求体:**
```json
{
  "hash": "文件MD5哈希值"
}
```

**响应:**
```json
{
  "uploadedChunks": [0, 1, 3, 5], // 已上传的分片索引
  "needUpload": true              // 是否需要上传
}
```

### 上传分片接口 (POST /api/upload/chunk)

**请求体 (FormData):**
- `chunk`: 分片文件
- `hash`: 文件哈希
- `index`: 分片索引
- `total`: 总分片数

**响应:**
```json
{
  "success": true,
  "message": "分片上传成功"
}
```

### 合并分片接口 (POST /api/upload/merge)

**请求体:**
```json
{
  "hash": "文件哈希值",
  "filename": "原始文件名",
  "total": 10  // 总分片数
}
```

**响应:**
```json
{
  "success": true,
  "url": "https://example.com/files/uploaded-file.jpg",
  "message": "文件上传成功"
}
```

## 样式定制

组件提供了丰富的 CSS 类名用于样式定制：

```css
/* 上传区域 */
.file-uploader {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

/* 拖拽状态 */
.file-uploader.dragging {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

/* 深色主题 */
.file-uploader.dark {
  border-color: #374151;
  background-color: #1f2937;
  color: #f9fafb;
}

/* 文件列表 */
.file-list {
  margin-top: 16px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

/* 进度条 */
.progress-bar {
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}
```

## 最佳实践

### 1. 分片大小选择

```tsx
// 根据网络环境选择合适的分片大小
const getChunkSize = () => {
  const connection = navigator.connection
  if (connection) {
    // 慢速网络使用较小分片
    if (connection.effectiveType === '2g' || connection.effectiveType === '3g') {
      return 1 * 1024 * 1024 // 1MB
    }
  }
  return 5 * 1024 * 1024 // 5MB
}

<FileUploader
  action="/api/upload"
  chunkSize={getChunkSize()}
/>
```

### 2. 错误处理

```tsx
function RobustUploader() {
  const [uploadErrors, setUploadErrors] = useState([])

  const handleError = (file, error) => {
    setUploadErrors(prev => [...prev, { file: file.name, error: error.message }])
    
    // 可以实现重试逻辑
    if (error.message.includes('network')) {
      setTimeout(() => {
        // 重新上传
        retryUpload(file)
      }, 3000)
    }
  }

  return (
    <div>
      <FileUploader
        action="/api/upload"
        onError={handleError}
      />
      {uploadErrors.length > 0 && (
        <div className="error-list">
          {uploadErrors.map((error, index) => (
            <div key={index} className="error-item">
              {error.file}: {error.error}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 3. 性能优化

```tsx
// 大文件上传优化
<FileUploader
  action="/api/upload"
  chunkSize={10 * 1024 * 1024}  // 大分片减少请求数
  maxConcurrent={2}             // 限制并发避免阻塞
  beforeUpload={async (file) => {
    // 预先检查服务器空间
    const hasSpace = await checkServerSpace(file.size)
    if (!hasSpace) {
      alert('服务器空间不足')
      return false
    }
    return true
  }}
/>
```

## 注意事项

1. **依赖要求**: 需要安装 `crypto-js` 用于文件哈希计算
2. **浏览器兼容**: 使用了 FileReader API，需要现代浏览器支持
3. **服务端配置**: 需要服务端支持分片上传接口
4. **内存使用**: 大文件分片时注意内存占用
5. **网络异常**: 建议实现重试机制处理网络异常

## 兼容性

- React 16.8+
- 现代浏览器 (Chrome 60+, Firefox 60+, Safari 12+)
- 需要 FileReader、Fetch API 支持

## 相关组件

- [Button](./Button.md) - 按钮组件
- [Progress](./Progress.md) - 进度条组件