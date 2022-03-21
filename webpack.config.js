var path = require('path');
var webpack = require('webpack'); // 調用 webpack 棤組，給 ProvidePlugin 功能加入設定使用

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('[name].css');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

console.log("__dirname", __dirname)
console.log('resolve:', path.resolve(__dirname, './src'));
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, './src'),
  entry: {
    main: 'main',
    index: 'assets/js/index',
    card: 'assets/js/card',
  },
  /** Webpack 前端打包工具 - 依照指定環境挑選適合的 SourceMap 類型
   * https://awdr74100.github.io/2020-04-02-webpack-devtool/
   * 'source-map', // 只有此類型的 sourcemap 完全支援
   * 'hidden-source-map' / cheap-module-source-map / source-map
   */
  devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-source-map' : 'false',
  output: {
    path: path.resolve(__dirname, process.env.NODE_ENV === 'development' ? 'dist' : 'docs'),
    filename: './assets/js/[name].js?[hash:8]',
  },
  /**
   * webpack 說我們會自行載入外部的 jQuery，這樣就可以執行 webpack 正常通過了。
   * https://ithelp.ithome.com.tw/articles/10187554
   * https://webpack.docschina.org/configuration/externals/
   */
  // externals: {
  //   jquery: 'jQuery',
  // },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
    // splitChunks: {
    //   chunks: 'all'
    // },
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/scss'),
      path.resolve('src/assets'),
      path.resolve('node_modules'),
    ],
    alias: {
      // 給 vue指定了一個別名. 代碼中使用到了 vue, 那麼會去找 node_module/vue/dist/vue.esm.js 文件進行編譯
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['.js'],
  },
  devServer: {
    host: '127.0.0.1',
    port: 3001,
    stats: {
      assets: true, // 加入資源訊息
      cached: false, // 加入暫存（但未建構）模塊的信息
      chunkModules: false, // 將建構模塊信息加入到 chunk 信息
      chunkOrigins: false,
      chunks: false, // 加入 chunk 訊息（設置為 `false` 能允許較少的冗长輸出）
      colors: true, // 等同 `webpack --colors`
      hash: false, // 加入 compilation 的hash
      modules: false, // 加入建構模塊訊息
      reasons: false, // 加入模塊被引入的原因
      source: false,
      version: false, // 加入 webpack 版本信息
      warnings: false, // 加入警告
    },
    /**
     * Reloading [WDS] Disconnected! Fix
     * 官方文件：https://webpack.docschina.org/configuration/dev-server/
     * https://github.com/webpack/webpack-dev-server/issues/2199#issuecomment-522800528
     * https://www.jianshu.com/p/85c0eb8f3b0f
     * https://andyyou.github.io/2015/07/23/webpack/
     */
    open:
      // false,
      {
        app: [
          // 指定開啟瀏覽器 only one
          // 'Google Chrome',
          // 'Firefox',
          'Firefox Developer Edition',
          // '--incognito', // 無痕模式
          '--other-flag',
        ],
      },
    overlay: {
      warnings: true,
      errors: true,
    }, // 編譯器錯誤或警告時全屏覆蓋
    hot: false, // webpack 模块熱替換
    inline: true, // false 瀏覽器路徑多 /webpack-dev-server/ 與狀態列 App ready.
    noInfo: true, //  --no-info option
    // liveReload: false,
    writeToDisk: true, // 檔案形式輸出 dev-server 程式碼，設定 false 內容只會在記憶體中不會有實體檔案
    compress: true, // 啟用 gzip 壓縮，預設 false
  },
  module: {
    rules: [
      // {
      //   test: /\.css$/,
      //   // use: extractCSS.extract(['css-loader', 'postcss-loader']),
      //   include: path.resolve('src/css'),
      //   exclude: path.resolve('./node_modules'),
      // },
      {
        test: /\.(sass|scss)$/,
        use: extractCSS.extract([
          {
            loader: 'css-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // 開啟 sourcemap 支持
            },
          },
        ]),
        include: path.resolve('src/scss'),
        exclude: path.resolve('./node_modules'),
      },
      {
        test: /\.(js)$/,
        use: 'babel-loader',
        include: path.resolve('.'),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[path][name].[ext]?[hash:8]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV === 'production' ? false : true,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
        include: path.resolve('src/assets/images'),
        exclude: path.resolve('./node_modules'),
      },
      {
        // 自定義安裝字型檔
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]?[hash:8]',
        },
        include: path.resolve('src/assets'),
        exclude: path.resolve('./node_modules'),
      },
    ],
  },

  plugins: [
    extractCSS,

    /* 不處理直接搬圖片 ----------------------------------------------------------------- */
    /**
     * webpack 的 url-loader 以 image-webpack-loader 處理小於 8192 尺寸大小，將小圖直接使用 base64 方式包入 main.css 中。
     * 如果直接使用 main.js 注入圖片，透過 image-webpack-loader 也無法用於 .html 檔中。.html 等相關站台內取用圖片，使用此設定直接將圖片不以 lorader 方式處理。
     */
    new CopyWebpackPlugin([
      {
        from: 'assets/static-images/',
        to: 'assets/static-images/',
      },
    ]),
    /* 不處理直接搬圖片 ----------------------------------------------------------------- */

    /* 字體與 iconFont ---------------------------------------------------- */
    /**
     * 分別指向對應的 src (源碼) 與 dist (打包編譯檔)，Scss 處理時二邊都需要相同。
     * Scss 在處理編譯時，取用到 woff, woff2, ttf, eot 檔會透上 lile-loader 進行 src (源碼) 讀取
     * lile-loader 讀取後會輸出字型檔在 dist (打包編譯檔)，產生檔案讓瀏覽器取用字型
     */

    // fortawesome
    new CopyWebpackPlugin([
      {
        from: '../node_modules/@fortawesome/fontawesome-free/webfonts',
        to: '../src/assets/fonts/fontawesome-free',
      },
    ]),
    /* /字體與 iconFont ---------------------------------------------------- */

    /* HTML 樣版 ------------------------------------------------------------------ */
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'htmlTemplate/template_1.html',
      chunks: ['vendor', 'main', 'index'],
      minify: {
        collapseWhitespace: false, // true HTML 壓成單行
        removeComments: true, // 刪除註解
        removeRedundantAttributes: true, // 刪除多餘的屬性
        removeScriptTypeAttributes: true, // 刪除腳本類型屬性
        removeStyleLinkTypeAttributes: true, // 刪除樣式鏈接類型屬性
        useShortDoctype: true, // 使用簡短的文檔類型
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'card.html',
      template: 'htmlTemplate/template_2.html',
      chunks: ['vendor', 'main', 'card'],
      minify: {
        collapseWhitespace: false, // true HTML 壓成單行
        removeComments: true, // 刪除註解
        removeRedundantAttributes: true, // 刪除多餘的屬性
        removeScriptTypeAttributes: true, // 刪除腳本類型屬性
        removeStyleLinkTypeAttributes: true, // 刪除樣式鏈接類型屬性
        useShortDoctype: true, // 使用簡短的文檔類型
      },
    }),
    /* /HTML 樣版 ------------------------------------------------------------------ */
  ],
};
