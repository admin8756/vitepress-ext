
import BBCode from "./BBCode/index.vue";
import MarkMap from "./MarkMap/index.vue";
import Mermaid from "./Mermaid/index.vue";
import GLBLoad from "./GLBLoad/index.vue";
import ImagePreview from "./ImagePreview/index.vue";
import ToSpeech from "./ToSpeech/index.vue";

interface Components {
  BBCode: typeof BBCode;
  MarkMap: typeof MarkMap;
  Mermaid: typeof Mermaid;
  GLBLoad: typeof GLBLoad;
  ImagePreview: typeof ImagePreview;
  ToSpeech: typeof ToSpeech;
}
import BBCodePlugin from "./BBCode/plugin";
import MarkMapPlugin from "./MarkMap/plugin";
import MermaidPlugin from "./Mermaid/plugin";

export { BBCodePlugin, MarkMapPlugin, MermaidPlugin };
export default <Components>{
  BBCode,
  MarkMap,
  Mermaid,
  GLBLoad,
  ImagePreview,
  ToSpeech,
};
