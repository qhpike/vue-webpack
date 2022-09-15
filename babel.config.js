/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const prodPlugins =[
  ['@babel/plugin-proposal-decorators', { legacy: true }],
]
if(process.env.NODE_ENV==='production') {
  prodPlugins.push('babel-plugin-transform-remove-console')
  
}
module.exports = {
  "presets":[
    [
      '@babel/preset-env',
      {
        "useBuiltIns":'usage',
        "corejs" :3
      }
    ],
    '@vue/babel-preset-jsx'
  ],
  plugins:[...prodPlugins]
 
}

