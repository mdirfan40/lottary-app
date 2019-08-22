import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router)

const router = new Router({

  routes: [
    //  {
    //    path: '*',
    //    redirect: '/'
    //  },
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dashboard',
      name: 'dashboard',
       children: [{
           path: '',
           name: 'dahsHome',
            component: () => import( /* webpackChunkName: "about" */ './views/Dashboard.vue')
         },
         {
           path: 'time',
           name: 'time',
           component: () => import( /* webpackChunkName: "about" */ './views/Time.vue')
         },
           {
             path: 'users',
             name: 'users',
             component: () => import( /* webpackChunkName: "about" */ './views/Users.vue')
           },
          {
            path: 'provider',
            name: 'provider',
            component: () => import( /* webpackChunkName: "about" */ './views/Provider.vue')
          },
         {
           path: 'result',
           name: 'result',
           component: () => import( /* webpackChunkName: "about" */ './views/Result.vue')
         }
       ],
      component: () => import( /* webpackChunkName: "about" */ './views/DashboardMain.vue'),
       meta: {
         requiresAuth: true,
         admin: true
       },
    },
    {
      path:'/main-result',
      name:'mainResult',
      component: () => import( /* webpackChunkName: "mainreuslt" */ './views/MainResult.vue')
    },
    {
      path: '/user/:id',
      name: 'userDashboard',
      meta: {
       requiresAuth: true,
       admin: false 
      },
      children:[
        {   
            path:'',
            name:'userhome',
            component: () => import( /* webpackChunkName: "dashboard" */ './views/UserDashboard.vue')
        },
         {
           path: 'order',
           name:'order',
           component: () => import( /* webpackChunkName: "order" */ './views/Order.vue')
         }
      ],
      component: () => import( /* webpackChunkName: "userhome" */ './views/UserHome.vue')
    },

    

    {
      path: '/login',
      name: 'login',
      component: () => import( /* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import( /* webpackChunkName: "register" */ './views/Register.vue')
    },
     
  ]
})

router.beforeEach((to, from, next) => {
 
  let user = JSON.parse(window.localStorage.getItem('auth'));
  to.matched.some(record => {
      if (record.name === 'login' || record.name === 'register') {
          if (user && !user.admin) {
               next({
                path: `/user/${user.uid}`,
                 params: {
                   nextUrl: to.fullPath
                 }
               })
          }else{
             if (user && user.admin) {
               next({
                 path: `/dashboard`,
                 params: {
                   nextUrl: to.fullPath
                 }
               })
             }
          }

          next()

      }

      if (record.name === 'userDashboard') {
       
          if (to.matched.some(record => record.meta.requiresAuth) && !to.matched.some(record => record.meta.admin)) {
            if(user && !user.admin) {
              next();
            } else {

              next({
                path: '/login',
                params: {
                  nextUrl: to.fullPath
                }
              })
            }
          }
      }

      if (record.name === 'home') {
          if (user && !user.admin) {
            next({
              path: `/user/${user.uid}`,
              params: {
                nextUrl: to.fullPath
              }
            });
          } else {
            next()
          }
      }

       if (record.name === 'dashboard') {
         if (to.matched.some(record => record.meta.requiresAuth) && to.matched.some(record => record.meta.admin)) {
           if (user && user.admin) {
             next();
           } else {
             next({
               path: '/login',
               params: {
                 nextUrl: to.fullPath
               }
             })
           }
         }
       }
  })

  next();
});

export default router;
