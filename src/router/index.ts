import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'

// 1. Define your routes
const routes = [
  {
    path: '/',
    name: 'task',
    component: TaskView,
  },
  {
    path: '/about-props',
    name: 'about-props',
    // Lazy loading: This loads the component only when the user visits the page
    component: () => import('@/views/AboutProps.vue'),
  },
]

// 2. Create the router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 3. Export the router so it can be used in main.js
export default router
