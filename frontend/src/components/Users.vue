<template>
  <div>
    <h1>Recepti</h1>
    <p>Ukupno recepata: {{ recipes.length }}</p>

    <RecipeCard
        v-for="recipe in recipes"
        :key="recipe._id"
        :recipe="recipe"
        @liked="handleLike"
        @commented="handleComment"
    />

    <p v-if="recipes.length === 0">Nema recepata za prikaz.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import RecipeCard from './RecipeCard.vue';
import { useAuth } from '../localstore.js';

const recipes = ref([]);
const { token } = useAuth();

async function fetchRecipes() {
  try {
    const res = await axios.get('http://localhost:5010/api/recipes', {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    recipes.value = res.data;
  } catch (err) {
    console.error('Greška pri dohvatu recepata:', err);
  }
}

async function handleLike(recipeId) {
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

async function handleComment(recipeId, commentText) {
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
