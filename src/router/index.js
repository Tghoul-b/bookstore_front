import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import VueWechatTitle from 'vue-wechat-title'; 
import main from '@/components/main/main'
import iviewArea from 'iview-area';
Vue.use(iviewArea);
Vue.use(VueWechatTitle)
Vue.use(Router);

export default new Router({
    mode:'history',
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{title:"登录界面"}
        },{
            path:'/',
            name:'main',
            component:main,
            meta:{title:"书店主页",requireAuth:true}
        }
    ]
    
})
