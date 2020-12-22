// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import api_all from "./api/";
import baseConfig from "./static/config"
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

Vue.prototype.$api = api_all;
Vue.use(ViewUI);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  let d=Math.round(new Date().getTime())
  let s=JSON.parse(window.localStorage.getItem("time"))
//   api_all.api_all.print_token()
  if(d-s>baseConfig.time_last){
       api_all.api_all.remove_token()
  }
  if (to.meta.requireAuth) {
      if (JSON.parse(window.localStorage.getItem("username"))) {  // 通过vuex state获取当前的token是否存在
          next()
      } else {
          alert('登录已失效')
          next({
              path: '/login' //登录路由
          })
      }
  } else {
      next()
  }
})
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});

