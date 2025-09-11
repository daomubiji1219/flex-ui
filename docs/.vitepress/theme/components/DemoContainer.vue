<template>
  <div class="demo-container">
    <div v-if="title" class="demo-title">{{ title }}</div>
    <div class="demo-content">
      <slot />
    </div>
    <div v-if="showCode" class="demo-code">
      <details>
        <summary>查看代码</summary>
        <div class="language-vue">
          <pre><code>{{ code }}</code></pre>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  code?: string;
  showCode?: boolean;
}

withDefaults(defineProps<Props>(), {
  showCode: true,
});
</script>

<style scoped>
.demo-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  margin: 16px 0;
}
.demo-title {
  font-weight: 600;
  margin-bottom: 8px;
}
.demo-code {
  margin-top: 12px;
}
.demo-content {
  padding: 8px 0;
}
</style>
