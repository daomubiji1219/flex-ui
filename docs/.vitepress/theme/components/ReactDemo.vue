<template>
  <div ref="rootEl"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, type Ref } from 'vue'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'

// 通过组件名动态映射到实际的 React 组件
// 根据你的导出结构，从源码入口导入组件
import * as Lib from '@/index'

interface ReactDemoProps {
  name: string
  // 传递给 React 组件的 props
  props?: Record<string, unknown>
}

const props = defineProps<ReactDemoProps>()
const rootEl: Ref<HTMLElement | null> = ref(null)
let root: Root | null = null

function mount() {
  if (!rootEl.value) return
  const Comp = (Lib as Record<string, unknown>)[props.name] as React.ComponentType<Record<string, unknown>> | undefined
  if (!Comp) {
    rootEl.value.innerHTML = `<div style="color:var(--vp-c-danger)">未找到 React 组件: ${props.name}</div>`
    return
  }
  if (!root) root = createRoot(rootEl.value)
  root.render(React.createElement(Comp, props.props ?? {}))
}

onMounted(() => {
  mount()
})

watch(() => props.props, () => mount(), { deep: true })

onBeforeUnmount(() => {
  if (root) {
    root.unmount()
    root = null
  }
})
</script>