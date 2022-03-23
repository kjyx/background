import requests from '@/utils/requests'
// 广告管理
export const reqAdList = (data) => requests({
  url: '/ad/list',
  method: 'get',
  params: data
})

// 修改
export const reqAdUpdate = (data) => requests({
  url: '/ad/update',
  method: 'post',
  data
})

// 添加
export const reqAdCreate = (data) => requests({
  url: '/ad/create',
  method: 'post',
  data
})

// 删除
export const reqAdDelete = (data) => requests({
  url: '/ad/delete',
  method: 'post',
  data
})
