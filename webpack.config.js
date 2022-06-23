/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
module.exports = (env) => {
  return {
    entry: {
      index:'./src/index.js'
    },
    output: {
      path:path.resolve(__dirname,'dist'),
      filename:'[name].[contenthash:6].js',
      assetModuleFilename:'static/[name].[contenthash].[ext]',
      clean:true,
    },
    mode:env.development ? 'development' : 'production',
    devtool: env.development ? 'source-map' : false,
    plugins:[
      new HtmlWebpackPlugin({
        title:'my-web-test',
        template:'./public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename:'static/style/[name].[contenthash].css'
      }),
      new DefinePlugin({
        BASEURL:"'./'"
      }),
      new VueLoaderPlugin()
    ],
    module: {
      rules:[
        {
          test:/\.css$/i,
          use:[
            MiniCssExtractPlugin.loader,
            {
              loader:'css-loader',
              options:{
                importLoaders:1,
                esModule:false,
              }
            },
            'postcss-loader'
          ]
        },
        {
          test:/\.scss$/i,
          use:[
            MiniCssExtractPlugin.loader,
            {
              loader:'css-loader',
              options:{
                importLoaders:1,
                esModule:false,
              }
            },
            'postcss-loader',
            'sass-loader',
            {
              loader:'sass-resources-loader',
              options:{
                resources:'./src/styles/var.scss'
              }
            }
          ]
        },
        {
          test:/\.js$/i,
          loader:'babel-loader',
          exclude:path.resolve(__dirname,'node_modules')
        },
        {
          test:/\.vue$/i,
          loader:'vue-loader'
        }
      ]
    }
  }
}