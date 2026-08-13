// VS Code-style palette ported from the giant portfolio template.
export const vsTokens = {
  yellow: '#D9E577',
  blue: '#389fdc',
  lightblue: '#85d8fb',
  brown: '#d98e73',
  bg: {
    sidebar: '#262526',
    main: '#1e1e1e',
    tabBar: '#424042',
    hover: '#2b2a2a',
    panel: '#1e1e1e',
  },
  text: {
    primary: '#e6f1ff',
    secondary: '#a2aabc',
    muted: '#6b7280',
  },
  font: {
    mono: '"SF Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  assetBase: '/portfolio-template',
};

export const ptAsset = (relative) =>
  `${vsTokens.assetBase}/${relative.replace(/^\.?\//, '')}`;
