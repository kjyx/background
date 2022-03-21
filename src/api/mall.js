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

// 订单管理
export const reqOrderList = (data) => requests({
  url: '/order/list',
  method: 'get',
  params: data
})

// 快递列表 order/channel
export const reqOrderChannel = function() {
  return requests({
    url: '/order/channel',
    method: 'get'
  })
}

// 售后管理
export const reqAftersaleList = (data) => requests({
  url: '/aftersale/list',
  method: 'get',
  params: data
})

// 通用问题
export const reqIsssueList = (data) => requests({
  url: '/issue/list',
  method: 'get',
  params: data
})

// 编辑问题
export const reqIssueUpdate = (data) => requests({
  url: '/issue/update',
  method: 'post',
  data
})

// 添加问题
export const reqIssueAdd = (data) => requests({
  url: '/issue/create',
  method: 'post',
  data
})

// 山粗问题
export const reqIssueDelete = (data) => requests({
  url: '/issue/delete',
  method: 'post',
  data
})

// 关键词
export const reqKeywordList = (data) => requests({
  url: '/keyword/list',
  mrthod: 'get',
  params: data
})

// 编辑关键词
export const reqKetwordUpdate = (data) => requests({
  url: '/keyword/update',
  method: 'post',
  data
})

// 添加关键词
export const reqKeywordCreate = (data) => requests({
  url: '/keyword/create',
  method: 'post',
  data
})
// 删除关键词
export const reqkeywordDelete = (data) => requests({
  url: '/keyword/delete',
  method: 'post',
  data
})
