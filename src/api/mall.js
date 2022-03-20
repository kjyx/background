import requests from '@/utils/requests'

// 行政区域
export const reqRegionList = () => requests({
  url: '/region/list',
  method: 'get'
})
// 品牌制造商
export const reqBrandList = (data) => requests({
  url: '/brand/list',
  method: 'get',
  params: data
})

// 修改成功
export const reqBrandUpdate = (data) => requests({
  url: '/brand/update',
  method: 'post',
  data
})

// 添加
export const reqBrandAdd = (data) => requests({
  url: '/brand/create',
  method: 'post',
  data
})

// 删除
export const reqBrandDelete = (data) => requests({
  url: '/brand/delete',
  method: 'post',
  data
})

// 商品类目
export const reqCategoryList = () => requests({
  url: '/category/list',
  method: 'get'
})

// 一级类目
export const reqCategoryL1 = () => requests({
  url: '/category/l1',
  method: 'get'
})

// 编辑类目
export const reqCategoryUpdate = (data) => requests({
  url: '/category/update',
  method: 'post',
  data
})

// 添加类目
export const reqCategoryCreate = (data) => requests({
  url: '/category/create',
  method: 'post',
  data
})

// 删除类木
export const reqCartgoryDelete = (data) => requests({
  url: '/category/delete',
  method: 'post',
  data
})

