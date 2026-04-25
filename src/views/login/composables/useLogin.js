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
        generalError.value = 'El servidor no devolvio un token valido.'
        return
      }

      localStorage.setItem('token', token)
      router.replace('/home')
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
