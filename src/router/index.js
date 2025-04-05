import { createRouter, createWebHistory } from 'vue-router';

// Import view components
const Home = () => import('../views/Home.vue');
const Program = () => import('../views/Program.vue');
const Question = () => import('../views/Question.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/programs/:id',
    name: 'Program',
    component: Program,
    props: true
  },
  {
    path: '/questions/:id',
    name: 'Question',
    component: Question,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router; 