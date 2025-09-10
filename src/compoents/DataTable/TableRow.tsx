// src/components/DataTable/TableRow.tsx
import React from 'react'

interface Column<T> {
  key: keyof T
  title: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  render?: (value: unknown, record: T, index: number) => React.ReactNode
  sortDirection?: 'asc' | 'desc'
  filterValue?: unknown
}

interface TableRowProps<T> {
  data: T
  columns: Column<T>[]
  index: number
  selected?: boolean
  onSelect: (selected: boolean) => void
  selectable?: boolean
}

export const TableRow = <T extends Record<string, unknown>>({
  data,
  columns,
  index,
  selected,
  onSelect,
  selectable = false
}: TableRowProps<T>) => {
  return (
    <div 
      className={`table-row ${selected ? 'selected' : ''} ${index % 2 === 0 ? 'even' : 'odd'}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: selected ? '#eff6ff' : index % 2 === 0 ? '#f9fafb' : 'white',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
      }}
      onClick={() => onSelect(!selected)}
    >
      {/* 选择框 */}
      {selectable && (
        <div style={{ marginRight: '12px' }}>
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      {/* 数据列 */}
      {columns.map((column) => {
        const value = data[column.key]
        const displayValue = column.render 
          ? column.render(value, data, index)
          : String(value || '')
        
        return (
          <div
            key={String(column.key)}
            style={{
              flex: column.width ? `0 0 ${column.width}px` : '1',
              padding: '0 8px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {displayValue}
          </div>
        )
      })}
    </div>
  )
}