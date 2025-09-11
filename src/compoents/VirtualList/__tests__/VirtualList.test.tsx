import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VirtualList } from '../VirtualList';
import type { VirtualListProps } from '../VirtualList';

// Mock lodash-es throttle
vi.mock('lodash-es', () => ({
  throttle: (fn: Function) => fn,
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

const renderTestItem = (item: TestItem, index?: number) => (
  <div data-testid={`item-${item.id}`} key={item.id}>
    {item.name}: {item.value}
  </div>
);

describe('VirtualList Component', () => {
  const mockData = generateTestData(100);
  
  const defaultProps: VirtualListProps<TestItem> = {
    data: mockData,
    renderItem: renderTestItem,
  };

  describe('Rendering', () => {
    it('should render virtual list container', () => {
      render(<VirtualList {...defaultProps} />);
      const container = screen.getByTestId('virtual-list');
      expect(container).toBeInTheDocument();
    });

    it('should render visible items only', () => {
      render(
        <VirtualList
          {...defaultProps}
          itemHeight={50}
          containerHeight={200}
        />
      );
      
      // With 200px container height and 50px item height, should show ~4 items + overscan
      const visibleItems = screen.getAllByTestId(/^item-/);
      expect(visibleItems.length).toBeLessThan(mockData.length);
      expect(visibleItems.length).toBeGreaterThan(0);
    });

    it('should render first few items initially', () => {
      render(<VirtualList {...defaultProps} />);
      
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
      expect(screen.getByTestId('item-3')).toBeInTheDocument();
    });
  });

  describe('Configuration', () => {
    it('should use custom container height', () => {
      render(
        <VirtualList
          {...defaultProps}
          containerHeight={500}
        />
      );
      
      const container = screen.getByTestId('virtual-list');
      expect(container).toHaveStyle({ height: '500px' });
    });

    it('should handle empty data array', () => {
      render(
        <VirtualList
          data={[]}
          renderItem={renderTestItem}
        />
      );
      
      const container = screen.getByTestId('virtual-list');
      expect(container).toBeInTheDocument();
    });

    it('should use custom render function', () => {
      const customRender = (item: TestItem, index?: number) => (
        <div data-testid={`custom-item-${item.id}`}>
          Custom: {item.name}
        </div>
      );
      
      render(
        <VirtualList
          {...defaultProps}
          renderItem={customRender}
        />
      );
      
      expect(screen.getByTestId('custom-item-1')).toBeInTheDocument();
    });
  });
});