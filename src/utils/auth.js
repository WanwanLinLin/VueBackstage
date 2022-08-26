// import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }


// 本地持久化存储token
export const setToken = (XAPIKEY)=>{
  localStorage.setItem("XAPIKEY", XAPIKEY);
}

// 获取本地存储的token
export const getToken = ()=>{
  return localStorage.getItem("XAPIKEY");
};

// 清除本地存储的token
export const removeToken=()=>{
  localStorage.removeItem("XAPIKEY")
};
