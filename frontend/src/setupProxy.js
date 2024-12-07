// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/google-api",
    createProxyMiddleware({
      target: "https://maps.googleapis.com", // Google API 도메인
      changeOrigin: true,
      pathRewrite: {
        "^/google-api": "", // '/google-api' 경로를 제거
      },
    })
  );
};
