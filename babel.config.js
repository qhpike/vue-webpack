/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const prodPlugins =[]
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
    ]
  ],
  plugins:[...prodPlugins]
 
}
