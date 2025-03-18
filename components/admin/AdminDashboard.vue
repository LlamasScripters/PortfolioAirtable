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
          <div class="category-list">
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
          <div class="recent-projects">
            <div v-if="isLoading" class="loading">Chargement...</div>
            <div v-else-if="recentProjects.length === 0" class="no-data">Aucun projet récent</div>
            <div v-else v-for="project in recentProjects" :key="project.id" class="recent-project">
              <div class="project-title">{{ project.title }}</div>
              <div class="project-date">{{ formatDate(project.createdTime) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const stats = ref({
    projects: 0,
    likes: 0,
    users: 0,
    technologies: 0,
    categoriesCount: {
      'Front-End': 0,
      'Back-End': 0,
      'Full-Stack': 0,
      'DevOps': 0,
      'User Interface': 0,
      'System Design': 0,
      'User Experience': 0,
      'Data': 0,
      'AI': 0
    }
  })
  
  const recentProjects = ref([])
  const isLoading = ref(true)
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
  }
  
  onMounted(async () => {
    try {
      isLoading.value = true
      
      const projects = await fetchProjects()
      const technologies = await fetchTechnologies()
      const users = await fetchUsers()
      
      stats.value.projects = projects.length
      stats.value.technologies = technologies.length
      stats.value.users = users.length
      
      stats.value.likes = projects.reduce((total, project) => total + (project.likes || 0), 0)
      
      projects.forEach(project => {
        if (project.categories) {
          project.categories.forEach(category => {
            if (stats.value.categoriesCount[category] !== undefined) {
              stats.value.categoriesCount[category]++
            }
          })
        }
      })
      
      recentProjects.value = [...projects]
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
        .slice(0, 5)
    } catch (error) {
      console.error('Erreur lors du chargement des données du tableau de bord:', error)
    } finally {
      isLoading.value = false
    }
  })
  
  // récupération des projets depuis l'API
  const fetchProjects = async () => {
    try {
      // simulation requête API
      // à remplacer par un appel API sur Airtable
      return [
        { id: 'p1', title: 'Portfolio Website', createdTime: '2023-01-15', likes: 5, categories: ['Front-End', 'User Interface'] },
        { id: 'p2', title: 'E-commerce Platform', createdTime: '2023-02-20', likes: 8, categories: ['Full-Stack', 'User Experience'] },
        { id: 'p3', title: 'Task Management API', createdTime: '2023-03-10', likes: 3, categories: ['Back-End', 'API'] },
        { id: 'p4', title: 'Mobile Game App', createdTime: '2023-04-05', likes: 12, categories: ['User Interface', 'User Experience'] },
        { id: 'p5', title: 'Data Visualization Tool', createdTime: '2023-05-18', likes: 7, categories: ['Data', 'Front-End'] }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      return []
    }
  }
  
  // récupération des technologies depuis l'API
  const fetchTechnologies = async () => {
    try {
      //  simulation requête API
      return [
        { id: 't1', name: 'React' },
        { id: 't2', name: 'Vue.js' },
        { id: 't3', name: 'Node.js' },
        { id: 't4', name: 'Python' },
        { id: 't5', name: 'MongoDB' }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des technologies:', error)
      return []
    }
  }
  
  // récupération des utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      // simulation requête API
      return [
        { id: 'u1', nom: 'Dupont', prenom: 'Jean' },
        { id: 'u2', nom: 'Martin', prenom: 'Sophie' },
        { id: 'u3', nom: 'Bernard', prenom: 'Michel' }
      ]
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return []
    }
  }
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