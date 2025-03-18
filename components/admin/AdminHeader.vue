<template>
    <div class="admin-header border-bot">
      <h1 class="page-title">{{ title }}</h1>
      
      <div class="user-info">
        <div v-if="user" class="user-details">
          <span class="user-name">{{ user.prenom }} {{ user.nom }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  
  const props = defineProps({
    title: {
      type: String,
      required: true
    }
  })
  
  const user = ref(null)
  
  // récupration des infos de l'utilisateur dans le localStorage
  onMounted(() => {
    if (process.client) {
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    }
  })
  
  const userRole = computed(() => {
    if (!user.value || !user.value.role) return ''
    return user.value.role.join(', ')
  })
  </script>
  
  <style scoped>
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 1.5rem;
    background-color: #011221;
    border-bottom: 1px solid #1E2D3D;
  }
  
  .page-title {
    color: #E5E9F0;
    font-size: 1.25rem;
    font-family: 'Fira Code', monospace;
    font-weight: 500;
  }
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-details {
    display: flex;
    flex-direction: column;
    margin-right: 0.75rem;
    text-align: right;
  }
  
  .user-name {
    color: #E5E9F0;
    font-size: 0.875rem;
    font-family: 'Fira Code', monospace;
  }
  
  .user-role {
    color: #607B96;
    font-size: 0.75rem;
    font-family: 'Fira Code', monospace;
  }
  
  .user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #1E2D3D;
    color: #43D9AD;
  }
  </style>