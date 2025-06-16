---
layout: doc
title: 图片预览组件
editLink: false
---

# ImagePreview 图片预览组件

图片预览组件提供了强大的图片查看功能，支持缩放、全屏显示、图片切换等特性。

## ✨ 主要特性

- 🖼️ **多模式支持**：单图片或多图片预览
- 🔍 **缩放控制**：支持放大、缩小、重置视图
- 🖱️ **拖拽移动**：鼠标拖拽移动图片
- 📱 **响应式设计**：完美适配移动端和桌面端
- 🎚️ **缩略图导航**：多图时提供底部缩略图切换
- ⌨️ **键盘快捷键**：左右箭头切换，ESC 退出全屏
- 📥 **下载功能**：一键下载当前图片
- 🖥️ **全屏预览**：沉浸式全屏体验
- 🔄 **状态管理**：加载状态、错误处理
- 🎨 **视觉优化**：流畅动画和毛玻璃效果


## 📦 安装使用

### 单个引入
在你要使用的页面中引入组件
``` md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { ImagePreview } from '@leelaa/vitepress-plugin-extended'
    const ImagePreviewView = defineClientComponent(() => ImagePreview)
</script>
```

### 全局引入
在你的`.vitepress/theme/index.ts`中引入组件
``` js
import { defineAsyncComponent, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { ImagePreview } from '@leelaa/vitepress-plugin-extended'
export default {
    enhanceApp({ app }) {
         app.component('ImagePreview', ImagePreview)
    }
}
```

## 基础用法

### 单张图片预览

```vue
<template>
  <ImagePreview
    height="400px"
    :images="[
      {
        url: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '产品展示',
      },
    ]" />
</template>
```

<ImagePreview
    height="400px"
    :images="[
      {
        url: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '产品展示',
      },
    ]" />

### 多图片预览

```vue
<template>
  <ImagePreview
    height="500px"
    :images="[
      {
        url: 'https://images.pexels.com/photos/1580271/pexels-photo-1580271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '美丽的风景',
      },
      {
        url: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '城市建筑',
      },
      {
        url: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '自然森林',
      },
      {
        url: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '科技办公',
      },
    ]" />
</template>
```

<ImagePreview
    height="500px"
    :images="[
      {
        url: 'https://images.pexels.com/photos/1580271/pexels-photo-1580271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '美丽的风景',
      },
      {
        url: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '城市建筑',
      },
      {
        url: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '自然森林',
      },
      {
        url: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        title: '科技办公',
      },
    ]" />

## 🔧 Props 配置

| 属性名   | 类型          | 默认值    | 是否必需 | 说明     |
| -------- | ------------- | --------- | -------- | -------- |
| `images` | `ImageItem[]` | `[]`      | 是       | 图片数组 |
| `height` | `string`      | `"600px"` | 否       | 容器高度 |

### ImageItem 接口

```typescript
interface ImageItem {
  url: string; // 图片URL（必需）
  title?: string; // 图片标题（可选）
}
```

### 工具栏按钮

| 按钮 | 功能   | 说明                       |
| ---- | ------ | -------------------------- |
| 🔍+  | 放大   | 放大当前图片               |
| 🔍-  | 缩小   | 缩小当前图片               |
| 🔄   | 重置   | 重置图片到初始位置和大小   |
| ◀️   | 上一张 | 切换到上一张图片（多图时） |
| ▶️   | 下一张 | 切换到下一张图片（多图时） |
| 📥   | 下载   | 下载当前图片               |
| ⛶    | 全屏   | 进入/退出全屏模式          |

### 键盘快捷键（仅在全屏后支持）

| 按键  | 功能       |
| ----- | ---------- |
| `←`   | 上一张图片 |
| `→`   | 下一张图片 |
| `ESC` | 退出全屏   |
