<template>
  <div class="bbcode-container" :class="{ fullscreen: isFullscreen }">
    <!-- Header Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="['tab-button', { active: activeTab === tab.key }]">
          <svg
            v-if="tab.key === 'preview'"
            class="icon"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          <svg
            v-if="tab.key === 'code'"
            class="icon"
            viewBox="0 0 24 24"
            fill="currentColor">
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
          {{ tab.label }}
        </button>
      </div>

      <div class="toolbar-right">
        <!-- 预览模式的工具栏 -->
        <template v-if="activeTab === 'preview'">
          <div class="control-group">
            <button
              @click="downloadHTML"
              class="control-button"
              title="下载HTML">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            </button>
            <button
              @click="toggleFullscreen"
              class="control-button"
              :title="isFullscreen ? '退出全屏' : '全屏'">
              <svg
                v-if="!isFullscreen"
                class="icon"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </button>
          </div>
        </template>

        <!-- 代码模式的工具栏 -->
        <template v-if="activeTab === 'code'">
          <div class="control-group">
            <button @click="copyCode" class="control-button" title="复制代码">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
            </button>
            <button
              @click="downloadBBCode"
              class="control-button"
              title="下载BBCode">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
            </button>
            <button
              @click="toggleFullscreen"
              class="control-button"
              :title="isFullscreen ? '退出全屏' : '全屏'">
              <svg
                v-if="!isFullscreen"
                class="icon"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Code Viewer -->
      <div v-show="activeTab === 'code'" class="code-panel">
        <div class="code-viewer">
          <pre class="code-content">{{ bbcodeContent }}</pre>
        </div>
      </div>

      <!-- BBCode Preview -->
      <div v-show="activeTab === 'preview'" class="preview-panel">
        <div class="bbcode-preview" v-html="parsedHTML"></div>

        <!-- Empty State -->
        <div v-if="!bbcodeContent.trim()" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>开始预览你的BBCode</h3>
          <p>切换到代码模式查看BBCode源码</p>
        </div>
      </div>
    </div>

    <!-- Fullscreen Overlay (when in fullscreen mode) -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click="exitFullscreen">
      <div class="fullscreen-close-hint">点击任意位置或按 ESC 退出全屏</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const downloadFunc = (url: string, name: string) => {
  if (document) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    console.log("未知环境");
  }
};
const props = withDefaults(defineProps<BBCodeConfig>(), {
  content: "",
  height: "600px",
  theme: "light",
});

// Reactive data
const activeTab = ref<"preview" | "code">("preview");
const bbcodeContent = ref(props.content);
const isFullscreen = ref(false);

// Tabs configuration
const tabs = [
  { key: "preview" as const, label: "预览" },
  { key: "code" as const, label: "代码" },
];

// BBCode 解析器
const parseBBCode = (text: string): string => {
  if (!text) return "";

  let html = text;

  // 基本格式标签
  html = html.replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>");
  html = html.replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>");
  html = html.replace(
    /\[u\](.*?)\[\/u\]/gi,
    '<span style="text-decoration: underline;">$1</span>'
  );
  html = html.replace(
    /\[s\](.*?)\[\/s\]/gi,
    '<span style="text-decoration: line-through;">$1</span>'
  );

  // 颜色标签
  html = html.replace(
    /\[color=(.*?)\](.*?)\[\/color\]/gi,
    '<span style="color: $1;">$2</span>'
  );

  // 字体大小
  html = html.replace(
    /\[size=(\d+)\](.*?)\[\/size\]/gi,
    '<span style="font-size: $1px;">$2</span>'
  );

  // 链接
  html = html.replace(
    /\[url=(.*?)\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
  );
  html = html.replace(
    /\[url\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // 图片
  html = html.replace(
    /\[img\](.*?)\[\/img\]/gi,
    '<img src="$1" alt="BBCode Image" style="max-width: 100%; height: auto;" />'
  );
  html = html.replace(
    /\[img=(.*?)x(.*?)\](.*?)\[\/img\]/gi,
    '<img src="$3" alt="BBCode Image" style="width: $1px; height: $2px;" />'
  );

  // 引用
  html = html.replace(
    /\[quote\](.*?)\[\/quote\]/gis,
    '<blockquote class="bbcode-quote">$1</blockquote>'
  );
  html = html.replace(
    /\[quote=(.*?)\](.*?)\[\/quote\]/gis,
    '<blockquote class="bbcode-quote"><cite>$1 写道：</cite>$2</blockquote>'
  );

  // 代码
  html = html.replace(
    /\[code\](.*?)\[\/code\]/gis,
    '<pre class="bbcode-code"><code>$1</code></pre>'
  );

  // 居中
  html = html.replace(
    /\[center\](.*?)\[\/center\]/gi,
    '<div style="text-align: center;">$1</div>'
  );

  // 无序列表
  html = html.replace(/\[list\](.*?)\[\/list\]/gis, (match, content) => {
    const items = content.replace(
      /\[\*\](.*?)(?=\[\*\]|\[\/list\]|$)/gi,
      "<li>$1</li>"
    );
    return `<ul class="bbcode-list">${items}</ul>`;
  });

  // 有序列表
  html = html.replace(/\[list=1\](.*?)\[\/list\]/gis, (match, content) => {
    const items = content.replace(
      /\[\*\](.*?)(?=\[\*\]|\[\/list\]|$)/gi,
      "<li>$1</li>"
    );
    return `<ol class="bbcode-list">${items}</ol>`;
  });

  // 表格
  html = html.replace(
    /\[table\](.*?)\[\/table\]/gis,
    '<table class="bbcode-table">$1</table>'
  );
  html = html.replace(/\[tr\](.*?)\[\/tr\]/gi, "<tr>$1</tr>");
  html = html.replace(/\[td\](.*?)\[\/td\]/gi, "<td>$1</td>");
  html = html.replace(/\[th\](.*?)\[\/th\]/gi, "<th>$1</th>");

  // 换行处理
  html = html.replace(/\n/g, "<br>");

  return html;
};

// 计算属性
const parsedHTML = computed(() => {
  return parseBBCode(bbcodeContent.value);
});

// Methods
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(bbcodeContent.value);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

const downloadBBCode = () => {
  const blob = new Blob([bbcodeContent.value], { type: "text/plain" });
  downloadFunc(URL.createObjectURL(blob), "content.bbcode");
};

const downloadHTML = () => {
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BBCode 转换结果</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        .bbcode-quote { background: #f4f4f4; border-left: 4px solid #ccc; margin: 10px 0; padding: 10px; }
        .bbcode-quote cite { font-weight: bold; display: block; margin-bottom: 5px; }
        .bbcode-code { background: #f8f8f8; border: 1px solid #ddd; padding: 10px; overflow-x: auto; }
        .bbcode-list { margin: 10px 0; padding-left: 20px; }
        .bbcode-table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        .bbcode-table td, .bbcode-table th { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .bbcode-table th { background-color: #f2f2f2; font-weight: bold; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    ${parsedHTML.value}
</body>
</html>`;
  const blob = new Blob([htmlContent], { type: "text/html" });
  downloadFunc(URL.createObjectURL(blob), "content.html");
};

// CSS全屏 - 不使用浏览器原生全屏API
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const exitFullscreen = () => {
  isFullscreen.value = false;
};
</script>

<style scoped>
.dark .content-area {
  background: #99999980 !important;
}
.dark .code-viewer {
  background: #99999980 !important;
}
.dark .control-button:hover {
  background: #cccccc80 !important;
}
.dark .toolbar {
  background: #1d1d1d !important;
}
.dark .control-group {
  background-color: #000 !important;
}
.dark .toolbar .tab-button.active {
  background-color: #dbeafe80 !important;
}
.dark .toolbar .tab-button:hover {
  background-color: #9299a380 !important;
  color: white;
}
.bbcode-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  height: v-bind(height);
  transition: all 0.3s ease;
  position: relative;
}

.bbcode-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  border-radius: 0;
  height: 100vh !important;
  margin: 0;
  padding: 0;
}

.bbcode-container.fullscreen .content-area {
  background: white;
  height: calc(100vh - 60px);
  margin: 0;
  padding: 0;
}

.fullscreen-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: -1;
  cursor: pointer;
}

.fullscreen-close-hint {
  position: absolute;
  top: 10px;
  right: 20px;
  color: white;
  font-size: 14px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  z-index: 1001;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  height: 60px;
}

.toolbar-left {
  display: flex;
  gap: 4px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
}

.tab-button:hover {
  color: #374151;
  background: white;
}

.tab-button.active {
  background: #dbeafe;
  color: #1d4ed8;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.control-group {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.control-button {
  padding: 8px;
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  border-right: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:last-child {
  border-right: none;
}

.control-button:first-child {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.control-button:last-child {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.control-button:hover {
  background: #f9fafb;
  color: #374151;
}

.icon {
  width: 16px;
  height: 16px;
}

.content-area {
  flex: 1;
  position: relative;
  height: calc(100% - 60px);
}

.code-panel {
  height: 100%;
  overflow: hidden;
}

.code-viewer {
  height: 100%;
  overflow: auto;
  background: #f9fafb;
}

.code-content {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 16px;
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
  background: transparent;
  border: none;
  outline: none;
}

.preview-panel {
  height: 100%;
  position: relative;
  overflow: auto;
}

.bbcode-preview {
  padding: 20px;
  line-height: 1.6;
  font-family: Arial, sans-serif;
}

.empty-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
}

.empty-state p {
  font-size: 14px;
}

/* BBCode preview styles */
:deep(.bbcode-quote) {
  background: #f4f4f4;
  border-left: 4px solid #ccc;
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

:deep(.bbcode-quote cite) {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
  color: #666;
}

:deep(.bbcode-code) {
  background: #f8f8f8;
  border: 1px solid #ddd;
  padding: 10px;
  overflow-x: auto;
  border-radius: 4px;
  margin: 10px 0;
}

:deep(.bbcode-code code) {
  font-family: "Fira Code", "Monaco", "Consolas", monospace;
  font-size: 13px;
  line-height: 1.4;
  background: none;
  padding: 0;
}

:deep(.bbcode-list) {
  margin: 10px 0;
  padding-left: 20px;
}

:deep(.bbcode-table) {
  border-collapse: collapse;
  width: 100%;
  margin: 10px 0;
  border: 1px solid #ddd;
}

:deep(.bbcode-table td),
:deep(.bbcode-table th) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

:deep(.bbcode-table th) {
  background-color: #f2f2f2;
  font-weight: bold;
}

:deep(.bbcode-preview a) {
  color: #0066cc;
  text-decoration: none;
}

:deep(.bbcode-preview a:hover) {
  text-decoration: underline;
}

:deep(.bbcode-preview img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
}

/* Custom scrollbar */
.code-viewer::-webkit-scrollbar,
.preview-panel::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-viewer::-webkit-scrollbar-track,
.preview-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.code-viewer::-webkit-scrollbar-thumb,
.preview-panel::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.code-viewer::-webkit-scrollbar-thumb:hover,
.preview-panel::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    height: auto;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .tab-button {
    flex: 1;
    justify-content: center;
  }
}

/* Print styles */
@media print {
  .toolbar {
    display: none;
  }

  .bbcode-container {
    box-shadow: none;
    border: none;
  }
}
</style>
