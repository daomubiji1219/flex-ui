# FileUploader 组件

一个支持大文件分片上传、断点续传、并发控制与哈希秒传的文件上传组件。

## 特性

- 📁 多文件/单文件上传
- 🧩 分片上传与断点续传
- ⚡ 并发控制与重试机制
- 🔒 beforeUpload 校验拦截
- ☁️ 自定义服务端 action 与 header
- 🔄 进度显示、取消与重试

## 基础用法

<DemoContainer title="基础用法（实时演示）">
  <ReactDemo name="FileUploader" />
</DemoContainer>

```tsx
import { FileUploader } from '@flexi-ui/components'

function App() {
  return (
    <FileUploader
      action="/api/upload"
      multiple
      chunkSize={2 * 1024 * 1024}
      onSuccess={(file, resp) => console.log('成功', file.name, resp)}
      onError={(file, err) => console.error('失败', file.name, err)}
    />
  )
}
```

## 拦截上传（beforeUpload）

```tsx
<FileUploader
  action="/api/upload"
  beforeUpload={async (file) => {
    // 例如：限制 10MB 以内且为图片类型
    const isImage = file.type.startsWith('image/')
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isImage) {
      alert('仅支持图片类型')
      return false
    }
    if (!isLt10M) {
      alert('文件需小于 10MB')
      return false
    }
    return true
  }}
/>
```

## 自定义请求头与携带信息

```tsx
<FileUploader
  action="/api/upload"
  headers={{ Authorization: 'Bearer xxx' }}
  data={{ biz: 'avatar' }}
/>
```

## 断点续传与秒传

```tsx
<FileUploader
  action="/api/upload"
  enableResume={true}
  enableInstant={true}
/>
```

<!-- ## API

- action: string (必填) 上传接口地址
- multiple: boolean 是否多选
- chunkSize: number 分片大小（字节）
- headers: Record<string, string> 额外请求头
- data: Record<string, string | number> 额外携带数据
- beforeUpload: (file: File) => boolean | Promise<boolean> 上传前校验
- onSuccess: (file: File, response: unknown) => void 成功回调
- onError: (file: File, error: unknown) => void 失败回调
- onProgress: (file: File, percent: number) => void 进度回调 -->