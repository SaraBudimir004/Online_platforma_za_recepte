<template>
  <NavigationBar :userRole="role"/>

  <div class="search-bar">
    <input
        v-model="searchQuery"
        type="text"
        placeholder="Pretraži recepte po nazivu ili korisniku..."
        @input="currentPage = 1"
    />
  </div>

  <div class="recipes-grid">
    <RecipeCard
        v-for="recipe in paginatedRecipes"
        :key="recipe._id"
        :recipe="recipe"
        :userRole="role"
        @liked="handleLike"
        @commented="handleComment"
    />
  </div>

  <p v-if="filteredRecipes.length === 0">Nema recepata za prikaz.</p>

  <div v-if="filteredRecipes.length > pageSize" class="pagination">
    <button
        :disabled="currentPage === 1"
        @click="currentPage--"
    >
      Prethodna
    </button>

    <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: page === currentPage }"
        @click="currentPage = page"
    >
      {{ page }}
    </button>

    <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
    >
      Sljedeća
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import RecipeCard from './RecipeCard.vue';
import { useAuth } from '../localstore.js';
import NavigationBar from "@/components/NavigationBar.vue";

const recipes = ref([]);
const { token, role } = useAuth();

const searchQuery = ref('');
const currentPage = ref(1);
const pageSize = 9;

async function fetchRecipes() {
  try {
    const headers = token.value
        ? { Authorization: `Bearer ${token.value}` }
        : {}; // prazan objekt ako nema tokena

    const res = await axios.get('http://localhost:5010/api/recipes', {
      headers
    });

    recipes.value = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (err) {
    console.error('Greška pri dohvatu recepata:', err);
  }
}

// Prilagodba recepata da gost ne vidi lajkove i komentare
const displayRecipes = computed(() => {
  if (role.value === 'guest') {
    return recipes.value.map(recipe => ({
      ...recipe,
      likes: [],
      comments: [],
      hasLiked: false,
    }));
  }
  return recipes.value;
});

const filteredRecipes = computed(() => {
  if (!searchQuery.value.trim()) return displayRecipes.value;

  const q = searchQuery.value.toLowerCase();

  return displayRecipes.value.filter(recipe => {
    const titleMatch = recipe.title?.toLowerCase().includes(q);
    const authorName = recipe.author?.username?.toLowerCase() || '';
    const authorMatch = authorName.includes(q);
    return titleMatch || authorMatch;
  });
});

const totalPages = computed(() => Math.ceil(filteredRecipes.value.length / pageSize));

const paginatedRecipes = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredRecipes.value.slice(start, end);
});

// Gost ne može lajkat
async function handleLike(recipeId) {
  if (role.value === 'guest') return;  // gost ne može lajkat

  try {
    await axios.post(`http://localhost:5010/api/recipes/${recipeId}/like`, {}, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    await fetchRecipes();
  } catch (err) {
    console.error('Greška pri lajkanju:', err);
  }
}

// Gost ne može komentirati
async function handleComment(recipeId, commentText) {
  if (role.value === 'guest') return;  // gost ne može komentirati

  try {
    await axios.post(`http://localhost:5010/api/recipes/${recipeId}/comment`, { text: commentText }, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    await fetchRecipes();
  } catch (err) {
    console.error('Greška pri dodavanju komentara:', err);
  }
}

onMounted(() => {
  fetchRecipes();
});
</script>

<style scoped>
.search-bar {
  max-width: 400px;
  margin: 20px auto 30px;
  text-align: center;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px;
  font-size: 0.95rem;
  border-radius: 20px;
  border: 1.3px solid #ccc;
  transition: border-color 0.25s, box-shadow 0.25s;
  box-shadow: none;
}

.search-bar input::placeholder {
  color: #999;
  font-style: italic;
}

.search-bar input:hover {
  border-color: #7a66a1;
}

.search-bar input:focus {
  outline: none;
  border-color: #7a66a1;
  box-shadow: 0 0 6px 1px rgba(122, 102, 161, 0.4);
  background-color: #faf7ff;
}
/* Responzivnost za manje ekrane */
@media (max-width: 600px) {
  .search-bar {
    max-width: 70%;
    margin: 15px auto 25px;
  }

  .search-bar input {
    font-size: 1rem;
    padding: 12px 16px;
  }
}

.recipes-grid {
  display: grid;
  gap: 20px;
  padding: 20px;
  grid-template-columns: repeat(3, 1fr);
  justify-content: center;
}

.recipes-grid > * {
  max-width: 450px;
  width: 80%;
}

@media (max-width: 900px) {
  .recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .recipes-grid {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 15px;
  }

  .recipes-grid > * {
    max-width: 100%;
  }
}

.pagination {
  margin: 20px auto;
  text-align: center;
}

.pagination button {
  background-color: #7a66a1;
  color: white;
  border: none;
  padding: 8px 12px;
  margin: 0 3px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button.active {
  background-color: #4a3671;
}
</style>
