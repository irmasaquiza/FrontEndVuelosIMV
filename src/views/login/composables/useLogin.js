import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../../api/axios'

export function useLogin() {
  const router = useRouter()

  const form = reactive({
    login: '',
    password: ''
  })

  const touched = reactive({
    login: false,
    password: false
  })

  const loading = ref(false)
  const generalError = ref('')
  const showPassword = ref(false)

  const errors = computed(() => ({
    login: !form.login ? 'El usuario es obligatorio.' : '',
    password: !form.password ? 'La contrasena es obligatoria.' : ''
  }))

  function markAllTouched() {
    touched.login = true
    touched.password = true
  }

  function getTokenFromResponse(response) {
    return response?.data?.data?.token || response?.data?.token || response?.data?.accessToken
  }

  function getFriendlyError(error) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Verifica tu conexion o intenta nuevamente.'
    }

    if (error.response.status === 401 || error.response.status === 400) {
      return 'Credenciales invalidas. Revisa tu usuario y contrasena.'
    }

    if (error.response.status >= 500) {
      return 'El servidor no pudo procesar el inicio de sesion. Intenta mas tarde.'
    }

    return 'No fue posible iniciar sesion. Intenta nuevamente.'
  }

  function decodeTokenPayload(token) {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload)
    } catch (e) {
      console.error('Error decoding JWT', e)
      return null
    }
  }

  async function handleLogin() {
    generalError.value = ''
    markAllTouched()

    if (errors.value.login || errors.value.password) {
      return
    }

    loading.value = true

    try {
      const response = await api.post('/auth/login', {
        login: form.login,
        password: form.password
      })

      const token = getTokenFromResponse(response)

      if (!token) {
        generalError.value = 'El servidor no devolvió un token válido.'
        return
      }

      localStorage.setItem('token', token)
      
      const payload = decodeTokenPayload(token)
      let roleId = null
      
      if (payload) {
        // Checking common properties where roles might be stored. 
        // We will look for idRol directly or inside a role object/array.
        roleId = payload.idRol || payload.roleId || payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      }

      // Check if it's an array and get first element if so (e.g. ['ADMINISTRADOR'])
      if (Array.isArray(roleId)) {
        roleId = roleId[0]
      }
      
      roleId = String(roleId).toUpperCase()

      // Redirect based on role (1 or ADMINISTRADOR goes to /admin, others to /dashboard)
      if (roleId === '1' || roleId === 'ADMINISTRADOR' || roleId === 'ADMIN') {
        router.replace('/admin')
      } else {
        router.replace('/dashboard')
      }
      
    } catch (error) {
      generalError.value = getFriendlyError(error)
    } finally {
      loading.value = false
    }
  }

  function togglePasswordVisibility() {
    showPassword.value = !showPassword.value
  }

  return {
    errors,
    form,
    generalError,
    handleLogin,
    loading,
    showPassword,
    togglePasswordVisibility,
    touched
  }
}
