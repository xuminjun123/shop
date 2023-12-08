/*
 * @Author: xmj
 * @Date: 2022-06-27 11:27:18
 */

const TOKENKEY = 'token';
export function getToken() {
  return uni.getStorageSync(TOKENKEY)
}

export function setToken(token: string) {
  uni.setStorageSync(TOKENKEY, token)
}

export function removeToken() {
  uni.removeStorageSync(TOKENKEY)
}
