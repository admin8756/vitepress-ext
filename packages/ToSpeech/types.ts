/**
 * ToSpeech 配置选项
 */
export interface ToSpeechConfig {
  /**
   * 组件内容
   * @default ''
   */
  content?: string;
  /**
   * 主题风格
   * @default 'light'
   */
  theme?: "light" | "dark";
  /**
   * 容器高度
   * @default '300px'
   */
}
