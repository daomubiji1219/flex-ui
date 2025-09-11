// src/components/DataTable/TableRow.tsx
import React, { useState } from 'react';
import type { Column } from './DataTable';
import { TableRowContainer, TableCell, ExpandButton } from './DataTable.styled';

interface TableRowProps<T> {
  record: T;
  columns: Column<T>[];
  index: number;
  selected?: boolean;
  onSelect?: (record: T, selected: boolean) => void;
  onRowClick?: (record: T, index: number) => void;
  selectable?: boolean;
  expandable?: boolean;
  expandedRowRender?: (record: T, index: number) => React.ReactNode;
}

export const TableRow = <T extends Record<string, unknown>>({
  record,
  columns,
  index,
  selected,
  onSelect,
  onRowClick,
  selectable = false,
  expandable = false,
  expandedRowRender,
}: TableRowProps<T>) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TableRowContainer className="table-row">
      {/* 主行 */}
      <div className="row-content" onClick={() => onRowClick?.(record, index)}>
        {/* 选择框 */}
        {selectable && (
          <div className="checkbox-cell">
            <input
              type="checkbox"
              checked={selected}
              onChange={e => {
                e.stopPropagation();
                onSelect?.(record, !selected);
              }}
            />
          </div>
        )}

        {/* 数据列 */}
        {columns.map(column => (
          <TableCell
            key={String(column.key)}
            width={column.width}
            className="table-cell"
          >
            {column.render
              ? column.render(record[column.key], record, index)
              : String(record[column.key] || '')}
          </TableCell>
        ))}

        {/* 展开按钮 */}
        {expandable && (
          <div className="expand-cell">
            <ExpandButton
              onClick={e => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              {expanded ? '−' : '+'}
            </ExpandButton>
          </div>
        )}
      </div>

      {/* 展开内容 */}
      {expandable && expanded && (
        <div className="expanded-content">
          {expandedRowRender?.(record, index)}
        </div>
      )}
    </TableRowContainer>
  );
};
