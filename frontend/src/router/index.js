import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Admin from '../pages/Admin.vue';
import Users from "../components/Users.vue";
import Profile from "../components/Profile.vue";

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/auth', name: 'Login', component: Login },
    { path: '/admin', name: 'Admin', component: Admin },
    { path: '/user', name: 'Users', component: Users },
    { path: '/profile', name: 'Profile', component: Profile },
    { path: '/user/:id', name: 'UserProfile',
        component: () => import('@/components/Profile.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
