// src/components/DataTable/Pagination.tsx
import React from 'react';

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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      }}
    >
      {/* 信息显示 */}
      <div style={{ fontSize: '14px', color: '#6b7280' }}>
        显示 {startItem}-{endItem} 条，共 {total} 条
      </div>

      {/* 分页控件 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* 上一页 */}
        <button
          onClick={handlePrevious}
          disabled={current === 1}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: current === 1 ? '#f3f4f6' : 'white',
            color: current === 1 ? '#9ca3af' : '#374151',
            cursor: current === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          上一页
        </button>

        {/* 页码 */}
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                style={{
                  padding: '8px 4px',
                  color: '#9ca3af',
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
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: isActive ? '#3b82f6' : 'white',
                color: isActive ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: '14px',
                minWidth: '40px',
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* 下一页 */}
        <button
          onClick={handleNext}
          disabled={current === totalPages}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: current === totalPages ? '#f3f4f6' : 'white',
            color: current === totalPages ? '#9ca3af' : '#374151',
            cursor: current === totalPages ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          下一页
        </button>
      </div>
    </div>
  );
};
