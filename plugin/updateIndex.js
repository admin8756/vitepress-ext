import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagesDir = path.resolve(__dirname, "..", "packages");
// 需要排除的文件路径
const excludeFile = path.resolve(packagesDir, "index.ts");

// 递归查找所有index.ts文件并排除指定文件
function findAllIndexTsFiles(directory) {
  const files = fs.readdirSync(directory);
  const indexTsFiles = [];
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 如果是目录，递归查找
      indexTsFiles.push(...findAllIndexTsFiles(filePath));
    } else if (file === "index.ts" && filePath !== excludeFile) {
      // 如果是index.ts文件且不是要排除的文件，添加到结果中
      indexTsFiles.push(filePath);
    }
  });
  
  return indexTsFiles;
}

const updateDocPlugin = () => {
  return {
    name: "update-index",
    buildStart() {
      try {
        // 递归查找所有index.ts文件
        const indexTsFiles = findAllIndexTsFiles(packagesDir);
        
        console.log("找到以下index.ts文件:");
        indexTsFiles.forEach(file => {
          console.log(file);
          
          // 这里可以添加处理每个index.ts文件的逻辑
          // 例如读取内容、更新导出语句等
        });
      } catch (error) {
        console.error("读取文件时出错:", error);
      }
    },
  };
};

export default updateDocPlugin;