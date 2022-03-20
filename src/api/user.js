import request from '@/utils/requests'

// 登录
export const login = (data) => request({
  url: '/auth/login',
  method: 'post',
  data
})

// 用户信息
export function getInfo(token) {
  return request({
    url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getKaptcha() {
  return request({
    url: '/auth/kaptcha',
    method: 'get'
  })
}
