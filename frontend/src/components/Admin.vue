<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Lista korisnika</h1>

    <!-- Tablica korisnika -->
    <table class="table-auto border-collapse w-full border border-gray-300">
      <thead>
      <tr class="bg-gray-200">
        <th class="border px-4 py-2">Korisničko ime</th>
        <th class="border px-4 py-2">Email</th>
        <th class="border px-4 py-2">Recepti</th>
        <th class="border px-4 py-2">Ukupno lajkova</th>
        <th class="border px-4 py-2">Ukupno komentara</th>
        <th class="border px-4 py-2">Akcija</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user._id">
        <td
            class="border px-4 py-2 cursor-pointer text-blue-600 hover:underline"
            @click="openUserProfile(user.username)"
        >
          {{ user.username }}
        </td>
        <td class="border px-4 py-2">{{ user.email }}</td>
        <td class="border px-4 py-2">{{ user.recipeCount }}</td>
        <td class="border px-4 py-2">{{ user.totalLikes }}</td>
        <td class="border px-4 py-2">{{ user.totalComments }}</td>
        <td class="border px-4 py-2">
          <button
              @click="deleteUser(user._id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Obriši
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Profil odabranog korisnika s receptima -->
    <div v-if="selectedUser" class="mt-6 p-4 border border-gray-300 rounded">
      <h2 class="text-lg font-bold mb-2">Profil: {{ selectedUser.username }}</h2>
      <p>Email: {{ selectedUser.email }}</p>

      <h3 class="mt-4 font-semibold">Recepti:</h3>
      <div v-if="selectedUser.recipes.length > 0">
        <RecipeCard
            v-for="recipe in selectedUser.recipes"
            :key="recipe._id"
            :recipe="recipe"
            :user-role="userRole"
            :editable="false"
        />
      </div>
      <p v-else>Ovaj korisnik nema recepata.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import RecipeCard from './RecipeCard.vue';

const API_BASE = "http://localhost:5010/auth";

export default {
  components: { RecipeCard },
  data() {
    return {
      users: [],
      selectedUser: null,
      userRole: 'admin',
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.users = res.data;
      } catch (error) {
        console.error("Greška pri dohvaćanju korisnika:", error);
      }
    },
    async deleteUser(userId) {
      if (!confirm("Jeste li sigurni da želite obrisati ovog korisnika?")) return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE}/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchUsers();
      } catch (error) {
        console.error("Greška pri brisanju korisnika:", error);
      }
    },
    async openUserProfile(username) {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE}/users/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.selectedUser = res.data;
      } catch (error) {
        console.error("Greška pri dohvaćanju profila korisnika:", error);
      }
    }
  }
};
</script>
