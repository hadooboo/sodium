const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    clearfield: './examples/clearfield.ts',
    label: './examples/label.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      chunks: ['index'],
      template: './src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'clearfield.html',
      chunks: ['clearfield'],
      template: './src/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'label.html',
      chunks: ['label'],
      template: './src/index.html',
    }),
  ],
  devServer: {
    host: 'localhost',
    port: 5500,
  },
};
