import { keyframes, createGlobalStyle } from 'styled-components';

export const closeWindow = keyframes`
  0% {
    opacity: 1;
    transform: translate(var(--window-transform-x, 0px), var(--window-transform-y, 0px)) scale(1);
    visibility: visible;
  }
  100% {
    opacity: 0;
    transform: translate(var(--window-transform-x, 0px), var(--window-transform-y, 0px)) scale(0.85);
    visibility: hidden;
  }
`;

export const scaleAppImage = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    visibility: visible;
  }
  to {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
    visibility: hidden;
  }
`;

export const transformDownShow = keyframes`
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0px); opacity: 1; }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const blink = keyframes`
  to { visibility: hidden; }
`;

export const UbuntuGlobalStyle = createGlobalStyle`
  .hoseacodes-ubuntu-root {
    --window-transform-x: 0px;
    --window-transform-y: 0px;
    font-family: 'Ubuntu', system-ui, -apple-system, sans-serif;
  }

  /*
   * Neutralize dev-tool overlays (LocatorJS et al.) that inject a
   * full-viewport iframe at z-index: 2147483647 and capture every click.
   * Scoped: only active while the Ubuntu easter egg is mounted, so it
   * doesn't affect normal dev experience outside the overlay.
   */
  body > iframe[style*="2147483647"],
  body > #locatorjs-wrapper ~ iframe,
  body > #locatorjs-wrapper iframe {
    pointer-events: none !important;
    z-index: -1 !important;
    visibility: hidden !important;
  }
`;
