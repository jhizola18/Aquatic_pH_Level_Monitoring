import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue'; // Make sure the path is correct
import SensorStore from '../components/SensorStore.vue'; // Make sure the path is correct

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/sensor-store',
    name: 'SensorStore',
    component: SensorStore,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
