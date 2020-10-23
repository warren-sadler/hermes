const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const ClosurePlugin = require("closure-webpack-plugin");

module.exports = {
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: path.resolve(__dirname, "./src/index.ts"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "./dist"),
  },
  optimization: {
    minimize: true,
    minimizer: [
      new ClosurePlugin({ mode: "STANDARD" }),
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
};
