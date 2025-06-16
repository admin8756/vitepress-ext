<template>
  <div class="markmap-container" :class="{ fullscreen: isFullscreen }">
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
              @click="downloadMarkdown"
              class="control-button"
              title="下载Markdown">
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
      <!-- Code Editor -->
      <div v-show="activeTab === 'code'" class="code-panel">
        <div class="code-viewer">
          <pre class="code-content">{{ markdownContent }}</pre>
        </div>
      </div>

      <!-- MarkMap Preview -->
      <div v-show="activeTab === 'preview'" class="preview-panel">
        <div
          ref="markmapContainer"
          class="markmap-svg-container"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp" />

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在渲染思维导图...</p>
        </div>

        <!-- Empty State -->
        <div v-if="!markdownContent.trim() && !isLoading" class="empty-state">
          <div class="empty-icon">🗺️</div>
          <h3>开始创建你的思维导图</h3>
          <p>切换到代码模式查看Markdown源码</p>
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
import * as d3 from "d3";
import { downloadFunc } from "../utils";

// Props
interface Props {
  content?: string;
  height?: string;
  theme?: "light" | "dark";
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  height: "600px",
  theme: "light",
});

// Reactive data
const activeTab = ref<"preview" | "code">("preview");
const markdownContent = ref(props.content);
const markmapContainer = ref<HTMLElement>();
const isLoading = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const currentTransform = ref({ x: 0, y: 0, scale: 1 });

// D3.js based mindmap variables
let svg: any = null;
let zoomBehavior: any = null;

// Tabs configuration
const tabs = [
  { key: "preview" as "preview", label: "预览" },
  { key: "code" as "code", label: "代码" },
];

// Parse markdown to tree structure
const parseMarkdown = (content: string) => {
  const lines = content.split("\n").filter((line) => line.trim());
  const root = { name: "Root", children: [] as any[], level: 0 };
  const stack = [root];

  lines.forEach((line) => {
    const match = line.match(/^(#+)\s*(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const node = { name: text, children: [], level };

      // Find the correct parent based on level
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);
    } else if (line.trim().startsWith("-")) {
      const text = line.trim().substring(1).trim();
      const node = {
        name: text,
        children: [],
        level: stack[stack.length - 1].level + 1,
      };
      stack[stack.length - 1].children.push(node);
    }
  });

  return root.children[0] || { name: "空白思维导图", children: [] };
};

// Render mindmap using D3.js
const renderMindmap = () => {
  if (!markmapContainer.value || !markdownContent.value.trim()) return;

  isLoading.value = true;

  try {
    const container = markmapContainer.value;
    container.innerHTML = "";

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Parse markdown to tree data
    const treeData = parseMarkdown(markdownContent.value);

    // Create SVG
    svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g");

    zoomBehavior = d3
      .zoom()
      .scaleExtent([0.1, 3])
      .filter((event) => {
        // 禁用滚轮事件，只允许拖拽
        return event.type !== "wheel";
      })
      .on("zoom", (event) => {
        if (
          !isNaN(event.transform.x) &&
          !isNaN(event.transform.y) &&
          !isNaN(event.transform.k)
        ) {
          g.attr("transform", event.transform);
          currentTransform.value = {
            x: event.transform.x,
            y: event.transform.y,
            scale: event.transform.k,
          };
        }
      });

    svg.call(zoomBehavior);

    // Create tree layout
    const tree = d3.tree().size([height - 100, width - 200]);
    const hierarchy = d3.hierarchy(treeData);
    const treeWithPosition = tree(hierarchy);

    // Colors for different levels
    const colors = [
      "#3B82F6",
      "#EF4444",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
    ];

    // Draw links
    g.selectAll(".link")
      .data(treeWithPosition.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal()
          .x((d: any) => d.y + 100)
          .y((d: any) => d.x + 50)
      )
      .style("fill", "none")
      .style("stroke", "#94a3b8")
      .style("stroke-width", 2);

    // Draw nodes
    const nodes = g
      .selectAll(".node")
      .data(treeWithPosition.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y + 100},${d.x + 50})`)
      .style("cursor", "pointer");

    // Add circles for nodes
    nodes
      .append("circle")
      .attr("r", 8)
      .style("fill", (d: any) => colors[d.depth % colors.length])
      .style("stroke", "#fff")
      .style("stroke-width", 2);

    // Add text labels
    nodes
      .append("text")
      .attr("dx", (d: any) => (d.children ? -15 : 15))
      .attr("dy", 5)
      .attr("text-anchor", (d: any) => (d.children ? "end" : "start"))
      .text((d: any) => d.data.name)
      .style("font-size", "14px")
      .style("font-family", "Inter, sans-serif")
      .style("fill", "#374151");

    // Add hover effects
    nodes
      .on("mouseenter", function (this: SVGGElement) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 12);
      })
      .on("mouseleave", function (this: SVGGElement) {
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 8);
      });

    // Center the view
    const bounds = g.node()?.getBBox();
    if (bounds) {
      const scale =
        Math.min(width / bounds.width, height / bounds.height) * 0.8;
      const translateX = (width - bounds.width * scale) / 2 - bounds.x * scale;
      const translateY =
        (height - bounds.height * scale) / 2 - bounds.y * scale;
      svg.call(
        zoomBehavior.transform,
        d3.zoomIdentity.translate(translateX, translateY).scale(scale)
      );
    }
  } catch (error) {
    console.error("Error rendering mindmap:", error);
  } finally {
    isLoading.value = false;
  }
};

// Methods
const zoomIn = () => {
  if (svg && zoomBehavior) {
    svg.transition().call(zoomBehavior.scaleBy, 1.2);
  }
};

const zoomOut = () => {
  if (svg && zoomBehavior) {
    svg.transition().call(zoomBehavior.scaleBy, 0.8);
  }
};

const resetView = () => {
  if (svg && zoomBehavior) {
    svg.transition().call(zoomBehavior.transform, d3.zoomIdentity);
  }
  currentTransform.value = { x: 0, y: 0, scale: 1 };
};

const downloadSVG = () => {
  if (!markmapContainer.value) return;

  const svgElement = markmapContainer.value.querySelector("svg");
  if (!svgElement) return;

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  downloadFunc(URL.createObjectURL(blob), "mindmap.svg");
};

const downloadMarkdown = () => {
  const blob = new Blob([markdownContent.value], { type: "text/markdown" });
  downloadFunc(URL.createObjectURL(blob), "mindmap.md");
};

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(markdownContent.value);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

// CSS全屏 - 不使用浏览器原生全屏API
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  // 等待DOM更新后重新渲染思维导图
  nextTick(() => {
    setTimeout(() => {
      if (activeTab.value === "preview") {
        renderMindmap();
      }
    }, 100);
  });
};

const exitFullscreen = () => {
  isFullscreen.value = false;
  // 全屏状态改变时重新渲染
  nextTick(() => {
    setTimeout(() => {
      if (activeTab.value === "preview") {
        renderMindmap();
      }
    }, 100);
  });
};

// Mouse drag handlers
const handleMouseDown = (e: MouseEvent) => {
  if (e.button === 0) {
    isDragging.value = true;
    dragStart.value = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }
};

const handleMouseMove = (e: MouseEvent) => {
  if (isDragging.value && svg && zoomBehavior) {
    const deltaX = e.clientX - dragStart.value.x;
    const deltaY = e.clientY - dragStart.value.y;

    const currentTransformValue = d3.zoomTransform(svg.node());
    const newTransform = currentTransformValue.translate(
      deltaX / currentTransformValue.k,
      deltaY / currentTransformValue.k
    );

    svg.call(zoomBehavior.transform, newTransform);
    dragStart.value = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// 窗口大小变化监听器
const handleResize = () => {
  if (activeTab.value === "preview") {
    nextTick(() => {
      setTimeout(() => {
        renderMindmap();
      }, 100);
    });
  }
};

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === "preview") {
    nextTick(() => {
      renderMindmap();
    });
  }
});

// Lifecycle
onMounted(() => {
  renderMindmap();

  // 监听窗口大小变化
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener("resize", handleResize);
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
.markmap-container {
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

.markmap-container.fullscreen {
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

.markmap-container.fullscreen .content-area {
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
}

.markmap-svg-container {
  width: 100%;
  height: 100%;
  cursor: grab;
}

.markmap-svg-container:active {
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Custom scrollbar for code viewer */
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

  .markmap-container {
    box-shadow: none;
    border: none;
  }
}
</style>
