import fs from "node:fs";
import path from "node:path";
import vue from "rollup-plugin-vue";
import { defineConfig } from "rollup";
import { fileURLToPath } from "node:url";
import esbuild from "rollup-plugin-esbuild";
import postcss from "rollup-plugin-postcss";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import updateDoc from "./plugin/updateDoc.js";
import updateIndex from "./plugin/updateIndex.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagesDir = path.resolve(__dirname, "packages");

// 读取并过滤符合规范的组件目录
const components = fs.readdirSync(packagesDir).filter((dir) => {
  const isDir = fs.statSync(path.join(packagesDir, dir)).isDirectory();
  const isPascalCase = /^[A-Z][\w\d]+$/.test(dir);
  const hasVue = fs.existsSync(path.join(packagesDir, dir, "index.vue"));
  const hasReadme = fs.existsSync(path.join(packagesDir, dir, "README.md"));
  const hasTypes = fs.existsSync(path.join(packagesDir, dir, "types.ts"));
  return isDir && isPascalCase && hasVue && hasReadme && hasTypes;
});

// 生成 input 配置项
const input = {
  index: path.join(packagesDir, "index.ts"),
  ...Object.fromEntries(
    components.map((name) => [name, path.join(packagesDir, name, "index.vue")])
  ),
};

export default defineConfig({
  input,
  output: {
    dir: "dist",
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    vue(),
    nodeResolve(),
    commonjs(),
    updateDoc(),
    updateIndex(),
    postcss({ extensions: [".css"], extract: false }),
    esbuild({
      target: "esnext",
      tsconfig: "tsconfig.json",
    }),
  ],
  external: ["vue", "mermaid", "three", "d3", "vue3-photo-preview"],
});
