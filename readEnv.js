/*
 * @Author: akexian
 * @Date: 2022-06-24
 * @Description: 
 */
const fs = require('fs')
const path = require('path')
module.exports = () => {
  console.log(process.env.NODE_ENV,'node_env')
  const sendName = process.env.NODE_ENV
  let filename = path.join(__dirname, `./.env.${sendName}`)
  try {
    const text = fs.readFileSync(filename, { encoding: 'utf-8' })
    const _text = text.replace(/\r/g, ',').replace(/\n/g, '').replace(/\s*/g, '');
    const arr = _text.split(',').map(item => item.split('='))
    const obj = Object.fromEntries(arr)
    return obj
  } catch (error) {
    return {}
  }
}