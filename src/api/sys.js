import requests from '@/utils/requests'

// 获取管理员信息
export const reqAdminList = (data) => requests({
  url: '/admin/list',
  method: 'get',
  params: data
})

// 获取管理员类型
export const reqAdminOptions = () => requests({
  url: '/role/options',
  method: 'get'
})

// 编辑管理员信息
export const reqRedactAdminInfo = (data) => requests({
  url: '/admin/update',
  method: 'post',
  data
})
// 添加管理员
export const reqAddAdmin = (data) => requests({
  url: 'admin/create',
  method: 'post',
  data
})

// 删除管理员
export const reqDetailAdmin = (data) => requests({
  url: '/admin/delete',
  method: 'post',
  data
})

// 角色信息
export const reqRoleList = (data) => requests({
  url: '/role/list',
  method: 'get',
  params: data
})

export const reqRoleUpdate = (data) => requests({
  url: '/role/update',
  method: 'post',
  data
})

// 删除
export const reqRoleDetele = (data) => requests({
  url: '/role/delete',
  method: 'post',
  data
})

// 授权
export const reqRolePermissions = (data) => requests({
  url: '/role/permissions',
  method: 'get',
  params: data
})

// 修改授权 role/permissions
export const reqUpdateAccredit = (data) => requests({
  url: '/role/permissions',
  method: 'post',
  data
})

// 添加管理员
export const reqRoleCreate = (data) => requests({
  url: '/role/create',
  method: 'post',
  data
})

// 操作日志
export const reqLogList = (data) => requests({
  url: '/log/list',
  method: 'get',
  params: data
})

// 对象存储 storage/list
export const reqStorageList = (data) => requests({
  url: '/storage/list',
  method: 'get',
  params: data
})

// 对象存储 编辑
export const reqStorageUpdate = (data) => requests({
  url: '/storage/update',
  method: 'post',
  data
})

// 删除 storage/delete
export const reqStorageDelete = (data) => requests({
  url: '/storage/delete',
  method: 'post',
  data
})

// 通知管理 notice/list
export const reqNoticeList = (data) => requests({
  url: '/notice/list',
  method: 'get',
  data
})
