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

// 优惠卷列表
export const reqCouponList = (data) => requests({
  url: '/coupon/list',
  mothod: 'get',
  params: data
})

// 分类 category/list
export const reqCategoryList = (data) => requests({
  url: '/category/list',
  method: 'get',
  data
})
// /goods/list
export const reqGoodsList = (data) => requests({
  url: '/goods/list',
  method: 'get',
  params: {
    limit: data
  }
})

// 优惠卷管理确认编辑
export const reqCouponUpdate = (data) => requests({
  url: '/coupon/update',
  method: 'post',
  data
})
// 添加优惠卷
export const reqCouponCreate = (data) => requests({
  url: '/coupon/create',
  method: 'post',
  data
})

// 删除优惠卷
export const reqCouponDelete = (data) => requests({
  url: '/coupon/delete',
  method: 'post',
  data
})

// 优惠卷详情 /coupon/read
export const reqCouponRead = (data) => requests({
  url: '/coupon/read',
  method: 'get',
  params: {
    id: data
  }
})

// 优惠卷详情 coupon/listuser
export const reqCouponListuser = (data) => requests({
  url: '/coupon/listuser',
  method: 'get',
  params: data
})
