<template>
  <div class="image-container" :class="{ fullscreen: isFullscreen }">
    <!-- Header Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="image-info">
          <span class="image-title">{{
            currentImage?.title || `图片 ${currentIndex + 1}`
          }}</span>
          <span v-if="images.length > 1" class="image-count"
            >{{ currentIndex + 1 }} / {{ images.length }}</span
          >
        </div>
      </div>

      <div class="toolbar-right">
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
          <button
            v-if="images.length > 1"
            @click="previousImage"
            class="control-button"
            title="上一张">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            v-if="images.length > 1"
            @click="nextImage"
            class="control-button"
            title="下一张">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
          <button
            @click="downloadImage"
            class="control-button"
            title="下载图片">
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
      </div>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Image Display Area -->
      <div class="image-display-area">
        <div
          ref="imageContainer"
          class="image-display"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @mouseup="handleMouseUp"
          @mouseleave="handleMouseUp">
          <img
            v-if="currentImage"
            :src="currentImage.url"
            :alt="currentImage.title || `图片 ${currentIndex + 1}`"
            class="main-image"
            :style="imageTransformStyle"
            @load="handleImageLoad"
            @error="handleImageError" />

          <!-- Loading State -->
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
            <p>正在加载图片...</p>
          </div>

          <!-- Error State -->
          <div v-if="hasError" class="error-state">
            <div class="error-icon">❌</div>
            <h3>图片加载失败</h3>
            <p>无法加载当前图片，请检查图片链接是否有效</p>
            <button @click="retryLoad" class="retry-button">重试</button>
          </div>

          <!-- Empty State -->
          <div v-if="!images.length && !isLoading" class="empty-state">
            <div class="empty-icon">🖼️</div>
            <h3>没有图片可显示</h3>
            <p>请提供有效的图片链接</p>
          </div>
        </div>
      </div>

      <!-- Thumbnail Navigation (使用绝对定位，只在多图片时显示) -->
      <div v-if="images.length > 1" class="thumbnail-nav">
        <div class="thumbnail-container">
          <button
            v-for="(image, index) in images"
            :key="index"
            @click="setCurrentImage(index)"
            :class="['thumbnail-button', { active: index === currentIndex }]"
            :title="image.title || `图片 ${index + 1}`">
            <img
              :src="image.url"
              :alt="image.title || `缩略图 ${index + 1}`"
              class="thumbnail-image"
              @error="handleThumbnailError" />
            <div class="thumbnail-overlay"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Overlay -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click="exitFullscreen">
      <div class="fullscreen-close-hint">点击任意位置或按 ESC 退出全屏</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
// Props
interface ImageItem {
  url: string;
  title?: string;
}

interface Props {
  images?: ImageItem[];
  height?: string;
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  height: "600px",
});

// Reactive data
const currentIndex = ref(0);
const isLoading = ref(false);
const hasError = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);
const imageContainer = ref<HTMLElement>();

// Computed
const currentImage = computed(() => {
  return props.images[currentIndex.value] || null;
});

const imageTransformStyle = computed(() => {
  return {
    transform: `translate(${translateX.value}px, ${translateY.value}px) scale(${scale.value})`,
    transformOrigin: "center center",
    transition: isDragging.value ? "none" : "transform 0.2s ease",
  };
});

// Methods
const setCurrentImage = (index: number) => {
  if (index >= 0 && index < props.images.length) {
    currentIndex.value = index;
    resetView();
    hasError.value = false;
  }
};

const nextImage = () => {
  const nextIndex = (currentIndex.value + 1) % props.images.length;
  setCurrentImage(nextIndex);
};

const previousImage = () => {
  const prevIndex =
    (currentIndex.value - 1 + props.images.length) % props.images.length;
  setCurrentImage(prevIndex);
};

const zoomIn = () => {
  scale.value = Math.min(scale.value * 1.2, 5);
};

const zoomOut = () => {
  scale.value = Math.max(scale.value * 0.8, 0.1);
};

const resetView = () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
};

const downloadImage = async () => {
  if (!currentImage.value) return;

  try {
    const response = await fetch(currentImage.value.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download =
      currentImage.value.title || `image-${currentIndex.value + 1}`;
    link.click();

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("下载图片失败:", error);
  }
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

const exitFullscreen = () => {
  isFullscreen.value = false;
};

const retryLoad = () => {
  hasError.value = false;
  isLoading.value = true;
};

// Event handlers
const handleImageLoad = () => {
  isLoading.value = false;
  hasError.value = false;
  resetView();
};

const handleImageError = () => {
  isLoading.value = false;
  hasError.value = true;
};

const handleThumbnailError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = "none";
};

const handleMouseDown = (e: MouseEvent) => {
  if (e.button === 0 && currentImage.value) {
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

    dragStart.value = { x: e.clientX, y: e.clientY };
  }
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (props.images.length <= 1) return;

  switch (e.key) {
    case "ArrowLeft":
      e.preventDefault();
      previousImage();
      break;
    case "ArrowRight":
      e.preventDefault();
      nextImage();
      break;
    case "Escape":
      if (isFullscreen.value) {
        exitFullscreen();
      }
      break;
  }
};

// Lifecycle
onMounted(() => {
  if (props.images.length > 0) {
    isLoading.value = true;
  }
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style scoped>
.dark .content-area {
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
.image-container {
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

.image-container.fullscreen {
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
  border: none;
}

.image-container.fullscreen .content-area {
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
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.image-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.image-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.image-count {
  font-size: 12px;
  color: #6b7280;
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
  position: relative;
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
}

/* 主图片显示区域 */
.image-display-area {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.image-display {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #f9fafb;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-display:active {
  cursor: grabbing;
}

/* 图片宽度适配模式 */
.main-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  display: block;
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

.error-state p {
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

/* 缩略图导航 - 使用绝对定位确保在移动端也能显示 */
.thumbnail-nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(10px);
  border-top: 1px solid #e5e7eb;
  padding: 12px;
  z-index: 10;
}

.thumbnail-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px;
  scrollbar-width: thin;
  justify-content: center;
}

.thumbnail-button {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.thumbnail-button:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.thumbnail-button.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.2s;
}

.thumbnail-button:hover .thumbnail-overlay {
  opacity: 1;
}

.thumbnail-button.active .thumbnail-overlay {
  opacity: 0;
}

/* Custom scrollbar for thumbnails */
.thumbnail-container::-webkit-scrollbar {
  height: 6px;
}

.thumbnail-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.thumbnail-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.thumbnail-container::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 移动端优化 */
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

  .image-info {
    text-align: center;
  }

  .thumbnail-button {
    width: 50px;
    height: 50px;
  }

  .thumbnail-nav {
    padding: 8px;
  }

  .thumbnail-container {
    gap: 6px;
    padding: 2px;
  }

  /* 确保移动端缩略图导航可见 */
  .content-area {
    padding-bottom: 0;
  }

  .image-display-area {
    padding-bottom: 78px; /* 为缩略图导航留出空间 */
  }
}

/* 全屏模式下的移动端适配 */
.image-container.fullscreen .image-display-area {
  padding-bottom: 0;
}

.image-container.fullscreen .thumbnail-nav {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .image-container.fullscreen .image-display-area {
    padding-bottom: 78px;
  }
}

/* Print styles */
@media print {
  .toolbar,
  .thumbnail-nav {
    display: none;
  }

  .image-container {
    box-shadow: none;
    border: none;
  }

  .image-display-area {
    padding-bottom: 0;
  }
}
</style>
