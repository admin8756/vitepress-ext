// Props 定义
interface ModelItem {
  url: string;
  title?: string;
}

interface GLBLoadConfig {
  model?: ModelItem;
  height?: string;
  enableMouseZoom?: boolean;
}
