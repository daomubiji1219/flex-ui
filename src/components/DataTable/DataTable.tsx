/**
 * DataTable 数据表格组件
 *
 * 功能特性：
 * - 支持大数据量展示（虚拟滚动）
 * - 排序、筛选、分页功能
 * - 行选择功能
 * - 自定义渲染
 * - 响应式设计
 *
 * @author flexi-ui
 * @version 1.0.0
 */

// src/components/DataTable/DataTable.tsx
import React, { useMemo, useState } from 'react';
import { VirtualList } from '../VirtualList/VirtualList';
import { TableRow } from './TableRow';
import { TableHeader } from './TableHeader';
import { TableSkeleton } from './TableSkeleton';
import { Pagination } from './Pagination';
import { TableContainer } from './DataTable.styled';
import { useErrorBoundaryEnhanced } from '../../hooks/useErrorBoundaryEnhanced';
import { DefaultErrorFallback } from '../../hooks/useErrorBoundary';

/**
 * 表格列配置接口
 * @template T 数据行类型
 */
export interface Column<T> {
  /** 列对应的数据字段键名 */
  key: keyof T;
  /** 列标题显示文本 */
  title: string;
  /** 列宽度（像素），可选 */
  width?: number;
  /** 是否支持排序 */
  sortable?: boolean;
  /** 是否支持筛选 */
  filterable?: boolean;
  /** 当前排序方向，'asc' 升序 | 'desc' 降序 */
  sortDirection?: 'asc' | 'desc';
  /** 当前筛选值 */
  filterValue?: unknown;
  /** 自定义渲染函数，用于自定义单元格内容 */
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
}

/**
 * DataTable 组件属性接口
 * @template T 数据行类型，必须继承 Record<string, unknown>
 */
export interface DataTableProps<T> {
  /** 表格数据源 */
  data: T[];
  /** 列配置数组 */
  columns: Column<T>[];
  /** 行数据的唯一标识字段 */
  rowKey: keyof T;
  /** 分页配置，可选 */
  pagination?: {
    /** 每页显示条数 */
    pageSize: number;
    /** 是否显示页面大小选择器 */
    showSizeChanger?: boolean;
  };
  /** 是否显示加载状态 */
  loading?: boolean;
  /** 行选择回调函数 */
  onRowSelect?: (selectedRows: T[]) => void;
  /** 是否启用虚拟滚动（大数据量时推荐） */
  virtualScroll?: boolean;
  /** 是否支持行选择 */
  selectable?: boolean;
  /** 自定义 CSS 类名 */
  className?: string;
}

/**
 * DataTable 主组件
 *
 * 这是一个高性能的数据表格组件，支持大数据量展示和丰富的交互功能
 *
 * @param props DataTableProps<T> 组件属性
 * @returns JSX.Element 表格组件
 */
export const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  pagination,
  loading,
  onRowSelect,
  virtualScroll = false,
  selectable = false,
  className,
}: DataTableProps<T>) => {
  // ==================== 错误边界 ====================
  const { ErrorBoundary } = useErrorBoundaryEnhanced(DefaultErrorFallback, {
    maxRetries: 3,
    onError: (error, errorInfo) => {
      console.error('DataTable 组件发生错误:', { error, errorInfo });
    },
  });

  // ==================== 状态管理 ====================

  /**
   * 排序状态
   * 存储当前的排序规则数组，支持多字段排序
   * 格式：[{key: 字段名, direction: 'asc'|'desc'}]
   */
  const [sorting, setSorting] = useState<
    Array<{ key: keyof T; direction: 'asc' | 'desc' }>
  >([]);

  /**
   * 筛选状态
   * 存储各字段的筛选条件，使用 Partial 表示所有字段都是可选的
   */
  const [filters, setFilters] = useState<Partial<Record<keyof T, unknown>>>({});

  /**
   * 选中行状态
   * 存储当前选中的行数据数组
   */
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  /**
   * 当前页码状态
   * 用于分页功能，从 1 开始计数
   */
  const [currentPage, setCurrentPage] = useState(1);

  // ==================== 数据处理层 ====================

  /**
   * 第一层：数据筛选
   * 根据 filters 状态对原始数据进行筛选
   * 使用 useMemo 缓存结果，只有 data 或 filters 变化时才重新计算
   */
  const filteredData = useMemo(() => {
    // 添加数据类型检查，确保 data 是数组
    if (!Array.isArray(data)) {
      const errorMessage = `DataTable: data prop must be an array, received: ${typeof data} ${data}`;
      console.error(errorMessage);
      // 抛出错误以触发错误边界
      throw new Error(errorMessage);
    }

    return data.filter(item => {
      // 检查每个筛选条件
      return Object.entries(filters).every(([key, value]) => {
        // 如果筛选值为空，则不筛选该字段
        if (!value) return true;

        // 将数据项的值转为小写字符串进行包含匹配
        const itemValue = String(item[key as keyof T]).toLowerCase();
        return itemValue.includes(String(value).toLowerCase());
      });
    });
  }, [data, filters]);

  /**
   * 第二层：数据排序
   * 对筛选后的数据进行排序处理
   * 支持多字段排序，按 sorting 数组顺序依次排序
   */
  const sortedData = useMemo(() => {
    // 如果没有排序规则，直接返回筛选后的数据
    if (sorting.length === 0) return filteredData;

    // 创建副本进行排序，避免修改原数组
    return [...filteredData].sort((a, b) => {
      // 遍历所有排序规则
      for (const sort of sorting) {
        const aVal = a[sort.key];
        const bVal = b[sort.key];

        // 比较两个值，返回 -1、0、1 分别表示小于、等于、大于
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      }
      return 0; // 所有字段都相等
    });
  }, [filteredData, sorting]);

  /**
   * 第三层：数据分页
   * 对排序后的数据进行分页处理
   * 如果没有分页配置，则返回全部数据
   */
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    // 计算当前页的数据范围
    const start = (currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;

    return sortedData.slice(start, end);
  }, [sortedData, currentPage, pagination]);

  // ==================== 副作用处理 ====================

  /**
   * 行选择回调处理
   * 当选中行发生变化时，调用外部传入的回调函数
   */
  React.useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedRows);
    }
  }, [selectedRows, onRowSelect]);

  // ==================== 操作函数集合 ====================

  /**
   * 操作函数集合
   * 使用 useMemo 缓存，避免每次渲染都创建新的函数对象
   */
  const actions = useMemo(
    () => ({
      /**
       * 排序操作
       * @param key 要排序的字段
       * @param direction 排序方向
       */
      sort: (key: keyof T, direction: 'asc' | 'desc') => {
        setSorting([{ key, direction }]);
      },

      /**
       * 筛选操作
       * @param key 要筛选的字段
       * @param value 筛选值
       */
      filter: (key: keyof T, value: unknown) => {
        setFilters(prev => ({ ...prev, [key]: value }));
      },

      /**
       * 切换行选择状态
       * @param row 要操作的行数据
       * @param selected 是否选中
       */
      toggleRowSelection: (row: T, selected: boolean) => {
        setSelectedRows(prev => {
          if (selected) {
            // 添加到选中列表
            return [...prev, row];
          } else {
            // 从选中列表中移除
            return prev.filter(r => r[rowKey] !== row[rowKey]);
          }
        });
      },

      /**
       * 页码切换
       * @param page 目标页码
       */
      changePage: (page: number) => {
        setCurrentPage(page);
      },
    }),
    [rowKey] // 只依赖 rowKey，其他状态通过函数式更新处理
  );

  // ==================== 渲染优化 ====================

  /**
   * 处理后的列配置
   * 将当前的排序和筛选状态合并到列配置中
   */
  const processedColumns = useMemo(
    () =>
      columns.map(col => ({
        ...col,
        // 查找当前列的排序方向
        sortDirection: sorting.find(
          (s: { key: keyof T; direction: 'asc' | 'desc' }) => s.key === col.key
        )?.direction,
        // 获取当前列的筛选值
        filterValue: filters[col.key],
      })),
    [columns, sorting, filters]
  );

  /**
   * 表格主体渲染
   * 根据数据量和虚拟滚动配置选择渲染方式
   */
  const TableBody = useMemo(() => {
    // 当启用虚拟滚动且数据量超过 100 条时，使用虚拟列表
    if (virtualScroll && paginatedData.length > 100) {
      console.log('启用虚拟滚动模式，数据量:', paginatedData.length);
      return (
        <VirtualList
          data={paginatedData}
          containerHeight={400} // 容器高度
          itemHeight={48} // 每行高度
          renderItem={(row: T, index?: number) => (
            <TableRow
              key={String(row[rowKey])}
              record={row}
              selectable={selectable}
              columns={processedColumns}
              index={index ?? 0}
              selected={selectedRows.includes(row)}
              onSelect={(record: T, selected: boolean) =>
                actions.toggleRowSelection(record, selected)
              }
            />
          )}
        />
      );
    }

    // 普通渲染模式：直接渲染所有行
    return (
      <div>
        {paginatedData.map((row: T, index: number) => (
          <TableRow
            key={String(row[rowKey])}
            record={row}
            selectable={selectable}
            columns={processedColumns}
            index={index}
            selected={selectedRows.includes(row)}
            onSelect={(record: T, selected: boolean) =>
              actions.toggleRowSelection(record, selected)
            }
          />
        ))}
      </div>
    );
  }, [
    paginatedData, // 分页后的数据
    processedColumns, // 处理后的列配置
    selectedRows, // 选中的行
    virtualScroll, // 虚拟滚动开关
    actions, // 操作函数
    rowKey, // 行键
    selectable, // 是否可选择
  ]);

  // ==================== 组件渲染 ====================

  return (
    <ErrorBoundary>
      <TableContainer
        className={`data-table ${className || ''}`}
        data-testid="data-table"
      >
        {/* 表头组件：处理列标题、排序、筛选 */}
        <TableHeader
          columns={processedColumns}
          onSort={actions.sort}
          onFilter={actions.filter}
        />

        {/* 表体组件：根据加载状态显示骨架屏或实际内容 */}
        {loading ? <TableSkeleton /> : TableBody}

        {/* 分页组件：当配置了分页时显示 */}
        {pagination && (
          <Pagination
            current={currentPage}
            total={filteredData.length} // 使用筛选后的总数
            pageSize={pagination.pageSize}
            onChange={actions.changePage}
          />
        )}
      </TableContainer>
    </ErrorBoundary>
  );
};

export default DataTable;
