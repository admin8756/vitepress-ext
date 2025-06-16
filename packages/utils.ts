// 下载内容

export const downloadFunc = (url: string, name: string) => {
  if (document) {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  } else {
    console.log("未知环境");
  }
};
