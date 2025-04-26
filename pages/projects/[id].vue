<!-- pages/projects/[id].vue -->

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const projectId = route.params.id;
console.log("Project ID:", projectId);

const {
  data: project,
  pending,
  error,
} = await useFetch(`/api/projects/${encodeURIComponent(projectId)}`);

if (error.value) {
  console.error(error.value);
}
</script>

<template>
  <main class="flex flex-col items-center justify-center p-10 text-white">
    <div v-if="pending" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-red-500">
      Erreur : {{ error.message }}
    </div>
    <div v-else-if="project">
      <h1 class="text-3xl font-bold mb-4">{{ project.name }}</h1>
      <img
        :src="project.img"
        :alt="project.name"
        class="rounded-lg shadow-lg max-w-lg mb-6"
      />
      <p class="mb-4">{{ project.description }}</p>
      <a :href="project.url" class="text-blue-400 hover:underline"
        >Voir le projet sur GitHub</a
      >
      <p class="mt-4">👍 Likes : {{ project.likes }}</p>
    </div>
  </main>
</template>
