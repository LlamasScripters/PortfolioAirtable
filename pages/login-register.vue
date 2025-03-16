<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600">
        <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          {{ mode === 'login' ? 'Connexion' : 'Inscription' }}
        </h2>
      </div>
  
      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form @submit.prevent="handleSubmit" class="space-y-6">
  
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-white">Nom</label>
            <input v-model="nom" required type="text" class="block w-full rounded-md border py-1.5 px-3">
          </div>
  
          <div v-if="mode === 'register'">
            <label class="block text-sm font-medium text-white">Prénom</label>
            <input v-model="prenom" required type="text" class="block w-full rounded-md border py-1.5 px-3">
          </div>
  
          <div>
            <label class="block text-sm font-medium text-white">Email</label>
            <input v-model="email" required type="email" class="block w-full rounded-md border py-1.5 px-3">
          </div>
  
          <div>
            <label class="block text-sm font-medium text-white">Mot de passe</label>
            <input v-model="password" required type="password" class="block w-full rounded-md border py-1.5 px-3">
          </div>
  
          <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded">
            {{ mode === 'login' ? 'Se connecter' : 'S\'inscrire' }}
          </button>
        </form>
  
        <p class="mt-6 text-center text-sm text-gray-500">
          <a @click.prevent="toggleMode" class="text-indigo-600 cursor-pointer">
            {{ mode === 'login' ? 'Pas encore inscrit ?' : 'Déjà inscrit ?' }}
          </a>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from 'axios'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const mode = ref('login')
  const email = ref('')
  const password = ref('')
  const nom = ref('')
  const prenom = ref('')
  
  const router = useRouter()
  
  const handleSubmit = async () => {
    try {
      const endpoint = mode.value === 'login' ? '/api/auth/login' : '/api/auth/register'
  
      const payload = mode.value === 'login'
        ? { email: email.value, password: password.value }
        : { email: email.value, password: password.value, nom: nom.value, prenom: prenom.value }
  
      const { data } = await axios.post(endpoint, payload)
  
      if (mode.value === 'login') {
        // stockage en localStorage
        localStorage.setItem('user', JSON.stringify(data.loggedUser))
  
        // Redirection selon rôle
        if (data.loggedUser.role.includes('Administrateur')) {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
      } else {
        alert(`Inscription réussie : ${data.email}`)
      }
  
    } catch (e) {
      alert(e.response?.data?.statusMessage || 'Erreur réseau')
    }
  }
  
  const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login'
  }
  </script>
  