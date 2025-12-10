import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'
import Home from './pages/Home.vue'
import Statictic from './pages/Statistic.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/stats', component: Statictic }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')





