<template>
    <div class="admin-sidebar border-right">
      <div class="sidebar-header border-bot">
        <h2 class="font-fira_bold">Admin</h2>
      </div>
      
      <div class="sidebar-menu">
        <div 
          class="sidebar-item" 
          :class="{ active: activeTab === 'dashboard' }"
          @click="changeTab('dashboard')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Tableau de bord</span>
        </div>
        
        <div 
          class="sidebar-item" 
          :class="{ active: activeTab === 'projects' || activeTab === 'create-project' || activeTab === 'edit-project' }"
          @click="changeTab('projects')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Projets</span>
        </div>
        
        <div 
          class="sidebar-item" 
          :class="{ active: activeTab === 'users' }"
          @click="changeTab('users')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>Utilisateurs</span>
        </div>
        
        <div 
          class="sidebar-item" 
          :class="{ active: activeTab === 'settings' }"
          @click="changeTab('settings')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span>Paramètres</span>
        </div>
        
        <div class="sidebar-item logout" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span>Déconnexion</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  const props = defineProps({
    activeTab: {
      type: String,
      required: true
    }
  })
  
  const emit = defineEmits(['change-tab'])
  const router = useRouter()
  
  const changeTab = (tab) => {
    emit('change-tab', tab)
  }
  
  const logout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }
  </script>
  
  <style scoped>
  .admin-sidebar {
    width: 250px;
    background-color: #011221;
    border-right: 1px solid #1E2D3D;
    height: 100%;
  }
  
  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    border-bottom: 1px solid #1E2D3D;
  }
  
  .sidebar-header h2 {
    color: #43D9AD;
    font-size: 1.25rem;
  }
  
  .sidebar-menu {
    padding: 1rem 0;
  }
  
  .sidebar-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: #607B96;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .sidebar-item:hover {
    background-color: #1E2D3D;
    color: #E5E9F0;
  }
  
  .sidebar-item.active {
    background-color: #1E2D3D;
    color: #E5E9F0;
    border-right: 3px solid #43D9AD;
  }
  
  .sidebar-item svg {
    margin-right: 0.75rem;
  }
  
  .sidebar-item span {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
  }
  
  .logout {
    margin-top: 2rem;
    border-top: 1px solid #1E2D3D;
    padding-top: 1rem;
    color: #E99287;
  }
  </style>