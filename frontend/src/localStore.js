import { ref } from 'vue';

const token = ref(localStorage.getItem('token') || null);
const role = ref(localStorage.getItem('role') || null);
const username = ref(localStorage.getItem('username') || null);

function login(newToken, newRole, newUsername) {
    token.value = newToken;
    role.value = newRole;
    username.value = newUsername;
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('username', newUsername);
}

function logout() {
    token.value = null;
    role.value = null;
    username.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
}

function isLoggedIn() {
    return !!token.value;
}

export function useAuth() {
    return { token, role, username, login, isLoggedIn };
}
