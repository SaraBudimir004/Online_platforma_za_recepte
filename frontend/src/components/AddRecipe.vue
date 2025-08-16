<template>
  <form @submit.prevent="submitRecipe" class="add-recipe-form">
    <h2>Dodaj novi recept</h2>

    <label for="title">Naslov recepta:</label>
    <input
        id="title"
        v-model="title"
        type="text"
        placeholder="Unesi naslov"
        required
    />

    <label for="description">Opis recepta:</label>
    <textarea
        id="description"
        v-model="description"
        placeholder="Unesi opis"
        required
    ></textarea>

    <label for="image">Slika recepta (upload):</label>
    <input
        id="image"
        type="file"
        @change="handleFileChange"
        accept="image/*"
    />
    <p>ili unesi URL slike:</p>
    <input
        type="text"
        v-model="imageUrl"
        placeholder="https://dodajSliku.com"
    />

    <!-- Preview slike -->
    <div v-if="previewImage" class="image-preview">
      <p>Pregled odabrane slike:</p>
      <img :src="previewImage" alt="Preview slike" />
    </div>

    <button type="submit" :disabled="loading">
      {{ loading ? "Spremanje..." : "Dodaj recept" }}
    </button>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Recept je uspješno dodan!</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const title = ref("");
const description = ref("");
const imageFile = ref(null);
const imageUrl = ref("");
const previewImage = ref(""); // za preview slike
const loading = ref(false);
const error = ref("");
const success = ref(false);

function handleFileChange(e) {
  const files = e.target.files;
  if (files.length > 0) {
    imageFile.value = files[0];
    imageUrl.value = ""; // resetiraj URL input

    // Napravi preview
    const reader = new FileReader();
    reader.onload = (event) => {
      previewImage.value = event.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
}

async function submitRecipe() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("description", description.value);

    if (imageFile.value) {
      formData.append("image", imageFile.value);
    } else if (imageUrl.value.trim() !== "") {
      formData.append("imageUrl", imageUrl.value.trim());
    }

    const token = localStorage.getItem("token");

    const response = await axios.post(
        "http://localhost:5010/api/recipes",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token ? `Bearer ${token}` : ""
          }
        }
    );

    success.value = true;
    // Reset forme i preview
    title.value = "";
    description.value = "";
    imageFile.value = null;
    imageUrl.value = "";
    previewImage.value = "";
  } catch (err) {
    error.value = err.response?.data?.message || "Greška pri dodavanju recepta.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.add-recipe-form {
  max-width: 500px;
  margin: 30px auto;
  background: #ffffff;
  padding: 32px 28px;
  border-radius: 18px;
  box-shadow: 0 6px 15px rgba(142, 68, 173, 0.18);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #4b2e83;
  transition: box-shadow 0.3s ease;
}

.add-recipe-form:hover {
  box-shadow: 0 8px 22px rgba(142, 68, 173, 0.28);
}

.add-recipe-form h2 {
  margin-bottom: 24px;
  font-weight: 800;
  font-size: 24px;
  color: #6a4b9e;
  text-align: center;
  letter-spacing: 0.05em;
}

.add-recipe-form label {
  display: block;
  margin-top: 20px;
  font-weight: 700;
  font-size: 15px;
  color: #6a4b9e;
  user-select: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.add-recipe-form label:hover {
  color: #8e44ad;
}

.add-recipe-form input[type="text"],
.add-recipe-form textarea {
  width: 100%;
  margin-top: 8px;
  padding: 14px 12px;
  border: none;
  border-bottom: 2.5px solid #b58ee0;
  border-radius: 0;
  font-size: 15px;
  background: transparent;
  color: #3e2a68;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  outline-offset: 3px;
  box-sizing: border-box;
}

.add-recipe-form input[type="text"]::placeholder,
.add-recipe-form textarea::placeholder {
  color: #a992ca;
  font-style: italic;
}

.add-recipe-form input[type="text"]:focus,
.add-recipe-form textarea:focus {
  border-bottom-color: #8e44ad;
  outline: none;
  background-color: #f7eefa;
}

.add-recipe-form input[type="file"] {
  margin-top: 14px;
  color: #7a5299;
  cursor: pointer;
  font-weight: 600;
}

.add-recipe-form textarea {
  min-height: 130px;
  resize: vertical;
  font-family: inherit;
}

.add-recipe-form button {
  margin-top: 30px;
  background-color: #8e44ad;
  color: white;
  border: none;
  padding: 14px 22px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 28px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.15s ease, box-shadow 0.3s ease;
  box-shadow: 0 7px 16px rgba(142, 68, 173, 0.3);
  width: 100%;
  letter-spacing: 0.03em;
}

.add-recipe-form button:hover:not(:disabled) {
  background-color: #732d91;
  transform: scale(1.06);
  box-shadow: 0 9px 22px rgba(115, 45, 145, 0.45);
}

.add-recipe-form button:disabled {
  background-color: #b58ee0;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.error {
  color: #a8324a;
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.02em;
}

.success {
  color: #2f803f;
  margin-top: 16px;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.02em;
}

.image-preview {
  margin-top: 15px;
  text-align: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 250px;
  border-radius: 12px;
  border: 2px solid #b58ee0;
  object-fit: cover;
}
</style>
