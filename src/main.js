// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// 设置反向代理，前端请求默认发送到 http://localhost:1024/api
var axios = require('axios')
axios.defaults.baseURL = 'http://localhost:1024/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios
Vue.config.productionTip = false

axios.defaults.withCredentials = true


router.beforeEach((to, from, next) => {
  if(to.meta.requireAuth){
    //判断 store 里有没有存储 user 的信息，如果存在，则放行
    if(store.state.user){
      axios.get('/authentication').then(resp => {
        console.log(resp)
        if (resp.data) {
          next()
        }else{
          //否则跳转到登录页面
          //并存储访问的页面路径（以便在登录后跳转到访问页）
          next({
            path:"login",
            query:{
              redirect: to.fullPath
            }
          })
        }
      })
    } else {
      next({
        path: 'login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
}
)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})



