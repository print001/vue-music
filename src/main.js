import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index'
import lazyLoad from 'vue-lazyload'
import store from './store'

fastclick.attach(document.body) // 点击300ms的延迟
Vue.use(lazyLoad, {
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App) // create element 方法
})
