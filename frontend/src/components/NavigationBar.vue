<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="nav-left">
        <router-link to="/" class="nav-logo">Online platforma za recepte</router-link>
      </div>

      <div class="nav-right">
        <!-- Ako nije gost -->
        <div v-if="userRole !== 'guest'" class="dropdown">
          <div class="dropdown-toggle">
            <img
                src="https://i.pinimg.com/1200x/39/e5/ce/39e5ceffa92b3b691386a20390e666c0.jpg"
                alt="Korisnik"
                class="profile-image"
                @click="toggleDropdown"
            />
          </div>

          <div v-if="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item" custom v-slot="{ navigate }">
              <div @click="navigate" class="dropdown-item-inner">Moj profil</div>
            </router-link>
            <div class="dropdown-item dropdown-item-inner" @click.stop="logout">Odjava</div>
          </div>
        </div>

        <!-- Ako je gost -->
        <div v-else>
          <img
              src="https://i.pinimg.com/736x/80/53/35/80533507ddc858ee867df16958669bea.jpg"
              alt="Gost"
              class="profile-image"
              @click="handleGuestClick"
              title="Registrirajte se za više funkcija"
              style="cursor: pointer;"
          />
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const { userRole } = defineProps({
  userRole: {
    type: String,
    required: true
  }
});

const showDropdown = ref(false);
const router = useRouter();

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const logout = () => {
  window.location.href = "http://localhost:5177/";
};

const handleGuestClick = () => {
  alert("Registrirajte se ili prijavite se da biste mogli koristiti više funkcija.");
  router.push('/');
};
</script>

<style scoped>
.navbar {
  background-color: #7a66a1;
  padding: 1rem 2rem;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-left .nav-logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-right {
  position: relative;
  display: flex;
  align-items: center;
}

.profile-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}

.profile-image:hover {
  transform: scale(1.05);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 60px;
  background-color: white;
  color: #333;
  border-radius: 10px;
  min-width: 230px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  z-index: 999;
  overflow: hidden;
  padding: 0.5rem 0;
}

.dropdown-item-inner {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #4a4a4a;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.25s ease;
}

.dropdown-item-inner:hover {
  background-color: #f4effb;
}

.dropdown-item:hover {
  background-color: #f4effb;
}
</style>
