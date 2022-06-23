/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const pxtorem = require('postcss-pxtorem')
module.exports = {
  plugins:[require('postcss-preset-env'),
  pxtorem({
      rootValue: 37.5, 
      propList: ['*'],
      selectorBlackList: ['.norem', 'var.scss'] 
  })
]
}