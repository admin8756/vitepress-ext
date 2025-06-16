export function MarkMapPlugin(md: { renderer: { rules: { fence: { (tokens: any, idx: any, options: any, env: any, self: any): any; bind?: any; }; }; }; }) {
  const fence = md.renderer.rules.fence.bind(md.renderer.rules);

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info.trim() === "markmap") {
      const content = encodeURIComponent(token.content);
      return `<MarkMap :content="decodeURIComponent('${content}')" />`;
    }
    return fence(tokens, idx, options, env, self);
  };
}