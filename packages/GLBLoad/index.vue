<template>
  <div class="glb-container" :class="{ fullscreen: isFullscreen }">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <div class="model-info">
          <span class="model-title">{{ model?.title || "3D 模型查看器" }}</span>
          <span v-if="isLoading" class="status loading">加载中...</span>
          <span v-else-if="hasError" class="status error">加载失败</span>
          <span v-else-if="model" class="status ready">已就绪</span>
        </div>
      </div>

      <div class="toolbar-right">
        <!-- 基础控制按钮 - 按图片顺序排列 -->
        <div class="control-group">
          <button
            @click="zoomIn"
            class="control-button"
            title="放大"
            :disabled="!isReady">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z" />
            </svg>
          </button>
          <button
            @click="zoomOut"
            class="control-button"
            title="缩小"
            :disabled="!isReady">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              <path d="M7 9h5v1H7z" />
            </svg>
          </button>
          <button
            @click="resetView"
            class="control-button"
            title="重置视角"
            :disabled="!isReady">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
          </button>
          <button
            @click="toggleAutoRotate"
            class="control-button"
            :class="{ active: autoRotate }"
            title="自动旋转"
            :disabled="!isReady">
            <svg
              v-if="!autoRotate"
              class="icon"
              viewBox="0 0 24 24"
              fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
          <button
            @click="toggleWireframe"
            class="control-button"
            :class="{ active: wireframeMode }"
            title="线框模式"
            :disabled="!isReady">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2l3 6 5-4-3 7 4 2-7 1-2 4-1-7-6 3 4-5L2 6l5 1z" />
            </svg>
          </button>
          <button @click="toggleFullscreen" class="control-button" title="全屏">
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

        <!-- 光照模式下拉框 -->
        <div class="control-group">
          <select
            v-model="lightingMode"
            @change="updateLighting"
            :disabled="!isReady"
            class="lighting-select">
            <option value="standard">标准光照</option>
            <option value="bright">明亮光照</option>
            <option value="soft">柔和光照</option>
            <option value="dramatic">戏剧光照</option>
          </select>
        </div>

        <!-- 光线方向多选下拉框 -->
        <div class="control-group">
          <div class="multi-select-wrapper">
            <button
              @click="toggleLightDropdown"
              class="multi-select-button"
              :disabled="!isReady">
              <span class="selected-text">{{ getLightDirectionText() }}</span>
              <svg
                class="dropdown-icon"
                :class="{ open: showLightDropdown }"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </button>

            <!-- 下拉选项 -->
            <div v-if="showLightDropdown" class="multi-select-dropdown">
              <label
                v-for="(direction, key) in lightDirections"
                :key="key"
                class="dropdown-option">
                <input
                  type="checkbox"
                  :value="key"
                  v-model="selectedLightDirections"
                  @change="updateLightDirection" />
                <span class="option-text">{{ direction.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <div ref="sceneContainer" class="scene-container">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p>正在加载 3D 模型...</p>
          <div v-if="loadingProgress > 0" class="loading-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: loadingProgress + '%' }"></div>
            </div>
            <span class="progress-text"
              >{{ Math.round(loadingProgress) }}%</span
            >
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="hasError" class="error-state">
          <div class="error-icon">❌</div>
          <h3>模型加载失败</h3>
          <p class="error-message">{{ errorMessage }}</p>
          <button @click="retryLoad" class="retry-button">重试</button>
        </div>

        <!-- 空状态 -->
        <div v-if="!model && !isLoading && !hasError" class="empty-state">
          <div class="empty-icon">🎲</div>
          <h3>没有模型可显示</h3>
          <p>请提供有效的 GLB/GLTF 模型文件</p>
        </div>
      </div>
    </div>

    <!-- 全屏覆盖层 -->
    <div v-if="isFullscreen" class="fullscreen-overlay" @click="exitFullscreen">
      <div class="fullscreen-close-hint">点击任意位置或按 ESC 退出全屏</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Props 定义
interface ModelItem {
  url: string;
  title?: string;
}

interface Props {
  model?: ModelItem;
  height?: string;
  enableMouseZoom?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "600px",
  enableMouseZoom: false,
});

// 响应式数据
const sceneContainer = ref<HTMLElement>();
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const loadingProgress = ref(0);
const isFullscreen = ref(false);
const autoRotate = ref(false);
const wireframeMode = ref(false);
const isReady = ref(false);

// 光照控制
const lightingMode = ref("standard");
const selectedLightDirections = ref(["front"]); // 默认选择前方光照
const showLightDropdown = ref(false);

// Three.js 核心对象
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let controls: OrbitControls | null = null;
let currentModel: THREE.Group | null = null;
let animationId: number | null = null;

// 光照对象
let ambientLight: THREE.AmbientLight | null = null;
let directionalLights: Map<string, THREE.DirectionalLight> = new Map();

// 保存初始状态的变量
let initialCameraPosition: THREE.Vector3 | null = null;
let initialCameraTarget: THREE.Vector3 | null = null;
let initialCameraDistance: number = 0;

// 光线方向配置（包含底部光源）
const lightDirections = {
  top: { name: "顶部", position: [0, 50, 0] },
  front: { name: "前方", position: [0, 20, 50] },
  left: { name: "左侧", position: [-50, 20, 0] },
  right: { name: "右侧", position: [50, 20, 0] },
  back: { name: "后方", position: [0, 20, -50] },
  bottom: { name: "底部", position: [0, -30, 0] },
} as const;

// 获取光源方向显示文本
const getLightDirectionText = () => {
  if (selectedLightDirections.value.length === 0) {
    return "选择光源方向";
  } else if (selectedLightDirections.value.length === 1) {
    const key = selectedLightDirections
      .value[0] as keyof typeof lightDirections;
    return lightDirections[key]?.name || "未知光源";
  } else {
    return `已选择 ${selectedLightDirections.value.length} 个光源`;
  }
};

// 切换光源下拉框
const toggleLightDropdown = () => {
  showLightDropdown.value = !showLightDropdown.value;
};

// 点击外部关闭下拉框
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".multi-select-wrapper")) {
    showLightDropdown.value = false;
  }
};

// 清理所有资源
const cleanup = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (controls) {
    controls.dispose();
    controls = null;
  }

  if (renderer) {
    if (sceneContainer.value?.contains(renderer.domElement)) {
      sceneContainer.value.removeChild(renderer.domElement);
    }
    renderer.dispose();
    renderer = null;
  }

  if (currentModel && scene) {
    scene.remove(currentModel);
    disposeObject3D(currentModel);
    currentModel = null;
  }

  // 清理光源
  directionalLights.forEach((light) => {
    if (scene) scene.remove(light);
  });
  directionalLights.clear();

  if (ambientLight && scene) {
    scene.remove(ambientLight);
    ambientLight = null;
  }

  if (scene) {
    scene.clear();
    scene = null;
  }

  camera = null;
  isReady.value = false;
};

// 递归清理3D对象
const disposeObject3D = (obj: THREE.Object3D) => {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material));
        } else {
          disposeMaterial(child.material);
        }
      }
    }
  });
};

// 清理材质
const disposeMaterial = (material: THREE.Material) => {
  if (material instanceof THREE.MeshStandardMaterial) {
    if (material.map) material.map.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.roughnessMap) material.roughnessMap.dispose();
    if (material.metalnessMap) material.metalnessMap.dispose();
  }
  material.dispose();
};

// 初始化Three.js场景
const initScene = () => {
  if (!sceneContainer.value) return;

  cleanup();

  const container = sceneContainer.value;
  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  // 创建场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8f9fa);

  // 创建相机 - 使用固定的aspect ratio计算
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.appendChild(renderer.domElement);

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = props.enableMouseZoom;
  controls.autoRotate = autoRotate.value;
  controls.autoRotateSpeed = 2.0;

  // 设置光照
  setupLighting();

  // 开始渲染循环
  animate();

  isReady.value = true;
};

// 设置光照
const setupLighting = () => {
  if (!scene) return;

  // 清理旧光源
  if (ambientLight) {
    scene.remove(ambientLight);
  }
  directionalLights.forEach((light) => {
    if (scene) {
      scene.remove(light);
    }
  });
  directionalLights.clear();

  // 环境光强度根据模式调整
  let ambientIntensity = 0.4;
  let directionalIntensity = 1.0;

  switch (lightingMode.value) {
    case "bright":
      ambientIntensity = 0.8;
      directionalIntensity = 1.5;
      break;
    case "soft":
      ambientIntensity = 0.6;
      directionalIntensity = 0.8;
      break;
    case "dramatic":
      ambientIntensity = 0.2;
      directionalIntensity = 2.0;
      break;
    default: // standard
      ambientIntensity = 0.4;
      directionalIntensity = 1.0;
  }

  // 环境光
  ambientLight = new THREE.AmbientLight(0x404040, ambientIntensity);
  scene.add(ambientLight);

  // 根据选择的方向创建方向光
  selectedLightDirections.value.forEach((direction) => {
    const lightConfig =
      lightDirections[direction as keyof typeof lightDirections];
    if (lightConfig) {
      const light = new THREE.DirectionalLight(0xffffff, directionalIntensity);
      light.position.set(
        lightConfig.position[0],
        lightConfig.position[1],
        lightConfig.position[2]
      );
      light.castShadow = true;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;

      if (scene) scene.add(light);
      directionalLights.set(direction, light);
    }
  });
};

// 更新光照
const updateLighting = () => {
  setupLighting();
};

// 更新光照方向
const updateLightDirection = () => {
  setupLighting();
};

// 渲染循环
const animate = () => {
  if (!renderer || !scene || !camera || !controls) return;

  animationId = requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
};

// 加载模型
const loadModel = async () => {
  if (!props.model?.url || !scene) return;

  isLoading.value = true;
  hasError.value = false;
  errorMessage.value = "";
  loadingProgress.value = 0;

  try {
    // 清理旧模型
    if (currentModel) {
      scene.remove(currentModel);
      disposeObject3D(currentModel);
      currentModel = null;
    }

    const loader = new GLTFLoader();

    const onProgress = (progressEvent: ProgressEvent) => {
      if (progressEvent.lengthComputable) {
        loadingProgress.value =
          (progressEvent.loaded / progressEvent.total) * 100;
      }
    };

    const gltf = await new Promise<any>((resolve, reject) => {
      loader.load(props.model!.url, resolve, onProgress, (error) => {
        console.error("GLTFLoader error:", error);
        reject(error);
      });
    });

    currentModel = gltf.scene;
    if (!currentModel) {
      return;
    }
    scene.add(currentModel);

    // 启用阴影
    currentModel.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // 适配模型到视图
    fitModelToView();

    isLoading.value = false;
  } catch (error) {
    console.error("模型加载失败:", error);
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : "未知错误";
    isLoading.value = false;
  }
};

// 让模型适配视图 - 精确修复变形问题
const fitModelToView = () => {
  if (!currentModel || !camera || !controls || !sceneContainer.value) return;

  // 计算模型包围盒
  const box = new THREE.Box3().setFromObject(currentModel);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  // 将模型中心移到原点
  currentModel.position.sub(center);

  // 获取最大尺寸
  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    // 获取容器实际尺寸
    const rect = sceneContainer.value.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    // 确保相机aspect比例正确
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();

    // 计算合适的相机距离
    const fov = camera.fov * (Math.PI / 180);
    const cameraDistance = (maxDim / (2 * Math.tan(fov / 2))) * 2.5;

    // 设置相机位置 - 使用标准化位置
    const cameraPosition = new THREE.Vector3(0.7, 0.5, 0.7);
    cameraPosition.normalize().multiplyScalar(cameraDistance);

    camera.position.copy(cameraPosition);
    controls.target.set(0, 0, 0);
    controls.update();

    // 保存初始状态
    initialCameraPosition = camera.position.clone();
    initialCameraTarget = controls.target.clone();
    initialCameraDistance = cameraDistance;
  }
};

// 重置视图
const resetView = () => {
  if (!camera || !controls || !isReady.value) return;

  if (initialCameraPosition && initialCameraTarget) {
    camera.position.copy(initialCameraPosition);
    controls.target.copy(initialCameraTarget);
  } else {
    camera.position.set(10, 8, 10);
    controls.target.set(0, 0, 0);
  }

  controls.update();
};

// 缩放控制
const zoomIn = () => {
  if (!camera || !controls || !isReady.value) return;

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, controls.target).normalize();
  const distance = camera.position.distanceTo(controls.target);
  const newDistance = Math.max(distance * 0.8, 0.5);

  camera.position
    .copy(controls.target)
    .add(direction.multiplyScalar(newDistance));
  controls.update();
};

const zoomOut = () => {
  if (!camera || !controls || !isReady.value) return;

  const direction = new THREE.Vector3();
  direction.subVectors(camera.position, controls.target).normalize();
  const distance = camera.position.distanceTo(controls.target);
  const newDistance = Math.min(distance * 1.25, 100);

  camera.position
    .copy(controls.target)
    .add(direction.multiplyScalar(newDistance));
  controls.update();
};

// 切换功能
const toggleAutoRotate = () => {
  if (!controls || !isReady.value) return;
  autoRotate.value = !autoRotate.value;
  controls.autoRotate = autoRotate.value;
};

const toggleWireframe = () => {
  if (!currentModel || !isReady.value) return;

  wireframeMode.value = !wireframeMode.value;

  currentModel.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => {
          material.wireframe = wireframeMode.value;
        });
      } else {
        child.material.wireframe = wireframeMode.value;
      }
    }
  });
};

// 处理窗口大小变化 - 精确修复变形问题
const handleResize = () => {
  if (!sceneContainer.value || !camera || !renderer) return;

  // 延迟处理以确保容器尺寸已更新
  nextTick(() => {
    setTimeout(() => {
      const container = sceneContainer.value!;
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width > 0 && height > 0) {
        // 更新相机的纵横比
        camera!.aspect = width / height;
        camera!.updateProjectionMatrix();

        // 更新渲染器大小
        renderer!.setSize(width, height);

        // 如果有模型且有初始距离，重新计算相机位置
        if (currentModel && initialCameraDistance > 0 && controls) {
          // 保持相机的相对方向，重新计算距离以适应新的aspect ratio
          const currentDirection = new THREE.Vector3();
          currentDirection
            .subVectors(camera!.position, controls.target)
            .normalize();

          // 重新计算距离
          const fov = camera!.fov * (Math.PI / 180);
          const box = new THREE.Box3().setFromObject(currentModel);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const newDistance = (maxDim / (2 * Math.tan(fov / 2))) * 2.5;

          // 更新相机位置
          camera!.position
            .copy(controls.target)
            .add(currentDirection.multiplyScalar(newDistance));
          controls.update();

          // 更新保存的距离
          initialCameraDistance = newDistance;
        }
      }
    }, 10);
  });
};

// 全屏控制
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;

  nextTick(() => {
    setTimeout(() => {
      handleResize();
    }, 150);
  });
};

const exitFullscreen = () => {
  isFullscreen.value = false;

  nextTick(() => {
    setTimeout(() => {
      handleResize();
    }, 150);
  });
};

// 重试加载
const retryLoad = () => {
  hasError.value = false;
  errorMessage.value = "";
  if (props.model) {
    loadModel();
  }
};

// 键盘事件处理
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && isFullscreen.value) {
    exitFullscreen();
  }
};

// 监听器
watch(
  () => props.model,
  (newModel) => {
    if (newModel && scene) {
      loadModel();
    }
  },
  { immediate: false }
);

watch(
  () => props.enableMouseZoom,
  (newValue) => {
    if (controls) {
      controls.enableZoom = newValue;
    }
  }
);

// 生命周期
onMounted(() => {
  initScene();

  if (props.model) {
    loadModel();
  }

  window.addEventListener("resize", handleResize);
  window.addEventListener("keydown", handleKeyDown);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  cleanup();
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("click", handleClickOutside);
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
.glb-container {
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

.glb-container.fullscreen {
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
  min-height: 60px;
  flex-wrap: wrap;
  gap: 8px;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.status {
  font-size: 12px;
}

.status.loading {
  color: #3b82f6;
}

.status.error {
  color: #dc2626;
}

.status.ready {
  color: #10b981;
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
  min-width: 36px;
  min-height: 36px;
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

.control-button:hover:not(:disabled) {
  background: #f9fafb;
  color: #374151;
}

.control-button.active {
  background: #3b82f6;
  color: white;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.icon {
  width: 16px;
  height: 16px;
}

.lighting-select {
  padding: 6px 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  border-radius: 6px;
  min-width: 120px;
}

.lighting-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.lighting-select:focus {
  outline: none;
  background: #f9fafb;
}

/* 多选下拉框样式 */
.multi-select-wrapper {
  position: relative;
  min-width: 140px;
}

.multi-select-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 8px;
  border: none;
  background: transparent;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  border-radius: 6px;
  gap: 6px;
}

.multi-select-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.multi-select-button:hover:not(:disabled) {
  background: #f9fafb;
}

.selected-text {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
  flex-shrink: 0;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

.multi-select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 13px;
  color: #374151;
}

.dropdown-option:hover {
  background: #f9fafb;
}

.dropdown-option:first-child {
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.dropdown-option:last-child {
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

.dropdown-option input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.option-text {
  user-select: none;
}

.content-area {
  position: relative;
  height: calc(100% - 60px);
}

.scene-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #fafafa;
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
  background: rgba(255, 255, 255, 0.95);
  color: #6b7280;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #dbeafe;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-progress {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  width: 200px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.2s ease;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
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
  z-index: 10;
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
  z-index: 10;
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

/* 确保 Three.js 画布正确填充容器 */
:deep(canvas) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  cursor: grab;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    min-height: auto;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .model-info {
    text-align: center;
  }

  .control-group {
    flex-wrap: wrap;
  }

  .lighting-select {
    min-width: 100px;
    font-size: 12px;
  }

  .multi-select-wrapper {
    min-width: 120px;
  }

  .multi-select-button {
    font-size: 12px;
  }

  .glb-container {
    height: 400px;
  }

  .content-area {
    height: calc(100% - 140px);
  }
}

/* 打印样式 */
@media print {
  .toolbar {
    display: none;
  }

  .glb-container {
    box-shadow: none;
    border: none;
  }
}
</style>
