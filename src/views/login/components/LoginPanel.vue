<template>
  <main class="login-shell">
    <section class="login-brand">
      <div class="brand-plane-icon">
        <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
          <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
        </svg>
      </div>
      <p class="brand-name">Nacho<span>Flight</span></p>
      <h1>Tu próximo destino te espera</h1>
      <p>Reserva vuelos, gestiona tus viajes y descubre el mundo con la mejor experiencia de viaje.</p>
    </section>

    <section class="login-card" aria-labelledby="login-title">
      <div class="login-logo mb-4">
        <div class="login-logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
          </svg>
        </div>
        <span class="login-logo-text">Nacho<span>Flight</span></span>
      </div>

      <div class="login-card-header mb-4">
        <h2 id="login-title" class="fw-bold">Iniciar sesión</h2>
        <p class="text-muted mb-0">Bienvenido de vuelta. Ingresa tus credenciales para continuar.</p>
      </div>

      <div v-if="generalError" class="alert alert-danger" role="alert">
        {{ generalError }}
      </div>

      <form class="login-form" novalidate @submit.prevent="$emit('submit-login')">
        <div class="mb-3">
          <label class="form-label label-upper" for="login-user">Usuario</label>
          <input
            id="login-user"
            v-model.trim="form.login"
            autocomplete="username"
            class="form-control form-control-nf"
            :class="{ 'is-invalid': touched.login && errors.login }"
            :disabled="loading"
            placeholder="Ingresa tu usuario"
            type="text"
            @blur="touched.login = true"
          />
          <div v-if="touched.login && errors.login" class="invalid-feedback">
            {{ errors.login }}
          </div>
        </div>

        <div class="mb-2">
          <div class="d-flex align-items-center justify-content-between gap-3 mb-1">
            <label class="form-label label-upper mb-0" for="login-password">Contraseña</label>
            <button
              class="password-toggle"
              type="button"
              :disabled="loading"
              @click="$emit('toggle-password')"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
          <input
            id="login-password"
            v-model="form.password"
            autocomplete="current-password"
            class="form-control form-control-nf"
            :class="{ 'is-invalid': touched.password && errors.password }"
            :disabled="loading"
            placeholder="Tu contraseña"
            :type="showPassword ? 'text' : 'password'"
            @blur="touched.password = true"
          />
          <div v-if="touched.password && errors.password" class="invalid-feedback">
            {{ errors.password }}
          </div>
        </div>

        <p class="login-note text-muted small mt-2 mb-3">
          No guardes credenciales en equipos compartidos.
        </p>

        <button class="btn btn-nf w-100" :disabled="loading" type="submit">
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          {{ loading ? 'Validando acceso...' : 'Ingresar' }}
        </button>
      </form>

      <hr class="my-4" />
      <p class="text-center text-muted" style="font-size: 0.72rem;">
        © 2026 NachoFlight. Todos los derechos reservados.
      </p>
    </section>
  </main>
</template>

<script setup>
defineProps({
  errors: { type: Object, required: true },
  form: { type: Object, required: true },
  generalError: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false },
  touched: { type: Object, required: true }
})

defineEmits(['submit-login', 'toggle-password'])
</script>

<style scoped>
.login-shell {
  min-height: calc(100vh - 4rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 420px);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Lado izquierdo ── */
.login-brand {
  background: linear-gradient(135deg, #d60f2b 0%, #a00824 55%, #6b0016 100%);
  border-radius: 16px;
  padding: clamp(2rem, 5vw, 3.5rem);
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-brand::before {
  content: '';
  position: absolute;
  right: -80px; top: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
  pointer-events: none;
}

.login-brand::after {
  content: '';
  position: absolute;
  left: -60px; bottom: -60px;
  width: 220px; height: 220px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  pointer-events: none;
}

.brand-plane-icon {
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.brand-name {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;
  margin-bottom: 0.75rem;
}

.brand-name span {
  color: rgba(255,255,255,0.5);
}

.login-brand h1 {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.75rem;
  color: #fff;
}

.login-brand > p {
  color: rgba(255,255,255,0.75);
  font-size: 0.95rem;
  max-width: 400px;
  line-height: 1.65;
}

/* ── Lado derecho ── */
.login-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  padding: clamp(1.75rem, 4vw, 2.5rem);
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

.login-card-header h2 {
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

.form-control-nf.is-invalid:focus {
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.12);
}

.password-toggle {
  border: 0;
  background: transparent;
  color: #d60f2b;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 0;
  line-height: 1;
}

.password-toggle:disabled { opacity: 0.5; }

.login-note { line-height: 1.5; }

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

@media (max-width: 860px) {
  .login-shell {
    grid-template-columns: 1fr;
    align-items: start;
  }
  .login-brand { min-height: auto; }
  .login-brand h1 { font-size: 1.7rem; }
}
</style>