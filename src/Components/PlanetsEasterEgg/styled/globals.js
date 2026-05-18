import { createGlobalStyle } from 'styled-components';

/*
 * Neutralize LocatorJS / dev-tool overlays while the Planets easter egg is mounted.
 * They inject a full-viewport iframe at z-index: 2147483647 that captures every click,
 * which sits above our overlay (z-index: 99) and blocks all interactions.
 */
export const PlanetsGlobalStyle = createGlobalStyle`
  body > iframe[style*="2147483647"],
  body > #locatorjs-wrapper ~ iframe,
  body > #locatorjs-wrapper iframe {
    pointer-events: none !important;
    z-index: 99 !important;
    visibility: hidden !important;
  }
`;
