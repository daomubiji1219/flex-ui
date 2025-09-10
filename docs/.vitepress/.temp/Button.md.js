import { resolveComponent, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from "vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Button 组件","description":"","frontmatter":{},"headers":[],"relativePath":"Button.md","filePath":"Button.md","lastUpdated":null}');
const _sfc_main = { name: "Button.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_DemoContainer = resolveComponent("DemoContainer");
  const _component_ReactDemo = resolveComponent("ReactDemo");
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="button-组件" tabindex="-1">Button 组件 <a class="header-anchor" href="#button-组件" aria-label="Permalink to &quot;Button 组件&quot;">​</a></h1><p>一个功能丰富的按钮组件，支持多种样式、尺寸、加载状态和图标。</p><h2 id="特性" tabindex="-1">特性 <a class="header-anchor" href="#特性" aria-label="Permalink to &quot;特性&quot;">​</a></h2><ul><li>🎨 多种样式变体（primary、secondary、outline、ghost）</li><li>📏 三种尺寸（sm、md、lg）</li><li>⏳ 内置加载状态和 Spinner</li><li>🖼️ 支持图标</li><li>🎯 完全的 TypeScript 支持</li><li>🎭 主题适配</li><li>♿ 无障碍支持</li></ul><h2 id="基础用法" tabindex="-1">基础用法 <a class="header-anchor" href="#基础用法" aria-label="Permalink to &quot;基础用法&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, { title: "基础按钮" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { children: "默认按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { variant: "secondary", children: "次要按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { variant: "outline", children: "边框按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { variant: "ghost", children: "幽灵按钮" }
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { children: "默认按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { variant: "secondary", children: "次要按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { variant: "outline", children: "边框按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { variant: "ghost", children: "幽灵按钮" }
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h2 id="不同尺寸" tabindex="-1">不同尺寸 <a class="header-anchor" href="#不同尺寸" aria-label="Permalink to &quot;不同尺寸&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, { title: "尺寸" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { size: "sm", children: "小按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { size: "md", children: "中等按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { size: "lg", children: "大按钮" }
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { size: "sm", children: "小按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { size: "md", children: "中等按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { size: "lg", children: "大按钮" }
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h2 id="加载状态" tabindex="-1">加载状态 <a class="header-anchor" href="#加载状态" aria-label="Permalink to &quot;加载状态&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, { title: "加载状态" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { loading: true, children: "加载中..." }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { loading: true, size: "sm", children: "小按钮加载" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { loading: true, variant: "outline", children: "边框按钮加载" }
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { loading: true, children: "加载中..." }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { loading: true, size: "sm", children: "小按钮加载" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { loading: true, variant: "outline", children: "边框按钮加载" }
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h2 id="带图标" tabindex="-1">带图标 <a class="header-anchor" href="#带图标" aria-label="Permalink to &quot;带图标&quot;">​</a></h2><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">import</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> { Button } </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">from</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;@flexi-ui/components&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">import</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> { PlusIcon, DownloadIcon } </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">from</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &#39;@heroicons/react/24/outline&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#22863A", "--shiki-dark": "#85E89D" })}">div</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  &lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> icon</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">PlusIcon</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> /&gt;}&gt;添加&lt;/</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  &lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> icon</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">DownloadIcon</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> /&gt;} </span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">variant</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;outline&quot;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;下载&lt;/</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  &lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> icon</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">PlusIcon</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> /&gt;} /&gt; {</span><span style="${ssrRenderStyle({ "--shiki-light": "#6A737D", "--shiki-dark": "#6A737D" })}">/* 仅图标 */</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&lt;/</span><span style="${ssrRenderStyle({ "--shiki-light": "#22863A", "--shiki-dark": "#85E89D" })}">div</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h2 id="禁用状态" tabindex="-1">禁用状态 <a class="header-anchor" href="#禁用状态" aria-label="Permalink to &quot;禁用状态&quot;">​</a></h2>`);
  _push(ssrRenderComponent(_component_DemoContainer, { title: "禁用状态" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { disabled: true, children: "禁用按钮" }
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ReactDemo, {
          name: "Button",
          props: { disabled: true, variant: "outline", children: "禁用边框按钮" }
        }, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { disabled: true, children: "禁用按钮" }
          }),
          createVNode(_component_ReactDemo, {
            name: "Button",
            props: { disabled: true, variant: "outline", children: "禁用边框按钮" }
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h2 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h2><h3 id="buttonprops" tabindex="-1">ButtonProps <a class="header-anchor" href="#buttonprops" aria-label="Permalink to &quot;ButtonProps&quot;">​</a></h3><table tabindex="0"><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>描述</th></tr></thead><tbody><tr><td>variant</td><td><code>&#39;primary&#39; | &#39;secondary&#39; | &#39;outline&#39; | &#39;ghost&#39;</code></td><td><code>&#39;primary&#39;</code></td><td>按钮样式变体</td></tr><tr><td>size</td><td><code>&#39;sm&#39; | &#39;md&#39; | &#39;lg&#39;</code></td><td><code>&#39;md&#39;</code></td><td>按钮尺寸</td></tr><tr><td>loading</td><td><code>boolean</code></td><td><code>false</code></td><td>是否显示加载状态</td></tr><tr><td>icon</td><td><code>React.ReactNode</code></td><td>-</td><td>按钮图标</td></tr><tr><td>fullWidth</td><td><code>boolean</code></td><td><code>false</code></td><td>是否占满容器宽度</td></tr><tr><td>disabled</td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用</td></tr><tr><td>onClick</td><td><code>(event: React.MouseEvent) =&gt; void</code></td><td>-</td><td>点击事件处理函数</td></tr><tr><td>children</td><td><code>React.ReactNode</code></td><td>-</td><td>按钮内容</td></tr><tr><td>className</td><td><code>string</code></td><td>-</td><td>自定义 CSS 类名</td></tr><tr><td>style</td><td><code>React.CSSProperties</code></td><td>-</td><td>自定义样式</td></tr></tbody></table><h3 id="样式变体说明" tabindex="-1">样式变体说明 <a class="header-anchor" href="#样式变体说明" aria-label="Permalink to &quot;样式变体说明&quot;">​</a></h3><ul><li><strong>primary</strong>: 主要按钮，使用主题色背景</li><li><strong>secondary</strong>: 次要按钮，使用灰色背景</li><li><strong>outline</strong>: 边框按钮，透明背景带边框</li><li><strong>ghost</strong>: 幽灵按钮，完全透明背景</li></ul><h3 id="尺寸说明" tabindex="-1">尺寸说明 <a class="header-anchor" href="#尺寸说明" aria-label="Permalink to &quot;尺寸说明&quot;">​</a></h3><ul><li><strong>sm</strong>: 小尺寸 (padding: 6px 12px, fontSize: 14px)</li><li><strong>md</strong>: 中等尺寸 (padding: 8px 16px, fontSize: 16px)</li><li><strong>lg</strong>: 大尺寸 (padding: 12px 24px, fontSize: 18px)</li></ul><h2 id="高级用法" tabindex="-1">高级用法 <a class="header-anchor" href="#高级用法" aria-label="Permalink to &quot;高级用法&quot;">​</a></h2><h3 id="自定义样式" tabindex="-1">自定义样式 <a class="header-anchor" href="#自定义样式" aria-label="Permalink to &quot;自定义样式&quot;">​</a></h3><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">  style</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{{ </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    borderRadius: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;20px&#39;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">,</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    boxShadow: </span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&#39;0 4px 12px rgba(0,0,0,0.1)&#39;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  }}</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  自定义样式按钮</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&lt;/</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><h3 id="异步操作" tabindex="-1">异步操作 <a class="header-anchor" href="#异步操作" aria-label="Permalink to &quot;异步操作&quot;">​</a></h3><div class="language-tsx vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">tsx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">function</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> AsyncButton</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">() {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  const</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">loading</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">, </span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">setLoading</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> useState</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">false</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  const</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> handleClick</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> =</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> async</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> () </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=&gt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">    setLoading</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">true</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">    try</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">      await</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> someAsyncOperation</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">()</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    } </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">finally</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">      setLoading</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">(</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">false</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  return</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> (</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    &lt;</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}"> loading</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{loading} </span><span style="${ssrRenderStyle({ "--shiki-light": "#6F42C1", "--shiki-dark": "#B392F0" })}">onClick</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">=</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">{handleClick}&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">      提交数据</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    &lt;/</span><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-dark": "#79B8FF" })}">Button</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">&gt;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  )</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">}</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h2 id="主题适配" tabindex="-1">主题适配 <a class="header-anchor" href="#主题适配" aria-label="Permalink to &quot;主题适配&quot;">​</a></h2><p>按钮组件会自动适配当前主题，使用 <code>useTheme</code> hook 获取主题色彩。主要颜色会根据主题动态调整。</p><h2 id="无障碍支持" tabindex="-1">无障碍支持 <a class="header-anchor" href="#无障碍支持" aria-label="Permalink to &quot;无障碍支持&quot;">​</a></h2><ul><li>支持键盘导航</li><li>正确的 ARIA 属性</li><li>加载状态时自动禁用交互</li><li>语义化的 HTML 结构</li></ul><h2 id="注意事项" tabindex="-1">注意事项 <a class="header-anchor" href="#注意事项" aria-label="Permalink to &quot;注意事项&quot;">​</a></h2><ol><li>加载状态时按钮会自动禁用，无需手动设置 <code>disabled</code></li><li>图标和文本之间会自动添加适当的间距</li><li>组件使用 <code>forwardRef</code> 包装，支持 ref 传递</li><li>所有原生 button 属性都会透传到底层元素</li></ol><h2 id="性能优化" tabindex="-1">性能优化 <a class="header-anchor" href="#性能优化" aria-label="Permalink to &quot;性能优化&quot;">​</a></h2><ul><li>使用 <code>useMemo</code> 缓存样式计算</li><li>避免不必要的重新渲染</li><li>内置的 Spinner 组件轻量高效</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("Button.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  Button as default
};
