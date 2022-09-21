const {createProxyMiddleware} = require("http-proxy-middleware");
const proxy = {
    target: "http://localhost:81",
    changeOrigin: false
};
module.exports = function (app) {
    app.use(
        "/events",
        createProxyMiddleware(proxy)
    );
};
