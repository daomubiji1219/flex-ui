# 介绍

欢迎使用 Flexi-UI！这是一个现代化的 React 组件库，专注于提供灵活、高效、易用的 UI 组件。

## 设计理念

### 🧪 测试驱动开发 (TDD)

Flexi-UI 采用测试驱动开发方法，每个组件都先编写测试用例，再实现功能。这确保了：

- **高质量代码**：每个功能都经过充分测试
- **稳定可靠**：减少 bug 和回归问题
- **文档完善**：测试用例本身就是最好的使用文档
- **重构安全**：有测试保护，重构更安全

### 🎨 灵活的主题系统

支持深度定制的主题系统，让你能够：

- 轻松适配品牌色彩
- 自定义组件样式
- 支持暗色模式
- 响应式设计

### ⚡ 现代化技术栈

基于最新的前端技术构建：

- **React 18**：支持并发特性和最新 Hooks
- **TypeScript 5**：完整的类型支持
- **Vite**：快速的构建工具
- **Vitest**：现代化的测试框架
- **Tailwind CSS**：实用优先的 CSS 框架

## 核心特性

### 📦 按需加载

支持 ES Modules 和 Tree Shaking，只打包你使用的组件：

```tsx
// 只导入需要的组件
import { Button, Input } from '@daomu/flexi-ui';
```

### 🔧 TypeScript 支持

完整的 TypeScript 类型定义，提供优秀的开发体验：

```tsx
import { Button, ButtonProps } from '@daomu/flexi-ui';

// 完整的类型提示和检查
const MyButton: React.FC<ButtonProps> = props => {
  return <Button {...props} />;
};
```

### 🌍 国际化支持

内置国际化支持，轻松构建多语言应用：

```tsx
import { ConfigProvider } from '@daomu/flexi-ui';
import zhCN from '@daomu/flexi-ui/locale/zh-CN';

function App() {
  return <ConfigProvider locale={zhCN}>{/* 你的应用 */}</ConfigProvider>;
}
```

### 📱 响应式设计

所有组件都支持响应式设计，在各种设备上都能完美展示。

## 浏览器支持

现代浏览器和 IE11+（需要 polyfills）。

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               |

## 参与贡献

Flexi-UI 是一个开源项目，我们欢迎任何形式的贡献：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📝 改进文档
- 💻 提交代码

查看我们的 [贡献指南](/guide/contributing) 了解更多信息。

## 许可证

Flexi-UI 使用 [MIT 许可证](https://github.com/your-org/flexi-ui/blob/main/LICENSE)。
