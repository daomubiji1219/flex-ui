import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"开发指南（修正版）","description":"","frontmatter":{},"headers":[],"relativePath":"development-guide.md","filePath":"development-guide.md","lastUpdated":null}');
const _sfc_main = { name: "development-guide.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_ReactDemo = resolveComponent("ReactDemo");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="开发指南-修正版" tabindex="-1">开发指南（修正版） <a class="header-anchor" href="#开发指南-修正版" aria-label="Permalink to &quot;开发指南（修正版）&quot;">​</a></h1><p>本文档说明如何以 TDD 模式开发 Flexi-UI 组件，并基于 VitePress 搭建文档与 Vercel 部署。</p><h2 id="_1-测试驱动开发-tdd" tabindex="-1">1. 测试驱动开发（TDD） <a class="header-anchor" href="#_1-测试驱动开发-tdd" aria-label="Permalink to &quot;1. 测试驱动开发（TDD）&quot;">​</a></h2><ul><li><p>流程要点：先写失败测试 -&gt; 实现最小功能 -&gt; 重构与补充测试</p></li><li><p>工具链：Vitest + React Testing Library + Jest-DOM</p></li><li><p>vitest.config.ts 关键配置：</p><ul><li>globals: true</li><li>environment: &#39;jsdom&#39;</li><li>setupFiles: [&#39;./src/test/setup.ts&#39;]（如文件不存在需要创建）</li><li>include: [&#39;src/**/*.{test,spec}.{ts,tsx}&#39;]</li><li>resolve.alias: &#39;@&#39; -&gt; &#39;./src&#39;</li></ul></li><li><p>测试初始化文件建议（packages/flexi-ui/src/test/setup.ts）：</p><ul><li>引入 @testing-library/jest-dom</li><li>afterEach(cleanup)</li><li>polyfill: matchMedia、ResizeObserver、IntersectionObserver（按需）</li></ul></li></ul><h2 id="_2-文档站点-vitepress" tabindex="-1">2. 文档站点（VitePress） <a class="header-anchor" href="#_2-文档站点-vitepress" aria-label="Permalink to &quot;2. 文档站点（VitePress）&quot;">​</a></h2><ul><li><p>依赖安装：</p><ul><li>pnpm add -D vitepress vue @types/node @vitejs/plugin-react</li></ul></li><li><p>主配置（docs/.vitepress/config.ts）要点：</p><ul><li>base: &#39;/&#39;</li><li>vite.plugins: [react()]</li><li path.resolve(__dirname,="" css-module="/../src&#39;)">vite.resolve.alias:</li></ul></li><li><p>主题（docs/.vitepress/theme/index.ts）要点：</p><ul><li>不要直接注册 React 组件到 app.component</li><li>通过 Vue 组件 ReactDemo.vue 包装，在挂载时用 ReactDOM.createRoot 渲染 React 组件</li><li>在 enhanceApp 中注册 DemoContainer、ApiTable、ReactDemo</li></ul></li><li><p>示例文档中使用：</p><ul><li>`);
  _push(ssrRenderComponent(_component_ReactDemo, {
    name: "Button",
    props: { children: "默认按钮" }
  }, null, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_ReactDemo, {
    name: "Button",
    props: { variant: "primary", children: "主要按钮" }
  }, null, _parent));
  _push(`</li></ul></li><li><p>package.json 脚本：</p><ul><li>docs:dev =&gt; vitepress dev docs --port 3000</li><li>docs:build =&gt; vitepress build docs</li><li>docs:preview =&gt; vitepress preview docs --port 4173</li></ul></li></ul><blockquote><p>PowerShell 提示：需要顺序执行命令时，请分步运行，避免使用 &amp;&amp;。</p></blockquote><h2 id="_3-部署-vercel" tabindex="-1">3. 部署（Vercel） <a class="header-anchor" href="#_3-部署-vercel" aria-label="Permalink to &quot;3. 部署（Vercel）&quot;">​</a></h2><ul><li><p>vercel.json 建议：</p><ul><li>buildCommand: &quot;pnpm docs:build&quot;</li><li>outputDirectory: &quot;docs/.vitepress/dist&quot;</li><li>installCommand: &quot;pnpm install&quot;</li><li>devCommand: &quot;pnpm docs:dev&quot;</li><li NODE_VERSION:="" 18="">env:</li></ul></li><li><p>base 统一为 &#39;/&#39;：适配根域名部署</p></li></ul><h2 id="_4-组件开发最佳实践" tabindex="-1">4. 组件开发最佳实践 <a class="header-anchor" href="#_4-组件开发最佳实践" aria-label="Permalink to &quot;4. 组件开发最佳实践&quot;">​</a></h2><ul><li>类型：在 ts/tsx 中尽量避免 any，使用明确的类型定义；导入 React 类型时使用 <code>import type { ReactNode } from &#39;react&#39;</code></li><li>无障碍：使用语义化标签与 aria-* 属性；键盘可访问性</li><li>样式：遵循 BEM 或原子化方案；主题变量统一管理</li><li>测试：关注可访问性（getByRole）、关键交互、边界条件与回归</li></ul><h2 id="_5-依赖版本建议-与-vite-7-兼容" tabindex="-1">5. 依赖版本建议（与 Vite 7 兼容） <a class="header-anchor" href="#_5-依赖版本建议-与-vite-7-兼容" aria-label="Permalink to &quot;5. 依赖版本建议（与 Vite 7 兼容）&quot;">​</a></h2><ul><li>vite: ^5.4.x</li><li>vitepress: ^1.4.x</li><li>@vitejs/plugin-react: ^4.3.x</li><li>react: ^18.2.x</li><li>react-dom: ^18.2.x</li><li>typescript: ^5.4.x</li><li>vitest: ^1.6.x, jsdom: ^24.x</li><li>@testing-library/react: ^14.1.x, @testing-library/jest-dom: ^6.4.x</li></ul><h2 id="_6-ci-cd-概览" tabindex="-1">6. CI/CD 概览 <a class="header-anchor" href="#_6-ci-cd-概览" aria-label="Permalink to &quot;6. CI/CD 概览&quot;">​</a></h2><ul><li>CI：安装 -&gt; Lint -&gt; TypeCheck -&gt; Test -&gt; Build</li><li>CD：main 分支合并后触发 Vercel 部署</li><li>建议在 CI 中加入覆盖率门槛（如 lines &gt;= 80%）</li></ul><h2 id="_7-常见问题" tabindex="-1">7. 常见问题 <a class="header-anchor" href="#_7-常见问题" aria-label="Permalink to &quot;7. 常见问题&quot;">​</a></h2><ul><li>React 示例不显示：确认安装 @vitejs/plugin-react，并通过 ReactDemo 包装器渲染</li><li>文档资源路径异常：确认 base 为 &#39;/&#39;，并检查公开资源路径</li><li>PowerShell 串联命令失败：分步顺序执行</li><li>测试初始化缺失：创建 packages/flexi-ui/src/test/setup.ts 并在 vitest.config.ts 指定</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("development-guide.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const developmentGuide = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  developmentGuide as default
};
