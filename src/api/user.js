import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/acl/index/login',
    method: 'post',
    data
  })
}

export function getInfo(XAPIKEY) {
  return request({
    url: '/admin/acl/index/info',
    method: 'get',
    params: { XAPIKEY }
  })
}

export function logout() {
  return request({
    url: '/admin/acl/index/logout',
    method: 'get'
  })
}
