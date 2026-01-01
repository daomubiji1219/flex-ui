<template>
  <div ref="rootEl"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

// 通过组件名动态映射到实际的 React 组件
// 根据你的导出结构，从源码入口导入组件
import * as Lib from '@/index';

interface ReactDemoProps {
  name: string;
  // 传递给 React 组件的 props
  props?: Record<string, unknown>;
  // 演示变体
  variant?: string;
}

const props = defineProps<ReactDemoProps>();
const rootEl: Ref<HTMLElement | null> = ref(null);
let root: Root | null = null;

// 简单的 SVG 图标
const PlusIcon = React.createElement(
  'svg',
  {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
  },
  React.createElement('path', { d: 'M12 5v14M5 12h14' })
);

const DownloadIcon = React.createElement(
  'svg',
  {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
  },
  React.createElement('path', { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' })
);

// 为特定组件提供默认演示 props
function getDefaultProps(name: string, variant?: string): Record<string, unknown> | undefined {
  switch (name) {
    case 'VirtualList': {
      const data = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
      }));
      
      const baseProps = {
        data,
        containerHeight: 320,
        itemHeight: 60,
        renderItem: (item: { id: number; name: string; description: string }) =>
          React.createElement(
            'div',
            {
              key: item.id,
              style: {
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                height: '60px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
            },
            [
              React.createElement(
                'div',
                { key: 't', style: { fontWeight: 600 } },
                item.name
              ),
              React.createElement(
                'div',
                { key: 'd', style: { color: '#666', fontSize: '12px' } },
                item.description
              ),
            ]
          ),
      };

      if (variant === 'variable') {
        return {
          ...baseProps,
          itemHeight: (index: number) => 60 + (index % 3) * 20, // 60, 80, 100
          renderItem: (item: any, index: number) =>
             React.createElement(
            'div',
            {
              key: item.id,
              style: {
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                height: `${60 + (index % 3) * 20}px`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff'
              },
            },
            [
              React.createElement('div', { key: 't', style: { fontWeight: 600 } }, `${item.name} (H: ${60 + (index % 3) * 20}px)`),
              React.createElement('div', { key: 'd', style: { color: '#666', fontSize: '12px' } }, item.description),
            ]
          )
        };
      }
      
      return baseProps;
    }
    case 'DataTable': {
      const data: Array<Record<string, unknown>> = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: ['张三', '李四', '王五', '赵六', '钱七'][i % 5] + (i + 1),
        email: `user${i + 1}@example.com`,
        age: 20 + (i % 30),
        status: i % 3 === 0 ? 'inactive' : 'active',
        salary: 10000 + (i % 50) * 500,
        joinDate: new Date(Date.now() - i * 86400000).toLocaleDateString()
      }));

      const columns: Array<Record<string, unknown>> = [
        { key: 'id', title: 'ID', width: 60, sortable: true },
        { key: 'name', title: '姓名', sortable: true, filterable: true, width: 120 },
        { key: 'email', title: '邮箱', filterable: true, width: 200 },
        { key: 'age', title: '年龄', width: 100, sortable: true },
        {
          key: 'status',
          title: '状态',
          width: 100,
          render: (value: unknown) =>
            React.createElement(
              'span',
              { 
                style: { 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: String(value) === 'active' ? '#e6f7ff' : '#fff1f0',
                  color: String(value) === 'active' ? '#1890ff' : '#f5222d',
                  border: `1px solid ${String(value) === 'active' ? '#91d5ff' : '#ffa39e'}`
                } 
              },
              String(value) === 'active' ? '活跃' : '非活跃'
            ),
        },
      ];

      const baseProps = { data, columns, rowKey: 'id', pagination: { pageSize: 5 }, style: { height: 400 } };

      if (variant === 'selection') {
        return {
          ...baseProps,
          selectable: true,
          onRowSelect: (rows: any[]) => console.log('Selected rows:', rows)
        };
      }
      
      if (variant === 'virtual') {
        return {
          ...baseProps,
          virtualScroll: true,
          data: Array.from({ length: 1000 }, (_, i) => ({
             id: i + 1,
             name: `User ${i + 1}`,
             email: `user${i + 1}@example.com`,
             age: 20 + (i % 40),
             status: i % 2 === 0 ? 'active' : 'inactive'
          })),
          pagination: undefined // Virtual scroll usually works without pagination or with infinite scroll
        };
      }

      return baseProps;
    }
    case 'FileUploader': {
      const baseProps = {
        action: '/api/upload',
        // 阻止真实上传，仅用于文档演示
        beforeUpload: () => {
           // 模拟上传延迟
           return new Promise(resolve => {
             setTimeout(() => resolve(false), 1000);
           });
        },
      };

      if (variant === 'multiple') {
        return { ...baseProps, multiple: true };
      }
      
      if (variant === 'accept') {
        return { ...baseProps, accept: 'image/*', multiple: true };
      }
      
      if (variant === 'limit') {
         return { ...baseProps, maxSize: 1024 * 1024, multiple: true }; // 1MB limit
      }

      return baseProps;
    }
    case 'Button': {
      if (variant === 'icon') {
        return { children: '添加', icon: PlusIcon };
      }
      if (variant === 'icon-only') {
        return { icon: PlusIcon };
      }
      if (variant === 'loading') {
        return { children: '加载中', loading: true };
      }
      if (variant === 'full') {
        return { children: '全宽按钮', fullWidth: true, variant: 'primary' };
      }
      return {
        children: '默认按钮',
      };
    }
    case 'ThemeToggle': {
       if (variant === 'custom') {
         return { children: React.createElement('span', { style: { marginLeft: 8 } }, '切换模式') };
       }
       return {};
    }
    default:
      return undefined;
  }
}

function mount() {
  if (!rootEl.value) return;
  const Comp = (Lib as Record<string, unknown>)[props.name] as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  if (!Comp) {
    rootEl.value.innerHTML = `<div style="color:var(--vp-c-danger)">未找到 React 组件: ${props.name}</div>`;
    return;
  }
  if (!root) root = createRoot(rootEl.value);

  const defaults = getDefaultProps(props.name, props.variant);
  const mergedProps = defaults
    ? { ...defaults, ...(props.props ?? {}) }
    : (props.props ?? {});

  // 用ThemeProvider包装组件以提供主题上下文
  const ThemeProvider = (Lib as any).ThemeProvider;
  const wrappedComponent = ThemeProvider
    ? React.createElement(
        ThemeProvider,
        { defaultMode: 'light' },
        React.createElement(Comp, mergedProps)
      )
    : React.createElement(Comp, mergedProps);

  root.render(wrappedComponent);
}

onMounted(() => {
  mount();
});

watch(
  () => props.props,
  () => mount(),
  { deep: true }
);

onBeforeUnmount(() => {
  if (root) {
    root.unmount();
    root = null;
  }
});
</script>
