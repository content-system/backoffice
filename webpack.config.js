const webpack = require("webpack"),
  path = require("path"),
  BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = {
  target: "node",
  entry: "./server.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        // include: [path.resolve(__dirname, 'src')],
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname),
  },
  plugins: [new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ }), new BundleAnalyzerPlugin()],
}
