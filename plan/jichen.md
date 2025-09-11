# ESLint + Prettier + Husky 集成方案

## 当前项目状态分析

### ✅ 已完成部分

1. **ESLint 已配置**
   - 已安装 ESLint 相关依赖：`eslint`, `@eslint/js`, `typescript-eslint`
   - 已有 `eslint.config.js` 配置文件
   - 已配置 React 相关插件：`eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
   - 已在 package.json 中添加 lint 脚本：`"lint": "eslint ."`

### ❌ 需要完成部分

1. **Prettier 未配置**
   - 缺少 Prettier 依赖
   - 缺少 Prettier 配置文件
   - 缺少 ESLint 与 Prettier 的集成

2. **Husky 未配置**
   - 缺少 Husky 依赖
   - 缺少 Git hooks 配置
   - 缺少 commit 规范化工具

## 完整实施方案

### 第一步：安装 Prettier 相关依赖

```bash
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

### 第二步：创建 Prettier 配置文件

创建 `.prettierrc.json`：

```json:.prettierrc.json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "auto"
}
```

创建 `.prettierignore`：

```plaintext:.prettierignore
dist
node_modules
.turbo
docs/.vitepress/cache
pnpm-lock.yaml
```

### 第三步：更新 ESLint 配置

修改 `eslint.config.js`：

```javascript:eslint.config.js
import storybook from "eslint-plugin-storybook";
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config([
  { ignores: ['dist', 'node_modules', '.turbo', 'docs/.vitepress/cache'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier
    ],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'prettier': prettierPlugin
    },
    rules: {
      'prettier/prettier': 'error'
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
      },
    },
  },
  ...storybook.configs["flat/recommended"]
]);
```

### 第四步：安装 Husky 和 commit 规范化工具

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### 第五步：初始化 Husky

```bash
pnpm exec husky init
```

### 第六步：配置 Git hooks

创建 `.husky/pre-commit`：

```bash:.husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec lint-staged
```

创建 `.husky/commit-msg`：

```bash:.husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

pnpm exec commitlint --edit "$1"
```

### 第七步：配置 lint-staged

在 `package.json` 中添加：

```json:package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,scss,md}": [
      "prettier --write"
    ]
  }
}
```

### 第八步：配置 commitlint

创建 `commitlint.config.js`：

```javascript:commitlint.config.js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式化
        'refactor', // 重构
        'test',     // 测试相关
        'chore',    // 构建过程或辅助工具的变动
        'perf',     // 性能优化
        'ci',       // CI配置
        'build'     // 构建系统
      ]
    ],
    'subject-max-length': [2, 'always', 50],
    'body-max-line-length': [2, 'always', 72]
  }
};
```

### 第九步：更新 package.json 脚本

在 `package.json` 的 scripts 中添加：

```json:package.json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint:fix": "eslint . --fix",
    "prepare": "husky"
  }
}
```

## 验证配置

### 测试 Prettier

```bash
pnpm run format:check
pnpm run format
```

### 测试 ESLint

```bash
pnpm run lint
pnpm run lint:fix
```

### 测试 Git hooks

```bash
# 测试 commit 规范
git add .
git commit -m "test: 测试commit规范"

# 测试 pre-commit hook
git add .
git commit -m "feat: 添加新功能"
```

## 提交信息规范

使用 Conventional Commits 规范：

- `feat: 添加新功能`
- `fix: 修复bug`
- `docs: 更新文档`
- `style: 代码格式化`
- `refactor: 重构代码`
- `test: 添加测试`
- `chore: 构建配置更新`

## 总结

通过以上配置，项目将具备：

1. **代码风格统一**：ESLint + Prettier 自动格式化
2. **提交前检查**：pre-commit hook 自动运行 lint 和格式化
3. **提交信息规范**：commitlint 强制规范化 commit 信息
4. **开发体验优化**：IDE 集成，实时提示和自动修复

所有配置都遵循现代前端开发最佳实践，确保团队协作的代码质量和一致性。
