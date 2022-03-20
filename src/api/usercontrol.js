import requests from '@/utils/requests'

// 会员管理
export const reqUserList = (data) => requests({
  url: '/user/list',
  method: 'get',
  params: data
})

// 修改信息 user/update
export const reqUserUpdate = (data) => requests({
  url: '/user/update',
  method: 'post',
  data
})

// 搜索
export const reqUserDetail = (data) => requests({
  url: '/user/detail',
  method: 'get',
  params: {
    id: data
  }
})

// 收货地址
export const reqAddressList = (data) => requests({
  url: '/address/list',
  method: 'get',
  params: data
})

// 会员收藏
export const reqCollectionList = (data) => requests({
  url: '/collect/list',
  method: 'get',
  params: data
})

// 会员足迹
export const reqFootprintList = (data) => requests({
  url: '/footprint/list',
  method: 'get',
  params: data
})

//  搜索历史
export const reqHistoryList = (data) => requests({
  url: '/history/list',
  method: 'get',
  params: data
})

// 意见反馈
export const reqFeedBackList = (data) => requests({
  url: '/feedback/list',
  method: 'get',
  params: data
})
