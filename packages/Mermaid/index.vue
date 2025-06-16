<template>
  <div class="mermaid-container" :class="{ fullscreen: isFullscreen }">
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
            <button @click="zoomIn" class="control-button" title="放大">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
              </svg>
            </button>
            <button @click="zoomOut" class="control-button" title="缩小">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                <path d="M7 9h5v1H7z" />
              </svg>
            </button>
            <button @click="resetView" class="control-button" title="重置视图">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
            </button>
          </div>

          <div class="control-group">
            <button @click="downloadSVG" class="control-button" title="下载SVG">
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
              @click="downloadMermaid"
              class="control-button"
              title="下载Mermaid">
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
          <pre class="code-content">{{ mermaidContent }}</pre>
        </div>
      </div>

      <!-- Mermaid Preview -->
      <div v-show="activeTab === 'preview'" class="preview-panel">
        <div
          ref="mermaidContainer"
          class="mermaid-diagram-container"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp" />

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在渲染图表...</p>
        </div>

        <!-- Error State -->
        <div v-if="renderError" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>图表渲染失败</h3>
          <p class="error-message">{{ renderError }}</p>
          <button @click="retryRender" class="retry-button">重试</button>
        </div>

        <!-- Empty State -->
        <div
          v-if="!mermaidContent.trim() && !isLoading && !renderError"
          class="empty-state">
          <div class="empty-icon">📊</div>
          <h3>开始创建你的图表</h3>
          <p>切换到代码模式查看Mermaid源码</p>
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
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import mermaid from "mermaid";
import { downloadFunc } from "../utils";

// Props
interface Props {
  content?: string;
  height?: string;
  theme?: "default" | "forest" | "dark" | "neutral";
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  height: "600px",
  theme: "default",
});

// 生成唯一的组件ID，避免多个组件实例冲突
const componentId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

// Reactive data
const activeTab = ref<"preview" | "code">("preview");
const mermaidContent = ref(props.content);
const mermaidContainer = ref<HTMLElement>();
const isLoading = ref(false);
const isFullscreen = ref(false);
const renderError = ref("");
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);

// Tabs configuration
const tabs = [
  { key: "preview" as const, label: "预览" },
  { key: "code" as const, label: "代码" },
];

// Render Mermaid diagram
const renderMermaid = async () => {
  if (!mermaidContainer.value || !mermaidContent.value.trim()) return;

  isLoading.value = true;
  renderError.value = "";

  try {
    const container = mermaidContainer.value;
    container.innerHTML = "";

    // Create a unique ID for this diagram
    const diagramId = `${componentId}-${Date.now()}`;

    // Parse and render the diagram
    const { svg } = await mermaid.render(diagramId, mermaidContent.value);

    // Insert the SVG
    container.innerHTML = svg;

    // Get the SVG element and set up initial positioning
    const svgElement = container.querySelector("svg");
    if (svgElement) {
      svgElement.style.maxWidth = "none";
      svgElement.style.maxHeight = "none";
      svgElement.style.width = "auto";
      svgElement.style.height = "auto";

      // Wait for layout then center
      setTimeout(() => {
        centerDiagram();
      }, 50);
    }
  } catch (error) {
    console.error("Mermaid rendering error:", error);
    renderError.value = error instanceof Error ? error.message : "未知错误";
  } finally {
    isLoading.value = false;
  }
};

// Center the diagram in the container
const centerDiagram = () => {
  if (!mermaidContainer.value) return;

  const container = mermaidContainer.value;
  const svg = container.querySelector("svg");
  if (!svg) return;

  // Reset transform
  svg.style.transform = "";

  // Get container and SVG dimensions
  const containerRect = container.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  // Calculate center position
  const centerX = (containerRect.width - svgRect.width) / 2;
  const centerY = (containerRect.height - svgRect.height) / 2;

  // Reset to initial state
  scale.value = 1;
  translateX.value = Math.max(0, centerX);
  translateY.value = Math.max(0, centerY);

  applyTransform();
};

// Apply transform to the SVG
const applyTransform = () => {
  if (!mermaidContainer.value) return;

  const svg = mermaidContainer.value.querySelector("svg");
  if (!svg) return;

  svg.style.transform = `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`;
  svg.style.transformOrigin = "0 0";
};

// Methods
const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 3);
  applyTransform();
};

const zoomOut = () => {
  scale.value = Math.max(scale.value * 0.8, 0.1);
  applyTransform();
};

const resetView = () => {
  centerDiagram();
};

const downloadSVG = () => {
  if (!mermaidContainer.value) return;

  const svg = mermaidContainer.value.querySelector("svg");
  if (!svg) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  downloadFunc(URL.createObjectURL(blob), "mermaid-diagram.svg");
};

const downloadMermaid = () => {
  const blob = new Blob([mermaidContent.value], { type: "text/plain" });
  downloadFunc(URL.createObjectURL(blob), "mermaid-diagram.md");
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(mermaidContent.value);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

const retryRender = () => {
  renderError.value = "";
  renderMermaid();
};

// CSS全屏 - 不使用浏览器原生全屏API
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  nextTick(() => {
    setTimeout(() => {
      if (activeTab.value === "preview") {
        renderMermaid();
      }
    }, 100);
  });
};

const exitFullscreen = () => {
  isFullscreen.value = false;

  nextTick(() => {
    setTimeout(() => {
      if (activeTab.value === "preview") {
        renderMermaid();
      }
    }, 100);
  });
};

// Mouse handlers
const handleMouseDown = (e: MouseEvent) => {
  if (e.button === 0) {
    isDragging.value = true;
    dragStart.value = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value) {
    const deltaX = e.clientX - dragStart.value.x;
    const deltaY = e.clientY - dragStart.value.y;

    translateX.value += deltaX;
    translateY.value += deltaY;

    applyTransform();
    dragStart.value = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// 窗口大小变化处理器
const resizeHandler = () => {
  if (activeTab.value === "preview") {
    nextTick(() => {
      setTimeout(() => {
        renderMermaid();
      }, 100);
    });
  }
};

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === "preview") {
    nextTick(() => {
      renderMermaid();
    });
  }
});

// Lifecycle
onMounted(() => {
  renderMermaid();
  // 添加事件监听器
  window.addEventListener("resize", resizeHandler);
});

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener("resize", resizeHandler);
});
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
.dark .control-group{
  background-color: #000 !important;
}
.dark .toolbar .tab-button.active{
  background-color: #dbeafe80 !important;
}
.dark .toolbar .tab-button:hover{
  background-color: #9299a380 !important;
  color: white;
}
.mermaid-container {
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

.mermaid-container.fullscreen {
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

.mermaid-container.fullscreen .content-area {
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
  overflow: hidden;
}

.mermaid-diagram-container {
  width: 100%;
  height: 100%;
  cursor: grab;
  overflow: hidden;
  background: #fafafa;
}

.mermaid-diagram-container:active {
  cursor: grabbing;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  color: #6b7280;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 4px solid #dbeafe;
  border-top: 4px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.error-state {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  padding: 20px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #dc2626;
}

.error-message {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 16px;
  max-width: 400px;
}

.retry-button {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: #b91c1c;
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

/* Mermaid diagram styles */
:deep(.mermaid) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.mermaid svg) {
  max-width: none !important;
  max-height: none !important;
  transition: transform 0.2s ease;
}

/* Custom scrollbar */
.code-viewer::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-viewer::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.code-viewer::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.code-viewer::-webkit-scrollbar-thumb:hover {
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

  .mermaid-container {
    box-shadow: none;
    border: none;
  }
}
</style>
