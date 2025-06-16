---
layout: doc
title: ToSpeech 组件演示
editLink: false
---

<script setup>
import { ref } from 'vue'

const demoText = ref(`这是一个基于Vue3和Web Speech API开发的文本转语音组件。它提供了灵活的插槽设计，支持完全自定义播放界面，同时暴露所有播放状态和控制方法。组件具有以下特性：支持播放、暂停等完整控制功能；实时显示播放进度和时长；支持倍速播放调节；提供默认播放按钮和自定义插槽；完整的TypeScript类型支持。`)

const shortText = ref(`人工智能正在改变我们的生活方式。`)

// 格式化时间显示
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

# ToSpeech 组件演示

基于 Vue3 和 Web Speech API 的文本转语音组件，提供灵活的插槽设计和完整的播放控制功能。
## ✨ 特性

- **📖 博客阅读**: 为文章提供语音朗读功能
- **🎓 在线教育**: 辅助学习者理解课程内容
- **♿ 无障碍应用**: 为视障用户提供内容访问
- **🚗 多任务场景**: 驾驶、运动时收听内容
- **🌍 语言学习**: 帮助学习正确发音和语调
- **📱 移动应用**: 在手机上提供免提阅读体验

## 💡 最佳实践

1. **文本长度控制**: 对于长文本，建议分段处理以提升体验
2. **错误处理**: 检测浏览器支持情况并提供降级方案
3. **用户体验**: 提供清晰的播放状态反馈
4. **性能优化**: 避免频繁创建新的语音实例
5. **响应式设计**: 确保在不同设备上都有良好体验

## 📦 安装使用

### 单个引入

在你要使用的页面中引入组件

```md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { ToSpeech } from '@leelaa/vitepress-plugin-extended'
    const ToSpeechView = defineClientComponent(() => ToSpeech)
</script>
```

### 全局引入

在你的`.vitepress/theme/index.ts`中引入组件

```js
import { defineAsyncComponent, h } from "vue";
import DefaultTheme from "vitepress/theme";
import { ToSpeech } from "@leelaa/vitepress-plugin-extended";
export default {
  enhanceApp({ app }) {
    app.component("ToSpeech", ToSpeech);
  },
};
```

## 🚀 快速开始

### 安装使用

```vue
<script setup>
import ToSpeech from "@/components/ToSpeech.vue";

const content = "这是要转换为语音的文本内容";
</script>

<template>
  <!-- 默认按钮 -->
  <ToSpeech :text="content" />
</template>
```

## ✨ 功能演示

### 默认播放按钮

最简单的使用方式，提供一个方形播放按钮：
<ClientOnly>

<div class="demo-section">
  <ToSpeech :text="shortText" />
  <p class="demo-text">{{ shortText }}</p>
</div>
</ClientOnly>

```vue
<ToSpeech :text="content" />
```

### 自定义播放器

通过插槽完全自定义播放界面：
<ClientOnly>

<div class="demo-section">
  <ToSpeech :text="demoText">
    <template #default="{ isPlaying, currentTime, totalTime, progress, toggle, setRate, rate }">
      <div class="custom-player">
        <div class="player-header">
          <button @click="toggle" class="play-button">
            <span v-if="!isPlaying">▶️ 播放</span>
            <span v-else>⏸️ 暂停</span>
          </button>
          <div class="time-display">
            {{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}
          </div>
        </div>
        <div class="progress-section">
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-info">
            <small>进度显示（Web Speech API 不支持跳转）</small>
          </div>
        </div>
        <div class="controls-section">
          <span class="control-label">播放速度：</span>
          <button 
            v-for="speed in [0.5, 0.75, 1, 1.25, 1.5, 2]" 
            :key="speed"
            @click="setRate(speed)"
            :class="['speed-button', { active: rate === speed }]"
          >
            {{ speed }}×
          </button>
        </div>
      </div>
    </template>
  </ToSpeech>
</div>
</ClientOnly>

```vue
<ToSpeech :text="content">
  <template #default="{ isPlaying, currentTime, totalTime, progress, toggle, setRate, rate }">
    <div class="custom-player">
      <!-- 播放按钮 -->
      <button @click="toggle">
        {{ isPlaying ? '⏸️ 暂停' : '▶️ 播放' }}
      </button>
      <!-- 时间显示 -->
      <div>{{ formatTime(currentTime) }} / {{ formatTime(totalTime) }}</div>
      <!-- 进度条（仅显示） -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
      <!-- 倍速控制 -->
      <button 
        v-for="speed in [0.5, 1, 1.5, 2]" 
        :key="speed"
        @click="setRate(speed)"
        :class="{ active: rate === speed }"
      >
        {{ speed }}×
      </button>
    </div>
  </template>
</ToSpeech>
```

### 极简播放按钮

在标题旁添加小型播放按钮：
<ClientOnly>

<div class="demo-section">
  <div class="title-demo">
    <h3>文章标题</h3>
    <ToSpeech :text="shortText">
      <template #default="{ isPlaying, toggle }">
        <button @click="toggle" class="mini-button">
          <span v-if="!isPlaying">🔊</span>
          <span v-else>⏸️</span>
        </button>
      </template>
    </ToSpeech>
  </div>
</div>
</ClientOnly>

```vue
<div class="article-title">
  <h3>文章标题</h3>
  <ToSpeech :text="content">
    <template #default="{ isPlaying, toggle }">
      <button @click="toggle" class="mini-button">
        {{ isPlaying ? '⏸️' : '🔊' }}
      </button>
    </template>
  </ToSpeech>
</div>
```

## 📖 API 文档

### Props

| 参数       | 类型      | 默认值  | 说明                     |
| ---------- | --------- | ------- | ------------------------ |
| `text`     | `string`  | `""`    | 要合成的文本内容（必需） |
| `rate`     | `number`  | `1.0`   | 播放速度 (0.5-3.0)       |
| `volume`   | `number`  | `1.0`   | 音量大小 (0.0-1.0)       |
| `autoplay` | `boolean` | `false` | 是否自动播放             |

### 插槽参数

| 参数          | 类型                     | 说明                   |
| ------------- | ------------------------ | ---------------------- |
| `isPlaying`   | `boolean`                | 是否正在播放           |
| `currentTime` | `number`                 | 当前播放时间（秒）     |
| `totalTime`   | `number`                 | 总时长（秒，估算值）   |
| `progress`    | `number`                 | 播放进度百分比 (0-100) |
| `rate`        | `number`                 | 当前播放速度           |
| `loading`     | `boolean`                | 是否正在加载           |
| `play`        | `() => Promise<boolean>` | 播放方法               |
| `pause`       | `() => void`             | 暂停方法               |
| `toggle`      | `() => void`             | 切换播放/暂停          |
| `setRate`     | `(rate: number) => void` | 设置播放速度           |

### 组件方法

通过 `ref` 访问组件方法：

```vue
<script setup>
import { ref } from "vue";

const ttsRef = ref();

const controlPlay = () => ttsRef.value.play();
const controlPause = () => ttsRef.value.pause();
</script>

<template>
  <ToSpeech ref="ttsRef" :text="content" />
  <button @click="controlPlay">外部播放</button>
  <button @click="controlPause">外部暂停</button>
</template>
```

## ⚠️ 重要说明

### Web Speech API 特性

1. **进度显示**: 基于估算时长显示播放进度
2. **不支持跳转**: 语音是实时合成的，无法跳转到指定位置
3. **时长估算**: 基于文本长度和语速估算，可能与实际时长有差异
4. **浏览器支持**: 需要现代浏览器支持 Web Speech API
5. **语音质量**: 依赖浏览器和系统的语音引擎

### 浏览器兼容性

```javascript
if ("speechSynthesis" in window) {
  // 支持语音合成
} else {
  // 不支持，显示替代方案
}
```

## 🛠️ 实用工具

### 时间格式化

```javascript
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
```

### 文本预处理

```javascript
const preprocessText = (text) => {
  return text
    .replace(/\s+/g, " ") // 合并多个空格
    .replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s.,!?;:]/g, "") // 清理特殊字符
    .trim();
};
```



<style scoped>
.demo-section {
  margin: 24px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.demo-text {
  margin: 12px 0 0 0;
  color: #6c757d;
  font-size: 14px;
}

.title-demo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-demo h3 {
  margin: 0;
  font-size: 18px;
}

.mini-button {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.mini-button:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.custom-player {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #dee2e6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.player-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.play-button {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.play-button:hover {
  background: #0056b3;
}

.time-display {
  font-size: 13px;
  color: #6c757d;
  font-family: monospace;
}

.progress-section {
  margin-bottom: 16px;
}

.progress-track {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-bar {
  height: 100%;
  background: #007bff;
  transition: width 0.2s ease;
}

.progress-info {
  text-align: center;
}

.progress-info small {
  color: #6c757d;
  font-size: 11px;
}

.controls-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.control-label {
  font-size: 13px;
  color: #495057;
  margin-right: 4px;
}

.speed-button {
  padding: 4px 10px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.speed-button:hover {
  background: #f8f9fa;
}

.speed-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

@media (max-width: 640px) {
  .player-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .controls-section {
    justify-content: center;
  }
}
</style>
