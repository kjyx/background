import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/usercontrol',
    component: Layout,
    name: 'Usercontrol',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'membre',
        name: 'Membre',
        component: () => import('@/views/usercontrol/member'),
        meta: { title: '会员管理' }
      },
      {
        path: 'address',
        name: 'Address',
        component: () => import('@/views/usercontrol/Address'),
        meta: { title: '收货地址' }
      },
      {
        path: 'collection',
        name: 'Collection',
        component: () => import('@/views/usercontrol/Collection'),
        meta: { title: '会员收藏' }
      },
      {
        path: 'footprint',
        name: 'Footprint',
        component: () => import('@/views/usercontrol/Footprint'),
        meta: { title: '会员足迹' }
      },
      {
        path: 'searchhistory',
        name: 'SearchHistory',
        component: () => import('@/views/usercontrol/SearchHistory'),
        meta: { title: '搜索历史' }
      },
      {
        path: 'feedback',
        name: 'FeedBack',
        component: () => import('@/views/usercontrol/FeedBack'),
        meta: { title: '意见反馈' }
      }
    ]
  },
  {
    path: '/mall',
    component: Layout,
    name: 'Mall',
    meta: { title: '商场管理', icon: 'nested' },
    children: [
      {
        path: 'region',
        name: 'Region',
        component: () => import('@/views/mall/region'),
        meta: { title: '行政区域' }
      },
      {
        path: 'brand',
        name: 'Brand',
        component: () => import('@/views/mall/brand'),
        meta: { title: '品牌制造商' }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/mall/category'),
        meta: { title: '商品类目' }
      },
      {
        path: 'order',
        name: 'Order',
        component: () => import('@/views/mall/order'),
        meta: { title: '订单管理' }
      },
      {
        path: 'aftersale',
        name: 'Aftersale',
        component: () => import('@/views/mall/aftersale'),
        meta: { title: '售后管理' }
      },
      {
        path: 'issue',
        name: 'Issue',
        component: () => import('@/views/mall/issue'),
        meta: { title: '通用问题' }
      },
      {
        path: 'keyword',
        name: 'Keyword',
        component: () => import('@/views/mall/keyword'),
        meta: { title: '关键词' }
      }
    ]
  },

  {
    path: '/goods',
    component: Layout,
    name: 'Goods',
    meta: { title: '商品管理', icon: 'tree' },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/goods/list'),
        meta: { title: '商品列表' }
      },
      {
        path: 'edit',
        name: 'Edit',
        component: () => import('@/views/goods/edit'),
        meta: { title: '商品编辑' },
        hidden: true
      },
      {
        path: 'create',
        name: 'Create',
        component: () => import('@/views/goods/create'),
        meta: { title: '商品上架' }
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import('@/views/goods/comment'),
        meta: { title: '商品评价' }
      }
    ]
  },
  {
    path: '/promotion',
    component: Layout,
    name: 'Promotion',
    meta: { title: '推广管理', icon: 'tree' },
    children: [
      {
        path: 'ad',
        name: 'Ad',
        component: () => import('@/views/promotion/ad'),
        meta: { title: '广告管理' }
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('@/views/promotion/coupon'),
        meta: { title: '优惠卷管理' }
      },
      {
        path: 'topic',
        name: 'Topic',
        component: () => import('@/views/promotion/topic'),
        meta: { title: '专题管理' }
      },
      {
        path: 'groupon-rule',
        name: 'GrouponRule',
        component: () => import('@/views/promotion/groupon-rule'),
        meta: { title: '团购规则' }
      },
      {
        path: 'groupon-activity',
        name: 'GrouponActivity',
        component: () => import('@/views/promotion/groupon-activity'),
        meta: { title: '团购活动' }
      }
    ]
  },

  {
    path: '/sys',
    component: Layout,
    name: 'Sys',
    meta: { title: '系统管理', icon: 'tree' },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/sys/admin'),
        meta: { title: '管理员' }
      },
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/sys/notice'),
        meta: { title: '通知管理' }
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/sys/log'),
        meta: { title: '操作日志' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/sys/role'),
        meta: { title: '角色管理' }
      },
      {
        path: 'os',
        name: 'Os',
        component: () => import('@/views/sys/os'),
        meta: { title: '对象存储' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
