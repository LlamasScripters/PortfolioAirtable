<!-- ProjectCard.vue -->
<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps(["project", "projectKey", "index"]);
const likes = ref(props.project.likes || 0);

const addLike = async () => {
  try {
    const response = await axios.put('/api/projects/like', { id: props.project.id });
    likes.value = response.data.likes;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du like:', error);
  }
}
</script>

<template>
  <div id="project" :key="projectKey" class="lg:mx-5">
    <span class="flex text-sm my-3">
      <h3 v-if="index == null" class="text-purplefy font-fira_bold mr-3">
        Project {{ projectKey  + 1 }}
      </h3>
      <h3 v-else class="text-purplefy font-fira_bold mr-3">
        Project {{ index + 1 }}
      </h3>
      <h4 class="font-fira_retina text-menu-text">// {{ project.name }}</h4>
    </span>

    <div id="project-card" class="flex flex-col">
      <div id="window">
        <div class="absolute flex right-3 top-3">
          <slot name="tech-icons" />
        </div>
        <img id="showcase" :src="project.img" alt="" class="" />
      </div>

      <div class="pb-8 pt-6 px-6 border-top">
        <p class="text-menu-text font-fira_retina text-sm mb-5">
          {{ project.description }}
        </p>
        <div class="flex justify-between items-center">
          <router-link :to="`/projects/${encodeURIComponent(project.name)}`" id="view-button"
            class="text-white font-fira_retina py-2 px-4 w-fit text-xs rounded-lg">
            view-project
          </router-link>
          <button @click="addLike" class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white"
              class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
              <path
                d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z" />
            </svg>
            <span class="text-white">{{ likes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
#project {
  min-width: 400px;
  margin-bottom: 5px;
}

#project-card {
  border: 1px solid #1e2d3d;
  background-color: #011221;
  border-radius: 15px;
  max-width: 400px;
}

#window {
  max-height: 120px;
  position: relative;
  overflow: hidden;
}

#showcase {
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
}

@media (max-width: 768px) {
  #project {
    min-width: 100%;
  }
}

@media (min-width: 768px) {
  #project {
    width: 100%;
    min-width: 100%;
    padding-inline: 5px;
  }
}

@media (min-width: 1350px) {
  #project {
    width: 100%;
    min-width: 100%;
    padding-inline: 20px;
  }
}
</style>
