<template>
  <div class="projects-list-container">
    <div class="actions-bar">
      <div class="search-bar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Rechercher un projet..."
          v-model="searchQuery"
          @input="filterProjects"
        />
      </div>

      <button class="add-button" @click="$emit('create-project')">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Ajouter un projet
      </button>
    </div>

    <div class="filters-bar">
      <div
        class="filter-chip"
        :class="{ active: activeFilter === 'all' }"
        @click="applyFilter('all')"
      >
        Tous
      </div>
      <div
        class="filter-chip"
        :class="{ active: activeFilter === 'visible' }"
        @click="applyFilter('visible')"
      >
        Visibles
      </div>
      <div
        class="filter-chip"
        :class="{ active: activeFilter === 'hidden' }"
        @click="applyFilter('hidden')"
      >
        Cachés
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <span>Chargement des projets...</span>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="no-projects">
      <div class="no-projects-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg>
      </div>
      <div class="no-projects-text">Aucun projet trouvé</div>
      <div class="no-projects-subtext">{{ getNoProjectsMessage() }}</div>
    </div>

    <div v-else class="projects-table">
      <div class="table-header">
        <div class="col-thumbnail">Image</div>
        <div class="col-title">Titre</div>
        <div class="col-category">Technologies</div>
        <div class="col-promo">Promotion</div>
        <div class="col-likes">Likes</div>
        <div class="col-status">Statut</div>
        <div class="col-actions">Actions</div>
      </div>

      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="table-row"
      >
        <div class="col-thumbnail">
          <img
            :src="project.img || '/placeholder-image.jpg'"
            alt="Miniature du projet"
          />
        </div>

        <div class="col-title">
          <div class="project-title">{{ project.title }}</div>
          <div class="project-description">
            {{ truncateText(project.description, 80) }}
          </div>
        </div>

        <div class="col-category">
          <div
            v-for="tech in project.technologies"
            :key="tech.id"
            class="category-badge"
          >
            {{ tech.name }}
          </div>
        </div>

        <div class="col-promo">
          {{ project.promotion || "N/A" }}
        </div>

        <div class="col-likes">
          {{ project.likes || 0 }}
        </div>

        <div class="col-status">
          <div
            class="status-badge"
            :class="{
              'status-visible': project.visible,
              'status-hidden': !project.visible,
            }"
          >
            {{ project.visible ? "Visible" : "Caché" }}
          </div>
        </div>

        <div class="col-actions">
          <button
            class="action-button edit"
            @click="editProject(project.id)"
            title="Modifier"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              ></path>
            </svg>
          </button>

          <button
            class="action-button toggle"
            @click="toggleVisibility(project.id)"
            :title="project.visible ? 'Cacher' : 'Afficher'"
          >
            <svg
              v-if="project.visible"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </button>

          <button
            class="action-button comment"
            @click="openCommentModal(project.id)"
            title="Commenter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            <!-- <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="inherit"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              ></path>
            </svg> -->
          </button>
        </div>
      </div>
    </div>

    <!-- Modal pour les commentaires -->
    <div
      v-if="showCommentModal"
      class="modal-overlay"
      @click.self="closeCommentModal"
    >
      <div class="modal-content">
        <h3 class="modal-title">Commentaires</h3>

        <div class="comments-container">
          <div v-if="projectComments.length === 0" class="no-comments">
            Aucun commentaire pour ce projet.
          </div>

          <div
            v-else
            v-for="(comment, index) in projectComments"
            :key="index"
            class="comment-modal"
          >
            <div class="comment-header">
              <div class="comment-author">{{ comment.fields['Nom Complet Utilisateur'] }}</div>
              <div class="comment-date">{{ formatDate(comment.fields['Date de création']) }}</div>
            </div>
            <div class="comment-content">
              <div v-if="!comment.isEditing" class="comment-text-display">
              {{ comment.fields['Contenu'] }}
              <button 
                v-if="isAdminIsCommentAuthor(comment.fields['Nom Complet Utilisateur'])"
                class="edit-button" 
                @click="comment.isEditing = true"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              </div>
              <div v-else class="comment-edit-form">
              <textarea
                v-model="comment.fields['Contenu']"
                class="comment-textarea"
                rows="3"
                @keyup.esc="comment.isEditing = false"
              ></textarea>
              <div class="comment-edit-actions">
                <button 
                class="save-button"
                @click="updateComment(comment.id, comment.fields['Contenu']); comment.isEditing = false"
                >
                Enregistrer
                </button>
                <button 
                class="cancel-button"
                @click="comment.isEditing = false"
                >
                Annuler
                </button>
              </div>
              </div>
            </div>
            <button
              class="delete-comment"
              @click="deleteComment(comment.id)"
              v-if="isAdminIsCommentAuthor(comment.fields['Nom Complet Utilisateur'])"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 4H8l-2 2H1v2h1l2 14h14l2-14h1V6h-1z"></path>
                <path d="M7 10h10"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="add-comment">
          <textarea
            v-model="newComment"
            placeholder="Ajouter un commentaire..."
            rows="3"
          ></textarea>
          <button class="submit-comment" @click="addComment">Ajouter</button>
        </div>

        <button class="close-modal" @click="closeCommentModal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";

const emit = defineEmits(["edit-project", "create-project"]);

// states
const {
  data,
  status,
  execute: fetchProjects,
} = useFetch("/api/projects", {
  key: "projects",
});
const isLoading = computed(() => status.value === "pending");
const projects = computed(() => data.value);
const searchQuery = ref("");
const activeFilter = ref("all");
const showCommentModal = ref(false);
const currentProjectId = ref(null);
const projectComments = ref([]);
const newComment = ref("");
const isUpdatingProject = ref(false);

onBeforeMount(async () => {
  await fetchProjects();
});

// Liste des projets filtrés selon les critères de recherche et de filtre
const filteredProjects = computed(() => {
  let filtered = [...projects.value];

  // filtrage par visibilité
  if (activeFilter.value === "visible") {
    filtered = filtered.filter((project) => project.visible);
  } else if (activeFilter.value === "hidden") {
    filtered = filtered.filter((project) => !project.visible);
  }

  // filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((project) => {
      return (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.technologies &&
          project.technologies.some((cat) => cat.toLowerCase().includes(query)))
      );
    });
  }

  return filtered;
});

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
};

// applique un filtre (tous, visibles, cachés)
const applyFilter = (filter) => {
  activeFilter.value = filter;
};

// Édite un projet
const editProject = (projectId) => {
  emit("edit-project", projectId);
};

// change la visibilité d'un projet
const toggleVisibility = useDebounceFn(async (projectId) => {
  isUpdatingProject.value = true;
  const project = projects.value.find((p) => p.id === projectId);
  const newVisibleValue = !project.visible;
  try {
    const updatedProject = await $fetch(`/api/projects/${projectId}`, {
      body: { visible: newVisibleValue },
      method: "patch",
    });

    refreshNuxtData("projects");

    // projects.value = projects.value.map((project) =>
    //   project.id === updatedProject.id ? updatedProject : project
    // );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la visibilité:", error);
    // Annule le changement en cas d'erreur
    project.visible = !project.visible;
  } finally {
    isUpdatingProject;
  }
}, 500);

const openCommentModal = async (projectId) => {
  showCommentModal.value = true;
  currentProjectId.value = projectId;

  // Récupérer les commentaires du projet actuel
  try {
    const response = await $fetch(`/api/projects/${projectId}/comments`);
    projectComments.value = response.comments || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires:", error);
  }
};

const closeCommentModal = () => {
  showCommentModal.value = false;
  currentProjectId.value = null;
  newComment.value = "";
};

// ajout un commentaire au projet actuel
const addComment = async () => {
  if (!newComment.value.trim()) return;
  
  try {
    const userData = localStorage.getItem("user");
    await $fetch(`/api/projects/${currentProjectId.value}/comments`, {
      method: "post",
      body: { 
        contenu: newComment.value, 
        user: userData ? JSON.parse(userData) : null
       },
    });

    // Réinitialiser le champ de commentaire
    newComment.value = "";

    // Rafraîchir la liste des commentaires
    await openCommentModal(currentProjectId.value);
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
  }
};

// mettre à jour le contenu d'un commentaire
const updateComment = async (commentId, newContent) => {
  try {
    await $fetch(`/api/projects/${currentProjectId.value}/comments/${commentId}`, {
      method: "patch",
      body: { id: commentId, contenu: newContent },
    });

    // Rafraîchir la liste des commentaires
    await openCommentModal(currentProjectId.value);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du commentaire:", error);
  }
};

// supprime un commentaire
const deleteComment = async (commentId) => {
  try {
    await $fetch(`/api/projects/${currentProjectId.value}/comments/${commentId}`, {
      method: "delete",
    });

    // Rafraîchir la liste des commentaires
    await openCommentModal(currentProjectId.value);
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
  }
};

// vérifie si le est de l'admin
const isAdminIsCommentAuthor = (commentAuthor) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const userFullName = `${userData.nom} ${userData.prenom}`;

  return userFullName === commentAuthor;
};

// affichage d'un message lorsqu'aucun projet n'est trouvé
const getNoProjectsMessage = () => {
  if (searchQuery.value) {
    return "Essayez de modifier votre recherche ou de supprimer les filtres.";
  } else if (activeFilter.value === "visible") {
    return "Aucun projet visible n'est disponible.";
  } else if (activeFilter.value === "hidden") {
    return "Aucun projet caché n'est disponible.";
  } else {
    return "Commencez par créer un nouveau projet.";
  }
};
</script>

<style scoped>
.projects-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  width: 300px;
}

.search-bar svg {
  color: #607b96;
  margin-right: 0.5rem;
}

.search-bar input {
  background: transparent;
  border: none;
  color: #e5e9f0;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  width: 100%;
}

.search-bar input:focus {
  outline: none;
}

.search-bar input::placeholder {
  color: #607b96;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #43d9ad;
  color: #01080e;
  border: none;
  border-radius: 4px;
  padding: 0.625rem 1rem;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-button:hover {
  background-color: #4fe0b6;
}

.filters-bar {
  display: flex;
  gap: 0.75rem;
}

.filter-chip {
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 16px;
  padding: 0.375rem 0.75rem;
  color: #607b96;
  font-family: "Fira Code", monospace;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background-color: #1e2d3d;
  color: #e5e9f0;
}

.filter-chip.active {
  background-color: #1e2d3d;
  color: #e5e9f0;
  border-color: #43d9ad;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #607b96;
  font-family: "Fira Code", monospace;
  gap: 1rem;
}

.loading-spinner {
  border: 3px solid #1e2d3d;
  border-top: 3px solid #43d9ad;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #607b96;
  font-family: "Fira Code", monospace;
  gap: 0.5rem;
}

.no-projects-icon {
  color: #1e2d3d;
  margin-bottom: 1rem;
}

.no-projects-text {
  font-size: 1.125rem;
  color: #e5e9f0;
  margin-bottom: 0.5rem;
}

.no-projects-subtext {
  font-size: 0.875rem;
  color: #607b96;
}

.projects-table {
  display: flex;
  flex-direction: column;
  border: 1px solid #1e2d3d;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 2fr 1.5fr 1fr 80px 100px 120px;
  background-color: #011221;
  padding: 0.75rem 1rem;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  color: #607b96;
  border-bottom: 1px solid #1e2d3d;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 2fr 1.5fr 1fr 80px 100px 120px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #1e2d3d;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: rgba(30, 45, 61, 0.3);
}

.col-thumbnail img {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.col-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.project-title {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  color: #e5e9f0;
}

.project-description {
  font-family: "Fira Code", monospace;
  font-size: 0.75rem;
  color: #607b96;
}

.col-category {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-badge {
  background-color: rgba(67, 217, 173, 0.1);
  color: #43d9ad;
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
  font-family: "Fira Code", monospace;
  font-size: 0.75rem;
}

.col-promo,
.col-likes {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  color: #607b96;
}

.col-status {
  text-align: center;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-family: "Fira Code", monospace;
  font-size: 0.75rem;
}

.status-visible {
  background-color: rgba(67, 217, 173, 0.1);
  color: #43d9ad;
}

.status-hidden {
  background-color: rgba(233, 146, 135, 0.1);
  color: #e99287;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background-color: #011221;
  border: 1px solid #1e2d3d;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: #1e2d3d;
}

.action-button.edit {
  color: #43d9ad;
}

.action-button.toggle {
  color: #ffca28;
}

.action-button.comment {
  color: #e5e9f0;
}

/* Modal de commentaires */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(1, 8, 14, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #011627;
  border: 1px solid #1e2d3d;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.modal-title {
  padding: 1rem 1.5rem;
  font-family: "Fira Code", monospace;
  font-size: 1.125rem;
  color: #e5e9f0;
  border-bottom: 1px solid #1e2d3d;
}

.comments-container {
  padding: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-comments {
  text-align: center;
  padding: 2rem 0;
  color: #607b96;
  font-family: "Fira Code", monospace;
}

/* .comment {
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 4px;
  padding: 1rem;
} */

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  color: #e5e9f0;
}

.comment-date {
  font-family: "Fira Code", monospace;
  font-size: 0.75rem;
  color: #607b96;
}

.comment-text {
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  color: #607b96;
  line-height: 1.5;
}

.add-comment {
  padding: 1.5rem;
  border-top: 1px solid #1e2d3d;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-comment textarea {
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 4px;
  padding: 0.75rem;
  color: #e5e9f0;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  resize: vertical;
}

.add-comment textarea:focus {
  outline: none;
  border-color: #43d9ad;
}

.submit-comment {
  align-self: flex-end;
  background-color: #43d9ad;
  color: #01080e;
  border: none;
  border-radius: 4px;
  padding: 0.625rem 1rem;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-comment:hover {
  background-color: #4fe0b6;
}

.close-modal {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: #607b96;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal:hover {
  color: #e5e9f0;
}
.delete-comment {
  background: none;
  border: none;
  color: #607b96;
  cursor: pointer;
  transition: color 0.2s;
}
.delete-comment:hover {
  color: #e5e9f0;
}
.delete-comment svg {
  width: 16px;
  height: 16px;
}
.delete-comment:hover svg {
  color: #e5e9f0;
}
.comment-modal {
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 4px;
  padding: 1rem;
}
.comment-edit-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.comment-textarea {
  background-color: #011221;
  border: 1px solid #1e2d3d;
  border-radius: 4px;
  padding: 0.75rem;
  color: #e5e9f0;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
}
.comment-textarea:focus {
  outline: none;
  border-color: #43d9ad;
}
.comment-edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}
.save-button {
  background-color: #43d9ad;
  color: #01080e;
  border: none;
  border-radius: 4px;
  padding: 0.625rem 1rem;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.save-button:hover {
  background-color: #4fe0b6;
}
.cancel-button {
  background-color: #e5e9f0;
  color: #01080e;
  border: none;
  border-radius: 4px;
  padding: 0.625rem 1rem;
  font-family: "Fira Code", monospace;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.cancel-button:hover {
  background-color: #f0f4f8;
}
.comment-text-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Fira Code Retina';
  font-size: 0.875rem;
}
.comment-text-display .edit-button {
  background: none;
  border: none;
  color: #607b96;
  cursor: pointer;
  transition: color 0.2s;
}
.comment-text-display .edit-button:hover {
  color: #e5e9f0;
}
.comment-text-display .edit-button svg {
  width: 16px;
  height: 16px;
}
.comment-text-display .edit-button:hover svg {
  color: #e5e9f0;
}
</style>
