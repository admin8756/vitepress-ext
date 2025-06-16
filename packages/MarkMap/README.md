---
layout: doc
title: 图片预览组件
editLink: false
---

<script setup>
import { ref } from 'vue'

const markMapContent = ref(`# **示例**
- BBCode 示例 [/bbcode]
- MarkMap 示例 [/markmap]
- Mermaid 示例 [/mermaid]
- GLBLoad 示例 [/glb-viewer]
- ImagePreview 示例 [/image-preview]`
)
</script>

# MarkMap 文档

一个支持 **Markdown 源码查看 + 思维导图预览切换** 的可视化组件，具备缩放、重置视图、下载、全屏等实用功能，适合用于知识整理、项目规划等场景。

## ✨ 特性

- 🖥️ **双视图模式**
  - 支持「预览」与「代码」两种模式自由切换。
- 📄 **Markdown 转思维导图**
  - 内置解析器，能将 Markdown 内容解析为树形结构并渲染成思维导图。
- 🔍 **交互体验**
  - 支持缩放、重置视图和拖拽操作。
  - 节点具有悬停效果，增强交互性。
- 💾 **导出功能**
  - 一键下载思维导图的 SVG 文件或 Markdown 源码文件。
- 🧩 **嵌入式全屏**
  - 纯 CSS 实现，不依赖浏览器全屏 API。

## 📦 引入&使用

### 单个引入

在你要使用的页面中引入组件

```md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { MarkMap } from '@leelaa/vitepress-plugin-extended'
    const MarkMapView = defineClientComponent(() => MarkMap)
</script>
```

### 全局引入

在你的`.vitepress/theme/index.ts`中引入组件

```js
import { defineAsyncComponent, h } from "vue";
import DefaultTheme from "vitepress/theme";
import { MarkMap } from "@leelaa/vitepress-plugin-extended";
export default {
  enhanceApp({ app }) {
    app.component("MarkMap", MarkMap);
  },
};
```

### 扩展 md 插件

在你的`.vitepress\config.ts`中引入插件

```js
import { defineConfig } from "vitepress";
import { MarkMapPlugin } from "@leelaa/vitepress-plugin-extended";
export default defineConfig({
  markdown: {
    breaks: true,
    math: true,
    lineNumbers: true,
    lazyLoading: true,
    config: (md) => {
      MarkMapPlugin(md);
    },
  },
});
```

## 📁 示例
<MarkMap :content="markMapContent"/>

### 在vue中使用
```vue
<MarkMap content="# 思维导图标题
 - 子节点 1
 - 子节点 2"/>
```
### 在md中使用

````md
```markmap
# 思维导图标题
 - 子节点 1
 - 子节点 2
```
````

## 🎈 组件参数说明

| 参数名    | 类型                  | 默认值    | 描述                       |
| --------- | --------------------- | --------- | -------------------------- |
| `content` | `string`              | `""`      | 输入的 MarkMap 内容        |
| `theme`   | `"light"` \| `"dark"` | `"light"` | 主题风格（未来可扩展样式） |
| `height`  | `string`              | `"600px"` | 组件高度                   |

## 📁 预览与下载

### 预览模式工具栏

| 按钮            | 功能                                            |
| --------------- | ----------------------------------------------- |
| 🔍 放大         | 点击后通过 D3.js 的 `zoom` 行为放大思维导图视图 |
| 🔎 缩小         | 点击后通过 D3.js 的 `zoom` 行为缩小思维导图视图 |
| 🔄 重置视图     | 点击后将视图重置为初始状态，借助 D3.js 重置变换 |
| 💾 下载 SVG     | 点击后下载思维导图的 SVG 文件                   |
| 🖥️ 切换全屏模式 | 点击后切换全屏显示思维导图                      |

### 代码模式工具栏

| 按钮             | 功能                             |
| ---------------- | -------------------------------- |
| 📋 复制代码      | 点击后复制 Markdown 源码到剪贴板 |
| 💾 下载 Markdown | 点击后下载 Markdown 源码文件     |
| 🖥️ 切换全屏模式  | 点击后切换全屏显示 Markdown 源码 |
