// src/components/DataTable/Pagination.tsx
import React from 'react';
import {
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  PaginationButton,
} from './DataTable.styled';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);
  const handlePrevious = () => {
    if (current > 1) {
      onChange(current - 1);
    }
  };

  const handleNext = () => {
    if (current < totalPages) {
      onChange(current + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onChange(page);
  };

  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 4) {
        pages.push('...');
      }

      const start = Math.max(2, current - 2);
      const end = Math.min(totalPages - 1, current + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < totalPages - 3) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <PaginationContainer data-testid="pagination">
      {/* 信息显示 */}
      <PaginationInfo>
        显示 {startItem}-{endItem} 条，共 {total} 条
      </PaginationInfo>

      {/* 分页控件 */}
      <PaginationControls>
        {/* 上一页 */}
        <PaginationButton onClick={handlePrevious} disabled={current === 1}>
          上一页
        </PaginationButton>

        {/* 页码 */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  padding: '8px 4px',
                  color: 'inherit',
                  fontSize: '14px',
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === current;

          return (
            <PaginationButton
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              active={isActive}
              style={{ minWidth: '40px' }}
            >
              {pageNum}
            </PaginationButton>
          );
        })}

        {/* 下一页 */}
        <PaginationButton
          onClick={handleNext}
          disabled={current === totalPages}
        >
          下一页
        </PaginationButton>
      </PaginationControls>
    </PaginationContainer>
  );
};
