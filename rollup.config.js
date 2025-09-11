// 导入Rollup插件：用于解析Node.js模块路径（处理第三方依赖）
import resolve from '@rollup/plugin-node-resolve';
// 导入Rollup插件：将CommonJS模块转换为ES6模块（兼容不同模块规范）
import commonjs from '@rollup/plugin-commonjs';
// 导入Rollup插件：处理TypeScript文件编译
import typescript from '@rollup/plugin-typescript';
// 导入Rollup插件：将peerDependencies（同伴依赖）排除在打包结果外（由使用方提供）
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// 导入Rollup插件：处理CSS文件（支持PostCSS、Sass等预处理器）
import postcss from 'rollup-plugin-postcss';
// 导入Node.js文件系统模块：用于读取文件
import { readFileSync } from 'fs';

// 读取package.json文件内容并解析为JSON对象（用于动态获取配置信息）
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

// 导出Rollup的默认配置对象
export default {
  // 打包入口文件（库的主入口）
  input: 'src/index.ts',
  // 输出配置（生成多种模块格式的打包结果）
  output: [
    {
      // 输出文件路径：从package.json的main字段获取（通常是CommonJS格式入口）
      file: packageJson.main,
      // 输出格式：CommonJS（适用于Node环境或Webpack等工具）
      format: 'cjs',
      // 生成源映射文件（方便调试，映射打包后的代码到原始源码）
      sourcemap: true,
      // 导出模式：命名导出（确保模块可以通过const { x } = require('')方式导入）
      exports: 'named',
    },
    {
      // 输出文件路径：从package.json的module字段获取（通常是ES模块格式入口）
      file: packageJson.module,
      // 输出格式：ES模块（适用于现代浏览器或支持ES模块的打包工具）
      format: 'esm',
      // 生成源映射文件
      sourcemap: true,
    },
    // 生成按需导入所需的原子化ESM产物（与源码目录结构一一对应）
    {
      // 输出目录：指定原子化ESM产物的存放路径为dist/esm
      dir: 'dist/esm',
      // 输出格式：采用ES模块格式（适用于现代浏览器和支持ES模块的构建工具）
      format: 'esm',
      // 生成源映射文件：便于调试时将打包后的代码映射回原始源代码
      sourcemap: true,
      // 保留模块结构：不将所有代码合并为单个文件，而是保持与源码相同的模块划分
      preserveModules: true,
      // 模块根目录：指定保留模块结构时的根目录为src，确保输出目录结构与src保持一致
      preserveModulesRoot: 'src',
      // 入口文件命名规则：生成的入口文件名称使用原始文件名，不添加哈希或其他后缀
      entryFileNames: '[name].js',
    },
  ],
  // 配置使用的Rollup插件
  plugins: [
    // 启用peerDepsExternal插件：自动将peerDependencies排除在打包结果外
    peerDepsExternal(),
    // 配置resolve插件：解析模块路径
    resolve({
      browser: true, // 针对浏览器环境优化解析
      preferBuiltins: false, // 不优先使用Node.js内置模块（适用于前端库）
    }),
    // 启用commonjs插件：转换CommonJS模块为ES6模块
    commonjs(),
    // 配置typescript插件：处理TypeScript编译
    typescript({
      tsconfig: './tsconfig.rollup.json', // 使用专用 tsconfig，禁用 allowImportingTsExtensions 以避免告警
      declaration: false, // 不生成类型声明文件（通常单独配置生成）
      exclude: [
        // 排除不需要打包的文件（测试、示例等非核心代码）
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/*.stories.tsx',
        'src/examples/**',
        'src/stories/**',
        'src/test/**',
        'src/tests/**',
        'src/main.tsx',
        'src/App.tsx',
      ],
    }),
    // 配置postcss插件：处理CSS
    postcss({
      extract: true, // 将CSS提取为单独的文件（而非内联到JS中）
      minimize: true, // 压缩CSS代码（减小文件体积）
    }),
  ],
  // 声明外部依赖（这些模块不会被打包，由使用该库的项目提供）
  external: [
    'react', // React核心库
    'react-dom', // React DOM库
    '@emotion/react', // Emotion CSS-in-JS库
    '@emotion/styled', // Emotion的styled组件
    'framer-motion', // 动画库
    'clsx', // 类名拼接工具
    'crypto-js', // 加密工具库
    'lodash-es', // 工具函数库（ES模块版本）
  ],
};
