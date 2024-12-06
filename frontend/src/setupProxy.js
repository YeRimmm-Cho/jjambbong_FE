const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/google-api",
    createProxyMiddleware({
      target: "https://maps.googleapis.com",
      changeOrigin: true,
      pathRewrite: {
        "^/google-api": "", // "/google-api" 경로를 Google API 경로로 변경
      },
    })
  );
};
