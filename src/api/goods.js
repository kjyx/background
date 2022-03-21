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
