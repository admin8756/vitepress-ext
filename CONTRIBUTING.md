# 贡献指南

## 开发步骤

1. Fork 仓库 & 克隆项目
```bash
git clone https://github.com/admin8756/vitepress-leelaa-ext
cd vitepress-leelaa-ext
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 提交代码
```bash
git add .
git commit -m "feat: xxx"
git push
```

## 代码规范
- 使用 TypeScript
- 遵循 ESLint 规则
- commit 信息需符合约定式提交规范

## 注意事项
- 本项目的文档在`packages`目录下的组件中，请勿修改`examples`中的文件
- 如果有疑问，可以看`plugin\updateDoc.js`