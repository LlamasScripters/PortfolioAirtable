<template>
  <div class="dashboard-container">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon projects">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.projects }}</div>
          <div class="stat-label">Projets</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon likes">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.likes }}</div>
          <div class="stat-label">Likes</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon users">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.users }}</div>
          <div class="stat-label">Utilisateurs</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon technologies">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.technologies }}</div>
          <div class="stat-label">Technologies</div>
        </div>
      </div>
    </div>
    
    <div class="charts-container">
      <div class="chart-card">
        <h3 class="chart-title">Projets par catégorie</h3>
        <div v-if="isLoading" class="loading">Chargement...</div>
        <div v-else-if="Object.keys(stats.categoriesCount).length === 0" class="no-data">Aucune donnée disponible</div>
        <div v-else class="category-list">
          <div v-for="(count, category) in stats.categoriesCount" :key="category" class="category-item">
            <div class="category-name">{{ category }}</div>
            <div class="category-bar-container">
              <div class="category-bar" :style="{ width: `${(count / stats.projects) * 100}%` }"></div>
            </div>
            <div class="category-count">{{ count }}</div>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <h3 class="chart-title">Projets récents</h3>
        <div v-if="isLoading" class="loading">Chargement...</div>
        <div v-else-if="recentProjects.length === 0" class="no-data">Aucun projet récent</div>
        <div v-else v-for="project in recentProjects" :key="project.id" class="recent-project">
          <div class="project-title">{{ project.name }}</div>
          <div class="project-date">{{ formatDate(project.createdTime || new Date()) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjects } from '~/composables/use-projects'

const stats = ref({
  projects: 0,
  likes: 0,
  users: 0,
  technologies: 0,
  categoriesCount: {}
})

const recentProjects = ref([])
const isLoading = ref(true)
const error = ref(null)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
}

onMounted(async () => {
  try {
    isLoading.value = true
    
    // récupération des projets depuis l'API
    const { data: projectsData, error: projectsError } = await useProjects()
    
    if (projectsError.value) {
      throw new Error('Erreur lors de la récupération des projets')
    }
    
    const projects = projectsData.value || []
    
    // récupération des technologies depuis l'api
    const technologiesResponse = await fetch('/api/technologies')
    if (!technologiesResponse.ok) {
      throw new Error('Erreur lors de la récupération des technologies')
    }
    const technologies = await technologiesResponse.json()
    
    // récupération des utilisateurs
    const userResponse = await fetch('/api/users')
    let users = []
    
    if (userResponse.ok) {
      users = await userResponse.json()
    } else {
      console.warn('Impossible de récupérer les utilisateurs, utilisation de données par défaut')
      users = [{ id: 'u1' }, { id: 'u2' }, { id: 'u3' }] // Fallback si l'API n'existe pas encore
    }
    
    // calcul des statistiques
    stats.value.projects = projects.length
    stats.value.technologies = technologies.length
    stats.value.users = users.length
    
    // calcul du nombre total de likes
    stats.value.likes = projects.reduce((total, project) => total + (project.likes || 0), 0)
    
    // initialisation des catégories
    const categoriesMap = {}
    
    // utilisation des technologies comme catégories + groupage des projets par technologies
    projects.forEach(project => {
      if (project.technologies && Array.isArray(project.technologies)) {
        project.technologies.forEach(tech => {
          if (tech && tech.name) {
            categoriesMap[tech.name] = (categoriesMap[tech.name] || 0) + 1
          } else if (typeof tech === 'string') {
            categoriesMap[tech] = (categoriesMap[tech] || 0) + 1
          }
        })
      } else {
        const defaultCategory = 'Sans technologie'
        categoriesMap[defaultCategory] = (categoriesMap[defaultCategory] || 0) + 1
      }
    })
    
    stats.value.categoriesCount = categoriesMap
    
    // récupère les 5 derniers projets récents
    recentProjects.value = [...projects]
      .sort((a, b) => new Date(b.createdTime || 0) - new Date(a.createdTime || 0))
      .slice(0, 5)
      
  } catch (err) {
    console.error('Erreur lors du chargement des données du tableau de bord:', err)
    error.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: #011627;
  border: 1px solid #1E2D3D;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  margin-right: 1rem;
}

.stat-icon.projects {
  background-color: rgba(67, 217, 173, 0.1);
  color: #43D9AD;
}

.stat-icon.likes {
  background-color: rgba(233, 146, 135, 0.1);
  color: #E99287;
}

.stat-icon.users {
  background-color: rgba(255, 202, 40, 0.1);
  color: #FFCA28;
}

.stat-icon.technologies {
  background-color: rgba(96, 123, 150, 0.1);
  color: #607B96;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #E5E9F0;
  font-family: 'Fira Code', monospace;
}

.stat-label {
  font-size: 0.875rem;
  color: #607B96;
  font-family: 'Fira Code', monospace;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.chart-card {
  background-color: #011627;
  border: 1px solid #1E2D3D;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 300px;
}

.chart-title {
  font-size: 1rem;
  font-weight: 500;
  color: #E5E9F0;
  margin-bottom: 1.5rem;
  font-family: 'Fira Code', monospace;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-name {
  width: 120px;
  font-size: 0.875rem;
  color: #607B96;
  font-family: 'Fira Code', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-bar-container {
  flex: 1;
  height: 8px;
  background-color: #1E2D3D;
  border-radius: 4px;
  overflow: hidden;
}

.category-bar {
  height: 100%;
  background-color: #43D9AD;
  border-radius: 4px;
}

.category-count {
  width: 30px;
  font-size: 0.875rem;
  color: #E5E9F0;
  text-align: right;
  font-family: 'Fira Code', monospace;
}

.recent-projects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.recent-project {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #011221;
  border: 1px solid #1E2D3D;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.project-title {
  font-size: 0.875rem;
  color: #E5E9F0;
  font-family: 'Fira Code', monospace;
}

.project-date {
  font-size: 0.75rem;
  color: #607B96;
  font-family: 'Fira Code', monospace;
}

.loading, .no-data {
  text-align: center;
  padding: 2rem 0;
  color: #607B96;
  font-family: 'Fira Code', monospace;
}
</style>