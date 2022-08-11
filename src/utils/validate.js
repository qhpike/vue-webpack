/*
 * @Author: akexian
 * @Date: 2022-08-11
 * @Description: 
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}