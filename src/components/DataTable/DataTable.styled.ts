import styled from '@emotion/styled';
import { css } from '@emotion/react';
import type { Theme } from '../../theme/tokens';

// 表格容器
export const TableContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
  border-radius: ${({ theme }) => theme?.tokens?.radii?.md || '8px'};
  overflow: hidden;
  background-color: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  box-shadow: ${({ theme }) =>
    theme?.tokens?.shadows?.sm || '0 1px 3px 0 rgba(0, 0, 0, 0.1)'};

  .data-table {
    width: 100%;
  }
`;

// 表格头部容器
export const TableHeaderContainer = styled.div<{ theme?: Theme }>`
  display: flex;
  flex-direction: row;
  background-color: ${({ theme }) => theme?.colors?.surface || '#f3f4f6'};
  border-bottom: 2px solid ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
`;

// 表格头部单元格
export const HeaderCell = styled.div<{ theme?: Theme }>`
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .header-content {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: ${({ theme }) => theme?.colors?.text || '#374151'};
  }
`;

// 排序按钮
export const SortButton = styled.button<{ theme?: Theme }>`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme?.colors?.text?.secondary || '#6b7280'};
  padding: 2px 4px;
  border-radius: 2px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.surface || '#f3f4f6'};
    color: ${({ theme }) => theme?.colors?.text?.primary || '#374151'};
  }

  &:focus {
    outline: 2px solid
      ${({ theme }) => theme?.tokens?.colors?.primary?.[500] || '#3b82f6'};
    outline-offset: 2px;
  }
`;

// 过滤输入框
export const FilterInput = styled.input<{ theme?: Theme }>`
  width: 100%;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#d1d5db'};
  border-radius: 4px;
  font-size: 12px;
  background-color: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  color: ${({ theme }) => theme?.colors?.text?.primary || '#374151'};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) =>
      theme?.tokens?.colors?.primary?.[500] || '#3b82f6'};
    box-shadow: 0 0 0 1px
      ${({ theme }) => theme?.tokens?.colors?.primary?.[500] || '#3b82f6'};
  }

  &::placeholder {
    color: ${({ theme }) => theme?.colors?.text?.secondary || '#9ca3af'};
  }
`;

// 表格主体
export const TableBody = styled.div`
  /* 表格主体样式 */
`;

// 表格行容器
export const TableRowContainer = styled.div<{ theme?: Theme }>`
  .row-content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid
      ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme?.colors?.surface || '#f9fafb'};
    }

    &:nth-of-type(even) {
      background-color: ${({ theme }) => theme?.colors?.surface || '#f9fafb'};
    }
  }

  .checkbox-cell {
    margin-right: 12px;
    width: 20px;
  }

  .expand-cell {
    margin-left: 12px;
    width: 20px;
  }

  .expanded-content {
    padding: 16px;
    background-color: ${({ theme }) => theme?.colors?.surface || '#f3f4f6'};
    border-bottom: 1px solid
      ${({ theme }) => theme?.colors?.border || '#e5e7eb'};
  }
`;

// 表格单元格
export const TableCell = styled.div<{ width?: number; theme?: Theme }>`
  ${({ width }) =>
    width
      ? css`
          flex: 0 0 ${width}px;
        `
      : css`
          flex: 1;
        `}
  padding: 0 8px;
  font-size: ${({ theme }) => theme?.tokens?.typography?.sizes?.[2] || '14px'};
  color: ${({ theme }) => theme?.colors?.text || '#374151'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 复选框容器
export const CheckboxContainer = styled.div`
  ${({ theme }) => css`
    margin-right: ${theme.tokens.spacing[3]}px;
    display: flex;
    align-items: center;
  `}
`;

// 复选框样式
export const Checkbox = styled.input`
  ${({ theme }) => css`
    width: 16px;
    height: 16px;
    accent-color: ${theme.tokens.colors.primary[500]};
    cursor: pointer;
  `}
`;

// 加载状态容器
export const LoadingContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.tokens.spacing[8]}px;
    color: ${theme.colors.text.secondary};
  `}
`;

// 空状态容器
export const EmptyContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.tokens.spacing[8]}px;
    color: ${theme.colors.text.secondary};

    svg {
      width: 48px;
      height: 48px;
      margin-bottom: ${theme.tokens.spacing[4]}px;
      opacity: 0.5;
    }
  `}
`;

// 分页容器
export const PaginationContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.tokens.spacing[4]}px ${theme.tokens.spacing[6]}px;
    border-top: 1px solid ${theme.colors.border};
    background-color: ${theme.colors.surface};
  `}
`;

// 分页信息
export const PaginationInfo = styled.div`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[1]}px;
    color: ${theme.colors.text.secondary};
  `}
`;

// 分页控制
export const PaginationControls = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.tokens.spacing[2]}px;
  `}
`;

// 分页按钮
export const PaginationButton = styled.button<{
  active?: boolean;
  disabled?: boolean;
}>`
  ${({ theme, active, disabled }) => css`
    padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[3]}px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.tokens.radii.sm};
    background-color: ${active
      ? theme.tokens.colors.primary[500]
      : theme.colors.surface};
    color: ${active ? 'white' : theme.colors.text.primary};
    font-size: ${theme.tokens.typography.sizes[1]}px;
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    opacity: ${disabled ? 0.5 : 1};
    transition: all ${theme.tokens.transitions.fast};

    &:hover:not(:disabled) {
      background-color: ${active
        ? theme.tokens.colors.primary[600]
        : theme.tokens.colors.neutral[50]};
    }

    &:disabled {
      cursor: not-allowed;
    }
  `}
`;

// 展开按钮
export const ExpandButton = styled.button<{ theme?: Theme }>`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme }) => theme?.colors?.text?.secondary || '#6b7280'};
  padding: 4px;
  border-radius: 2px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme?.colors?.surface || '#f3f4f6'};
    color: ${({ theme }) => theme?.colors?.text || '#374151'};
  }

  &:focus {
    outline: 2px solid
      ${({ theme }) => theme?.tokens?.colors?.primary?.[500] || '#3b82f6'};
    outline-offset: 2px;
  }
`;
