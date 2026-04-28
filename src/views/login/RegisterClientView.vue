<template>
  <main class="register-shell">
    <section class="register-card" aria-labelledby="register-title">
      <div class="login-logo mb-4 justify-content-center">
        <div class="login-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
          </svg>
        </div>
        <span class="login-logo-text">Nacho<span>Flight</span></span>
      </div>

      <div class="register-card-header mb-4 text-center">
        <h2 id="register-title" class="fw-bold">Crear una cuenta</h2>
        <p class="text-muted mb-0">Únete para gestionar tus reservas y vuelos.</p>
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="alert alert-success" role="alert">
        {{ successMessage }}
      </div>

      <form class="register-form" novalidate @submit.prevent="handleRegister">
        
        <h6 class="text-uppercase fw-bold text-muted small mb-3 border-bottom pb-2">Datos Personales</h6>
        <div class="row g-3 mb-4">
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-nombre">Nombre</label>
            <input
              id="reg-nombre"
              v-model.trim="form.nombre"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Tu nombre"
              type="text"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-apellido">Apellido</label>
            <input
              id="reg-apellido"
              v-model.trim="form.apellido"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Tu apellido"
              type="text"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-identificacion">Identificación</label>
            <input
              id="reg-identificacion"
              v-model.trim="form.identificacion"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Cédula o Pasaporte"
              type="text"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-telefono">Teléfono</label>
            <input
              id="reg-telefono"
              v-model.trim="form.telefono"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Tu número"
              type="text"
              required
            />
          </div>
          <div class="col-12">
            <label class="form-label label-upper" for="reg-correo">Correo electrónico</label>
            <input
              id="reg-correo"
              v-model.trim="form.correo"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="tucorreo@ejemplo.com"
              type="email"
              required
            />
          </div>
        </div>

        <h6 class="text-uppercase fw-bold text-muted small mb-3 border-bottom pb-2">Datos de Acceso</h6>
        <div class="row g-3 mb-4">
          <div class="col-md-12">
            <label class="form-label label-upper" for="reg-username">Nombre de usuario</label>
            <input
              id="reg-username"
              v-model.trim="form.username"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Elige un usuario"
              type="text"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-password">Contraseña</label>
            <input
              id="reg-password"
              v-model="form.password"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Tu contraseña"
              type="password"
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label label-upper" for="reg-confirm">Confirmar contraseña</label>
            <input
              id="reg-confirm"
              v-model="form.confirmPassword"
              class="form-control form-control-nf"
              :disabled="loading"
              placeholder="Repite la contraseña"
              type="password"
              required
            />
          </div>
        </div>

        <button class="btn btn-nf w-100 mb-3" :disabled="loading" type="submit">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>

        <div class="text-center">
          <p class="text-muted small mb-1">¿Ya tienes una cuenta?</p>
          <router-link to="/" class="fw-bold text-decoration-none" style="color: #d60f2b;">Inicia sesión aquí</router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerAccount } from '../../services/authService'

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  nombre: '',
  apellido: '',
  identificacion: '',
  telefono: '',
  correo: '',
  username: '',
  password: '',
  confirmPassword: ''
})

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.nombre || !form.apellido || !form.identificacion || !form.telefono || !form.correo || !form.username || !form.password) {
    errorMessage.value = 'Por favor, completa todos los campos.'
    return
  }

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true

  try {
    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      identificacion: form.identificacion,
      correo: form.correo,
      telefono: form.telefono,
      username: form.username,
      password: form.password
    }
    
    await registerAccount(payload)

    successMessage.value = 'Cuenta creada con éxito. Redirigiendo al inicio de sesión...'
    
    // Redirigir al login después de un breve momento
    setTimeout(() => {
      router.push('/')
    }, 2000)

  } catch (error) {
    if (error?.response?.data?.errors) {
      errorMessage.value = Object.values(error.response.data.errors).flat().join(' | ')
    } else {
      errorMessage.value =
        error?.response?.data?.mensaje ||
        error?.response?.data?.message ||
        error?.message ||
        'Ocurrió un error al registrarse. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

.register-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  padding: clamp(1.75rem, 4vw, 2.5rem);
  width: 100%;
  max-width: 600px;
}

.login-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-logo-icon {
  width: 36px; height: 36px;
  background: #d60f2b;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.login-logo-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.4px;
}

.login-logo-text span { color: #d60f2b; }

.register-card-header h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a1a1a;
}

.label-upper {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #555;
}

.form-control-nf {
  border: 1.5px solid #e0e0e0;
  border-radius: 8px;
  min-height: 46px;
  background: #fafafa;
  font-size: 0.93rem;
  transition: border-color .2s, background .2s;
}

.form-control-nf:focus {
  border-color: #d60f2b;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(214, 15, 43, 0.1);
}

.btn-nf {
  background: #d60f2b;
  color: #fff;
  border: none;
  border-radius: 8px;
  min-height: 48px;
  font-weight: 800;
  font-size: 0.95rem;
  transition: background .2s, transform .1s;
}

.btn-nf:hover:not(:disabled) { background: #b50c24; color: #fff; }
.btn-nf:active:not(:disabled) { transform: scale(0.99); color: #fff; }
.btn-nf:disabled { background: #e8848f; color: #fff; }

@media (max-width: 600px) {
  .register-shell {
    padding: 1rem;
  }
}
</style>
