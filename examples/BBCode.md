---
layout: doc
title: BBCode 文档
editLink: false
---
<script setup>
import { ref } from 'vue'

const bbcodeContent = ref(`[b]粗体文本[/b]

[i]斜体文本[/i]

[u]下划线文本[/u]

[url=https://example.com]这是一个链接[/url]

[img]https://api.vvhan.com/api/wallpaper/views[/img]

[quote]这是一段引用文本[/quote]

[code]console.log('这是代码块');\nfunction example() { return true; }[/code]

[size=2]这是大一点的文本[/size]

[color=red]这是红色文本[/color]`

)
</script>
# BBCode 文档

BBCode 组件提供解析和渲染 BBCode 格式的功能，包括预览和编辑两种模式。

## ✨ 特性
* 🖥️ **双视图模式**
  - 支持「预览」与「代码」两种模式自由切换。
* 📄 **BBCode 转思维导图**
  - 内置解析器，能将 BBCode 内容解析为树形结构并渲染成富文本。
* 💾 **导出功能**
  - 一键下载BBCode的html 文件或 BBCode 源码文件。
* 🧩 **嵌入式全屏**
  - 纯 CSS 实现，不依赖浏览器全屏 API。

## 📦 引入&使用

### 单个引入
在你要使用的页面中引入组件
``` md
<script setup>
    import { defineClientComponent } from 'vitepress'
    import { BBCode } from '@leelaa/vitepress-plugin-extended'
    const BBCodeView = defineClientComponent(() => BBCode)
</script>
```

### 全局引入
在你的`.vitepress/theme/index.ts`中引入组件
``` js
import { defineAsyncComponent, h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { BBCode } from '@leelaa/vitepress-plugin-extended'
export default {
    enhanceApp({ app }) {
         app.component('BBcode', BBCode)
    }
}
```

### 扩展md插件

在你的`.vitepress\config.ts`中引入插件

``` js
import { defineConfig } from 'vitepress';
import { BBCodePlugin } from '@leelaa/vitepress-plugin-extended';
export default defineConfig({
    markdown: {
        breaks: true,
        math: true,
        lineNumbers: true,
        lazyLoading: true,
        config: (md) => {
            BBCodePlugin(md);
        },
    },
})
```

## 📁 示例

<BBCode :content="bbcodeContent"/>

### BBCode 预览组件

```vue
<BBCode content="[b]粗体[/b] [i]斜体[/i] [url=https://leelaa.cn]链接[/url]"/>
```

<BBCode content="[b]粗体[/b] [i]斜体[/i] [url=https://leelaa.cn]链接[/url]"/>

### md 文件中使用

```` md
``` bbcode
[b]粗体[/b] [i]斜体[/i] [url=https://leelaa.cn]链接[/url]
```
````

``` bbcode
[b]粗体[/b] [i]斜体[/i] [url=https://leelaa.cn]链接[/url]
```

## 🎈 组件参数说明
| 参数名    | 类型                  | 默认值    | 描述                       |
| --------- | --------------------- | --------- | -------------------------- |
| `content` | `string`              | `""`      | 输入的 BBCode 内容         |
| `theme`   | `"light"` \| `"dark"` | `"light"` | 主题风格（未来可扩展样式） |
| `height`  | `string`              | `"600px"` | 组件高度                   |



## 📄 支持的 BBCode 标签

- `[b]` - 粗体文本
- `[i]` - 斜体文本
- `[u]` - 下划线文本
- `[url=链接]` - 超链接
- `[img]` - 图片
- `[quote]` - 引用文本
- `[code]` - 代码块
- `[size=数值]` - 文本大小
- `[color=颜色]` - 文本颜色

