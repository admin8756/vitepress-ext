# 部署文档

## 环境准备
- Node.js >= 16
- pnpm >= 8

## 本地开发
```bash
pnpm install
pnpm dev
```

## 构建与发布
```bash
# 构建
pnpm build

# 发布到 npm
pnpm publish
```

## 使用方法

在你的 VitePress 项目中:

```bash
pnpm add vitepress-leelaa-ext
```

配置 `.vitepress/config.ts`:

```ts
import { defineConfig } from 'vitepress'
import {
    BBCodePlugin,
    MarkMapPlugin,
    MermaidPlugin
} from 'vitepress-leelaa-ext'

export default defineConfig({
  markdown: {
    breaks: true,
    lineNumbers: true,
    config: (md) => {
      BBCodePlugin(md);
      MarkMapPlugin(md);
      MermaidPlugin(md);
    },
  }
});
```

配置`.vitepress/theme/index.ts`:

```ts
import DefaultTheme from 'vitepress/theme'
import {
  Mermaid,
  MarkMap,
  ImagePreview,
  GLBLoad,
  BBCode,
  ToSpeech
} from '@leelaa/vitepress-plugin-extended'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册组件
    app.component('BBCode', BBCode)
    app.component('GLBLoad', GLBLoad)
    app.component('MarkMap', MarkMap)
    app.component('Mermaid', Mermaid)
    app.component('ImagePreview', ImagePreview)
    app.component('ToSpeech', ToSpeech)
  }
}
