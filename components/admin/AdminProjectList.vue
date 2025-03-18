<template>
    <div class="projects-list-container">
      <div class="actions-bar">
        <div class="search-bar">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Ajouter un projet
        </button>
      </div>
      
      <div class="filters-bar">
        <div class="filter-chip" :class="{ active: activeFilter === 'all' }" @click="applyFilter('all')">Tous</div>
        <div class="filter-chip" :class="{ active: activeFilter === 'visible' }" @click="applyFilter('visible')">Visibles</div>
        <div class="filter-chip" :class="{ active: activeFilter === 'hidden' }" @click="applyFilter('hidden')">Cachés</div>
      </div>
      
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <span>Chargement des projets...</span>
      </div>
      
      <div v-else-if="filteredProjects.length === 0" class="no-projects">
        <div class="no-projects-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <div class="col-category">Catégorie</div>
          <div class="col-promo">Promotion</div>
          <div class="col-likes">Likes</div>
          <div class="col-status">Statut</div>
          <div class="col-actions">Actions</div>
        </div>
        
        <div v-for="project in filteredProjects" :key="project.id" class="table-row">
          <div class="col-thumbnail">
            <img :src="project.img || '/placeholder-image.jpg'" alt="Miniature du projet" />
          </div>
          
          <div class="col-title">
            <div class="project-title">{{ project.title }}</div>
            <div class="project-description">{{ truncateText(project.description, 80) }}</div>
          </div>
          
          <div class="col-category">
            <div v-for="(category, index) in project.categories" :key="index" class="category-badge">
              {{ category }}
            </div>
          </div>
          
          <div class="col-promo">
            {{ project.promotion || 'N/A' }}
          </div>
          
          <div class="col-likes">
            {{ project.likes || 0 }}
          </div>
          
          <div class="col-status">
            <div class="status-badge" :class="{ 'status-visible': project.visible, 'status-hidden': !project.visible }">
              {{ project.visible ? 'Visible' : 'Caché' }}
            </div>
          </div>
          
          <div class="col-actions">
            <button class="action-button edit" @click="editProject(project.id)" title="Modifier">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            
            <button class="action-button toggle" @click="toggleVisibility(project.id)" :title="project.visible ? 'Cacher' : 'Afficher'">
              <svg v-if="project.visible" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            
            <button class="action-button comment" @click="openCommentModal(project.id)" title="Commenter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Modal pour les commentaires -->
      <div v-if="showCommentModal" class="modal-overlay" @click.self="closeCommentModal">
        <div class="modal-content">
          <h3 class="modal-title">Commentaires</h3>
          
          <div class="comments-container">
            <div v-if="projectComments.length === 0" class="no-comments">
              Aucun commentaire pour ce projet.
            </div>
            
            <div v-else v-for="(comment, index) in projectComments" :key="index" class="comment">
              <div class="comment-header">
                <div class="comment-author">{{ comment.author }}</div>
                <div class="comment-date">{{ formatDate(comment.date) }}</div>
              </div>
              <div class="comment-text">{{ comment.text }}</div>
            </div>
          </div>
          
          <div class="add-comment">
            <textarea v-model="newComment" placeholder="Ajouter un commentaire..." rows="3"></textarea>
            <button class="submit-comment" @click="addComment">Ajouter</button>
          </div>
          
          <button class="close-modal" @click="closeCommentModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  
  const emit = defineEmits(['edit-project', 'create-project'])
  
  // states
  const projects = ref([])
  const isLoading = ref(true)
  const searchQuery = ref('')
  const activeFilter = ref('all')
  const showCommentModal = ref(false)
  const currentProjectId = ref(null)
  const projectComments = ref([])
  const newComment = ref('')
  
  onMounted(async () => {
    try {
      isLoading.value = true
      
      // récupération des projets depuis l'API
      const response = await fetchProjects()
      projects.value = response
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error)
    } finally {
      isLoading.value = false
    }
  })
  
  // Liste des projets filtrés selon les critères de recherche et de filtre
  const filteredProjects = computed(() => {
    let filtered = [...projects.value]
    
    // filtrage par visibilité
    if (activeFilter.value === 'visible') {
      filtered = filtered.filter(project => project.visible)
    } else if (activeFilter.value === 'hidden') {
      filtered = filtered.filter(project => !project.visible)
    }
    
    // filtrage par recherche
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(project => {
        return project.title.toLowerCase().includes(query) ||
               project.description.toLowerCase().includes(query) ||
               (project.categories && project.categories.some(cat => cat.toLowerCase().includes(query)))
      })
    }
    
    return filtered
  })
  
  // récupération des projets depuis l'API
  const fetchProjects = async () => {
    try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return [
        {
          id: 'p1',
          title: 'Portfolio Website',
          description: 'A modern portfolio website with dark theme and responsive design',
          categories: ['Front-End', 'User Interface'],
          promotion: '2024 - ESGI',
          likes: 5,
          visible: true,
          img: 'https://picsum.photos/id/1/200/100'
        },
        {
          id: 'p2',
          title: 'E-commerce Platform',
          description: 'Complete e-commerce solution with payment integration and inventory management',
          categories: ['Full-Stack', 'User Experience'],
          promotion: '2023 - ESGI',
          likes: 8,
          visible: true,
          img: 'https://picsum.photos/id/2/200/100'
        },
        {
          id: 'p3',
          title: 'Task Management API',
          description: 'RESTful API for task management with authentication and data validation',
          categories: ['Back-End', 'API'],
          promotion: '2022 - ESGI',
          likes: 3,
          visible: false,
          img: 'https://picsum.photos/id/3/200/100'
        },
        {
          id: 'p4',
          title: 'Mobile Game App',
          description: 'Casual mobile game with multiplayer functionality and leaderboards',
          categories: ['User Interface', 'User Experience'],
          promotion: '2023 - ESGI',
          likes: 12,
          visible: true,
          img: 'https://picsum.photos/id/4/200/100'
        },
        {
          id: 'p5',
          title: 'Data Visualization Tool',
          description: 'Interactive data visualization dashboard for business intelligence',
          categories: ['Data', 'Front-End'],
          promotion: '2021 - ESGI',
          likes: 7,
          visible: false,
          img: 'https://picsum.photos/id/5/200/100'
        }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      return []
    }
  }
  
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }
  
  // applique un filtre (tous, visibles, cachés)
  const applyFilter = (filter) => {
    activeFilter.value = filter
  }
  
  // filtre les projets selon la requête de recherche
  const filterProjects = () => {
    // vide car le filtrage se fait via le computed property
  }
  
  // Édite un projet
  const editProject = (projectId) => {
    emit('edit-project', projectId)
  }
  
  // change la visibilité d'un projet
  const toggleVisibility = async (projectId) => {
    const project = projects.value.find(p => p.id === projectId)
    if (project) {
      project.visible = !project.visible
      
      try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
        console.log(`Projet ${projectId} est maintenant ${project.visible ? 'visible' : 'caché'}`)
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la visibilité:', error)
        // Annule le changement en cas d'erreur
        project.visible = !project.visible
      }
    }
  }
  
  const openCommentModal = async (projectId) => {
    currentProjectId.value = projectId
    
    // récupération des commentaires pour ce projet
    try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      projectComments.value = [
        {
          author: 'Jean Dupont',
          date: '2023-05-15T10:30:00',
          text: 'Le design est superbe, mais il faudrait améliorer la performance sur mobile.'
        },
        {
          author: 'Marie Martin',
          date: '2023-05-16T14:20:00',
          text: 'Très bon travail sur l\'intégration des APIs externes.'
        }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error)
      projectComments.value = []
    }
    
    showCommentModal.value = true
  }
  
  const closeCommentModal = () => {
    showCommentModal.value = false
    currentProjectId.value = null
    newComment.value = ''
  }
  
  // ajout un commentaire au projet actuel
  const addComment = async () => {
    if (!newComment.value.trim()) return
    
    try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      const newCommentObj = {
        author: 'Utilisateur actuel',
        date: new Date().toISOString(),
        text: newComment.value
      }
      
      projectComments.value.push(newCommentObj)
      newComment.value = ''
      
      console.log(`Commentaire ajouté au projet ${currentProjectId.value}:`, newCommentObj)
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error)
    }
  }
  
  // affichage d'un message lorsqu'aucun projet n'est trouvé
  const getNoProjectsMessage = () => {
    if (searchQuery.value) {
      return 'Essayez de modifier votre recherche ou de supprimer les filtres.'
    } else if (activeFilter.value === 'visible') {
      return 'Aucun projet visible n\'est disponible.'
    } else if (activeFilter.value === 'hidden') {
      return 'Aucun projet caché n\'est disponible.'
    } else {
      return 'Commencez par créer un nouveau projet.'
    }
  }
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
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    padding: 0.5rem 0.75rem;
    width: 300px;
  }
  
  .search-bar svg {
    color: #607B96;
    margin-right: 0.5rem;
  }
  
  .search-bar input {
    background: transparent;
    border: none;
    color: #E5E9F0;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    width: 100%;
  }
  
  .search-bar input:focus {
    outline: none;
  }
  
  .search-bar input::placeholder {
    color: #607B96;
  }
  
  .add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #43D9AD;
    color: #01080E;
    border: none;
    border-radius: 4px;
    padding: 0.625rem 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-button:hover {
    background-color: #4FE0B6;
  }
  
  .filters-bar {
    display: flex;
    gap: 0.75rem;
  }
  
  .filter-chip {
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 16px;
    padding: 0.375rem 0.75rem;
    color: #607B96;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .filter-chip:hover {
    background-color: #1E2D3D;
    color: #E5E9F0;
  }
  
  .filter-chip.active {
    background-color: #1E2D3D;
    color: #E5E9F0;
    border-color: #43D9AD;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: #607B96;
    font-family: 'Fira Code', monospace;
    gap: 1rem;
  }
  
  .loading-spinner {
    border: 3px solid #1E2D3D;
    border-top: 3px solid #43D9AD;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .no-projects {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 0;
    color: #607B96;
    font-family: 'Fira Code', monospace;
    gap: 0.5rem;
  }
  
  .no-projects-icon {
    color: #1E2D3D;
    margin-bottom: 1rem;
  }
  
  .no-projects-text {
    font-size: 1.125rem;
    color: #E5E9F0;
    margin-bottom: 0.5rem;
  }
  
  .no-projects-subtext {
    font-size: 0.875rem;
    color: #607B96;
  }
  
  .projects-table {
    display: flex;
    flex-direction: column;
    border: 1px solid #1E2D3D;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .table-header {
    display: grid;
    grid-template-columns: 80px 2fr 1.5fr 1fr 80px 100px 120px;
    background-color: #011221;
    padding: 0.75rem 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    color: #607B96;
    border-bottom: 1px solid #1E2D3D;
  }
  
  .table-row {
    display: grid;
    grid-template-columns: 80px 2fr 1.5fr 1fr 80px 100px 120px;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #1E2D3D;
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
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #E5E9F0;
  }
  
  .project-description {
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #607B96;
  }
  
  .col-category {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .category-badge {
    background-color: rgba(67, 217, 173, 0.1);
    color: #43D9AD;
    border-radius: 12px;
    padding: 0.25rem 0.5rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
  }
  
  .col-promo, .col-likes {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #607B96;
  }
  
  .col-status {
    text-align: center;
  }
  
  .status-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
  }
  
  .status-visible {
    background-color: rgba(67, 217, 173, 0.1);
    color: #43D9AD;
  }
  
  .status-hidden {
    background-color: rgba(233, 146, 135, 0.1);
    color: #E99287;
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
    border: 1px solid #1E2D3D;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .action-button:hover {
    background-color: #1E2D3D;
  }
  
  .action-button.edit {
    color: #43D9AD;
  }
  
  .action-button.toggle {
    color: #FFCA28;
  }
  
  .action-button.comment {
    color: #607B96;
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
    border: 1px solid #1E2D3D;
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
    font-family: 'Fira Code', monospace;
    font-size: 1.125rem;
    color: #E5E9F0;
    border-bottom: 1px solid #1E2D3D;
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
    color: #607B96;
    font-family: 'Fira Code', monospace;
  }
  
  .comment {
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    padding: 1rem;
  }
  
  .comment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .comment-author {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #E5E9F0;
  }
  
  .comment-date {
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #607B96;
  }
  
  .comment-text {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #607B96;
    line-height: 1.5;
  }
  
  .add-comment {
    padding: 1.5rem;
    border-top: 1px solid #1E2D3D;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .add-comment textarea {
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    padding: 0.75rem;
    color: #E5E9F0;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    resize: vertical;
  }
  
  .add-comment textarea:focus {
    outline: none;
    border-color: #43D9AD;
  }
  
  .submit-comment {
    align-self: flex-end;
    background-color: #43D9AD;
    color: #01080E;
    border: none;
    border-radius: 4px;
    padding: 0.625rem 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-comment:hover {
    background-color: #4FE0B6;
  }
  
  .close-modal {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: #607B96;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .close-modal:hover {
    color: #E5E9F0;
  }
  </style>