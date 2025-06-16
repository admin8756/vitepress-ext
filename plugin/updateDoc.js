import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 组件目录
const packagesDir = path.resolve(__dirname, "..", "packages");
// 文档目录
const targetExamplesDir = path.resolve(__dirname, "..", "examples");
// 首页目录
const indexMdPath = path.resolve(__dirname, "..", "examples", "index.md");
// 递归查找所有.md文件
function findAllMdFiles(directory) {
  const files = fs.readdirSync(directory);
  const mdFiles = [];

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 如果是目录，递归查找
      mdFiles.push(...findAllMdFiles(filePath));
    } else if (file.endsWith(".md")) {
      // 如果是.md文件，添加到结果中
      mdFiles.push(filePath);
    }
  });

  return mdFiles;
}
/**
 * 复制单个md文件到目标目录，并用它的一级父目录名重命名
 * @param {string} filePath 源md文件完整路径
 * @param {string} targetDir 目标目录
 */
function copyMdFileWithDirName(filePath, targetDir) {
  // 取一级父目录名
  const dirs = filePath.split(path.sep);
  // 例如路径为 F:\项目\vitepress-leelaa-ext\packages\BBCode\README.md
  // 取到 BBCode 目录
  const pkgIndex = dirs.findIndex((d) => d === "packages");
  if (pkgIndex === -1 || pkgIndex + 1 >= dirs.length) {
    console.warn(`路径格式异常，无法取一级目录名: ${filePath}`);
    return;
  }
  const firstLevelDir = dirs[pkgIndex + 1];

  // 目标文件名: 目标目录/一级目录名.md
  const targetFile = path.join(targetDir, `${firstLevelDir}.md`);

  // 复制文件
  fs.copyFileSync(filePath, targetFile);
  console.log(`复制 ${filePath} => ${targetFile}`);
}
/**
 * 根据 md 文件列表自动生成 index.md，使用 YAML 中 features 数组格式定义卡片
 * @param {string[]} mdFiles - md 文件绝对路径列表
 * @param {string} outputPath - 输出 index.md 完整路径
 */
function generateIndexMd(mdFiles, outputPath) {
  const dirMap = new Map();

  mdFiles.forEach((file) => {
    const dirName = path.basename(path.dirname(file));
    if (!dirMap.has(dirName)) {
      dirMap.set(dirName, []);
    }
    dirMap.get(dirName).push(file);
  });
  const emojiMap = {
    BBCode: "📝",
    Mermaid: "🐟",
    ToSpeech: "🔊",
    MarkMap: "🧠",
    GLBLoad: "🧱",
    ImagePreview: "🖼️",
    Inquirer: "❓",
    // ToSpeech: "🎵",
  };

  // 生成 features 数组
  const features = [];
  for (const [dirName] of dirMap) {
    features.push({
      icon: emojiMap[dirName] || "🧩",
      title: dirName,
      details: `查看 ${dirName} 组件的使用示例和文档，点击进入。`,
      link: `/${dirName}/`,
    });
  }

  // 转成 YAML 格式字符串（兼容缩进）
  function toYamlArray(arr) {
    return arr
      .map((item) => {
        return [
          "- icon: " +
            (item.icon.includes("/") ? `\n    src: ${item.icon}` : item.icon),
          `  title: ${item.title}`,
          `  details: ${item.details}`,
          `  link: ${item.link}`,
        ].join("\n");
      })
      .join("\n");
  }

  const frontmatter = `---
layout: home
hero:
  name: "VitePress Plugin Ext"
  text: "增强 VitePress 的功能与用户体验"
  tagline: 将 VitePress 变成的更强大，只需几分钟
  image:
    src: https://vitepress-ext.leelaa.cn/logo.png
    alt: VitePress
  actions:
    - theme: brand
      text: 查看示例
      link: /BBCode
    - theme: alt
      text: 在GitHub上
      link: https://github.com/admin8756/vitepress-plugin-extended
    - theme: alt
      text: 在npm上
      link: https://www.npmjs.com/package/@leelaa/vitepress-plugin-extended
features:
${toYamlArray(features).replace(/^/gm, "  ")}  
---`;

  // 页面主体内容
  const content = `${frontmatter}\n\n`;

  fs.writeFileSync(outputPath, content, "utf-8");
  console.log(`index.md 已生成到：${outputPath}`);
}

const updateDocPlugin = () => {
  return {
    name: "update-doc",
    buildStart() {
      try {
        // 递归查找所有.md文件
        const mdFiles = findAllMdFiles(packagesDir);
        mdFiles.forEach((file) => {
          copyMdFileWithDirName(file, targetExamplesDir);
        });
        generateIndexMd(mdFiles, indexMdPath);
      } catch (error) {
        console.error("读取文件时出错:", error);
      }
    },
  };
};

export default updateDocPlugin;
