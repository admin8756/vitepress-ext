/**
 * BBCode 编辑器和预览器的配置选项
 */
interface BBCodeConfig {
  /**
   * 组件内容
   * @default ''
   */
  content?: string;
  /**
   * 主题风格
   * @default 'light'
   */
  theme?: 'light' | 'dark';
  /**
   * 容器高度
   * @default '300px'
   */
  height?: string;
}
