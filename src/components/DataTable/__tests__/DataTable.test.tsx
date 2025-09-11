import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../DataTable';
import type { DataTableProps, Column } from '../DataTable';
import { ThemeProvider } from '../../../providers/ThemeProvider';

// Mock VirtualList component
vi.mock('../../VirtualList/VirtualList', () => ({
  VirtualList: ({
    data,
    renderItem,
  }: {
    data: unknown[];
    renderItem: (item: unknown, index: number) => React.ReactNode;
  }) => (
    <div data-testid="virtual-list">
      {data.map((item: unknown, index: number) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
    </div>
  ),
}));

// Test wrapper with ThemeProvider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider defaultMode="light">{children}</ThemeProvider>
);

interface TestData extends Record<string, unknown> {
  id: number;
  name: string;
  age: number;
  email: string;
}

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
];

const mockColumns: Column<TestData>[] = [
  { key: 'id', title: 'ID', width: 80 },
  { key: 'name', title: 'Name', width: 150, sortable: true },
  { key: 'age', title: 'Age', width: 100, sortable: true },
  { key: 'email', title: 'Email', width: 200, filterable: true },
];

// Helper function to render with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(ui, { wrapper: TestWrapper });
};

describe('DataTable Component', () => {
  const defaultProps: DataTableProps<TestData> = {
    data: mockData,
    columns: mockColumns,
    rowKey: 'id',
  };

  describe('Rendering', () => {
    it('should render data table with data', () => {
      renderWithTheme(<DataTable {...defaultProps} />);
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      renderWithTheme(<DataTable {...defaultProps} />);
      expect(screen.getByText('ID')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render empty table when no data', () => {
      renderWithTheme(<DataTable {...defaultProps} data={[]} />);
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when loading', () => {
      renderWithTheme(<DataTable {...defaultProps} loading />);
      expect(screen.getByTestId('table-skeleton')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should render pagination when enabled', () => {
      const paginationProps = {
        ...defaultProps,
        pagination: { pageSize: 2 },
      };
      renderWithTheme(<DataTable {...paginationProps} />);
      expect(screen.getByTestId('pagination')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('should render selectable table when selectable is true', () => {
      const onRowSelect = vi.fn();
      renderWithTheme(
        <DataTable {...defaultProps} selectable onRowSelect={onRowSelect} />
      );

      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });

  describe('Virtual Scroll', () => {
    it('should render with virtual scroll enabled', () => {
      renderWithTheme(<DataTable {...defaultProps} virtualScroll />);
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });
  });
});
