import React, { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { VirtualList } from '../components/VirtualList/VirtualList';
import { Button } from '../components/Button/Button';
import { useTheme } from '../hooks/useTheme';

// 示例数据类型
interface ListItem {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
}

// 生成示例数据
const generateSampleData = (count: number): ListItem[] => {
  const categories = ['工作', '学习', '生活', '娱乐', '健康'];
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `任务 ${index + 1}`,
    description: `这是第 ${index + 1} 个任务的详细描述，包含了一些重要的信息和说明。`,
    category: categories[Math.floor(Math.random() * categories.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString('zh-CN'),
  }));
};

// 样式化组件
const ExampleContainer = styled.div`
  ${({ theme }) => css`
    padding: ${theme.tokens.spacing[6]}px;
    background-color: ${theme.colors.background};
    min-height: 100vh;
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
    border-radius: ${theme.tokens.radii.lg};
    border: 1px solid ${theme.colors.border};
  `}
`;

const ControlGroup = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.tokens.spacing[2]}px;
  `}
`;

const Label = styled.label`
  ${({ theme }) => css`
    font-size: ${theme.tokens.typography.sizes[1]}px;
    font-weight: ${theme.tokens.typography.weights.medium};
    color: ${theme.colors.text.primary};
    white-space: nowrap;
  `}
`;

const VirtualListExample: React.FC = () => {
  const { theme } = useTheme();
  const [itemCount, setItemCount] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(400);
  const [itemHeight, setItemHeight] = useState(80);

  const data = useMemo(() => generateSampleData(itemCount), [itemCount]);

  // 渲染列表项
  const renderItem = (item: ListItem, index?: number) => {
    const priorityColors = {
      high: theme.colors.semantic.error,
      medium: theme.colors.semantic.warning,
      low: theme.colors.semantic.success,
    };

    return (
      <div
        style={{
          padding: '12px 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor:
            index && index % 2 === 0
              ? theme.colors.surface
              : theme.colors.background,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}
          >
            {item.title}
          </h4>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                backgroundColor: priorityColors[item.priority],
                color: 'white',
              }}
            >
              {item.priority === 'high'
                ? '高'
                : item.priority === 'medium'
                  ? '中'
                  : '低'}
            </span>
            <span
              style={{ fontSize: '12px', color: theme.colors.text.secondary }}
            >
              {item.category}
            </span>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme.colors.text.secondary,
            lineHeight: '1.4',
          }}
        >
          {item.description}
        </p>
        <div style={{ fontSize: '11px', color: theme.colors.text.disabled }}>
          创建时间: {item.createdAt} | ID: {item.id}
        </div>
      </div>
    );
  };

  return (
    <ExampleContainer>
      <h2
        style={{
          marginBottom: theme.tokens.spacing[5] + 'px',
          color: theme.colors.text.primary,
        }}
      >
        VirtualList 虚拟列表示例
      </h2>
      <p
        style={{
          color: theme.colors.text.secondary,
          marginBottom: theme.tokens.spacing[5] + 'px',
        }}
      >
        虚拟列表组件可以高效渲染大量数据，只渲染可视区域内的元素，提升性能。
      </p>

      {/* 控制面板 */}
      <ControlsContainer>
        <ControlGroup>
          <Label>数据量:</Label>
          <select
            value={itemCount}
            onChange={e => setItemCount(Number(e.target.value))}
            style={{
              padding:
                theme.tokens.spacing[1] +
                'px ' +
                theme.tokens.spacing[2] +
                'px',
              borderRadius: theme.tokens.radii.sm,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
            }}
          >
            <option value={100}>100 条</option>
            <option value={1000}>1,000 条</option>
            <option value={5000}>5,000 条</option>
            <option value={10000}>10,000 条</option>
            <option value={50000}>50,000 条</option>
          </select>
        </ControlGroup>

        <ControlGroup>
          <Label>容器高度:</Label>
          <select
            value={containerHeight}
            onChange={e => setContainerHeight(Number(e.target.value))}
            style={{
              padding:
                theme.tokens.spacing[1] +
                'px ' +
                theme.tokens.spacing[2] +
                'px',
              borderRadius: theme.tokens.radii.sm,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
            }}
          >
            <option value={300}>300px</option>
            <option value={400}>400px</option>
            <option value={500}>500px</option>
            <option value={600}>600px</option>
          </select>
        </ControlGroup>

        <ControlGroup>
          <Label>项目高度:</Label>
          <select
            value={itemHeight}
            onChange={e => setItemHeight(Number(e.target.value))}
            style={{
              padding:
                theme.tokens.spacing[1] +
                'px ' +
                theme.tokens.spacing[2] +
                'px',
              borderRadius: theme.tokens.radii.sm,
              border: `1px solid ${theme.colors.border}`,
              backgroundColor: theme.colors.background,
              color: theme.colors.text.primary,
            }}
          >
            <option value={60}>60px</option>
            <option value={80}>80px</option>
            <option value={100}>100px</option>
            <option value={120}>120px</option>
          </select>
        </ControlGroup>

        <Button
          onClick={() => setItemCount(Math.floor(Math.random() * 10000) + 1000)}
          variant="outline"
          size="sm"
        >
          随机数据量
        </Button>
      </ControlsContainer>

      {/* 信息展示 */}
      <div
        style={{
          marginBottom: theme.tokens.spacing[4] + 'px',
          fontSize: theme.tokens.typography.sizes[2] + 'px',
          color: theme.colors.text.secondary,
          display: 'flex',
          gap: theme.tokens.spacing[4] + 'px',
          flexWrap: 'wrap',
        }}
      >
        <span>
          总数据量:{' '}
          <strong style={{ color: theme.colors.text.primary }}>
            {data.length.toLocaleString()}
          </strong>{' '}
          条
        </span>
        <span>
          容器高度:{' '}
          <strong style={{ color: theme.colors.text.primary }}>
            {containerHeight}px
          </strong>
        </span>
        <span>
          项目高度:{' '}
          <strong style={{ color: theme.colors.text.primary }}>
            {itemHeight}px
          </strong>
        </span>
        <span>
          预计可见项目:{' '}
          <strong style={{ color: theme.colors.text.primary }}>
            {Math.ceil(containerHeight / itemHeight)}
          </strong>{' '}
          个
        </span>
      </div>

      {/* 虚拟列表 */}
      <div
        style={{
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.tokens.radii.lg,
          overflow: 'hidden',
          boxShadow: theme.isDark
            ? '0 2px 8px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <VirtualList
          data={data}
          containerHeight={containerHeight}
          itemHeight={itemHeight}
          overscan={5}
          getKey={item => item.id}
          renderItem={renderItem}
        />
      </div>

      {/* 性能说明 */}
      <div
        style={{
          marginTop: theme.tokens.spacing[5] + 'px',
          padding: theme.tokens.spacing[4] + 'px',
          backgroundColor: theme.isDark
            ? theme.tokens.colors.primary[900]
            : theme.tokens.colors.primary[50],
          borderRadius: theme.tokens.radii.lg,
          fontSize: theme.tokens.typography.sizes[2] + 'px',
        }}
      >
        <h4
          style={{
            margin: '0 0 ' + theme.tokens.spacing[2] + 'px 0',
            color: theme.tokens.colors.primary[500],
          }}
        >
          性能优势
        </h4>
        <ul
          style={{
            margin: 0,
            paddingLeft: theme.tokens.spacing[5] + 'px',
            color: theme.colors.text.secondary,
          }}
        >
          <li>只渲染可视区域内的元素，大幅减少 DOM 节点数量</li>
          <li>支持动态高度和固定高度两种模式</li>
          <li>内置节流优化，减少滚动时的重复计算</li>
          <li>支持预渲染（overscan）提升滚动体验</li>
          <li>适用于大数据量列表场景，如数据表格、聊天记录等</li>
        </ul>
      </div>
    </ExampleContainer>
  );
};

export default VirtualListExample;
