const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
            loader: path.resolve('test-loader.js'),
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
    new CopyWebpackPlugin([{from: 'images/*'}]),
    new HtmlWebpackPlugin({
      filename: 'help/index.html',
      template: 'src/help/index.fjson',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'help/contact-us/index.html',
      template: 'src/help/contact-us.fjson',
      inject: false,
    }),
    new HtmlWebpackPlugin({
      filename: 'help/submit-data/index.html',
      template: 'src/help/submit-data.fjson',
      inject: false,
    }),
  ],
};

module.exports = config;
