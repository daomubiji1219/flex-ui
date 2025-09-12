// 导入 Emotion 核心样式工具：styled 用于创建带样式的组件，css 用于编写嵌套/条件样式
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Theme } from '../../theme/tokens';

// 主容器组件：包裹整个文件上传区域，控制全局宽度和字体
// 接收完整的Theme对象，支持ThemeProvider主题系统
export const Container = styled.div<{ theme?: Theme }>`
  // 使用 css 函数接收组件 props（此处解构出 theme），编写条件样式
  ${({ theme }) => css`
    width: 100%; // 占满父容器宽度
    // 从主题 tokens 中获取正文字体，保证全局字体一致性
    font-family: ${theme.tokens.typography.fonts.body};
  `}
`;

// 拖拽区域组件：文件拖拽的核心交互区域，视觉状态随拖拽行为变化
// 接收四个关键 props：
// - theme：完整的主题对象（从ThemeProvider获取）
// - isDragging：是否有文件正在拖拽到区域上方（控制拖拽中样式）
// - darkMode：是否为暗黑模式（控制明暗主题下的颜色差异）
// - disabled：是否禁用（控制禁用态的光标和透明度）
export const DropZone = styled.div<{
  theme?: Theme;
  isDragging: boolean;
  darkMode: boolean;
  disabled?: boolean;
}>`
  ${({ theme, isDragging, darkMode, disabled }) => css`
    position: relative; // 为内部绝对定位的 Overlay 提供定位上下文
    // 边框样式：拖拽中显示主题主色，否则按明暗模式显示中性色
    border: 2px dashed
      ${isDragging
        ? theme.tokens.colors.primary[500] // 拖拽中：主题主色（500 为常规浓度）
        : darkMode
          ? theme.tokens.colors.neutral[600] // 暗黑模式：中性色 600（偏深灰）
          : theme.tokens.colors.neutral[300]}; // 亮色模式：中性色 300（偏浅灰）
    border-radius: ${theme.tokens.radii.lg}; // 从主题获取大圆角（统一圆角风格）
    padding: ${theme.tokens.spacing[9]}; // 从主题获取大间距（控制内部留白）
    min-height: 200px; // 设置最小高度，避免显示过扁
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中
    justify-content: center; // 水平居中
    text-align: center; // 内部内容居中对齐
    // 背景色：拖拽中显示主色透明层，否则按明暗模式显示中性透明层
    background-color: ${isDragging
      ? darkMode
        ? theme.tokens.colors.primary[900] + '33' // 暗黑拖拽中：主色 900（极深）+ 33% 透明度
        : theme.tokens.colors.primary[50] // 亮色拖拽中：主色 50（极浅）
      : darkMode
        ? theme.tokens.colors.neutral[800] + '80' // 暗黑常态：中性 800 + 80% 透明度
        : theme.tokens.colors.neutral[50]}; // 亮色常态：中性 50（极浅灰）
    // 光标：禁用时显示“不允许”，否则显示“指针”（提示可点击）
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    // 过渡动画：所有样式变化使用主题定义的“正常”速度（统一动效节奏）
    transition: all ${theme.tokens.transitions.normal};
    overflow: hidden; // 隐藏超出容器的内容（防止 Overlay 溢出）
    margin-bottom: ${theme.tokens.spacing[6]}; // 底部间距：与下方文件列表分隔
    opacity: ${disabled ? 0.6 : 1}; // 禁用态透明度降低（视觉上提示不可交互）

    // 拖拽中额外样式：轻微放大（增强拖拽反馈）
    ${isDragging &&
    css`
      transform: scale(1.02); // 放大 2%
    `}

    //  hover 状态：非禁用时改变边框和背景色（增强交互反馈）
    &:hover {
      ${!disabled &&
      css`
        border-color: ${theme.tokens.colors
          .primary[400]}; // 边框变为主色 400（稍浅）
        // 背景色与拖拽中一致，强化“可交互”感知
        background-color: ${darkMode
          ? theme.tokens.colors.primary[900] + '33'
          : theme.tokens.colors.primary[50]};
      `}
    }

    // focus-within 状态：内部元素获焦时（如隐藏的输入框），显示外轮廓（ accessibility 优化）
    &:focus-within {
      outline: 2px solid ${theme.tokens.colors.primary[500]}; // 主色外轮廓
      outline-offset: 2px; // 轮廓与边框保持 2px 间距（避免重叠）
    }
  `}
`;

// 拖拽区域覆盖层：仅在拖拽中显示，提供渐变动画效果（增强视觉反馈）
export const DropZoneOverlay = styled.div`
  position: absolute; // 绝对定位，覆盖整个 DropZone
  inset: 0; // 等同于 top:0; right:0; bottom:0; left:0;（填充父容器）
  // 渐变背景：从主色 500（10% 透明度）到透明，135deg 角度（斜向渐变）
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.tokens.colors.primary[500]}10 0%,
    // 主色 + 10% 透明度
    transparent 100%
  );
  // 脉冲动画：2 秒一次，使用 cubic-bezier 曲线控制节奏（平滑过渡）
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

  // 脉冲动画关键帧：透明度从 1 → 0.5 → 1（呼吸效果）
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

// 拖拽区域文本：显示“拖拽文件到此处”等提示文字，样式随状态变化
// 接收 isDragging（拖拽状态）和 darkMode（明暗模式）控制颜色
export const DropZoneText = styled.p<{
  theme?: Theme;
  isDragging: boolean;
  darkMode: boolean;
}>`
  ${({ theme, isDragging, darkMode }) => css`
    margin: 0; // 清除默认段落margin
    font-size: ${theme.tokens.typography
      .sizes[2]}; // 从主题获取文本尺寸（2 为中等大小）
    font-weight: ${theme.tokens.typography.weights
      .medium}; // 中等字重（比常规粗一点）
    transition: color ${theme.tokens.transitions.normal}; // 颜色变化添加过渡（平滑）
    // 文本颜色：拖拽中显示主色，否则按明暗模式显示中性色
    color: ${isDragging
      ? darkMode
        ? theme.tokens.colors.primary[400] // 暗黑拖拽中：主色 400（稍浅）
        : theme.tokens.colors.primary[600] // 亮色拖拽中：主色 600（稍深）
      : darkMode
        ? theme.tokens.colors.neutral[300] // 暗黑常态：中性 300（浅灰）
        : theme.tokens.colors.neutral[600]}; // 亮色常态：中性 600（深灰）

    // hover 状态：无论是否拖拽，都显示主色（强化可交互提示）
    &:hover {
      color: ${darkMode
        ? theme.tokens.colors.primary[400]
        : theme.tokens.colors.primary[600]};
    }
  `}
`;

// 隐藏的文件输入框：实际接收文件选择的核心元素，视觉上隐藏
// 通过 DropZone 点击事件触发其选择文件功能（自定义上传按钮的常规做法）
export const HiddenInput = styled.input`
  display: none; // 完全隐藏输入框（不占空间，不可见）
`;

// 拖拽区域内容容器：包裹图标、主文本、次文本，控制内部布局
export const DropZoneContent = styled.div`
  ${({ theme }) => css`
    display: flex; // 弹性布局
    flex-direction: column; // 垂直排列子元素（图标在上，文本在下）
    align-items: center; // 子元素水平居中
    gap: ${theme.tokens
      .spacing[4]}px; // 子元素间距：从主题获取 4 号间距（中等）
    pointer-events: none; // 取消指针事件（确保点击穿透到 DropZone，触发输入框）
  `}
`;

// 上传图标容器：显示“上传”相关图标（如云朵、文件图标）
export const UploadIcon = styled.div`
  ${({ theme }) => css`
    width: 48px; // 固定图标容器宽度
    height: 48px; // 固定图标容器高度（正方形，保证图标比例）
    color: ${theme.colors.text
      .secondary}; // 图标颜色：从主题获取次要文本色（偏灰）

    // 控制内部 SVG 图标尺寸：填满容器
    svg {
      width: 100%;
      height: 100%;
    }
  `}
`;

// 主要文本：显示拖拽区域的核心提示（如“拖拽文件到此处或点击上传”）
export const PrimaryText = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography
      .sizes[3]}px; // 3 号文本（比次要文本大）
    font-weight: ${theme.tokens.typography.weights
      .medium}; // 中等字重（突出核心信息）
    color: ${theme.colors.text.primary}; // 主要文本色（主题定义的强调色）
    margin-bottom: ${theme.tokens.spacing[1]}px; // 底部小间距：与次要文本分隔
  `}
`;

// 次要文本：显示辅助提示（如“支持 PNG、JPG 等格式，最大 10MB”）
export const SecondaryText = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography
      .sizes[1]}px; // 1 号文本（较小，辅助信息）
    color: ${theme.colors.text.secondary}; // 次要文本色（偏灰，不抢焦点）
    line-height: ${theme.tokens.typography.lineHeights
      .normal}; // 常规行高（保证可读性）
  `}
`;

// 文件列表容器：包裹所有已选择/上传的文件项，控制列表布局
export const FileList = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column; // 垂直排列文件项（一个文件一行）
    gap: ${theme.tokens.spacing[3]}; // 文件项间距：3 号间距（紧凑但不拥挤）
  `}
`;

// 文件列表标题：显示“已选择文件”等标题，与文件项区分
export const FileListHeader = styled.div`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[4]}px ${theme.tokens.spacing[6]}px; // 上下 4 号、左右 6 号间距
    // 背景色：按明暗模式显示中性色（与文件项背景区分）
    background-color: ${theme.isDark
      ? theme.tokens.colors.neutral[800] // 暗黑：中性 800（深灰）
      : theme.tokens.colors.neutral[50]}; // 亮色：中性 50（浅灰）
    border-bottom: 1px solid ${theme.colors.border}; // 底部边框：主题定义的边框色（分隔线）
    font-weight: ${theme.tokens.typography.weights
      .semibold}; // 半粗字重（突出标题）
    font-size: ${theme.tokens.typography
      .sizes[1]}px; // 1 号文本（与次要文本一致）
    color: ${theme.colors.text.primary}; // 主要文本色（强调标题）
  `}
`;

// 文件项容器：单个文件的卡片，包含图标、名称、大小、进度条等
// 接收 darkMode 控制明暗模式下的背景和边框
export const FileItem = styled.div<{ theme?: Theme; darkMode: boolean }>`
  ${({ theme, darkMode }) => css`
    // 背景色：暗黑模式深灰，亮色模式白色（卡片感）
    background-color: ${darkMode ? theme.tokens.colors.neutral[800] : 'white'};
    // 边框：暗黑模式中性 700（深灰边框），亮色模式中性 200（浅灰边框）
    border: 1px solid
      ${darkMode
        ? theme.tokens.colors.neutral[700]
        : theme.tokens.colors.neutral[200]};
    border-radius: ${theme.tokens.radii.lg}; // 大圆角（与 DropZone 统一风格）
    padding: ${theme.tokens.spacing[4]}; // 4 号内边距（内部元素不拥挤）
    // 阴影：亮色模式显示轻微阴影（增强卡片层次感），暗黑模式无阴影（避免突兀）
    box-shadow: ${darkMode
      ? 'none'
      : '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'};
    transition: all ${theme.tokens.transitions.normal}; // 所有样式变化添加过渡
    // 入场动画：从下方滑入（增强添加文件的反馈）
    animation: slideInFromBottom 0.3s ease-out;

    // hover 状态：亮色模式加深阴影（增强交互反馈）
    &:hover {
      box-shadow: ${darkMode
        ? 'none'
        : '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'};
    }

    // 滑入动画关键帧：从透明、下方 16px 到不透明、原位
    @keyframes slideInFromBottom {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `}
`;

// 文件图标：显示文件类型图标（如图片、文档），颜色随上传状态变化
// 接收 status 控制图标颜色（区分成功/失败/上传中等状态）
export const FileIcon = styled.div<{
  theme?: Theme;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
}>`
  ${({ theme, status }) => css`
    width: 24px; // 固定图标宽度
    height: 24px; // 固定图标高度（正方形）
    flex-shrink: 0; // 不允许收缩（保证图标尺寸不变）

    // 成功状态：语义化成功色（绿色系）
    ${status === 'success' &&
    css`
      color: ${theme.tokens.colors.semantic.success};
    `}

    // 错误状态：语义化错误色（红色系）
    ${status === 'error' &&
    css`
      color: ${theme.tokens.colors.semantic.error};
    `}
    
    // 上传中状态：主题主色
    ${status === 'uploading' &&
    css`
      color: ${theme.tokens.colors.primary[500]};
    `}
    
    // 准备上传/暂停状态：次要文本色（偏灰）
    ${(status === 'ready' || status === 'paused') &&
    css`
      color: ${theme.colors.text.secondary};
    `}
    
    // 控制 SVG 图标填满容器
    svg {
      width: 100%;
      height: 100%;
    }
  `}
`;

// 文件信息容器：包裹文件名、大小等文本信息，占满剩余空间
export const FileInfo = styled.div`
  flex: 1; // 弹性占比 1（填满父容器剩余宽度）
  min-width: 0; // 解决文本溢出时不换行的问题（允许文本截断）
`;

// 文件头部信息：包裹文件名、文件大小、状态标签，控制横向布局
export const FileHeader = styled.div`
  ${({ theme }) => css`
    display: flex;
    justify-content: space-between; // 两端对齐（文件名左，大小和标签右）
    align-items: center; // 垂直居中
    margin-bottom: ${theme.tokens.spacing[3]}; // 底部 3 号间距：与进度条分隔
    flex-wrap: wrap; // 允许换行（适配小屏幕，避免内容溢出）
    gap: ${theme.tokens.spacing[2]}; // 换行后元素间距：2 号间距（紧凑）
  `}
`;

// 文件名：显示文件名称，超出时截断（添加省略号）
// 接收 darkMode 控制文本颜色
export const FileName = styled.span<{ theme?: Theme; darkMode: boolean }>`
  ${({ theme, darkMode }) => css`
    font-weight: ${theme.tokens.typography.weights
      .semibold}; // 半粗字重（突出文件名）
    // 颜色：暗黑模式浅灰，亮色模式深灰（保证可读性）
    color: ${darkMode
      ? theme.tokens.colors.neutral[100]
      : theme.tokens.colors.neutral[900]};
    flex: 1; // 占满剩余宽度（优先显示文件名）
    min-width: 0; // 允许文本截断
    overflow: hidden; // 隐藏超出内容
    text-overflow: ellipsis; // 超出时显示省略号（...）
    white-space: nowrap; // 不换行（保证一行显示）
  `}
`;

// 文件大小：显示文件体积（如 2.3MB），辅助信息
// 接收 darkMode 控制文本颜色
export const FileSize = styled.span<{ theme?: Theme; darkMode: boolean }>`
  ${({ theme, darkMode }) => css`
    font-size: ${theme.tokens.typography
      .sizes[1]}; // 1 号文本（较小，辅助信息）
    // 颜色：暗黑模式中性 400（中灰），亮色模式中性 500（中灰）
    color: ${darkMode
      ? theme.tokens.colors.neutral[400]
      : theme.tokens.colors.neutral[500]};
  `}
`;

// 状态标签：显示文件上传状态（如“上传中”“成功”“失败”）
// 接收 status（状态）和 darkMode（明暗模式）控制背景和文本色
export const StatusBadge = styled.span<{
  theme?: Theme;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
  darkMode: boolean;
}>`
  ${({ theme, status, darkMode }) => css`
    padding: ${theme.tokens.spacing[1]} ${theme.tokens.spacing[2]}; // 上下 1 号、左右 2 号间距（小标签）
    border-radius: ${theme.tokens.radii.sm}; // 小圆角（标签风格）
    font-size: ${theme.tokens.typography
      .sizes[0]}; // 0 号文本（最小，标签专用）
    font-weight: ${theme.tokens.typography.weights
      .medium}; // 中等字重（突出状态）
    text-transform: uppercase; // 全大写（标签视觉风格统一）
    letter-spacing: 0.05em; // 字母间距 0.05em（增强大写文本可读性）

    // 准备上传状态：主色透明层
    ${status === 'ready' &&
    css`
      background-color: ${darkMode
        ? theme.tokens.colors.primary[900] + '33' // 暗黑：主色 900 + 33% 透明度
        : theme.tokens.colors.primary[50]}; // 亮色：主色 50（浅）
      color: ${darkMode
        ? theme.tokens.colors.primary[400]
        : theme.tokens.colors.primary[600]};
    `}

    // 上传中状态：橙色透明层（语义：进行中）
    ${status === 'uploading' &&
    css`
      background-color: ${darkMode
        ? theme.tokens.colors.orange[900] + '33'
        : theme.tokens.colors.orange[50]};
      color: ${darkMode
        ? theme.tokens.colors.orange[400]
        : theme.tokens.colors.orange[600]};
    `}
    
    // 成功状态：绿色透明层（语义：成功）
    ${status === 'success' &&
    css`
      background-color: ${darkMode
        ? theme.tokens.colors.green[900] + '33'
        : theme.tokens.colors.green[50]};
      color: ${darkMode
        ? theme.tokens.colors.green[400]
        : theme.tokens.colors.green[600]};
    `}
    
    // 错误状态：红色透明层（语义：失败）
    ${status === 'error' &&
    css`
      background-color: ${darkMode
        ? theme.tokens.colors.red[900] + '33'
        : theme.tokens.colors.red[50]};
      color: ${darkMode
        ? theme.tokens.colors.red[400]
        : theme.tokens.colors.red[600]};
    `}
    
    // 暂停状态：紫色透明层（语义：暂停）
    ${status === 'paused' &&
    css`
      background-color: ${darkMode
        ? theme.tokens.colors.purple[900] + '33'
        : theme.tokens.colors.purple[50]};
      color: ${darkMode
        ? theme.tokens.colors.purple[400]
        : theme.tokens.colors.purple[600]};
    `}
  `}
`;

// 文件详情：显示辅助信息（如“上传速度”“剩余时间”）
export const FileDetails = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[0]}px; // 0 号文本（最小）
    color: ${theme.colors.text.secondary}; // 次要文本色（偏灰）
    display: flex;
    align-items: center; // 垂直居中
    gap: ${theme.tokens.spacing[2]}px; // 元素间距：2 号（紧凑）
  `}
`;

// 进度条容器：包裹进度条和进度文本，控制进度条区域布局
export const ProgressContainer = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.tokens.spacing[2]}px; // 顶部 2 号间距：与文件详情分隔
    width: 100%; // 占满父容器宽度
  `}
`;

// 进度条背景：进度条的底层容器，控制进度条整体样式
// 接收 darkMode 控制背景色
export const ProgressBar = styled.div<{ theme?: Theme; darkMode: boolean }>`
  ${({ theme, darkMode }) => css`
    width: 100%; // 占满容器宽度
    height: 6px; // 固定高度（细进度条，不抢焦点）
    // 背景色：暗黑模式中性 700（深灰），亮色模式中性 200（浅灰）
    background-color: ${darkMode
      ? theme.tokens.colors.neutral[700]
      : theme.tokens.colors.neutral[200]};
    border-radius: ${theme.tokens.radii.full}; // 全圆角（圆形进度条）
    overflow: hidden; // 隐藏超出背景的进度填充部分
    margin-bottom: ${theme.tokens.spacing[3]}; // 底部 3 号间距：与操作按钮分隔
    position: relative; // 为进度条闪光效果提供定位上下文
  `}
`;

// 进度条填充：显示当前上传进度（宽度由 progress 控制）
// 接收 progress（进度百分比）和 status（状态）控制宽度和颜色
export const ProgressFill = styled.div<{
  theme?: Theme;
  progress: number;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
}>`
  ${({ theme, progress, status }) => css`
    height: 100%; // 填满进度条高度
    width: ${progress}%; // 进度宽度（由外部传入的百分比控制）
    border-radius: ${theme.tokens.radii.full}; // 全圆角（与背景统一）
    transition: width ${theme.tokens.transitions.normal}; // 宽度变化添加过渡（平滑进度）
    position: relative; // 为闪光效果提供定位上下文

    // 准备上传状态：主色渐变
    ${status === 'ready' &&
    css`
      background: linear-gradient(
        90deg,
        ${theme.tokens.colors.primary[500]},
        ${theme.tokens.colors.primary[400]}
      );
    `}

    // 上传中状态：主色渐变
    ${status === 'uploading' &&
    css`
      background: linear-gradient(
        90deg,
        ${theme.tokens.colors.primary[500]},
        ${theme.tokens.colors.primary[400]}
      );
    `}

    // 成功状态：绿色渐变
    ${status === 'success' &&
    css`
      background: linear-gradient(
        90deg,
        ${theme.tokens.colors.green[500]},
        ${theme.tokens.colors.green[400]}
      );
    `}

    // 错误状态：红色渐变
    ${status === 'error' &&
    css`
      background: linear-gradient(
        90deg,
        ${theme.tokens.colors.red[500]},
        ${theme.tokens.colors.red[400]}
      );
    `}

    // 暂停状态：紫色渐变
    ${status === 'paused' &&
    css`
      background: linear-gradient(
        90deg,
        ${theme.tokens.colors.purple[500]},
        ${theme.tokens.colors.purple[400]}
      );
    `}
  `}
`;

// 进度条闪光效果：在上传中显示，增强“动态进度”的视觉感知
export const ProgressShimmer = styled.div`
  position: absolute; // 绝对定位，覆盖进度条填充部分
  inset: 0; // 填满父容器
  // 渐变背景：透明 → 白色（30% 透明度）→ 透明（闪光效果）
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  // 闪光动画：2 秒一次，从左到右滑动
  animation: shimmer 2s infinite;

  // 闪光动画关键帧：从左侧 -100%（完全隐藏）到右侧 100%（完全隐藏）
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`;

// 操作按钮组：包裹“暂停/继续”“删除”等按钮，控制按钮布局
export const ButtonGroup = styled.div`
  ${({ theme }) => css`
    display: flex; // 水平排列按钮
    gap: ${theme.tokens.spacing[2]}; // 按钮间距：2 号（紧凑）
  `}
`;

// 操作按钮：文件操作的核心按钮（如暂停、继续、删除）
// 接收 variant 控制按钮类型（颜色区分功能）
export const ActionButton = styled.button<{
  theme?: Theme;
  variant?: 'pause' | 'resume' | 'primary' | 'secondary' | 'danger';
}>`
  ${({ theme, variant = 'secondary' }) => css`
    padding: ${theme.tokens.spacing[1]} ${theme.tokens.spacing[3]}; // 上下 1 号、左右 3 号间距（小按钮）
    border: none; // 清除默认边框
    border-radius: ${theme.tokens.radii.sm}; // 小圆角（按钮风格）
    font-size: ${theme.tokens.typography.sizes[0]}; // 0 号文本（小按钮专用）
    font-weight: ${theme.tokens.typography.weights
      .medium}; // 中等字重（突出按钮文本）
    cursor: pointer; // 光标显示“指针”（提示可点击）
    transition: all ${theme.tokens.transitions.fast}; // 快速过渡（按钮交互更灵敏）
    color: white; // 文本白色（深色背景按钮的常规搭配）

    // focus-visible 状态：键盘聚焦时显示外轮廓（accessibility 优化）
    &:focus-visible {
      outline: 2px solid ${theme.tokens.colors.primary[500]};
      outline-offset: 1px;
    }

    // 禁用状态：透明度降低，光标“不允许”
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    // hover 状态：非禁用时轻微上浮+添加阴影（增强交互反馈）
    &:hover:not(:disabled) {
      transform: translateY(-1px); // 上浮 1px
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // 加深阴影（增强层次感）
    }

    // active 状态：点击时回到原位（模拟按压反馈）
    &:active {
      transform: translateY(0);
    }

    // 暂停按钮：橙色系（语义：警告/进行中）
    ${variant === 'pause' &&
    css`
      background-color: ${theme.tokens.colors.orange[500]};

      &:hover:not(:disabled) {
        background-color: ${theme.tokens.colors
          .orange[600]}; // hover 时加深颜色
      }
    `}

    // 继续按钮：绿色系（语义：成功/恢复）
    ${variant === 'resume' &&
    css`
      background-color: ${theme.tokens.colors.green[500]};

      &:hover:not(:disabled) {
        background-color: ${theme.tokens.colors.green[600]};
      }
    `}
    
    // 主要按钮：主题主色（语义：核心操作）
    ${variant === 'primary' &&
    css`
      background-color: ${theme.tokens.colors.primary[500]};

      &:hover:not(:disabled) {
        background-color: ${theme.tokens.colors.primary[600]};
      }
    `}
    
    // 危险按钮：红色系（语义：删除/危险操作）
    ${variant === 'danger' &&
    css`
      background-color: ${theme.tokens.colors.red[500]};

      &:hover:not(:disabled) {
        background-color: ${theme.tokens.colors.red[600]};
      }
    `}
  `}
`;

// 状态指示器：与 StatusBadge 功能类似，可能用于更紧凑的场景（代码中未明确使用）
// 接收 status 控制颜色和背景
export const StatusIndicator = styled.div<{
  theme?: Theme;
  status: 'ready' | 'uploading' | 'success' | 'error' | 'paused';
}>`
  ${({ theme, status }) => css`
    font-size: ${theme.tokens.typography.sizes[0]}px; // 0 号文本
    font-weight: ${theme.tokens.typography.weights.medium}; // 中等字重
    padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[2]}px; // 小内边距
    border-radius: ${theme.tokens.radii.sm}; // 小圆角

    // 准备状态：次要文本色 + 边框色背景
    ${status === 'ready' &&
    css`
      color: ${theme.colors.text.secondary};
      background-color: ${theme.colors.border};
    `}

    // 上传中：主色文本 + 主色浅背景
    ${status === 'uploading' &&
    css`
      color: ${theme.tokens.colors.primary[700]};
      background-color: ${theme.tokens.colors.primary[100]};
    `}
    
    // 成功状态：语义成功色文本 + 成功色浅背景
    ${status === 'success' &&
    css`
      color: ${theme.tokens.colors.semantic.success};
      background-color: ${theme.tokens.colors.semantic.success}20; // 20% 透明度
    `}
    
    // 错误状态：语义错误色文本 + 错误色浅背景
    ${status === 'error' &&
    css`
      color: ${theme.tokens.colors.semantic.error};
      background-color: ${theme.tokens.colors.semantic.error}20;
    `}
    
    // 暂停状态：次要主题色文本 + 次要主题色浅背景
    ${status === 'paused' &&
    css`
      color: ${theme.tokens.colors.secondary[700]};
      background-color: ${theme.tokens.colors.secondary[100]};
    `}
  `}
`;

// 加载旋转器：显示“加载中”状态（如重试上传时）
export const Spinner = styled.div`
  ${({ theme: _theme }) => css`
    width: 16px; // 固定宽度
    height: 16px; // 固定高度（正方形）
    // 边框样式：透明边框 + 顶部当前色边框（形成扇形）
    border: 2px solid transparent;
    border-top: 2px solid currentColor; // currentColor 继承父元素颜色（灵活适配）
    border-radius: 50%; // 全圆角（圆形旋转器）
    // 旋转动画：1 秒一次，线性匀速
    animation: spin 1s linear infinite;

    // 旋转动画关键帧：从 0deg 到 360deg（完整一圈）
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `}
`;

// 错误消息：显示上传失败的详细原因（如“文件过大”“网络错误”）
export const ErrorMessage = styled.div`
  ${({ theme }) => css`
    margin-top: ${theme.tokens.spacing[2]}px; // 顶部 2 号间距：与进度条分隔
    padding: ${theme.tokens.spacing[2]}px ${theme.tokens.spacing[3]}px; // 上下 2 号、左右 3 号间距
    // 背景色：错误色 10% 透明度（浅红背景）
    background-color: ${theme.tokens.colors.semantic.error}10;
    // 边框：错误色 30% 透明度（浅红边框）
    border: 1px solid ${theme.tokens.colors.semantic.error}30;
    border-radius: ${theme.tokens.radii.sm}; // 小圆角
    color: ${theme.tokens.colors.semantic.error}; // 错误色文本（红色系）
    font-size: ${theme.tokens.typography.sizes[0]}px; // 0 号文本（辅助信息）
  `}
`;
