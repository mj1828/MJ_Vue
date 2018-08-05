// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import md5 from 'js-md5'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import store from './store/store'
import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import {loginRequest} from './utils/api'

Vue.prototype.$http = axios
Vue.prototype.$MD5 = md5
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.loginRequest = loginRequest;
Vue.config.productionTip = false

Vue.use(element)
Vue.use(mavonEditor)

router.beforeEach((to,from,next) => {
  console.log(localStorage.getItem('userName'))
  console.log(to.name)
  if (localStorage.getItem('userName') == null && to.path !== '/') {
    next('/')
  } else if(localStorage.getItem('userName') != null && to.path == '/') {
    next('/content')
  }else{
    console.log('测试')
    next()
  }
})

router.afterEach((to,from,next) => {
  window.scrollTo(0, 0)
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
