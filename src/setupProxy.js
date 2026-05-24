const { createProxyMiddleware } = require('http-proxy-middleware');

// CRA's default proxy heuristic serves the SPA shell for any request with
// Accept: text/html — which breaks address-bar visits to non-API backend
// routes like /sitemap.xml. Force-proxy crawler-facing paths to Express.
module.exports = function (app) {
  app.use(
    ['/sitemap.xml', '/robots.txt'],
    createProxyMiddleware({
      target: 'http://localhost:3003',
      changeOrigin: true,
    })
  );
};
