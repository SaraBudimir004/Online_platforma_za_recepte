import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Admin from '../pages/Admin.vue';
import Users from "../components/Users.vue";

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/auth', name: 'Login', component: Login },
    { path: '/admin', name: 'Admin', component: Admin },
    { path: '/user', name: 'Users', component: Users },


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
