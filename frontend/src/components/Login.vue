<template>
  <div class="wrapper">
    <div class="auth-container">
      <h2>{{ isRegistering ? 'Registracija' : 'Prijava' }}</h2>

      <div v-if="message" :class="['alert', alertType]">{{ message }}</div>

      <div class="form-wrapper">
        <form v-if="isRegistering" @submit.prevent="registerUser">
          <input v-model="username" type="text" placeholder="Korisničko ime" required />
          <input v-model="email" type="email" placeholder="Email (gmail.com)" required />
          <input v-model="password" type="password" placeholder="Lozinka" required />
          <button type="submit">Registriraj se</button>
          <button @click.prevent="toggleForm" class="link-button">Već imaš račun? Prijavi se</button>
        </form>

        <form v-else @submit.prevent="loginUser">
          <input v-model="username" type="text" placeholder="Korisničko ime" required />
          <input v-model="password" type="password" placeholder="Lozinka" required />
          <select v-model="selectedRole">
            <option value="user">Korisnik</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Prijava</button>
          <button @click.prevent="toggleForm" class="link-button">Nemate račun? Registrirajte se</button>
        </form>
      </div>

      <div class="guest-login">
        <button @click="guestLogin" class="link-button">Prijava kao gost</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Import useAuth iz localstore.js
import { useAuth } from '../localstore.js';

const { login } = useAuth();

const username = ref('');
const email = ref('');
const password = ref('');
const isRegistering = ref(false);
const selectedRole = ref('user');
const message = ref('');
const alertType = ref('');

const router = useRouter();

const toggleForm = () => {
  isRegistering.value = !isRegistering.value;
  message.value = '';
  alertType.value = '';
  username.value = '';
  email.value = '';
  password.value = '';
};

const registerUser = async () => {
  try {
    const res = await axios.post('http://localhost:5010/user/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    });
    message.value = res.data.message || 'Registracija uspješna!';
    alertType.value = 'success';
    setTimeout(() => {
      toggleForm();
    }, 2000);
  } catch (err) {
    message.value = err.response?.data?.message || 'Greška pri registraciji.';
    alertType.value = 'error';
  }
};

const loginUser = async () => {
  try {
    const url =
        selectedRole.value === 'admin'
            ? 'http://localhost:5010/auth/admin-login'
            : 'http://localhost:5010/user/login';

    const res = await axios.post(url, {
      username: username.value,
      password: password.value,
    });

    // Koristi funkciju login iz useAuth da postaviš token i rolu
    login(res.data.token, selectedRole.value,username.value);

    message.value = res.data.message || 'Prijava uspješna!';
    alertType.value = 'success';

    setTimeout(() => {
      if (selectedRole.value === 'admin') router.push('/admin');
      else router.push('/user');
    }, 2000);
  } catch (err) {
    message.value = err.response?.data?.message || 'Greška pri prijavi.';
    alertType.value = 'error';
  }
};

const guestLogin = async () => {
  try {
    const res = await axios.post('http://localhost:5010/guest/login');

    login(res.data.token, 'guest','Gost');

    message.value = res.data.message || 'Prijava kao gost uspješna!';
    alertType.value = 'success';

    setTimeout(() => {
      router.push('/user');
    }, 2000);
  } catch (err) {
    message.value = err.response?.data?.message || 'Greška pri prijavi gosta.';
    alertType.value = 'error';
  }
};
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-container {
  max-width: 400px;
  padding: 30px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(98, 79, 130, 0.2);
}

input,
select {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #624f82;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.link-button {
  background: none;
  border: 2px solid #624f82;
  color: #624f82;
  padding: 10px;
  margin-top: 10px;
  width: 100%;
  border-radius: 4px;
  cursor: pointer;
}

.alert {
  margin: 10px 0;
  padding: 10px;
  border-radius: 4px;
}

.alert.success {
  background: #d4edda;
  color: #155724;
}

.alert.error {
  background: #f8d7da;
  color: #721c24;
}

.guest-login {
  margin-top: 20px;
}
</style>
