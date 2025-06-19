---
layout: doc
title: Mermaid 图表
editLink: false
---
# Mermaid 图表组件示例

Mermaid 图表组件提供创建和显示 Mermaid 图表的功能，包括预览和查看代码两种模式。

## ✨ 特性

- 🖥️ **双视图模式**
  - 支持「预览」与「代码」两种模式自由切换。
- 🔍 **交互体验**
  - 支持缩放、重置视图和拖拽操作。
  - 节点具有悬停效果，增强交互性。
- 💾 **导出功能**
  - 一键下载思维导图的 SVG 文件或 Markdown 源码文件。
- 🧩 **嵌入式全屏**
  - 纯 CSS 实现，不依赖浏览器全屏 API。

## 🎈 组件参数说明

| 参数名    | 类型                  | 默认值    | 描述                       |
| --------- | --------------------- | --------- | -------------------------- |
| `content` | `string`              | `""`      | 输入的 Mermaid 内容         |
| `theme`   | `"light"` \| `"dark"` | `"light"` | 主题风格（未来可扩展样式） |
| `height`  | `string`              | `"600px"` | 组件高度                   |

## 📦 引入&使用

### 单个引入

在你要使用的页面中引入组件

```md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { Mermaid } from '@leelaa/vitepress-plugin-extended'
    const MermaidView = defineClientComponent(() => Mermaid)
</script>
```

### 全局引入

在你的`.vitepress/theme/index.ts`中引入组件

```js
import { defineAsyncComponent, h } from "vue";
import DefaultTheme from "vitepress/theme";
import { Mermaid } from "@leelaa/vitepress-plugin-extended";
export default {
  enhanceApp({ app }) {
    app.component("Mermaid", Mermaid);
  },
};
```

### 扩展 md 插件

在你的`.vitepress\config.ts`中引入插件

```js
import { defineConfig } from "vitepress";
import { MermaidPlugin } from "@leelaa/vitepress-plugin-extended";
export default defineConfig({
  markdown: {
    breaks: true,
    math: true,
    lineNumbers: true,
    lazyLoading: true,
    config: (md) => {
      MermaidPlugin(md);
    },
  },
});
```

## 使用

## 📁 示例

### vue组件的使用方式

```vue
<Mermaid content="graph LR
    A[开始] --> B{判断}
    B -->|条件1| C[处理1]
    B -->|条件2| D[处理2]
    C --> E[结束]
    D --> E" />
```

### md中的使用方式

```` md
```mermaid
graph LR
    A[开始] --> B{判断}
    B -->|条件1| C[处理1]
    B -->|条件2| D[处理2]
    C --> E[结束]
    D --> E
```
````

### 流程图

```mermaid
graph LR
    A[开始] --> B{判断}
    B -->|条件1| C[处理1]
    B -->|条件2| D[处理2]
    C --> E[结束]
    D --> E
```

### 时序图

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 登录请求
    系统-->>用户: 返回结果
```

### 甘特图

```mermaid
gantt
    title 项目进度
    dateFormat  YYYY-MM-DD
    section 阶段1
    任务1     :a1, 2026-01-01, 30d
    任务2     :after a1, 20d
```

### 思维导图

```mermaid
mindmap
    root((核心主题))
        子主题1
            子主题1.1
            子主题1.2
        子主题2
            子主题2.1
            子主题2.2
        子主题3
```

### 饼图

```mermaid
pie
    title 年度销售占比
    "电子产品" : 45
    "服装" : 25
    "食品" : 15
    "其他" : 15
```

### 实体关系图

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : "下订单"
    ORDER ||--|{ LINE-ITEM : "包含"
    CUSTOMER {
        string name
        string email
        int phone
    }
    ORDER {
        int orderId
        date orderDate
        int customerId
    }
    LINE-ITEM {
        int itemId
        int quantity
        float price
    }
```

### 时序图

```mermaid
sequenceDiagram
    participant 用户
    participant 系统
    用户->>系统: 发送请求
    系统-->>用户: 返回数据
    用户->>系统: 确认接收
```

### 状态图

```mermaid
stateDiagram
    [*] --> 初始状态
    初始状态 --> 运行中
    运行中 --> 暂停: 收到暂停事件
    运行中 --> 错误: 发生异常
    暂停 --> 运行中: 收到恢复事件
    错误 --> [*]: 重置
```

## 🎈 组件参数说明

| 参数名    | 类型                  | 默认值    | 描述                       |
| --------- | --------------------- | --------- | -------------------------- |
| `content` | `string`              | `""`      | 输入的 Mermaid 内容        |
| `theme`   | `"light"` \| `"dark"` | `"light"` | 主题风格（未来可扩展样式） |
| `height`  | `string`              | `"600px"` | 组件高度                   |

## 📁 预览与下载

### 预览模式工具栏

| 按钮            | 功能                          |
| --------------- | ----------------------------- |
| 🔍 放大         | 点击后放大视图                |
| 🔎 缩小         | 点击后缩小视图                |
| 🔄 重置视图     | 点击后将视图重置为初始状态    |
| 💾 下载 SVG     | 点击后下载图表的 SVG 文件 |
| 🖥️ 切换全屏模式 | 点击后切换全屏显示图表    |

### 代码模式工具栏

| 按钮             | 功能                             |
| ---------------- | -------------------------------- |
| 📋 复制代码      | 点击后复制 Markdown 源码到剪贴板 |
| 💾 下载 Markdown | 点击后下载 Markdown 源码文件     |
| 🖥️ 切换全屏模式  | 点击后切换全屏显示 Markdown 源码 |
