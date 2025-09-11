// src/components/DataTable/TableHeader.tsx
import React from 'react';

interface Column<T> {
  key: keyof T;
  title: string;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  sortDirection?: 'asc' | 'desc';
  filterValue?: unknown;
}

interface TableHeaderProps<T> {
  columns: Column<T>[];
  onSort: (key: keyof T, direction: 'asc' | 'desc') => void;
  onFilter: (key: keyof T, value: unknown) => void;
}

export const TableHeader = <T extends Record<string, unknown>>({
  columns,
  onSort,
  onFilter,
}: TableHeaderProps<T>) => {
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const newDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const handleFilter = (column: Column<T>, value: string) => {
    onFilter(column.key, value || undefined);
  };

  return (
    <div className="table-header">
      {/* 标题行 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px',
          backgroundColor: '#f3f4f6',
          borderBottom: '2px solid #e5e7eb',
          fontWeight: '600',
          fontSize: '14px',
          color: '#374151',
        }}
      >
        {/* 选择框列 */}
        {/* <div style={{ marginRight: '12px', width: '20px' }}>
          <input type="checkbox" />
        </div> */}

        {columns.map(column => (
          <div
            key={String(column.key)}
            style={{
              flex: column.width ? `0 0 ${column.width}px` : '1',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center',
              cursor: column.sortable ? 'pointer' : 'default',
            }}
            onClick={() => handleSort(column)}
          >
            <span>{column.title}</span>
            {column.sortable && (
              <span style={{ marginLeft: '4px', fontSize: '12px' }}>
                {column.sortDirection === 'asc'
                  ? '↑'
                  : column.sortDirection === 'desc'
                    ? '↓'
                    : '↕'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* 过滤行 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        {/* 选择框列占位 */}
        <div style={{ marginRight: '12px', width: '20px' }} />

        {columns.map(column => (
          <div
            key={String(column.key)}
            style={{
              flex: column.width ? `0 0 ${column.width}px` : '1',
              padding: '0 8px',
            }}
          >
            {column.filterable && (
              <input
                type="text"
                placeholder={`筛选 ${column.title}`}
                value={String(column.filterValue || '')}
                onChange={e => handleFilter(column, e.target.value)}
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
