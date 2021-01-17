import Vue from 'vue';
import Router from "vue-router";

const Home = () => import('views/home/Home')
const Zhuye = () => import('views/zhuye/Zhuye')
const Welcome = () => import('views/welcome/Welcome')
const Users = () => import('views/user/Users')
const Rights = () => import('views/power/Rights')
const Roles = () => import('views/power/Roles')
const Cate = () => import('views/goods/Cate')
const Params = () => import('views/params/Params')
const List = () => import('views/goods/List')
const Add = () => import('views/goods/Add')
const Order = () => import('views/order/Order')
const Report = () => import('views/report/Report')


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '' ,
            redirect:'/login'
        },
        {
            path:'/login',
            component: Home
        },
        {
            path: '/zhuye',
            component: Zhuye,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },
                {
                    path: '/users',
                    component: Users
                },
                {
                    path: '/rights',
                    component: Rights
                },
                {
                    path: '/roles',
                    component: Roles
                },
                {
                    path: '/categories',
                    component: Cate
                },
                {
                    path: '/params',
                    component: Params
                },
                {
                    path: '/goods',
                    component: List
                },
                {
                    path: '/goods/add',
                    component: Add
                },
                {
                    path: '/orders',
                    component: Order
                },
                {
                    path: '/reports',
                    component: Report
                }
            ]
        },

    ],
    mode: 'history'
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to 将要访问的路径
    //from 从哪个路径来
    //next 是一个函数，代表放行 next() next('/login')强制放行
    if(to.path === '/login') return next();
    //获取token
    window.tokenstr = window.sessionStorage.getItem('token')
    if(!tokenstr) return next('/login')
    next()
})

export default router