// src/examples/DataTableExample.tsx
import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { DataTable } from '../components/DataTable/DataTable';
import { Button } from '../components/Button/Button';
import { useTheme } from '../hooks/useTheme';
import type { Column } from '../components/DataTable/index';

// 示例数据类型
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  city: string;
  phone: string;
}

// 样式化组件
const ExampleContainer = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    padding: ${theme.tokens.spacing[6]}px;
    border-radius: ${theme.tokens.radii.lg};
    transition: all ${theme.tokens.transitions.normal};
  `}
`;

const ControlsContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-wrap: wrap;
    gap: ${theme.tokens.spacing[4]}px;
    margin-bottom: ${theme.tokens.spacing[6]}px;
    padding: ${theme.tokens.spacing[4]}px;
    background-color: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.tokens.radii.md};
  `}
`;

const ControlGroup = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.tokens.spacing[2]}px;
  `}
`;

const Label = styled.label`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[1]}px;
    font-weight: ${theme.tokens.typography.weights.medium};
    color: ${theme.colors.text.primary};
  `}
`;

const Select = styled.select`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[2]}px ${theme.tokens.spacing[3]}px;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.tokens.radii.sm};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    font-size: ${theme.tokens.typography.sizes[1]}px;
    transition: border-color ${theme.tokens.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${theme.tokens.colors.primary[500]};
      box-shadow: 0 0 0 1px ${theme.tokens.colors.primary[500]};
    }
  `}
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' | 'pending' }>`
  ${({ theme, status }) => {
    const statusConfig = {
      active: {
        bg: theme.isDark
          ? theme.tokens.colors.green[900]
          : theme.tokens.colors.green[100],
        text: theme.isDark
          ? theme.tokens.colors.green[200]
          : theme.tokens.colors.green[800],
        label: '活跃',
      },
      inactive: {
        bg: theme.isDark
          ? theme.tokens.colors.red[900]
          : theme.tokens.colors.red[100],
        text: theme.isDark
          ? theme.tokens.colors.red[200]
          : theme.tokens.colors.red[800],
        label: '非活跃',
      },
      pending: {
        bg: theme.isDark
          ? theme.tokens.colors.orange[900]
          : theme.tokens.colors.orange[100],
        text: theme.isDark
          ? theme.tokens.colors.orange[200]
          : theme.tokens.colors.orange[800],
        label: '待定',
      },
    };

    return css`
      padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[2]}px;
      border-radius: ${theme.tokens.radii.full};
      font-size: ${theme.tokens.typography.sizes[0]}px;
      font-weight: ${theme.tokens.typography.weights.medium};
      background-color: ${statusConfig[status].bg};
      color: ${statusConfig[status].text};

      &::before {
        content: '${statusConfig[status].label}';
      }
    `;
  }}
`;

const DepartmentBadge = styled.span`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[1]}px ${theme.tokens.spacing[2]}px;
    border-radius: ${theme.tokens.radii.sm};
    font-size: ${theme.tokens.typography.sizes[0]}px;
    font-weight: ${theme.tokens.typography.weights.medium};
    background-color: ${theme.isDark
      ? theme.tokens.colors.primary[900]
      : theme.tokens.colors.primary[100]};
    color: ${theme.isDark
      ? theme.tokens.colors.primary[200]
      : theme.tokens.colors.primary[800]};
  `}
`;

const SalaryText = styled.span`
  ${({ theme }) => css`
    font-weight: ${theme.tokens.typography.weights.semibold};
    color: ${theme.isDark
      ? theme.tokens.colors.green[400]
      : theme.tokens.colors.green[600]};
  `}
`;

const InfoContainer = styled.div`
  ${({ theme }) => css`
    margin-bottom: ${theme.tokens.spacing[4]}px;
    padding: ${theme.tokens.spacing[3]}px;
    background-color: ${theme.isDark
      ? theme.tokens.colors.primary[900]
      : theme.tokens.colors.primary[50]};
    border: 1px solid ${theme.tokens.colors.primary[200]};
    border-radius: ${theme.tokens.radii.md};
    font-size: ${theme.tokens.typography.sizes[1]}px;
    color: ${theme.colors.text.secondary};
  `}
`;

// 创建带测试样式的 DataTable 容器
const TestDataTableContainer = styled.div`
  border: 5px solid #22c55e !important;
  border-radius: 20px !important;
  box-shadow: 0 0 30px rgba(34, 197, 94, 0.8) !important;
  background: rgba(34, 197, 94, 0.1) !important;
  transform: scale(1.02) !important;
  margin: 20px !important;
  position: relative !important;

  &::before {
    content: '🎯 DataTable className 生效！';
    position: absolute;
    top: -15px;
    left: 20px;
    background: #22c55e;
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 14px;
    font-weight: bold;
    z-index: 1000;
    animation: bounce 2s infinite;
  }

  &::after {
    content: '✨ 表格测试 ✨';
    position: absolute;
    bottom: -15px;
    right: 20px;
    background: #16a34a;
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    font-size: 12px;
    z-index: 1000;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

// className 测试样式
const TestClassNameStyles = styled.div`
  .data-table-test-class {
    border: 5px solid #22c55e !important;
    border-radius: 20px !important;
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.8) !important;
    background: rgba(34, 197, 94, 0.1) !important;
    transform: scale(1.02) !important;
    margin: 20px !important;
    position: relative !important;

    &::before {
      content: '🎯 DataTable className 生效！';
      position: absolute;
      top: -15px;
      left: 20px;
      background: #22c55e;
      color: white;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 14px;
      font-weight: bold;
      z-index: 1000;
      animation: bounce 2s infinite;
    }

    &::after {
      content: '✨ 表格测试 ✨';
      position: absolute;
      bottom: -15px;
      right: 20px;
      background: #16a34a;
      color: white;
      padding: 5px 15px;
      border-radius: 15px;
      font-size: 12px;
      z-index: 1000;
    }

    @keyframes bounce {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  }
`;

// 生成示例数据
const generateSampleData = (count: number): User[] => {
  const departments = [
    '工程部',
    '产品部',
    '设计部',
    '市场部',
    '销售部',
    '人事部',
  ];
  const statuses = ['active', 'inactive', 'pending'] as const;
  const cities = [
    '北京',
    '上海',
    '广州',
    '深圳',
    '杭州',
    '成都',
    '武汉',
    '西安',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `用户${index + 1}`,
    email: `user${index + 1}@example.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    salary: Math.floor(Math.random() * 50000) + 30000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    joinDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
      .toISOString()
      .split('T')[0],
    city: cities[Math.floor(Math.random() * cities.length)],
    age: Math.floor(Math.random() * 40) + 22,
    phone: `1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  }));
};

const DataTableExample: React.FC = () => {
  const { theme } = useTheme();
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof User>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dataCount, setDataCount] = useState(100);
  const [selectedRows, setSelectedRows] = React.useState<User[]>([]);

  const data = useMemo(() => generateSampleData(dataCount), [dataCount]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortField] as string | number;
      const bValue = b[sortField] as string | number;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const getFieldLabel = (field: keyof User): string => {
    const labels: Record<keyof User, string> = {
      id: 'ID',
      name: '姓名',
      email: '邮箱',
      age: '年龄',
      department: '部门',
      salary: '薪资',
      status: '状态',
      joinDate: '入职日期',
      city: '城市',
      phone: '电话',
    };
    return labels[field];
  };

  // 定义列配置
  const columns: Column<User>[] = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      sortable: true,
      render: value => (
        <span className="font-mono text-sm">{String(value)}</span>
      ),
    },
    {
      key: 'name',
      title: '姓名',
      width: 120,
      sortable: true,
      filterable: true,
      render: value => <span className="font-medium">{String(value)}</span>,
    },
    {
      key: 'email',
      title: '邮箱',
      width: 200,
      sortable: true,
      filterable: true,
      render: value => <span className="text-blue-600">{String(value)}</span>,
    },
    {
      key: 'age',
      title: '年龄',
      width: 80,
      sortable: true,
      render: value => (
        <span className="text-center block">{String(value)}</span>
      ),
    },
    {
      key: 'department',
      title: '部门',
      width: 120,
      sortable: true,
      filterable: true,
      render: value => <DepartmentBadge>{String(value)}</DepartmentBadge>,
    },
    {
      key: 'salary',
      title: '薪资',
      width: 120,
      sortable: true,
      render: value => (
        <SalaryText>¥{(value as number).toLocaleString()}</SalaryText>
      ),
    },
    {
      key: 'status',
      title: '状态',
      width: 100,
      sortable: true,
      filterable: true,
      render: value => (
        <StatusBadge status={value as 'active' | 'inactive' | 'pending'} />
      ),
    },
    {
      key: 'joinDate',
      title: '入职日期',
      width: 120,
      sortable: true,
      render: value => <span className="text-gray-600">{String(value)}</span>,
    },
  ];

  const handleRowSelect = React.useCallback((rows: User[]) => {
    setSelectedRows(rows);
    console.log('Selected rows:', rows);
  }, []);

  return (
    <ExampleContainer>
      <TestClassNameStyles />
      <h2
        style={{
          marginBottom: theme.tokens.spacing[6] + 'px',
          color: theme.colors.text.primary,
          fontSize: theme.tokens.typography.sizes[5] + 'px',
          fontWeight: theme.tokens.typography.weights.bold,
        }}
      >
        数据表格示例
      </h2>

      {/* 控制面板 */}
      <ControlsContainer>
        <ControlGroup>
          <Label>数据量:</Label>
          <Select
            value={dataCount}
            onChange={e => {
              setDataCount(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={50}>50 条</option>
            <option value={100}>100 条</option>
            <option value={500}>500 条</option>
            <option value={1000}>1,000 条</option>
            <option value={5000}>5,000 条</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>每页显示:</Label>
          <Select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5 条</option>
            <option value={10}>10 条</option>
            <option value={20}>20 条</option>
            <option value={50}>50 条</option>
            <option value={100}>100 条</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>排序字段:</Label>
          <Select
            value={sortField}
            onChange={e => setSortField(e.target.value as keyof User)}
          >
            <option value="id">ID</option>
            <option value="name">姓名</option>
            <option value="age">年龄</option>
            <option value="salary">薪资</option>
            <option value="joinDate">入职日期</option>
          </Select>
        </ControlGroup>

        <ControlGroup>
          <Label>排序方向:</Label>
          <Select
            value={sortDirection}
            onChange={e => setSortDirection(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </Select>
        </ControlGroup>

        <ControlGroup style={{ justifyContent: 'flex-end' }}>
          <Button
            variant="primary"
            onClick={() => {
              setDataCount(Math.floor(Math.random() * 5000) + 100);
              setPageSize([5, 10, 20, 50][Math.floor(Math.random() * 4)]);
              setCurrentPage(1);
            }}
          >
            随机配置
          </Button>
        </ControlGroup>
      </ControlsContainer>

      {/* 信息展示 */}
      <InfoContainer>
        显示第 {(currentPage - 1) * pageSize + 1} -{' '}
        {Math.min(currentPage * pageSize, sortedData.length)} 条， 共{' '}
        {sortedData.length} 条数据
        {sortField && (
          <span style={{ marginLeft: theme.tokens.spacing[4] + 'px' }}>
            按{' '}
            <strong style={{ color: theme.colors.text.primary }}>
              {getFieldLabel(sortField)}
            </strong>{' '}
            {sortDirection === 'asc' ? '升序' : '降序'} 排列
          </span>
        )}
      </InfoContainer>

      {/* 选中行信息 */}
      {selectedRows.length > 0 && (
        <div
          style={{
            marginBottom: theme.tokens.spacing[4] + 'px',
            padding: theme.tokens.spacing[4] + 'px',
            backgroundColor: theme.isDark
              ? theme.tokens.colors.primary[900]
              : theme.tokens.colors.primary[50],
            border: `1px solid ${theme.tokens.colors.primary[200]}`,
            borderRadius: theme.tokens.radii.lg + 'px',
          }}
        >
          <h3
            style={{
              fontSize: theme.tokens.typography.sizes[1] + 'px',
              fontWeight: theme.tokens.typography.weights.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.tokens.spacing[2] + 'px',
            }}
          >
            已选中 {selectedRows.length} 行:
          </h3>
          <div
            style={{
              fontSize: theme.tokens.typography.sizes[1] + 'px',
              color: theme.colors.text.secondary,
            }}
          >
            {selectedRows.map(row => row.name).join(', ')}
          </div>
        </div>
      )}

      {/* DataTable 组件 */}
      <div
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.tokens.radii.lg + 'px',
          border: `1px solid ${theme.colors.border}`,
          position: 'relative',
        }}
      >
        <TestDataTableContainer>
          {/* <ErrorBoundary> */}
          <DataTable<User>
            data={sortedData}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize,
            }}
            loading={false}
            onRowSelect={handleRowSelect}
          />
          {/* </ErrorBoundary> */}
        </TestDataTableContainer>
      </div>

      {/* 数据统计 */}
      <div
        style={{
          marginTop: theme.tokens.spacing[6] + 'px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: theme.tokens.spacing[4] + 'px',
        }}
      >
        <div
          style={{
            padding: theme.tokens.spacing[4] + 'px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.tokens.radii.lg + 'px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3
            style={{
              fontSize: theme.tokens.typography.sizes[3] + 'px',
              fontWeight: theme.tokens.typography.weights.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.tokens.spacing[2] + 'px',
            }}
          >
            总用户数
          </h3>
          <p
            style={{
              fontSize: theme.tokens.typography.sizes[6] + 'px',
              fontWeight: theme.tokens.typography.weights.bold,
              color: theme.isDark
                ? theme.tokens.colors.primary[400]
                : theme.tokens.colors.primary[600],
            }}
          >
            {data.length}
          </p>
        </div>
        <div
          style={{
            padding: theme.tokens.spacing[4] + 'px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.tokens.radii.lg + 'px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3
            style={{
              fontSize: theme.tokens.typography.sizes[3] + 'px',
              fontWeight: theme.tokens.typography.weights.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.tokens.spacing[2] + 'px',
            }}
          >
            活跃用户
          </h3>
          <p
            style={{
              fontSize: theme.tokens.typography.sizes[6] + 'px',
              fontWeight: theme.tokens.typography.weights.bold,
              color: theme.isDark
                ? theme.tokens.colors.green[400]
                : theme.tokens.colors.green[600],
            }}
          >
            {data.filter(user => user.status === 'active').length}
          </p>
        </div>
        <div
          style={{
            padding: theme.tokens.spacing[4] + 'px',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.tokens.radii.lg + 'px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3
            style={{
              fontSize: theme.tokens.typography.sizes[3] + 'px',
              fontWeight: theme.tokens.typography.weights.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.tokens.spacing[2] + 'px',
            }}
          >
            已选中
          </h3>
          <p
            style={{
              fontSize: theme.tokens.typography.sizes[6] + 'px',
              fontWeight: theme.tokens.typography.weights.bold,
              color: theme.isDark
                ? theme.tokens.colors.purple[400]
                : theme.tokens.colors.purple[600],
            }}
          >
            {selectedRows.length}
          </p>
        </div>
      </div>
    </ExampleContainer>
  );
};

export default DataTableExample;
