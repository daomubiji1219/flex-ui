// src/components/DataTable/TableHeader.tsx
import type { Column } from './DataTable';
import {
  TableHeaderContainer,
  HeaderCell,
  SortButton,
  FilterInput,
} from './DataTable.styled';

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
    <TableHeaderContainer className="table-header">
      {columns.map(column => (
        <HeaderCell key={String(column.key)} className="header-cell">
          <div className="header-content">
            <span>{column.title}</span>
            {column.sortable && (
              <SortButton
                className="sort-button"
                onClick={() => handleSort(column)}
              >
                {column.sortDirection === 'asc'
                  ? '↑'
                  : column.sortDirection === 'desc'
                    ? '↓'
                    : '↕'}
              </SortButton>
            )}
          </div>
          {column.filterable && (
            <FilterInput
              type="text"
              className="filter-input"
              placeholder={`筛选 ${column.title}`}
              value={String(column.filterValue || '')}
              onChange={e => handleFilter(column, e.target.value)}
            />
          )}
        </HeaderCell>
      ))}
    </TableHeaderContainer>
  );
};
