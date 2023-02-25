const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.ts",
    petrolpump: "./chapter4/PetrolPump.ts",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|webp|wav)$/,
        use: "file-loader",
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
      filename: "petrolpump.html",
      chunks: ["petrolpump"],
      template: "./src/example.html",
    }),
  ],
  devServer: {
    host: "localhost",
    port: 5500,
  },
};
