import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Flexi-UI","description":"","frontmatter":{},"headers":[],"relativePath":"index.md","filePath":"index.md","lastUpdated":1757514271000}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="flexi-ui" tabindex="-1">Flexi-UI <a class="header-anchor" href="#flexi-ui" aria-label="Permalink to &quot;Flexi-UI&quot;">​</a></h1><p>现代化的 React 组件库 —— 灵活、高效、易用。</p><ul><li>查看指南：[<a href="/guide/">进入指南</a>]</li><li>快速浏览组件：[<a href="/Button.html">Button</a>] [<a href="/DataTable.html">DataTable</a>] [<a href="/VirtualList.html">VirtualList</a>] [<a href="/FileUploader.html">FileUploader</a>]</li></ul><p>提示：左侧侧边栏列出了全部组件文档，顶部导航可前往指南页。</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
