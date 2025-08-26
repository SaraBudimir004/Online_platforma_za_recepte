<template>
  <div class="p-4">
    <h1 class="text-xl font-bold mb-4">Lista korisnika</h1>

    <!-- Tablica korisnika -->
    <div class="table-container">
      <table class="table-auto border-collapse w-full border border-gray-300">
        <thead>
        <tr class="bg-gray-200">
          <th class="border px-4 py-2">Korisničko ime</th>
          <th class="border px-4 py-2">Email</th>
          <th class="border px-4 py-2">Recepti</th>
          <th class="border px-4 py-2">Ukupno lajkova</th>
          <th class="border px-4 py-2">Ukupno komentara</th>
          <th class="border px-4 py-2">Brisanje korisnika</th>
        </tr>
        </thead>
        <tbody>
        <!-- Filtriramo da se admini ne prikazuju -->
        <tr v-for="user in users.filter(u => u.role !== 'admin')" :key="user._id">
          <td class="border px-4 py-2" data-label="Korisničko ime" @click="openUserProfile(user.username)">
            {{ user.username }}
          </td>
          <td class="border px-4 py-2" data-label="Email">{{ user.email }}</td>
          <td class="border px-4 py-2" data-label="Recepti">{{ user.recipeCount }}</td>
          <td class="border px-4 py-2" data-label="Ukupno lajkova">{{ user.totalLikes }}</td>
          <td class="border px-4 py-2" data-label="Ukupno komentara">{{ user.totalComments }}</td>
          <td class="border px-4 py-2" data-label="Brisanje korisnika">
            <button
                @click="deleteUser(user._id)"
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Obriši korisnika
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Profil odabranog korisnika s receptima -->
    <div v-if="selectedUser" class="selected-user mt-6 p-4 border border-gray-300 rounded shadow-md bg-white">
      <h2 class="text-lg font-bold mb-2">Profil: {{ selectedUser.username }}</h2>
      <p class="mb-2">Email: {{ selectedUser.email }}</p>

      <h3 class="mt-4 font-semibold mb-2">Recepti:</h3>
      <div v-if="selectedUser.recipes.length > 0">
        <RecipeCard
            v-for="recipe in selectedUser.recipes"
            :key="recipe._id"
            :recipe="recipe"
            :user-role="userRole"
            :editable="true"
            @delete="handleDeleteRecipe"
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
        await axios.delete(`${API_BASE}/users/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchUsers();
        if (this.selectedUser && this.selectedUser._id === userId) this.selectedUser = null;
        alert("Korisnik i njegovi recepti su obrisani.");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Greška pri brisanju korisnika.");
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
        console.error(error);
        alert(error.response?.data?.message || 'Greška pri dohvaćanju profila.');
      }
    },
    async handleDeleteRecipe(recipeId) {
      if (!confirm('Jeste li sigurni da želite obrisati ovaj recept?')) return;
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE}/recipe/${recipeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (this.selectedUser) this.openUserProfile(this.selectedUser.username);
        alert('Recept je obrisan.');
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Greška pri brisanju recepta.');
      }
    }
  }
};
</script>

<style scoped>
/* Glavni stil za Admin stranicu */
.p-4 {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #f5f0ff;
}

h1 {
  font-size: 2rem;
  color: #5b2e8a;
  text-align: center;
  margin-bottom: 30px;
}

/* Tablica korisnika */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(122, 77, 163, 0.12);
}

thead tr {
  background-color: #f3e8ff;
  color: #5b2e8a;
  font-weight: 600;
}

th, td {
  padding: 12px 15px;
  text-align: left;
}

tbody tr {
  transition: transform 0.2s ease, background-color 0.2s ease;
  cursor: pointer;
}

tbody tr:hover {
  background-color: #fdf0ff;
  transform: translateY(-2px);
}

/* Dugmad akcija */
button {
  font-weight: 500;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
}

/* Profil odabranog korisnika */
.selected-user {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 18px rgba(122, 77, 163, 0.12);
  margin-top: 30px;
}

/* Responsivnost tablice */
@media (max-width: 768px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    display: none;
  }

  tbody tr {
    margin-bottom: 20px;
    border-radius: 12px;
    padding: 16px;
    background-color: #fdf6ff;
    box-shadow: 0 4px 12px rgba(122, 77, 163, 0.08);
  }

  td {
    display: flex;
    justify-content: space-between;
    text-align: left;
    padding: 8px 12px;
    border: none;
    position: relative;
  }

  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #5b2e8a;
    margin-right: 10px;
  }

  td:last-child {
    justify-content: flex-start;
    flex-direction: column;
  }

  button {
    margin-top: 8px;
  }
}

@media (max-width: 480px) {
  .selected-user {
    padding: 16px;
  }

  td {
    padding: 6px 10px;
  }
}
</style>
