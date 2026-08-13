export const macTheme = {
  bg: {
    menuBar: 'rgba(75, 85, 99, 0.4)',
    menuBarSolid: 'rgb(55, 65, 81)',
    menuBorder: 'rgba(107, 114, 128, 0.6)',
    dock: 'rgba(255, 255, 255, 0.1)',
    dockBorder: 'rgba(255, 255, 255, 0.2)',
    windowChrome: 'rgba(64, 64, 64, 0.85)',
    windowBg: '#1e1e1e',
    windowContent: '#1c1c1e',
    contextMenu: 'rgba(60, 60, 60, 0.95)',
    boot: '#000000',
    trafficClose: '#ff5f57',
    trafficMin: '#febc2e',
    trafficMax: '#28c840',
    blue: '#0a84ff',
    blueHover: '#0066d4',
    selectionBlue: 'rgba(10, 132, 255, 0.85)',
  },
  text: {
    white: '#ffffff',
    primary: '#f5f5f7',
    secondary: 'rgba(255, 255, 255, 0.75)',
    muted: 'rgba(255, 255, 255, 0.45)',
    dark: '#1d1d1f',
  },
  shadow: {
    window: '0 16px 60px rgba(0, 0, 0, 0.5)',
    menu: '0 12px 32px rgba(0, 0, 0, 0.4)',
    dock: '0 10px 30px rgba(0, 0, 0, 0.4)',
  },
  font: {
    base: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  menuBarHeight: '24px',
  dockHeight: '64px',
  assetBase: '/mac/images',
};

export const macAsset = (relativePath) => {
  const path = relativePath.replace(/^\.?\//, '').replace(/^images\//, '');
  return `${macTheme.assetBase}/${path}`;
};
