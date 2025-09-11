import { useState, useRef, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { throttle } from 'lodash-es';

// 定义组件属性接口
interface VirtualListProps<T> {
  data: T[];
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  getKey?: (item: T) => number | string;
  renderItem: (item: T, index?: number) => ReactNode; //列表引索得节点
}

//jsx场景下防止误认<T>为标签
export const VirtualList = <T,>({
  data,
  itemHeight = 50,
  containerHeight = 1000,
  overscan = 3,
  getKey,
  renderItem,
}: VirtualListProps<T>) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [itemHeights, setItemHeights] = useState<Record<number, number>>({});

  const updateHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      if (prev[index] === height) return prev;
      return { ...prev, [index]: height };
    });
  }, []);

  const [startIndex, endIndex, totalHeight] = useMemo<
    [number, number, number]
  >(() => {
    let total = 0;
    let start = 0;
    let end = data.length;

    // 找出可视区域起点
    for (let i = 0; i < data.length; i++) {
      const h = itemHeights[i] || itemHeight;
      if (total + h >= scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
      total += h;
    }

    // 继续找出可视区域终点
    let visibleHeight = 0;
    for (let i = start; i < data.length; i++) {
      visibleHeight += itemHeights[i] || itemHeight;
      if (visibleHeight >= containerHeight) {
        end = Math.min(data.length, i + overscan * 2);
        break;
      }
    }

    const allHeight = data.reduce((acc, _, index) => {
      return acc + (itemHeights[index] || itemHeight);
    }, 0);

    return [start, end, allHeight];
  }, [itemHeight, scrollTop, itemHeights, data, overscan, containerHeight]);

  const offsetTop = useMemo<number>(() => {
    let offset = 0;
    for (let i = 0; i < startIndex; i++) {
      offset += itemHeights[i] || itemHeight;
    }
    return offset;
  }, [itemHeights, startIndex, itemHeight]);

  const handleScroll = throttle(() => {
    setScrollTop(containerRef.current?.scrollTop || 0);
  }, 50);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto bg-gray-50"
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
      data-testid="virtual-list"
    >
      <div className="relative" style={{ height: `${totalHeight}px` }}>
        <div
          className="absolute w-full"
          style={{
            transform: `translateY(${offsetTop}px)`,
          }}
        >
          {data.slice(startIndex, endIndex).map((item, i) => {
            const index = startIndex + i;
            return (
              <div
                key={getKey?.(item) ?? index}
                ref={ref => {
                  if (ref) {
                    const h = ref.offsetHeight;
                    if (h && itemHeights[index] !== h) {
                      updateHeight(index, h);
                    }
                  }
                }}
                className="border-b p-4 text-center bg-white hover:bg-blue-50 transition-colors"
              >
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export type { VirtualListProps };
export default VirtualList;

// 使用示例 - 展示组件能力
export const Demo = () => {
  const data = useMemo(
    () =>
      Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
      })),
    []
  );

  return (
    <VirtualList
      data={data}
      containerHeight={400}
      itemHeight={70}
      renderItem={item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      )}
    />
  );
};
