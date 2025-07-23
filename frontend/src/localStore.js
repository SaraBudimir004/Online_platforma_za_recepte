import { ref } from 'vue';

const token = ref(localStorage.getItem('token') || null);
const role = ref(localStorage.getItem('role') || null);

function login(newToken, newRole) {
    token.value = newToken;
    role.value = newRole;
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
}

function logout() {
    token.value = null;
    role.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
}

function isLoggedIn() {
    return !!token.value;
}

export function useAuth() {
    return { token, role, login, logout, isLoggedIn };
}
console.log('TOKEN U localstore.js:', token.value);

