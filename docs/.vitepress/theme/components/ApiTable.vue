<template>
  <table class="api-table">
    <thead>
      <tr>
        <th>属性</th>
        <th>类型</th>
        <th>默认值</th>
        <th>说明</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, idx) in rows" :key="idx">
        <td>{{ row.name }}</td>
        <td><code>{{ row.type }}</code></td>
        <td><code>{{ row.default ?? '-' }}</code></td>
        <td>{{ row.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
interface ApiRow { name: string; type: string; default?: string; description: string }

const props = defineProps<{ rows: ApiRow[] }>()
const rows = props.rows
</script>

<style scoped>
.api-table { width: 100%; border-collapse: collapse; }
.api-table th, .api-table td { border: 1px solid var(--vp-c-divider); padding: 8px; text-align: left; }
.api-table thead { background: var(--vp-c-bg-soft); }
</style>