import DefaultTheme from 'vitepress/theme'
import './style.css'
import {
  Mermaid,
  MarkMap,
  ImagePreview,
  GLBLoad,
  BBCode,
  ToSpeech
} from "../../../dist/index.js";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册组件
    app.component('BBCode', BBCode)
    app.component('GLBLoad', GLBLoad)
    app.component('MarkMap', MarkMap)
    app.component('Mermaid', Mermaid)
    app.component('ImagePreview', ImagePreview)
    app.component('ToSpeech', ToSpeech)
  }
}