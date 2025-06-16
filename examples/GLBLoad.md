---
layout: doc
title: GLB 模型查看器
editLink: false
---

<script setup>
import { ref } from 'vue'

const models = [
  {
    url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
    title: '损坏的头盔'
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf',
    title: '橡皮鸭'
  },
  {
    url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf',
    title: '牛油果'
  }
]

const currentModel = ref(models[0])
const enableZoom = ref(false)
</script>

# GLBLoad 3D 模型查看器

一个功能强大的 Vue 组件，用于在 Web 端展示和交互 3D 模型。支持 GLB/GLTF 格式，提供完整的交互控制和专业的渲染效果。

## ✨ 主要特性

- **📦 格式支持**: 完美支持 GLB/GLTF 格式的 3D 模型
- **🖱️ 交互控制**: 鼠标拖拽旋转、缩放、平移操作
- **🔍 视角控制**: 放大、缩小、重置视角
- **📱 响应式设计**: 完美适配移动端和桌面端
- **🎨 渲染模式**: 支持正常模式和线框模式
- **💡 光照系统**: 多种光照模式和光线方向设置

- **🔄 自动旋转**: 可开启/关闭自动旋转展示
- **🖥️ 全屏预览**: 沉浸式全屏体验
- **🎚️ 滚轮控制**: 可配置是否启用滚轮缩放
- **📐 智能适配**: 自动适配模型大小和居中显示
- **🔧 状态管理**: 完整的加载、错误、空状态处理
- **⚡ 性能优化**: Three.js 动态加载，内存管理优化

## 📦 安装使用

### 单个引入

在你要使用的页面中引入组件

```md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { GLBLoad } from '@leelaa/vitepress-plugin-extended'
    const GLBLoad = defineClientComponent(() => GLBLoad)
</script>
```

### 全局引入

在你的`.vitepress/theme/index.ts`中引入组件

```js
import { defineAsyncComponent, h } from "vue";
import DefaultTheme from "vitepress/theme";
import { GLBLoad } from "@leelaa/vitepress-plugin-extended";
export default {
  enhanceApp({ app }) {
    app.component("GLBLoad", GLBLoad);
  },
};
```

### 基本使用

```vue
<template>
  <!-- 基础用法 -->
  <GLBLoad
    height="500px"
    :model="{
      url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      title: '损坏的头盔',
    }" />
</template>
```

<GLBLoad
    height="500px"
    :model=" {url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',title: '损坏的头盔'}"
  />

## 🎮 功能控制

### 工具栏按钮

| 图标 | 功能     | 说明                   |
| ---- | -------- | ---------------------- |
| 🔍+  | 放大     | 放大当前模型           |
| 🔍-  | 缩小     | 缩小当前模型           |
| 🔄   | 重置视角 | 重置相机位置和模型缩放 |
| ⏯️   | 自动旋转 | 开启/关闭自动旋转展示  |
| 📐   | 线框模式 | 切换线框渲染模式       |
| ⛶    | 全屏     | 进入/退出全屏模式      |

### 光照控制

#### 光照模式

- **标准光照**: 平衡的环境光和方向光
- **明亮光照**: 增强的光照强度，适合展示细节
- **柔和光照**: 柔和的半球光照，营造温和氛围
- **戏剧光照**: 聚光灯效果，创造戏剧性对比

#### 光线方向

- **顶部光照**: 从上方照亮模型
- **前方光照**: 从前方照亮模型
- **左侧光照**: 从左侧照亮模型
- **右侧光照**: 从右侧照亮模型
- **后方光照**: 从后方照亮模型

### 鼠标操作

| 操作     | 功能                              |
| -------- | --------------------------------- |
| 左键拖拽 | 旋转模型                          |
| 右键拖拽 | 平移视角                          |
| 滚轮     | 缩放（需要 enableMouseZoom=true） |

## 📋 使用示例

### 模型切换器

<div class="model-selector">
    <button
    v-for="model in models"
    :key="model.url"
    @click="currentModel = model"
    :class="{ active: currentModel === model }"
    >
    {{ model.title }}
    </button>
</div>

<GLBLoad
    height="600px"
    :model="currentModel"
    :enableMouseZoom="enableZoom"
/>
<label>
<input type="checkbox" v-model="enableZoom">
启用滚轮缩放
</label>

### 基础 3D 模型展示

```vue
<GLBLoad
  height="600px"
  model="{
      url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf',
      title: '损坏的头盔'
    }"></GLBLoad>
```

<style scoped>
.model-selector {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.model-selector button {
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.model-selector button:hover {
  border-color: #3b82f6;
}

.model-selector button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>

### 示例 4：动态加载模型

```vue
<template>
  <div>
    <input
      v-model="modelUrl"
      placeholder="输入模型URL"
      @keyup.enter="loadModel" />
    <button @click="loadModel">加载模型</button>

    <GLBLoad v-if="currentModel" height="500px" :model="currentModel" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const modelUrl = ref("");
const currentModel = ref(null);

const loadModel = () => {
  if (modelUrl.value.trim()) {
    currentModel.value = {
      url: modelUrl.value.trim(),
      title: "用户加载的模型",
    };
  }
};
</script>
```
