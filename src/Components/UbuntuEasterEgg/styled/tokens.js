export const ubuntuTheme = {
  bg: {
    grey: '#111111',
    warmGrey: '#AEA79F',
    coolGrey: '#333333',
    orange: '#E95420',
    liteAbrgn: '#77216F',
    medAbrgn: '#5E2750',
    drkAbrgn: '#2C001E',
    windowTitle: '#201f1f',
    geditDark: '#021B33',
    geditLight: '#003B70',
    geditDarker: '#010D1A',
    contextMenu: 'rgb(43, 43, 43)',
  },
  text: {
    grey: '#F6F6F5',
    warmGrey: '#AEA79F',
    coolGrey: '#333333',
    blue: '#3465A4',
    green: '#4E9A06',
    geditOrange: '#F39A21',
    geditBlue: '#50B6C6',
    geditDark: '#003B70',
  },
  border: {
    orange: '#E95420',
  },
  shadow: {
    window: '1px 4px 12px 4px rgba(0, 0, 0, 0.2)',
  },
  font: {
    base: "'Ubuntu', system-ui, -apple-system, sans-serif",
    mono: "'Ubuntu Mono', Menlo, Monaco, 'Courier New', monospace",
  },
  navbarHeight: '28px',
  sidebarWidth: '60px',
  assetBase: '/ubuntu',
};

export const asset = (relativePath) => {
  const path = relativePath.replace(/^\.?\//, '');
  return `${ubuntuTheme.assetBase}/${path}`;
};
