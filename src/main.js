import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import 'common/stylus/index'

fastclick.attach(document.body) // 点击300ms的延迟
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App) // create element 方法
})
