// 导入项目自定义的主题类型（从本地主题文件中）
import type { Theme as CustomTheme } from '../theme/tokens';

// TypeScript 的模块扩展语法：扩展 '@emotion/react' 模块的类型定义
declare module '@emotion/react' {
  // 重新定义 Emotion 内置的 Theme 接口，使其完全等同于自定义的 Theme 类型
  // 这样 Emotion 的所有主题相关 API 都会自动识别自定义主题的属性
  export interface Theme extends CustomTheme {}
}
