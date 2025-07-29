<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="user-info">
        <div class="user-top">
          <div class="user-name-icon">
            <span class="user-icon">
              <img
                  src="https://i.pinimg.com/1200x/39/e5/ce/39e5ceffa92b3b691386a20390e666c0.jpg"
                  alt="User Icon"
              />
            </span>
            <h2>{{ username }}</h2>
          </div>
          <button class="edit-button" @click="isEditing ? saveProfile() : toggleEdit()">
            {{ isEditing ? 'Spremi' : 'Uredi profil' }}
          </button>
        </div>

        <div v-if="!isEditing" class="profile-data">
          <p><strong>Ime i prezime:</strong> {{ profile.fullName || '-' }}</p>
          <p><strong>Godina rođenja:</strong> {{ profile.birthYear || '-' }}</p>
          <p><strong>Grad:</strong> {{ profile.city || '-' }}</p>
          <p><strong>Email za kontakt:</strong> {{ profile.contactEmail || '-' }}</p>
          <p><strong>O meni:</strong> {{ profile.bio || '-' }}</p>
        </div>

        <form v-else @submit.prevent="saveProfile" class="edit-form">
          <label>
            Ime i prezime:
            <input type="text" v-model="profile.fullName" placeholder="Unesi ime i prezime" />
          </label>

          <label>
            Godina rođenja:
            <input type="number" v-model.number="profile.birthYear" placeholder="Unesi godinu rođenja" />
          </label>

          <label>
            Grad:
            <input type="text" v-model="profile.city" placeholder="Unesi grad" />
          </label>

          <label>
            Email za kontakt:
            <input type="email" v-model="profile.contactEmail" placeholder="Unesi email" />
          </label>

          <label>
            O meni:
            <textarea v-model="profile.bio" rows="4" placeholder="Napiši nešto o sebi"></textarea>
          </label>
        </form>
      </div>
    </div>
  </div>

  <div class="content-container">
    <div class="recipes-left">
      <div v-if="userRecipes.length === 0">Nema recepata.</div>
      <div v-else class="recipe-list">
        <RecipeCard
            v-for="recipe in userRecipes"
            :key="recipe._id"
            :recipe="recipe"
            :showAuthor="false"
            :editable="true"
            @delete="deleteRecipe"
        />

      </div>
    </div>

    <AddRecipe />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuth } from '@/localStore.js';
import AddRecipe from "@/components/AddRecipe.vue";
import RecipeCard from "@/components/RecipeCard.vue";

const { username, token } = useAuth();

const profile = ref({
  fullName: '',
  birthYear: null,
  city: '',
  contactEmail: '',
  bio: '',
});

const isEditing = ref(false);
const userRecipes = ref([]);

const config = {
  headers: { Authorization: `Bearer ${token.value}` },
};

const fetchProfile = async () => {
  try {
    const res = await axios.get('http://localhost:5010/profile', config);
    if (res.data) {
      profile.value = {
        fullName: res.data.fullName || '',
        birthYear: res.data.birthYear || null,
        city: res.data.city || '',
        contactEmail: res.data.contactEmail || '',
        bio: res.data.bio || '',
      };
    }
  } catch (error) {
    console.error('Greška pri dohvaćanju profila:', error);
  }
};

const fetchUserRecipes = async () => {
  try {
    const res = await axios.get('http://localhost:5010/api/recipes/my-recipes', config);
    userRecipes.value = res.data;
  } catch (error) {
    console.error('Greška pri dohvaćanju korisničkih recepata:', error);
  }
};

onMounted(() => {
  fetchProfile();
  fetchUserRecipes();
});

const toggleEdit = () => {
  isEditing.value = true;
};

const saveProfile = async () => {
  try {
    await axios.post('http://localhost:5010/profile', profile.value, config);
    isEditing.value = false;
    await fetchProfile();
  } catch (error) {
    console.error('Greška pri spremanju profila:', error);
  }
};
const deleteRecipe = async (id) => {
  if (!confirm("Jeste li sigurni da želite obrisati recept?")) return;

  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5010/api/recipes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });


    await fetchUserRecipes(); // osvježi listu recepata nakon brisanja
  } catch (error) {
    console.error("Greška pri brisanju recepta:", error.response?.data?.message || error.message);
  }
};


</script>

<style scoped>
.profile-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.user-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.user-name-icon {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  display: inline-block;
  box-shadow: 0 0 5px rgba(0,0,0,0.15);
  border: 2px solid #8e44ad;
}

.user-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-top h2 {
  font-weight: 700;
  font-size: 2rem;
  margin: 0;
}

.edit-button {
  background-color: #8e44ad;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.edit-button:hover {
  background-color: #732d91;
}

.profile-data p {
  margin: 6px 0;
  font-size: 1.1rem;
}

.edit-form label {
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  font-weight: 600;
  font-size: 1rem;
}

.edit-form input,
.edit-form textarea {
  margin-top: 6px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
}

/* Layout: Recepti lijevo, forma desno */
.content-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.recipes-left {
  flex: 1;
}


/* Responsive za mobitele */
@media (max-width: 900px) {
  .content-container {
    flex-direction: column;
    gap: 30px;
  }

}
</style>
