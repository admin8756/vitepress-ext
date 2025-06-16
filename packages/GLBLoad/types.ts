/**
 * GLBLoad 3D模型加载器的配置选项
 */
export interface GLBLoadConfig {
  /**
   * 模型文件路径
   */
  src: string;

  /**
   * 容器宽度
   * @default '100%'
   */
  width?: string;

  /**
   * 容器高度
   * @default '500px'
   */
  height?: string;

  /**
   * 相机视角
   * @default 75
   */
  fov?: number;

  /**
   * 相机近平面
   * @default 0.1
   */
  near?: number;

  /**
   * 相机远平面
   * @default 1000
   */
  far?: number;

  /**
   * 初始相机位置
   * @default { x: 0, y: 0, z: 5 }
   */
  cameraPosition?: {
    x: number;
    y: number;
    z: number;
  };

  /**
   * 是否显示加载动画
   * @default true
   */
  showLoading?: boolean;
}

/**
 * GLBLoad 组件事件
 */
export interface GLBLoadEvents {
  /**
   * 模型加载完成时触发
   */
  onLoad?: () => void;

  /**
   * 模型加载失败时触发
   */
  onError?: (error: Error) => void;
}