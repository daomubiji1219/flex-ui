import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualList } from '../VirtualList';
import type { VirtualListProps } from '../VirtualList';
import { ThemeProvider } from '../../../providers/ThemeProvider';

// Mock 本地 throttle 实现，确保测试中立即执行回调
vi.mock('../../../utils/throttle', () => ({
  throttle: (fn: (...args: unknown[]) => void) => fn,
}));

interface TestItem {
  id: number;
  name: string;
  value: string;
}

const generateTestData = (count: number): TestItem[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    value: `Value ${index + 1}`,
  }));
};

const renderTestItem = (item: TestItem) => (
  <div data-testid={`item-${item.id}`} key={item.id}>
    {item.name}: {item.value}
  </div>
);

// 测试渲染辅助函数
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider defaultMode="light">{ui}</ThemeProvider>);
};

describe('VirtualList Component', () => {
  const mockData = generateTestData(100);

  const defaultProps: VirtualListProps<TestItem> = {
    data: mockData,
    renderItem: renderTestItem,
  };

  describe('Rendering', () => {
    it('should render virtual list container', () => {
      renderWithTheme(<VirtualList {...defaultProps} />);
      const container = screen.getByTestId('virtual-list');
      expect(container).toBeInTheDocument();
    });

    it('should render visible items only', () => {
      renderWithTheme(
        <VirtualList {...defaultProps} itemHeight={50} containerHeight={200} />
      );

      // With 200px container height and 50px item height, should show ~4 items + overscan
      const visibleItems = screen.getAllByTestId(/^item-/);
      expect(visibleItems.length).toBeLessThan(mockData.length);
      expect(visibleItems.length).toBeGreaterThan(0);
    });

    it('should render first few items initially', () => {
      renderWithTheme(<VirtualList {...defaultProps} />);

      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });
  });

  describe('Configuration', () => {
    it('should use custom container height', () => {
      renderWithTheme(<VirtualList {...defaultProps} containerHeight={500} />);

      const container = screen.getByTestId('virtual-list');
      expect(container).toHaveStyle({ height: '500px' });
    });

    it('should handle empty data array', () => {
      renderWithTheme(<VirtualList data={[]} renderItem={renderTestItem} />);

      const container = screen.getByTestId('virtual-list');
      expect(container).toBeInTheDocument();
    });

    it('should use custom render function', () => {
      const customRender = (item: TestItem) => (
        <div data-testid={`custom-item-${item.id}`}>Custom: {item.name}</div>
      );

      renderWithTheme(
        <VirtualList {...defaultProps} renderItem={customRender} />
      );

      expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
    });
  });
});
