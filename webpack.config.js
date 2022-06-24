/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')
const { DefinePlugin  } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const readEnv = require('./readEnv')
const envirmont = readEnv('development')
console.log(typeof envirmont.VUE_APP_HOSPITAL_SERVER,'objisany')
module.exports = (env,argv) => {
  return {
    entry: {
      index:'./src/index.js'
    },
    output: {
      path:path.resolve(__dirname,'dist'),
      filename:'static/js/[name].[contenthash:6].js',
      assetModuleFilename:'static/[name].[contenthash].[ext]',
      clean:true,
    },
    mode:env.development ? 'development' : 'production' ,
    devtool: env.development ? 'source-map' : false,
    devServer:{
      static:'./dist',
      hot:false,
    },
    plugins:[
      new HtmlWebpackPlugin({
        title:'my-web-test',
        template:'./public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename:'static/style/[name].[contenthash].css'
      }),
      new DefinePlugin({
        BASEURL:"'./'",
        BASEHEAD:envirmont.VUE_APP_SMS_SERVER
        // "process.env" :{
        //   ...envirmont
        // }
        
      }),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin(
        {
          patterns:[
            {from:'./public/favicon.ico'}
          ]
        }
      ),
      new WebpackBar({
        color: env.development ? "#00BFFF" : "#67c23a",  // 默认green，进度条颜色支持HEX
        basic: false,   // 默认true，启用一个简单的日志报告器
        profile:false,  // 默认false，启用探查器。
      })
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
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/img/[name].[contenthash:6][ext]'
          }
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
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
    },
    resolve:{
      alias:{
        '@':path.resolve(__dirname,'src/')
      }
    }
  }
}