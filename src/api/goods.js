import requests from '@/utils/requests'

// 获取商品列表
export const reqGoodsList = (data) => requests({
  url: '/goods/list',
  method: 'get',
  params: data
})
// 获取商品信息
export const reqGoodsDetail = (id) => requests({
  url: 'goods/detail',
  method: 'get',
  params: {
    id: id
  }
})

// 获取分类和品牌商
export const reqCatAndBrand = () => requests({
  url: '/goods/catAndBrand',
  method: 'get'
})

// 图片 /storage/create
export const createStorage = () => requests({
  url: '/storage/create',
  method: 'post'
})

// 更新商品
export const reqGoodsUpdate = (data) => requests({
  url: '/goods/update',
  method: 'post',
  data
})

// 删除商品
export const reqGoodsDelete = (data) => requests({
  url: '/goods/delete',
  method: 'post',
  data
})
// 上架商品
export const reqGoodsCreate = (data) => requests({
  url: '/goods/create',
  method: 'post',
  data
})

// 商品评论
export const reqCommentList = (data) => requests({
  url: '/comment/list',
  method: 'get',
  params: data
})

// 回复
export const reqOrderReply = (data) => requests({
  url: '/order/reply',
  method: 'post',
  data
})

// 删除
export const reqCommentDelete = (data) => requests({
  url: '/comment/delete',
  method: 'post',
  data
})
