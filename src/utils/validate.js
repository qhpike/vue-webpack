/*
 * @Author: akexian
 * @Date: 2022-08-11
 * @Description: 
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const reg = /^\w{6,}$/
  return reg.test(str)
}
export function validPhone(phone) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone.trim())
}