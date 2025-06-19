import { defineConfig } from "vitepress";
import {
  BBCodePlugin,
  MarkMapPlugin,
  MermaidPlugin,
} from "../../dist/index.js";
export default defineConfig({
  title: "VitePress Plugin Ext",
  description: "强大的VitePress增强插件集合",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "BBCode", link: "/BBCode" },
      { text: "MarkMap", link: "/MarkMap" },
      { text: "Mermaid", link: "/Mermaid" },
      { text: "GLBLoad", link: "/GLBLoad" },
      { text: "ImagePreview", link: "/ImagePreview" },
      { text: "ToSpeech", link: "/ToSpeech" },
      { text: "About", link: "/About" },
    ],
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "Copyright © 2025-present leelaa",
    },
    sidebar: [
      {
        text: "示例",
        items: [
          { text: "BBCode 示例", link: "/BBCode" },
          { text: "MarkMap 示例", link: "/MarkMap" },
          { text: "Mermaid 示例", link: "/Mermaid" },
          { text: "GLBLoad 示例", link: "/GLBLoad" },
          { text: "ImagePreview 示例", link: "/ImagePreview" },
          { text: "ToSpeech 示例", link: "/ToSpeech" },
        ],
      },
    ],
  },
  vite: {
    plugins: [],
  },
  markdown: {
    breaks: true,
    lineNumbers: true,
    config: (md) => {
      BBCodePlugin(md);
      MarkMapPlugin(md);
      MermaidPlugin(md);
    },
  },
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/vue3-photo-preview@0.3.0/dist/index.css",
      },
    ],
  ],
});
