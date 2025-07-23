<template>
  <div class="wrapper">
    <div class="intro-container">
      <h1>Online platforma za recepte</h1>
      <p>Pronađi inspiraciju za kuhanje, podijeli svoje recepte i poveži se s drugima koji vole kuhati.</p>
      <button @click="goToLogin">Započni</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/auth');
};
</script>

<style scoped>
.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('https://i.pinimg.com/736x/cb/1d/9f/cb1d9f37f6ffb351e7a57707e80a3fb4.jpg') no-repeat center center fixed;
  background-size: cover;
}

.intro-container {
  max-width: 500px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(98, 79, 130, 0.2);
}

h1 {
  margin-bottom: 20px;
  color: #333;
}

p {
  margin-bottom: 30px;
  color: #555;
  font-size: 1.1rem;
}

button {
  padding: 14px 30px;
  background: #624f82;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.3s ease;
}

button:hover {
  background: #7a66a1;
}
</style>
