/* eslint-env node */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 1. プラグインを読み込む
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 1. 読み込み

module.exports = {
  mode: 'development',
  entry: './src/js/script.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // 出力前に dist フォルダを綺麗にする（おすすめ！）
  },
  devServer: {
    static: 'dist', // どのフォルダを公開するか
    open: true, // 起動時にブラウザを自動で開く
    hot: true, // 変更箇所だけを賢く更新する（Hot Module Replacement）
  },
  module: {
    rules: [
      // 2. TypeScript用のルールを追加
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 2. style-loaderからこれに差し替え！
          'css-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // node_modules内は翻訳不要なので除外
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]], //target:["web","es5"],じゃなくてよい
          },
        },
      },
    ],
  },
  // 拡張子の解決設定を追加（重要！）
  // これにより、import時に .ts や .js を省略できるようになります
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new MiniCssExtractPlugin({
      // 3. 出力するCSSのファイル名を指定
      filename: 'style.css',
    }),
  ],
  devtool: 'source-map',
}
