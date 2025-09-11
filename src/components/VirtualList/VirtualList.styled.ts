// 导入Emotion的styled函数，用于创建带样式的组件
import styled from '@emotion/styled';
// 导入Emotion的css函数，用于在样式中使用模板字符串语法
import { css } from '@emotion/react';
// 导入主题类型定义（当前为注释状态）
// import type { Theme } from '../../theme/tokens';

// 虚拟列表容器组件
// 接收containerHeight属性用于设置容器高度
export const VirtualListContainer = styled.div<{ containerHeight: number }>`
  ${({ theme, containerHeight }) => css`
    height: ${containerHeight}px; // 容器高度由外部传入
    overflow-y: auto; // 启用垂直滚动
    background-color: ${theme.colors.background}; // 使用主题背景色
    border-radius: ${theme.tokens.radii.md}; // 使用主题中等圆角
    border: 1px solid ${theme.colors.border}; // 使用主题边框样式

    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px; // 滚动条宽度
    }

    &::-webkit-scrollbar-track {
      // 滚动条轨道样式
      background: ${theme.isDark
        ? theme.tokens.colors.neutral[800]
        : theme.tokens.colors.neutral[100]}; // 根据暗黑模式切换轨道颜色
      border-radius: ${theme.tokens.radii.sm}; // 轨道使用小圆角
    }

    &::-webkit-scrollbar-thumb {
      // 滚动条滑块样式
      background: ${theme.isDark
        ? theme.tokens.colors.neutral[600]
        : theme.tokens.colors.neutral[400]}; // 根据暗黑模式切换滑块颜色
      border-radius: ${theme.tokens.radii.sm}; // 滑块使用小圆角

      &:hover {
        // 滑块hover状态
        background: ${theme.isDark
          ? theme.tokens.colors.neutral[500]
          : theme.tokens.colors.neutral[500]}; // hover时改变颜色
      }
    }
  `}
`;

// 虚拟列表内容区域组件
// 接收totalHeight属性用于设置总高度
export const VirtualListContent = styled.div<{ totalHeight: number }>`
  ${({ totalHeight }) => css`
    position: relative; // 相对定位，作为子元素定位参考
    height: ${totalHeight}px; // 总高度由所有列表项高度计算得出
  `}
`;

// 可视区域容器组件
// 接收offsetTop属性用于设置偏移量
export const VisibleArea = styled.div<{ offsetTop: number }>`
  ${({ offsetTop }) => css`
    position: absolute; // 绝对定位，用于滚动时调整位置
    width: 100%; // 宽度占满父容器
    transform: translateY(${offsetTop}px); // 通过位移实现滚动效果
  `}
`;

// 虚拟列表项组件
export const VirtualListItem = styled.div`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[4]}px; // 使用主题间距
    text-align: center; // 文本居中对齐
    background-color: ${theme.colors.surface}; // 使用主题表面色
    border-bottom: 1px solid ${theme.colors.border}; // 底部边框
    transition: all ${theme.tokens.transitions.fast}; // 使用主题快速过渡效果

    &:hover {
      // 列表项hover状态
      background-color: ${theme.isDark
        ? theme.tokens.colors.primary[900]
        : theme.tokens.colors.primary[50]}; // 根据暗黑模式切换hover背景色
    }

    &:last-child {
      // 最后一个列表项去除底部边框
      border-bottom: none;
    }
  `}
`;

// 加载状态容器组件
export const LoadingContainer = styled.div`
  ${({ theme }) => css`
    display: flex; // 使用flex布局
    align-items: center; // 垂直居中
    justify-content: center; // 水平居中
    padding: ${theme.tokens.spacing[8]}px; // 使用主题大间距
    color: ${theme.colors.text.secondary}; // 使用主题次要文本色
    font-size: ${theme.tokens.typography.sizes[2]}px; // 使用主题字体大小
  `}
`;

// 空状态容器组件
export const EmptyContainer = styled.div`
  ${({ theme }) => css`
    display: flex; // 使用flex布局
    flex-direction: column; // 垂直排列子元素
    align-items: center; // 垂直居中
    justify-content: center; // 水平居中
    padding: ${theme.tokens.spacing[8]}px; // 使用主题大间距
    color: ${theme.colors.text.secondary}; // 使用主题次要文本色

    svg {
      // 空状态图标样式
      width: 48px; // 图标宽度
      height: 48px; // 图标高度
      margin-bottom: ${theme.tokens.spacing[4]}px; // 图标底部间距
      opacity: 0.5; // 图标半透明效果
    }

    p {
      // 空状态文本样式
      font-size: ${theme.tokens.typography.sizes[2]}px; // 使用主题字体大小
      margin: 0; // 去除默认外边距
    }
  `}
`;

// 虚拟列表项内容包装器组件
export const ItemContent = styled.div`
  ${({ theme }) => css`
    h3 {
      // 列表项标题样式
      margin: 0 0 ${theme.tokens.spacing[1]}px 0; // 底部间距
      font-size: ${theme.tokens.typography.sizes[3]}px; // 使用主题字体大小
      font-weight: ${theme.tokens.typography.weights
        .semibold}; // 使用主题半粗体
      color: ${theme.colors.text.primary}; // 使用主题主要文本色
    }

    p {
      // 列表项描述文本样式
      margin: 0; // 去除默认外边距
      font-size: ${theme.tokens.typography.sizes[1]}px; // 使用主题字体大小
      color: ${theme.colors.text.secondary}; // 使用主题次要文本色
      line-height: ${theme.tokens.typography.lineHeights
        .normal}; // 使用主题行高
    }
  `}
`;
