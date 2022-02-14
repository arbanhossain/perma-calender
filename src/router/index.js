import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Calendar from '@/views/Calendar.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/error',
    name: 'Error',
    component: NotFound
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/calendar/:id',
    name: 'Calendar',
    component: Calendar
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
