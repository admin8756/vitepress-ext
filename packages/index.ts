export * from "./BBCode";
export * from "./MarkMap";
export * from "./Mermaid";
export * from "./GLBLoad";
export * from "./ImagePreview";
export * from "./ToSpeech";

import { BBCode } from "./BBCode";
import { MarkMap } from "./MarkMap";
import { Mermaid } from "./Mermaid";
import { GLBLoad } from "./GLBLoad";
import { ImagePreview } from "./ImagePreview";
import { ToSpeech } from "./ToSpeech";

interface Components {
  BBCode: typeof BBCode;
  MarkMap: typeof MarkMap;
  Mermaid: typeof Mermaid;
  GLBLoad: typeof GLBLoad;
  ImagePreview: typeof ImagePreview;
  ToSpeech: typeof ToSpeech;
}
import { BBCodePlugin } from "./BBCode/plugin";
import { MarkMapPlugin } from "./MarkMap/plugin";
import { MermaidPlugin } from "./Mermaid/plugin";

export { BBCodePlugin, MarkMapPlugin, MermaidPlugin };
export default <Components>{
  BBCode,
  MarkMap,
  Mermaid,
  GLBLoad,
  ImagePreview,
  ToSpeech,
};
