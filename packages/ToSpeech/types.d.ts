/**
 * ToSpeech 配置选项
 */
interface ToSpeechConfig {
  // 要合成的文本
  text: string;
  // 播放速度
  rate?: number;
  // 音量
  volume?: number;
  // 自动播放
  autoplay?: boolean;
}
