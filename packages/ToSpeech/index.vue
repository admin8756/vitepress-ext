<template>
  <div class="text-to-speech">
    <slot
      :isPlaying="isPlaying"
      :currentTime="currentTime"
      :totalTime="totalTime"
      :progress="progress"
      :play="play"
      :pause="pause"
      :toggle="togglePlayPause"
      :setRate="setRate"
      :rate="rate"
      :loading="loading">
      <!-- 默认的方形播放按钮 -->
      <button
        @click="togglePlayPause"
        class="default-play-button"
        :class="{ playing: isPlaying }"
        :disabled="!text || loading">
        <span v-if="loading">⏳</span>
        <span v-else-if="!isPlaying">▶️</span>
        <span v-else>⏸️</span>
      </button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from "vue";

interface Props {
  // 要合成的文本
  text: string;
  // 播放速度
  rate?: number;
  // 音量
  volume?: number;
  // 自动播放
  autoplay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  rate: 1.0,
  volume: 1.0,
  autoplay: false,
});

// 播放状态
const isPlaying = ref(false);
const loading = ref(false);
const currentTime = ref(0); // 当前播放时间（秒）
const totalTime = ref(0); // 总时长（秒）
const rate = ref(props.rate);

// 内部状态
let currentUtterance: SpeechSynthesisUtterance | null = null;
let startTime = 0;
let pausedAt = 0; // 暂停时的时间点
let timeInterval: number | null = null;

// 计算播放进度百分比
const progress = computed(() => {
  if (totalTime.value === 0) return 0;
  return Math.min((currentTime.value / totalTime.value) * 100, 100);
});

// 估算总时长（基于文本长度和语速）
const calculateTotalTime = (text: string, playbackRate: number): number => {
  if (!text?.trim()) return 0;

  // 估算公式：中文每分钟约200字，英文每分钟约150词
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const totalChars = chineseChars + englishWords;

  // 基础速度：每分钟200字，然后除以播放速度
  const baseCharsPerMinute = 200;
  const adjustedCharsPerMinute = baseCharsPerMinute * playbackRate;
  const estimatedMinutes = totalChars / adjustedCharsPerMinute;

  return Math.max(1, Math.ceil(estimatedMinutes * 60)); // 最少1秒
};

// 播放方法
const play = async () => {
  if (!props.text?.trim()) return false;
  if (!speechSynthesis) {
    return;
  }
  try {
    loading.value = true;

    // 如果已经在播放，先停止
    if (currentUtterance) {
      speechSynthesis.cancel();
    }

    // 计算总时长
    totalTime.value = calculateTotalTime(props.text, rate.value);

    // 创建语音合成对象
    currentUtterance = new SpeechSynthesisUtterance(props.text.trim());
    currentUtterance.rate = rate.value;
    currentUtterance.volume = props.volume;
    currentUtterance.pitch = 1.0;

    // 尝试设置合适的语音
    const voices = speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (voice) => voice.lang.includes("zh") || voice.lang.includes("cmn")
      ) || voices.find((voice) => voice.default);

    if (preferredVoice) {
      currentUtterance.voice = preferredVoice;
    }

    // 设置事件监听
    currentUtterance.onstart = () => {
      loading.value = false;
      isPlaying.value = true;
      startTime = Date.now() - pausedAt * 1000; // 考虑之前暂停的时间
      startTimeTracking();
    };

    currentUtterance.onend = () => {
      loading.value = false;
      isPlaying.value = false;
      currentTime.value = totalTime.value;
      stopTimeTracking();
      pausedAt = 0;
      currentUtterance = null;
    };

    currentUtterance.onerror = (event) => {
      loading.value = false;
      isPlaying.value = false;
      stopTimeTracking();

      // 忽略用户中断的错误
      if (event.error !== "interrupted") {
        console.error("语音播放错误:", event.error);
      }

      currentUtterance = null;
    };

    // 开始播放
    speechSynthesis.speak(currentUtterance);
    return true;
  } catch (error) {
    loading.value = false;
    isPlaying.value = false;
    console.error("播放失败:", error);
    return false;
  }
};

// 暂停方法
const pause = () => {
  if (!speechSynthesis) {
    return;
  }
  if (isPlaying.value && speechSynthesis.speaking) {
    speechSynthesis.pause();
    isPlaying.value = false;
    pausedAt = currentTime.value;
    stopTimeTracking();
  }
};

// 恢复播放
const resume = () => {
  if (!speechSynthesis) {
    return;
  }
  if (!isPlaying.value && speechSynthesis.paused) {
    speechSynthesis.resume();
    isPlaying.value = true;
    startTime = Date.now() - pausedAt * 1000;
    startTimeTracking();
  }
};

// 停止方法
const stop = () => {
  if (!speechSynthesis) {
    return;
  }
  speechSynthesis.cancel();
  isPlaying.value = false;
  loading.value = false;
  currentTime.value = 0;
  pausedAt = 0;
  stopTimeTracking();
  currentUtterance = null;
};

// 切换播放/暂停
const togglePlayPause = () => {
  if (!speechSynthesis) {
    return;
  }
  if (!props.text?.trim()) return;

  if (isPlaying.value) {
    pause();
  } else if (speechSynthesis.paused && currentUtterance) {
    resume();
  } else {
    play();
  }
};

// 设置播放速度
const setRate = (newRate: number) => {
  if (newRate < 0.5 || newRate > 3) return;

  const wasPlaying = isPlaying.value;

  // 更新速度
  rate.value = newRate;

  // 重新计算总时长
  totalTime.value = calculateTotalTime(props.text, newRate);

  // 如果正在播放，需要重新开始
  if (wasPlaying) {
    stop();
    setTimeout(() => {
      play();
    }, 200);
  }
};

// 开始时间追踪
const startTimeTracking = () => {
  stopTimeTracking();
  timeInterval = window.setInterval(() => {
    if (isPlaying.value) {
      const elapsed = (Date.now() - startTime) / 1000;
      currentTime.value = Math.min(elapsed, totalTime.value);
    }
  }, 100); // 每100ms更新一次
};

// 停止时间追踪
const stopTimeTracking = () => {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};

// 监听文本变化，重新计算时长
watch(
  () => props.text,
  (newText) => {
    stop(); // 先停止播放
    if (newText?.trim()) {
      totalTime.value = calculateTotalTime(newText, rate.value);
    } else {
      totalTime.value = 0;
    }
    currentTime.value = 0;
    pausedAt = 0;
  },
  { immediate: true }
);

// 监听速度变化
watch(
  () => props.rate,
  (newRate) => {
    if (newRate && newRate !== rate.value) {
      setRate(newRate);
    }
  },
  { immediate: true }
);

// 自动播放
watch(
  () => props.autoplay,
  (shouldAutoplay) => {
    if (shouldAutoplay && props.text?.trim() && !isPlaying.value) {
      setTimeout(() => {
        play();
      }, 500);
    }
  },
  { immediate: true }
);

// 组件卸载时清理
onUnmounted(() => {
  stop();
});

// 暴露方法和状态给父组件
defineExpose({
  // 方法
  play,
  pause,
  resume,
  stop,
  toggle: togglePlayPause,
  setRate,

  // 状态（响应式）
  isPlaying: computed(() => isPlaying.value),
  currentTime: computed(() => currentTime.value),
  totalTime: computed(() => totalTime.value),
  progress: computed(() => progress.value),
  rate: computed(() => rate.value),
  loading: computed(() => loading.value),
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
.dark .control-button:hover {
  background: #cccccc80 !important;
}
.dark .control-group {
  background-color: #000 !important;
}
.text-to-speech {
  display: inline-block;
}

.default-play-button {
  width: 48px;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.default-play-button:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.default-play-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.default-play-button.playing {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.default-play-button.playing:hover {
  background: #2563eb;
  border-color: #2563eb;
}
</style>
