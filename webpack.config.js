/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const WebpackBar = require('webpackbar')
const { DefinePlugin  } = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const readEnv = require('./readEnv')
const { resolve } = require('path')
const envirmont = readEnv()
module.exports = env => {
  return {
    entry: {
      main:'./src/index.js'
    },
    output: {
      path:path.resolve(__dirname,'dist'),
      filename:'static/js/[name].[contenthash:6].bundle.js',
      chunkFilename: 'static/js/[name].[chunkhash:6].chunk.js',
      assetModuleFilename:'static/[name].[contenthash].[ext]',
      clean:true,
    },
    mode:env.development ? 'development' : 'production' ,
    devtool: env.development ? 'source-map' : false,
    devServer:{
      port:90,
      static:'./dist',
      hot:true,
    },
    plugins:[
      new HtmlWebpackPlugin({
        title:'my-web-testsss',
        template:'./public/index.html'
      }),
      new MiniCssExtractPlugin({
        filename:'static/css/[name].[contenthash].css',
        // chunkFilename: 'static/cssextract/[id].[contenthash].css'
      }),
      new DefinePlugin({
        BASEURL:"'./'",
        MYURL :JSON.stringify({
          ...envirmont
        })
        
      }),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin(
        {
          patterns:[
            {from:'./public/favicon.ico'},
            {from:'./public/sdk.js'}
          ]
        }
      ),
      new WebpackBar({
        color: env.development ? "#00BFFF" : "#67c23a",  // 默认green，进度条颜色支持HEX
        basic: false,   // 默认true，启用一个简单的日志报告器
        profile:false,  // 默认false，启用探查器。
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: env.report ? 'server' :'disabled', //脚本后面跟reprot可开启analyzer分析
        // generateStatsFile: env.report
      })
    ],
    module: {
      rules:[
        {
          test:/\.css$/i,
          use:[
            {
              loader: env.development ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader:'css-loader',
              options:{
                importLoaders:1,
                esModule:false,
              }
            },
            'postcss-loader'
          ],
          // exclude:path.resolve(__dirname,'./node_modules/element-ui')
        },
        {
          test:/\.scss$/i,
          use:[
            
            {
              loader: env.development ? 'style-loader' : MiniCssExtractPlugin.loader,
            },
            {
              loader:'css-loader',
              options:{
                importLoaders:2,
                esModule:false,
              }
            },
            'postcss-loader',
            'sass-loader',
            {
              loader:'sass-resources-loader',
              options:{
                resources:'./src/styles/var.module.scss'
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/img/[name].[contenthash:6][ext]'
          },
          exclude:resolve('src/icons/svg')
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'static/font/[name].[contenthash:6][ext]'
          }
        },
        {
          test:/\.js$/i,
          loader:'babel-loader',
          exclude:/node_modules/
        },
        {
          test:/\.svg$/i,
          use:[
            {
              loader:'svg-sprite-loader',
              options:{
                symbolId: 'icon-[name]',
              }
            },
          ],
          include:resolve('src/icons/svg')
        },
        {
          test:/\.vue$/i,
          loader:'vue-loader',
          options:{
            loaders:[
            
              {
                loader: env.development ? 'style-loader' : MiniCssExtractPlugin.loader,
              },
              // {
              //   loader:'css-loader',
              //   options:{
              //     importLoaders:1,
              //     esModule:false,
              //   }
              // },
              // 'postcss-loader',
              // 'sass-loader',
              // {
              //   loader:'sass-resources-loader',
              //   options:{
              //     resources:'./src/styles/var.module.scss'
              //   }
              // }
            ]
          }
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
         element: {
           test: /[\\/]node_modules[\\/]element-ui[\\/]/,
           name: 'element',
           chunks: 'all',
           priority:10
         },
         vue: {
           test: /[\\/]node_modules[\\/]vue[\\/]/,
           name: 'vue',
           chunks: 'all',
           priority:10
         },
         vuex: {
          test: /[\\/]node_modules[\\/]vuex[\\/]/,
          name: 'vuex',
          chunks: 'all',
          priority:10
        },
       },
     },
    },
    performance: {
      hints: "warning", // 枚举
      maxAssetSize: 20000000, // 整数类型（以字节为单位）
      maxEntrypointSize: 30000000, // 整数类型（以字节为单位）
    },
    resolve:{
      fallback: {
        path:require.resolve('path-browserify')
      },
      alias:{
        '@':path.resolve(__dirname,'src/')
      },
      extensions: [".js", ".json", ".jsx", ".css",".vue"],
    },
    stats:'all'
  }
}