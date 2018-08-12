import Vue from 'vue'
import Router from 'vue-router'
import adminlogin from '@/components/admin/login'

import mj_main from '@/components/admin/common/main'
import mj_content from '@/components/admin/common/content'

import readme from '@/components/admin/readme'

// 用户
import mj_user from '@/components/admin/system/user/user'
// 菜单
import mj_menu from '@/components/admin/system/menu/menu'
//角色
import mj_role from '@/components/admin/system/role/role'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: adminlogin
    },
    {
      path: '/content',
      name: 'content',
      component: mj_content
    },
    // 系统管理
    {
      path: '/yhgl',
      name: 'yhgl',
      component: mj_user
    },
    {
      path: '/cdgl',
      name: 'cdgl',
      component: mj_menu
    },
    {
      path: '/jsgl',
      name: 'jsgl',
      component: mj_role
    },
    //直播管理
    {
      path: '/ltsgl',
      name: 'ltsgl',
      component: mj_content
    },
    {
      path: '/readme',
      name: 'readme',
      component: readme
    }
  ]
})
