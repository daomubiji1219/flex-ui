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
}

const props = defineProps<ReactDemoProps>();
const rootEl: Ref<HTMLElement | null> = ref(null);
let root: Root | null = null;

// 为特定组件提供默认演示 props
function getDefaultProps(name: string): Record<string, unknown> | undefined {
  switch (name) {
    case 'VirtualList': {
      const data = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        description: `Description for item ${i}`,
      }));
      return {
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
    }
    case 'DataTable': {
      const data: Array<Record<string, unknown>> = [
        {
          id: 1,
          name: '张三',
          email: 'zhang@example.com',
          age: 25,
          status: 'active',
        },
        {
          id: 2,
          name: '李四',
          email: 'li@example.com',
          age: 30,
          status: 'inactive',
        },
        {
          id: 3,
          name: '王五',
          email: 'wang@example.com',
          age: 22,
          status: 'active',
        },
      ];
      const columns: Array<Record<string, unknown>> = [
        { key: 'id', title: 'ID', width: 60, sortable: true },
        { key: 'name', title: '姓名', sortable: true, filterable: true },
        { key: 'email', title: '邮箱', filterable: true },
        { key: 'age', title: '年龄', width: 100, sortable: true },
        {
          key: 'status',
          title: '状态',
          render: (value: unknown) =>
            React.createElement(
              'span',
              { className: `status ${String(value)}` },
              String(value) === 'active' ? '活跃' : '非活跃'
            ),
        },
      ];
      return { data, columns, rowKey: 'id', pagination: { pageSize: 5 } };
    }
    case 'FileUploader': {
      return {
        action: '/api/upload',
        accept: 'image/*',
        multiple: true,
        // 阻止真实上传，仅用于文档演示
        beforeUpload: () => false,
        theme: 'auto',
      };
    }
    case 'Button': {
      return {
        children: '默认按钮',
      };
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

  const defaults = getDefaultProps(props.name);
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
