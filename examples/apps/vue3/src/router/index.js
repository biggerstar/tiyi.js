import {createRouter, createWebHashHistory, createWebHistory} from "vue-router";


const routes = [
  {
    path:'/',
    redirect:'page'
  },
  {
    path:'/page',
    component: ()=> import('../components/Page.vue')
  },
  {
    path:'/page1',
    component: ()=> import('../components/Page1.vue')
  },
  {
    path:'/page2',
    component: ()=> import('../components/Page2.vue')
  },
]




const router = createRouter({
  routes:routes,
  history:createWebHistory('/')
  // history:createWebHashHistory( )
})

export default router






