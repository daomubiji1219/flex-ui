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

## 演示应用

查看完整的演示应用：

```bash
cd packages/flexi-ui
pnpm dev
```

## 快速开始

### 基础用法

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="FileUploader" />
</DemoContainer>

### 多文件上传

<DemoContainer title="多文件上传">
  <ReactDemo name="FileUploader" variant="multiple" />
</DemoContainer>

### 限制文件类型（仅图片）

<DemoContainer title="限制文件类型">
  <ReactDemo name="FileUploader" variant="accept" />
</DemoContainer>

### 限制文件大小（最大 1MB）

<DemoContainer title="限制文件大小">
  <ReactDemo name="FileUploader" variant="limit" />
</DemoContainer>

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

### 集成到表单

```tsx
import { useForm } from 'react-hook-form';

function UploadForm() {
  const { register, handleSubmit, setValue } = useForm();
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
        <label>附件</label>
        <FileUploader
          action="/api/upload"
          accept=".pdf,.doc,.docx"
          onSuccess={(file, response) => {
            const fileUrl = response.url;
            setFileUrl(fileUrl);
            setValue('attachment', fileUrl);
          }}
        />
      </div>

      <button type="submit">提交</button>
    </form>
  );
}
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

## 注意事项

- 大文件上传时建议调整合适的分片大小和并发数
- 使用断点续传功能需要后端支持相应的接口
- 文件哈希计算可能耗时，建议在 Web Worker 中进行
- 上传过程中避免页面刷新，可能导致上传中断
