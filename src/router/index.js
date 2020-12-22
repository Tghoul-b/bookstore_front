import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import VueWechatTitle from 'vue-wechat-title'; 
import main from '@/components/main/main'
import cart from '@/components/cart/cart'
import admin from '@/components/admin/admin'
import iviewArea from 'iview-area';
Vue.use(iviewArea);
Vue.use(VueWechatTitle)
Vue.use(Router);

export default new Router({
    mode:'history',
    base:'/Book/',
    routes: [{
            path: '/login',
            name: 'Login',
            component: Login,
            meta:{title:"登录界面"}
        },{
            path:'/',
            name:'main',
            component:main,
            meta:{title:"书店主页",requireAuth:false}
        },{
            path:'/cart',
            name:'cart',
            component:cart,
            meta:{title:"购物车"}
        },{
            path:'/admin',
            name:'admin',
            component:admin,
            meta:{title:"管理员页面",requireAuth:true}
        }
    ]
    
})
