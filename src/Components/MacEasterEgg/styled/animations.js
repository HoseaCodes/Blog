import { keyframes, createGlobalStyle } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const bootProgress = keyframes`
  from { width: 0%; }
  to   { width: 100%; }
`;

export const MacGlobalStyle = createGlobalStyle`
  .hoseacodes-mac-root {
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Neutralize LocatorJS / dev-tool overlays while the easter egg is mounted. */
  body > iframe[style*="2147483647"],
  body > #locatorjs-wrapper ~ iframe,
  body > #locatorjs-wrapper iframe {
    pointer-events: none !important;
    z-index: -1 !important;
    visibility: hidden !important;
  }
`;
