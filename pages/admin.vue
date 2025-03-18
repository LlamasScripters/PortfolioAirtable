<template>
  <div class="admin-container">
    <AdminSidebar :activeTab="activeTab" @change-tab="changeTab" />
    
    <div class="admin-content">
      <AdminHeader :title="getPageTitle()" />
      
      <div class="admin-main">
        <AdminDashboard v-if="activeTab === 'dashboard'" />
        
        <AdminProjectList 
          v-if="activeTab === 'projects'" 
          @edit-project="editProject" 
          @create-project="activeTab = 'create-project'"
        />
        
        <AdminProjectForm 
          v-if="activeTab === 'create-project'" 
          @saved="handleProjectSaved" 
          @cancelled="activeTab = 'projects'"
        />
        
        <AdminProjectForm 
          v-if="activeTab === 'edit-project'" 
          :projectId="currentProjectId" 
          @saved="handleProjectSaved" 
          @cancelled="activeTab = 'projects'"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth-admin'
})

import { ref } from 'vue'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminDashboard from '~/components/admin/AdminDashboard.vue'
import AdminProjectList from '~/components/admin/AdminProjectList.vue'
import AdminProjectForm from '~/components/admin/AdminProjectForm.vue'



const activeTab = ref('projects')
const currentProjectId = ref(null)

const changeTab = (tab) => {
  activeTab.value = tab
}

const getPageTitle = () => {
  switch (activeTab.value) {
    case 'dashboard':
      return 'Tableau de bord'
    case 'projects':
      return 'Gestion des projets'
    case 'create-project':
      return 'Créer un nouveau projet'
    case 'edit-project':
      return 'Modifier un projet'
    default:
      return 'Administration'
  }
}

const editProject = (projectId) => {
  currentProjectId.value = projectId
  activeTab.value = 'edit-project'
}

const handleProjectSaved = () => {
  activeTab.value = 'projects'
  currentProjectId.value = null
}
</script>

<style>
.admin-container {
  display: flex;
  min-height: calc(100vh - 85px);
  background-color: #011627;
  color: #E5E9F0;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
}

.admin-main {
  padding: 1.5rem;
}
</style>