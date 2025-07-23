<template>
  <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <img :src="recipe.image" alt="Slika recepta" style="max-width: 300px;" />
    <p>{{ recipe.description }}</p>

    <div>
      <button @click="toggleLike">
        {{ recipe.hasLiked ? 'Unlike' : 'Like' }} ({{ recipe.likes.length }})
      </button>
    </div>

    <div>
      <input v-model="commentText" placeholder="Dodaj komentar" />
      <button @click="submitComment">Komentiraj</button>
    </div>

    <div>
      <h4>Komentari:</h4>
      <ul>
        <li v-for="comment in recipe.comments" :key="comment._id">
          <strong>{{ comment.user.username }}:</strong> {{ comment.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recipe: Object
});
const emit = defineEmits(['liked', 'commented']);

const commentText = ref('');

function toggleLike() {
  emit('liked', props.recipe._id);
}

function submitComment() {
  if (commentText.value.trim() === '') return;
  emit('commented', props.recipe._id, commentText.value);
  commentText.value = '';
}
</script>

<style scoped>
.recipe-card {
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
}
</style>
