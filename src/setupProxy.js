const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA's default proxy heuristic serves the SPA shell for any request with
// Accept: text/html — which breaks address-bar visits to non-API backend
// routes (sitemap, LinkedIn OAuth, etc). This file force-proxies a fixed list
// of paths to Express regardless of Accept header.
//
// Using pathFilter (v3 explicit form) instead of app.use(paths, ...) because
// the latter wasn't matching reliably for LinkedIn OAuth navigation.
const PROXY_PATHS = [
  '/sitemap.xml',
  '/robots.txt',
  '/api/admin/linkedin/connect',
  '/api/admin/linkedin/callback',
];

module.exports = function (app) {
  // TEMP DEBUG — confirms setupProxy.js was loaded by CRA at startup.
  console.log('[setupProxy] loaded; proxying paths:', PROXY_PATHS);

  app.use(
    createProxyMiddleware({
      target: 'http://localhost:3003',
      changeOrigin: true,
      pathFilter: (pathname) => {
        const match = PROXY_PATHS.some(
          (p) => pathname === p || pathname.startsWith(p + '?') || pathname.startsWith(p + '/')
        );
        // TEMP DEBUG — log every request the proxy considers and whether it matched.
        console.log(`[setupProxy] ${match ? 'MATCH' : 'skip '} ${pathname}`);
        return match;
      },
    })
  );
};
