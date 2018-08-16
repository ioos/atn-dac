const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const helpFiles = new Promise(function(resolve, reject) {
  const fs = require('fs');

  var retFiles = [];
  var files = fs.readdir('./src/help', function(err, files) {
    if (err !== null) {
      reject(err);
    }

    files.forEach(function(f) {
      if (f.endsWith(".fjson") && f !== "genindex.fjson" && f !== "search.fjson") {
        var tokenName = f.substring(0, f.length - 6),
          pathName = (tokenName === "index") ? "" : tokenName + "/";

        retFiles.push(new HtmlWebpackPlugin({
          filename: 'help/' + pathName + 'index.html',
          template: 'src/help/' + f,
          inject: false,
        }));
      }
    });

    resolve(retFiles);
  });
});

const config = {
  mode: 'development',
  entry: {
    app: './src/app.js',
    //bootstrap: 'bootstrap/dist/css/bootstrap.min.css',
    atnstyle: './css/atn.scss',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.fjson$/,
        use: [
          'html-loader?attrs=false',
          {
            loader: path.resolve('help-json-loader.js'),
            options: {
              template: 'src/help-templ.pug',
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: ['html-loader?attrs=false', 'pug-html-loader'],
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader', // inject CSS into page
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          },
          {
            loader: 'postcss-loader', // run post css actions
            options: {
              plugins: function() {
                // post css plugins
                return [require('precss'), require('autoprefixer')];
              },
            },
          },
          {
            loader: 'sass-loader', // compiles sass to CSS
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.pug',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'data/index.html',
      template: 'src/data/index.pug',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'map/index.html',
      template: 'src/map/index.pug',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'about/index.html',
      template: 'src/about/index.pug',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'help/index.html',
      template: 'src/help/index.pug',
      inject: false,
    }),
    new CopyWebpackPlugin([{from: 'images/*'}]),
    new CopyWebpackPlugin([{from: 'src/help/_images/*', to: 'help/_images/', flatten: true}]),
  ],
};

const configPromise = new Promise(function(resolve, reject) {
  helpFiles.then(function(files) {
    //reject(files);
    config.plugins = config.plugins.concat(files);
    resolve(config);
  }).catch(function(err) {
    reject(err);
  });
});

module.exports = configPromise;
