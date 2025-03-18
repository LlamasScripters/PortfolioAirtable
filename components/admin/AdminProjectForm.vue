<template>
    <div class="project-form-container">
      <div v-if="isLoading" class="loading">
        <div class="loading-spinner"></div>
        <span>Chargement des données...</span>
      </div>
      
      <div v-else>
        <form @submit.prevent="saveProject" class="project-form">
          <div class="form-grid">
            <div class="form-column">
              <div class="form-section">
                <h3 class="section-title">Informations générales</h3>
                
                <div class="form-group">
                  <label for="project-title">Titre <span class="required">*</span></label>
                  <input 
                    id="project-title" 
                    v-model="formData.title" 
                    type="text" 
                    placeholder="Nom du projet" 
                    required
                  >
                  <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
                </div>
                
                <div class="form-group">
                  <label for="project-description">Description <span class="required">*</span></label>
                  <textarea 
                    id="project-description" 
                    v-model="formData.description" 
                    placeholder="Description du projet" 
                    rows="5" 
                    required
                  ></textarea>
                  <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
                </div>
                
                <div class="form-group">
                  <label for="project-url">URL du projet</label>
                  <input 
                    id="project-url" 
                    v-model="formData.url" 
                    type="url" 
                    placeholder="https://exemple.com"
                  >
                  <span v-if="errors.url" class="error-message">{{ errors.url }}</span>
                </div>
              </div>
              
              <div class="form-section">
                <h3 class="section-title">Catégorisation</h3>
                
                <div class="form-group categories-group">
                  <label>Catégories <span class="required">*</span></label>
                  <div class="categories-container">
                    <div 
                      v-for="category in availableCategories" 
                      :key="category"
                      class="category-checkbox"
                    >
                      <input 
                        :id="'category-' + category.toLowerCase().replace(' ', '-')" 
                        type="checkbox" 
                        :value="category" 
                        v-model="formData.categories"
                      >
                      <label :for="'category-' + category.toLowerCase().replace(' ', '-')">{{ category }}</label>
                    </div>
                  </div>
                  <span v-if="errors.categories" class="error-message">{{ errors.categories }}</span>
                </div>
              </div>
              
              <div class="form-section">
                <h3 class="section-title">Visibilité</h3>
                
                <div class="form-group visibility-group">
                  <div class="visibility-toggle">
                    <div 
                      class="toggle-option" 
                      :class="{ active: formData.visible }" 
                      @click="formData.visible = true"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      <span>Visible</span>
                    </div>
                    <div 
                      class="toggle-option" 
                      :class="{ active: !formData.visible }" 
                      @click="formData.visible = false"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      <span>Caché</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-column">
              <div class="form-section">
                <h3 class="section-title">Visuels</h3>
                
                <div class="form-group">
                  <label for="project-image">Image principale</label>
                  <div class="image-upload-container">
                    <div 
                      class="image-preview" 
                      :style="{ backgroundImage: formData.img ? `url(${formData.img})` : 'none' }"
                    >
                      <div v-if="!formData.img" class="no-image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                          <circle cx="8.5" cy="8.5" r="1.5"></circle>
                          <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                        <span>Aucune image</span>
                      </div>
                      <button v-if="formData.img" type="button" class="remove-image-btn" @click="removeImage">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                    <div class="upload-actions">
                      <input 
                        type="file" 
                        id="image-upload" 
                        accept="image/*" 
                        @change="handleImageUpload" 
                        class="hidden-input"
                      >
                      <label for="image-upload" class="upload-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Télécharger
                      </label>
                      <button type="button" class="url-btn" @click="promptImageUrl">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        URL
                      </button>
                    </div>
                  </div>
                  <span v-if="errors.img" class="error-message">{{ errors.img }}</span>
                </div>
              </div>
              
              <div class="form-section">
                <h3 class="section-title">Technologies</h3>
                
                <div class="form-group">
                  <label>Technologies utilisées <span class="required">*</span></label>
                  <div v-if="loadingTechnologies" class="loading-inline">
                    Chargement des technologies...
                  </div>
                  <div v-else class="technologies-container">
                    <div 
                      v-for="tech in technologies" 
                      :key="tech.id"
                      :class="['technology-item', { active: formData.tech.includes(tech.id) }]"
                      @click="toggleTechnology(tech.id)"
                    >
                      <img :src="tech.icon" :alt="tech.name" class="tech-icon">
                      <span class="tech-name">{{ tech.name }}</span>
                    </div>
                  </div>
                  <span v-if="errors.tech" class="error-message">{{ errors.tech }}</span>
                </div>
              </div>
              
              <div class="form-section">
                <h3 class="section-title">Attribution</h3>
                
                <div class="form-group">
                  <label for="project-promotion">Promotion <span class="required">*</span></label>
                  <select 
                    id="project-promotion" 
                    v-model="formData.promotion" 
                    required
                  >
                    <option value="" disabled>Sélectionner une promotion</option>
                    <option v-for="promo in promotions" :key="promo.id" :value="promo.id">
                      {{ promo.name }}
                    </option>
                  </select>
                  <span v-if="errors.promotion" class="error-message">{{ errors.promotion }}</span>
                </div>
                
                <div class="form-group">
                  <label>Étudiants <span class="required">*</span></label>
                  <div v-if="loadingStudents" class="loading-inline">
                    Chargement des étudiants...
                  </div>
                  <div v-else class="students-container">
                    <div class="selected-students">
                      <div 
                        v-for="studentId in formData.students" 
                        :key="studentId" 
                        class="selected-student"
                      >
                        <span>{{ getStudentName(studentId) }}</span>
                        <button type="button" @click="removeStudent(studentId)" class="remove-student">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div class="add-student">
                      <select 
                        v-model="selectedStudent" 
                        @change="addStudent"
                      >
                        <option value="" disabled selected>Ajouter un étudiant</option>
                        <option 
                          v-for="student in availableStudents" 
                          :key="student.id" 
                          :value="student.id"
                        >
                          {{ student.firstName }} {{ student.lastName }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <span v-if="errors.students" class="error-message">{{ errors.students }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancel">Annuler</button>
            <button type="submit" class="save-btn" :disabled="isSaving">
              <span v-if="isSaving">
                <div class="btn-spinner"></div>
                Enregistrement...
              </span>
              <span v-else>{{ projectId ? 'Mettre à jour' : 'Créer' }}</span>
            </button>
          </div>
        </form>
      </div>
      
      <div v-if="showSuccessMessage" class="success-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
      
      <div v-if="showErrorMessage" class="error-toast">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>
      
      <div v-if="showImageUrlModal" class="modal-overlay" @click.self="showImageUrlModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Ajouter une image par URL</h3>
          
          <div class="form-group">
            <label for="image-url">URL de l'image</label>
            <input 
              id="image-url" 
              v-model="imageUrl" 
              type="url" 
              placeholder="https://exemple.com/image.jpg"
            >
          </div>
          
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="showImageUrlModal = false">Annuler</button>
            <button type="button" class="confirm-btn" @click="addImageByUrl">Ajouter</button>
          </div>
          
          <button class="close-modal" @click="showImageUrlModal = false">
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
  import { ref, computed, onMounted, watch } from 'vue'
  
  const props = defineProps({
    projectId: {
      type: String,
      default: null
    }
  })
  
  const emit = defineEmits(['saved', 'cancelled'])
  
  // states
  const isLoading = ref(true)
  const isSaving = ref(false)
  const loadingTechnologies = ref(true)
  const loadingStudents = ref(true)
  const showSuccessMessage = ref(false)
  const showErrorMessage = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')
  const showImageUrlModal = ref(false)
  const imageUrl = ref('')
  const selectedStudent = ref('')
  
  // données formulaire
  const formData = ref({
    title: '',
    description: '',
    url: '',
    img: '',
    promotion: '',
    categories: [],
    tech: [],
    students: [],
    visible: true
  })
  
  const technologies = ref([])
  const students = ref([])
  const promotions = ref([])
  
  // erreurs de validation
  const errors = ref({
    title: '',
    description: '',
    url: '',
    img: '',
    promotion: '',
    categories: '',
    tech: '',
    students: ''
  })
  
  const availableCategories = [
    'Front-End',
    'Back-End',
    'Full-Stack',
    'DevOps',
    'User Interface',
    'System Design',
    'User Experience',
    'Data',
    'AI'
  ]
  
  // Étudiants disponibles (non sélectionnés)
  const availableStudents = computed(() => {
    return students.value.filter(student => !formData.value.students.includes(student.id))
  })
  
  // Charge les données au chargement du composant
  onMounted(async () => {
    try {
      isLoading.value = true
      
      // Chargement des données de référence
      await Promise.all([
        loadTechnologies(),
        loadStudents(),
        loadPromotions()
      ])
      
      // Si on est en mode édition, charger les données du projet
      if (props.projectId) {
        await loadProject(props.projectId)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      showError('Erreur lors du chargement des données. Veuillez réessayer.')
    } finally {
      isLoading.value = false
    }
  })
  
  // chargement des technologies depuis l'API
  const loadTechnologies = async () => {
    try {
      loadingTechnologies.value = true
      
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      const techData = [
        { id: 'rec1', name: 'JavaScript', icon: 'https://cdn.iconscout.com/icon/free/png-256/javascript-2752148-2284965.png' },
        { id: 'rec2', name: 'React', icon: 'https://cdn.iconscout.com/icon/free/png-256/react-3-1175109.png' },
        { id: 'rec3', name: 'Node.js', icon: 'https://cdn.iconscout.com/icon/free/png-256/nodejs-2-226035.png' },
        { id: 'rec4', name: 'Python', icon: 'https://cdn.iconscout.com/icon/free/png-256/python-2-226051.png' },
        { id: 'rec5', name: 'Docker', icon: 'https://cdn.iconscout.com/icon/free/png-256/docker-226091.png' }
      ]
      
      technologies.value = techData
    } catch (error) {
      console.error('Erreur lors du chargement des technologies:', error)
      throw error
    } finally {
      loadingTechnologies.value = false
    }
  }
  
  // chargement des étudiants depuis l'API
  const loadStudents = async () => {
    try {
      loadingStudents.value = true
      
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      const studentsData = [
        { id: 'rec1', firstName: 'Sami', lastName: 'Assiakh' },
        { id: 'rec2', firstName: 'Aria', lastName: 'Aman' },
        { id: 'rec3', firstName: 'Moussa Seydou', lastName: 'Traore' },
        { id: 'rec4', firstName: 'Moustapha', lastName: 'Chegdali' },
        { id: 'rec5', firstName: 'John', lastName: 'Doe' }
      ]
      
      students.value = studentsData
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error)
      throw error
    } finally {
      loadingStudents.value = false
    }
  }
  
  // chargement des promotions depuis l'API
  const loadPromotions = async () => {
    try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      const promotionsData = [
        { id: 'rec1', name: '5IW1 - ESGI 2024' },
        { id: 'rec2', name: '4IW1 - ESGI 2024' },
        { id: 'rec3', name: '3IW1 - ESGI 2024' },
        { id: 'rec4', name: '5IW1 - ESGI 2023' },
        { id: 'rec5', name: '4IW1 - ESGI 2023' }
      ]
      
      promotions.value = promotionsData
    } catch (error) {
      console.error('Erreur lors du chargement des promotions:', error)
      throw error
    }
  }
  
  // chargement des données d'un projet existant
  const loadProject = async (projectId) => {
    try {
      // exemple données mockées
      // à remplacer soon par un appel API Airtable
      const project = {
        id: projectId,
        title: 'Portfolio Website',
        description: 'A modern portfolio website with dark theme and responsive design',
        url: 'https://portfolio.example.com',
        img: 'https://picsum.photos/id/1/500/300',
        promotion: 'rec1',
        categories: ['Front-End', 'User Interface'],
        tech: ['rec1', 'rec2'],
        students: ['rec1', 'rec2'],
        visible: true
      }
      
      // affectation des données au formulaire
      formData.value = {
        title: project.title,
        description: project.description,
        url: project.url,
        img: project.img,
        promotion: project.promotion,
        categories: project.categories,
        tech: project.tech,
        students: project.students,
        visible: project.visible
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error)
      throw error
    }
  }
  
  // check si le formulaire est valide
  const validateForm = () => {
    let isValid = true
    errors.value = {
      title: '',
      description: '',
      url: '',
      img: '',
      promotion: '',
      categories: '',
      tech: '',
      students: ''
    }
    
    // Titre
    if (!formData.value.title.trim()) {
      errors.value.title = 'Le titre est requis'
      isValid = false
    }
    
    // Description
    if (!formData.value.description.trim()) {
      errors.value.description = 'La description est requise'
      isValid = false
    }
    
    // URL (validation du format si présent)
    if (formData.value.url && !isValidUrl(formData.value.url)) {
      errors.value.url = 'URL invalide'
      isValid = false
    }
    
    // Catégories
    if (formData.value.categories.length === 0) {
      errors.value.categories = 'Au moins une catégorie est requise'
      isValid = false
    }
    
    // Technologies
    if (formData.value.tech.length === 0) {
      errors.value.tech = 'Au moins une technologie est requise'
      isValid = false
    }
    
    // Promotion
    if (!formData.value.promotion) {
      errors.value.promotion = 'La promotion est requise'
      isValid = false
    }
    
    // Étudiants
    if (formData.value.students.length === 0) {
      errors.value.students = 'Au moins un étudiant est requis'
      isValid = false
    }
    
    return isValid
  }
  
  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }
  
  // enregistrement du projet
  const saveProject = async () => {
    if (!validateForm()) {
      const firstErrorElement = document.querySelector('.error-message')
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    try {
      isSaving.value = true
      
      // Préparer les données
      const projectData = {
        title: formData.value.title,
        description: formData.value.description,
        url: formData.value.url,
        img: formData.value.img,
        promotion: formData.value.promotion,
        categories: formData.value.categories,
        tech: formData.value.tech,
        students: formData.value.students,
        visible: formData.value.visible
      }
      
      // exemple d'appel API
      if (props.projectId) {
        // await updateProject(props.projectId, projectData)
        console.log('Projet mis à jour:', props.projectId, projectData)
        showSuccess('Projet mis à jour avec succès')
      } else {
        // await createProject(projectData)
        console.log('Projet créé:', projectData)
        showSuccess('Projet créé avec succès')
      }
      
      setTimeout(() => {
        emit('saved')
      }, 1500)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error)
      showError('Erreur lors de l\'enregistrement du projet. Veuillez réessayer.')
    } finally {
      isSaving.value = false
    }
  }
  
  // anuule la création/modification et revient à la liste
  const cancel = () => {
    emit('cancelled')
  }
  
  // gère le téléchargement d'une image
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // TODO : à changer
      // exemple : ici on utilise une url locale
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.img = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  // suppression image actuelle
  const removeImage = () => {
    formData.value.img = ''
    // Réinitialise l'input file
    const fileInput = document.getElementById('image-upload')
    if (fileInput) {
      fileInput.value = ''
    }
  }
  
  // ouvre la modal pour ajouter une image par URL
  const promptImageUrl = () => {
    imageUrl.value = ''
    showImageUrlModal.value = true
  }
  
  // ajout image par url
  const addImageByUrl = () => {
    if (imageUrl.value && isValidUrl(imageUrl.value)) {
      formData.value.img = imageUrl.value
      showImageUrlModal.value = false
    } else {
      errorMessage.value = 'URL invalide'
      showErrorMessage.value = true
      setTimeout(() => {
        showErrorMessage.value = false
      }, 3000)
    }
  }
  
  // active/désactive une technologie
  const toggleTechnology = (techId) => {
    const index = formData.value.tech.indexOf(techId)
    if (index === -1) {
      formData.value.tech.push(techId)
    } else {
      formData.value.tech.splice(index, 1)
    }
  }
  
  // ajoute un étudiant
  const addStudent = () => {
    if (selectedStudent.value && !formData.value.students.includes(selectedStudent.value)) {
      formData.value.students.push(selectedStudent.value)
      selectedStudent.value = ''
    }
  }
  
  // supprime un étudiant
  const removeStudent = (studentId) => {
    const index = formData.value.students.indexOf(studentId)
    if (index !== -1) {
      formData.value.students.splice(index, 1)
    }
  }
  
  // obtient le nom complet d'un étudiant à partir de son ID
  const getStudentName = (studentId) => {
    const student = students.value.find(s => s.id === studentId)
    return student ? `${student.firstName} ${student.lastName}` : 'Étudiant inconnu'
  }
  
  const showSuccess = (message) => {
    successMessage.value = message
    showSuccessMessage.value = true
    setTimeout(() => {
      showSuccessMessage.value = false
    }, 3000)
  }
  
  const showError = (message) => {
    errorMessage.value = message
    showErrorMessage.value = true
    setTimeout(() => {
      showErrorMessage.value = false
    }, 5000)
  }
  </script>
  
  <style scoped>
  .project-form-container {
    position: relative;
  }
  
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 1rem;
    color: #607B96;
    font-family: 'Fira Code', monospace;
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
  
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  
  .form-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-section {
    background-color: #011627;
    border: 1px solid #1E2D3D;
    border-radius: 8px;
    padding: 1.5rem;
  }
  
  .section-title {
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    color: #E5E9F0;
    margin-bottom: 1.25rem;
    font-weight: 500;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .form-group:last-child {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #607B96;
    margin-bottom: 0.5rem;
  }
  
  .required {
    color: #E99287;
  }
  
  input[type="text"],
  input[type="url"],
  textarea,
  select {
    width: 100%;
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    padding: 0.75rem;
    color: #E5E9F0;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
  }
  
  input[type="text"]:focus,
  input[type="url"]:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #43D9AD;
  }
  
  textarea {
    resize: vertical;
  }
  
  .error-message {
    display: block;
    color: #E99287;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
  
  .categories-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
  
  .category-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .category-checkbox input[type="checkbox"] {
    width: 16px;
    height: 16px;
    appearance: none;
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 3px;
    cursor: pointer;
  }
  
  .category-checkbox input[type="checkbox"]:checked {
    background-color: #43D9AD;
    border-color: #43D9AD;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23011221'%3E%3Cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3E%3C/svg%3E");
    background-size: 12px;
    background-repeat: no-repeat;
    background-position: center;
  }
  
  .category-checkbox label {
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    color: #607B96;
    cursor: pointer;
    margin-bottom: 0;
  }
  
  .visibility-toggle {
    display: flex;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .toggle-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background-color: #011221;
    color: #607B96;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .toggle-option.active {
    background-color: #1E2D3D;
    color: #E5E9F0;
  }
  
  .toggle-option:first-child {
    border-right: 1px solid #1E2D3D;
  }
  
  .toggle-option:first-child.active {
    color: #43D9AD;
  }
  
  .toggle-option:last-child.active {
    color: #E99287;
  }
  
  .image-upload-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .image-preview {
    width: 100%;
    height: 200px;
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: #607B96;
  }
  
  .remove-image-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: rgba(1, 8, 14, 0.7);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E99287;
    cursor: pointer;
  }
  
  .upload-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .hidden-input {
    display: none;
  }
  
  .upload-btn,
  .url-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #1E2D3D;
    border: none;
    border-radius: 4px;
    padding: 0.625rem 1rem;
    color: #E5E9F0;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .upload-btn:hover,
  .url-btn:hover {
    background-color: #263B50;
  }
  
  .technologies-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .technology-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 80px;
    padding: 0.75rem;
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .technology-item:hover {
    border-color: #607B96;
  }
  
  .technology-item.active {
    background-color: #1E2D3D;
    border-color: #43D9AD;
  }
  
  .tech-icon {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
  
  .tech-name {
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
    color: #607B96;
    text-align: center;
  }
  
  .technology-item.active .tech-name {
    color: #E5E9F0;
  }
  
  .students-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .selected-students {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .selected-student {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #1E2D3D;
    border-radius: 16px;
    padding: 0.375rem 0.75rem;
    color: #E5E9F0;
    font-family: 'Fira Code', monospace;
    font-size: 0.75rem;
  }
  
  .remove-student {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: #607B96;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .remove-student:hover {
    color: #E99287;
  }
  
  .add-student select {
    width: 100%;
  }
  
  .loading-inline {
    padding: 0.75rem;
    background-color: #011221;
    border: 1px solid #1E2D3D;
    border-radius: 4px;
    color: #607B96;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
  }
  
  .form-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  .cancel-btn,
  .save-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cancel-btn {
    background-color: transparent;
    border: 1px solid #607B96;
    color: #607B96;
  }
  
  .cancel-btn:hover {
    border-color: #E5E9F0;
    color: #E5E9F0;
  }
  
  .save-btn {
    background-color: #43D9AD;
    border: none;
    color: #01080E;
  }
  
  .save-btn:hover {
    background-color: #4FE0B6;
  }
  
  .save-btn:disabled {
    background-color: #1E2D3D;
    color: #607B96;
    cursor: not-allowed;
  }
  
  .btn-spinner {
    border: 2px solid #01080E;
    border-radius: 50%;
    border-top: 2px solid transparent;
    width: 16px;
    height: 16px;
    animation: spin 1s linear infinite;
  }
  
  .success-message {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: rgba(67, 217, 173, 0.1);
    border-left: 4px solid #43D9AD;
    border-radius: 4px;
    padding: 1rem 1.5rem;
    color: #43D9AD;
    font-family: 'Fira Code', monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
    z-index: 100;
  }
  
  .error-toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background-color: rgba(233, 146, 135, 0.1);
    border-left: 4px solid #E99287;
    border-radius: 4px;
    padding: 1rem 1.5rem;
    color: #E99287;
    font-family: 'Fira Code', monospace;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
    z-index: 100;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
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
    width: 400px;
    max-width: 90%;
    padding: 1.5rem;
    position: relative;
  }
  
  .modal-title {
    font-family: 'Fira Code', monospace;
    font-size: 1.125rem;
    color: #E5E9F0;
    margin-bottom: 1.5rem;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .confirm-btn {
    background-color: #43D9AD;
    border: none;
    color: #01080E;
    border-radius: 4px;
    padding: 0.625rem 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .confirm-btn:hover {
    background-color: #4FE0B6;
  }
  
  .close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: #607B96;
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .close-modal:hover {
    color: #E5E9F0;
  }
  </style>