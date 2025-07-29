<template>
  <div class="recipe-card">
    <h3>{{ recipe.title }}</h3>
    <p v-if="showAuthor" class="author-line">
      👩‍🍳 Objavio/la: <strong>{{ recipe.author?.username || 'Nepoznato' }}</strong>
    </p>

    <img :src="recipe.image" alt="Slika recepta" class="recipe-image" />

    <div class="actions">
      <button class="like-btn" @click="toggleLike" aria-label="Like button">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            :class="{ liked: recipe.hasLiked }"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8746c5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
          <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5
            5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5
            5.5 0 0 0 0-7.78z"
              :fill="recipe.hasLiked ? '#8746c5' : 'none'"
          />
        </svg>
        <span>{{ recipe.likes.length }}</span>
      </button>

      <button class="comment-toggle-btn" @click="openCommentsModal">
        💬 Komentari ({{ recipe.comments.length }})
      </button>

      <button class="recipe-toggle-btn" @click="openRecipeModal">
        📖 Pogledaj recept
      </button>

      <!-- Gumb za brisanje, prikazuje se samo ako je editable true -->
      <button v-if="editable" class="delete-btn" @click="$emit('delete', recipe._id)" title="Obriši recept">
        🗑️
      </button>
    </div>

    <!-- Modal za komentare -->
    <div v-if="showCommentsModal" class="modal-overlay" @click.self="closeCommentsModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeCommentsModal">✖</button>
        <h4>Komentari</h4>
        <ul class="comments-list">
          <li v-for="comment in recipe.comments" :key="comment._id" class="comment-item">
            <strong>{{ comment.user.username }}:</strong> {{ comment.text }}
          </li>
        </ul>

        <div class="comment-input">
          <input v-model="commentText" placeholder="Dodaj komentar..." />
          <button @click="submitComment">Komentiraj</button>
        </div>
      </div>
    </div>

    <!-- Modal za detalje recepta -->
    <div v-if="showRecipeModal" class="modal-overlay" @click.self="closeRecipeModal">
      <div class="modal-content">
        <button class="modal-close-btn" @click="closeRecipeModal">✖</button>
        <h4>Detalji recepta:</h4>
        <p>{{ recipe.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  recipe: Object,
  showAuthor: { type: Boolean, default: true },
  editable: { type: Boolean, default: false },
});

const emit = defineEmits(['liked', 'commented', 'delete']);

const commentText = ref('');
const showCommentsModal = ref(false);
const showRecipeModal = ref(false);

function toggleLike() {
  emit('liked', props.recipe._id);
}

function submitComment() {
  if (commentText.value.trim() === '') return;
  emit('commented', props.recipe._id, commentText.value);
  commentText.value = '';
}

function openCommentsModal() {
  showCommentsModal.value = true;
}

function closeCommentsModal() {
  showCommentsModal.value = false;
}

function openRecipeModal() {
  showRecipeModal.value = true;
}

function closeRecipeModal() {
  showRecipeModal.value = false;
}
</script>

<style scoped>
.recipe-card {
  background-color: #fdf6ff;
  border: 1px solid #d4b2f0;
  border-radius: 14px;
  padding: 22px;
  margin: 20px auto;
  max-width: 520px;
  box-shadow: 0 3px 10px rgba(122, 77, 163, 0.1);
}

.recipe-image {
  max-width: 100%;
  border-radius: 10px;
  margin-bottom: 14px;
  border: 2px solid #e4c3fa;
}

.author-line {
  color: #8746c5;
  font-size: 14px;
  margin-top: -4px;
  margin-bottom: 10px;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 14px;
  align-items: center;
}

.like-btn,
.comment-toggle-btn,
.recipe-toggle-btn,
.delete-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #8746c5;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 22px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.like-btn:hover,
.comment-toggle-btn:hover,
.recipe-toggle-btn:hover {
  background-color: #e3c0fa;
  color: #5b2e8a;
}

/* Posebno za gumb brisanja */
.delete-btn {
  font-size: 18px;
  padding: 6px 10px;
  color: #e74c3c;
  border-radius: 14px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.delete-btn:hover {
  background-color: #fceaea;
  color: #c0392b;
}

/* SVG srce bez obruba */
.like-btn svg {
  transition: fill 0.3s ease;
  stroke: #8746c5;
  fill: none;
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
}

.like-btn svg.liked {
  fill: #8746c5;
  box-shadow: none !important;
  outline: none !important;
  border: none !important;
}

/* Modal pozadina - tamna i prozirna */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal sadržaj */
.modal-content {
  background-color: #fff;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  padding: 20px;
  border-radius: 14px;
  position: relative;
  box-shadow: 0 4px 25px rgba(0,0,0,0.2);
}

/* Zatvori dugme */
.modal-close-btn {
  position: absolute;
  top: 10px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #8746c5;
  font-weight: bold;
}

/* Komentari lista */
.comments-list {
  list-style: none;
  padding: 0;
  max-height: 50vh;
  overflow-y: auto;
  margin-bottom: 12px;
}

.comment-item {
  padding: 7px 0;
  border-bottom: 1px solid #eee;
}

.comment-input {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.comment-input input {
  flex: 1;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #b58ee0;
}

.comment-input button {
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  background-color: #8746c5;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.comment-input button:hover {
  background-color: #a05dd8;
}
</style>
