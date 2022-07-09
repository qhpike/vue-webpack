/*
 * @Author: akexian
 * @Date: 2022-06-23
 * @Description: 
 */
const pxtorem = require('postcss-pxtorem')
module.exports = {
  plugins:[require('postcss-preset-env'),
//   pxtorem({
//       rootValue: 192, 
//       propList: ['*'],
//       selectorBlackList: ['.norem', 'var.scss'] 
//   })
          ],
// "plugins": [
    //   [
    //     "@babel/plugin-transform-runtime",
    //     {
    //       "corejs": 3
    //     }
    //   ]
    // ]
}