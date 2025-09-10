// src/components/DataTable/DataTable.tsx
import React, { useMemo, useState } from 'react'
import { VirtualList } from '../VirtualList/VirtualList'
import { TableRow } from './TableRow'
import { TableHeader } from './TableHeader'
import { TableSkeleton } from './TableSkeleton'
import { Pagination } from './Pagination'

export interface Column<T> {
  key: keyof T
  title: string
  width?: number
  sortable?: boolean
  filterable?: boolean
  render?: (value: unknown, record: T, index: number) => React.ReactNode
}

export interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  rowKey: keyof T
  pagination?: {
    pageSize: number
    showSizeChanger?: boolean
  }
  loading?: boolean
  onRowSelect?: (selectedRows: T[]) => void  //选中回调
  virtualScroll?: boolean
  selectable?: boolean
}

export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  pagination,
  loading,
  onRowSelect,
  virtualScroll = false,
  selectable = false
}: DataTableProps<T>) => {
  // 状态管理 - 简化实现
  //记录排序规则，存储{key: keyof T, direction: 'asc' | 'desc'}类型的数组
  const [sorting, setSorting] = useState<Array<{key: keyof T, direction: 'asc' | 'desc'}>>([])
  //记录筛选条件
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({})  //加可选修饰符’？‘
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // 数据处理
  const filteredData = useMemo(() => {
    return data.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        const itemValue = String(item[key as keyof T]).toLowerCase()
        return itemValue.includes(String(value).toLowerCase())
      })
    })
  }, [data, filters])
  
  const sortedData = useMemo(() => {
    if (sorting.length === 0) return filteredData
    
    return [...filteredData].sort((a, b) => {
      for (const sort of sorting) {
        const aVal = a[sort.key]
        const bVal = b[sort.key]
        //返回1交换两值，返回-1不交换
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sorting])
  
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData
    //计算当前页的页首引索和页尾引索
    const start = (currentPage - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pagination])
  
  // 使用onRowSelect回调
  React.useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedRows)
    }
  }, [selectedRows, onRowSelect])
  
  // 操作函数
  const actions = useMemo(() => ({
    //更新排序规则
    sort: (key: keyof T, direction: 'asc' | 'desc') => {
      setSorting([{ key, direction }])
    },
    //更新过滤规则，函数式更新
    filter: (key: keyof T, value: unknown) => {
      setFilters(prev => ({ ...prev, [key]: value }))
    },
    
    toggleRowSelection: (row: T, selected: boolean) => {
      setSelectedRows(prev => {
        if (selected) {
          return [...prev, row]
        } else {
          return prev.filter(r => r[rowKey] !== row[rowKey])
        }
      })
    },
    
    changePage: (page: number) => {
      setCurrentPage(page)
    }
  }), [rowKey])
  
  // 性能优化 - useMemo展示
  const processedColumns = useMemo(() => 
    columns.map(col => ({
      ...col,
      sortDirection: sorting.find((s: {key: keyof T, direction: 'asc' | 'desc'}) => s.key === col.key)?.direction,
      filterValue: filters[col.key]
    })), [columns, sorting, filters]
  )
  // 渲染优化
  const TableBody = useMemo(() => {
    if (virtualScroll && paginatedData.length >100) {
      console.log('virtualScroll',virtualScroll)
      return (
        <VirtualList
          data={paginatedData}
          containerHeight={400}
          itemHeight={48}
          renderItem={(row: T, index?: number) => (
            <TableRow
              key={String(row[rowKey])}
              data={row}
              selectable={selectable}

              columns={processedColumns}
              index={index ?? 0}
              selected={selectedRows.includes(row)}
              onSelect={(selected: boolean) => actions.toggleRowSelection(row, selected)}
            />
          )}
        />
      )
    }
    
    return (
      <div>
        {paginatedData.map((row: T, index: number) => (
          <TableRow
            key={String(row[rowKey])}
            data={row}
            selectable={selectable}
            columns={processedColumns}
            index={index}
            // selected={selectedRows.includes(row)}
            onSelect={(selected: boolean) => actions.toggleRowSelection(row, selected)}
          />
        ))}
      </div>
    )
  }, [paginatedData, processedColumns, selectedRows, virtualScroll, actions,rowKey,selectable])



  return (
    <div className="data-table">
      {/* 表头 */}
      <TableHeader
        columns={processedColumns}
        onSort={actions.sort}
        onFilter={actions.filter}
      />
      
      {/* 表体 */}
      {loading ? <TableSkeleton /> : TableBody}
      
      {/* 分页 */}
      {pagination && (
        <Pagination
          current={currentPage}
          total={filteredData.length}
          pageSize={pagination.pageSize}
          onChange={actions.changePage}
        />
      )}
    </div>
  )
}

export default DataTable