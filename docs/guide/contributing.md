# 贡献指南

感谢你有兴趣为 Flexi-UI 做出贡献！

## 开发流程

1. Fork 本仓库
2. 克隆到本地: `git clone ...`
3. 安装依赖: `pnpm install`
4. 创建分支: `git checkout -b feat/my-feature`
5. 开发并提交代码
6. 提交 Pull Request

## 提交规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变更

示例：`feat(Button): add ghost variant`

## 代码风格

提交前请确保通过 lint 检查和所有测试：

```bash
pnpm lint
pnpm test
```
