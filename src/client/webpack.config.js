const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const outputDirectory = "../../dist";

module.exports = {
    stats: "minimal",
    entry: ["babel-polyfill", "./src/client/index.tsx"],
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: "./js/[name].bundle.js"
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.tsx?$/i,
                use: [
                    {
                        loader: "ts-loader"
                    },
                ],
                exclude: /node_modules/
            },
            {
                enforce: "pre",
                test: /\.js$/i,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: "css-loader"
                    },
                ],
            },
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/i,
                loader: "url-loader",
                options: {
                    limit: 100000
                }
            },
        ]
    },
    resolve: {
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".json", ".less"]
    },
    devServer: {
        port: 3000,
        open: false,
        hot: true,
        proxy: {
            "/api/**": {
                target: "http://localhost:8050",
                secure: false,
                changeOrigin: true
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/templates/index.html",
            favicon: "./src/client/templates/favicon.ico",
            title: "express-typescript-react",
        }),
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
            chunkFilename: "./css/[id].css",
        }),
        new CopyPlugin({
            patterns: [
                {from: "./static", to: "static"}
            ],
        }),
    ],
};
