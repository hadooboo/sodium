const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.ts",
    airline1: "./examples/airline1.ts",
    airline2: "./examples/airline2.ts",
    clearfield: "./examples/clearfield.ts",
    label: "./examples/label.ts",
    reverse: "./examples/reverse.ts",
    gamechat: "./examples/gamechat.ts",
    redgreen: "./examples/redgreen.ts",
    translate: "./examples/translate.ts",
    spinner: "./examples/spinner.ts",
    nonegative: "./examples/nonegative.ts",
    add: "./examples/add.ts",
    spinme: "./examples/spinme.ts",
    formvalidation: "./examples/formvalidation.ts",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      chunks: ["index"],
      template: "./src/index.html",
    }),
    new HtmlWebpackPlugin({
      filename: "airline1.html",
      chunks: ["airline1"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "airline2.html",
      chunks: ["airline2"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "clearfield.html",
      chunks: ["clearfield"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "label.html",
      chunks: ["label"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "reverse.html",
      chunks: ["reverse"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "gamechat.html",
      chunks: ["gamechat"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "redgreen.html",
      chunks: ["redgreen"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "translate.html",
      chunks: ["translate"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "spinner.html",
      chunks: ["spinner"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "nonegative.html",
      chunks: ["nonegative"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "add.html",
      chunks: ["add"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "spinme.html",
      chunks: ["spinme"],
      template: "./src/example.html",
    }),
    new HtmlWebpackPlugin({
      filename: "formvalidation.html",
      chunks: ["formvalidation"],
      template: "./src/example.html",
    }),
  ],
  devServer: {
    host: "localhost",
    port: 5500,
  },
};
