export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.client) {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user || !user.role.includes('Administrateur')) {
        return navigateTo('/')
      }
    }
  })
  