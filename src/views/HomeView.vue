<template>
  <section class="dashboard">
    <div class="hero">
      <div>
        <p class="eyebrow">Panel principal</p>
        <h1>Bienvenido al sistema de vuelos</h1>
        <p class="lead">
          Desde aqui puedes administrar catalogos base y seguir construyendo el resto del front por modulos.
        </p>
      </div>

      <button class="secondary-btn" @click="logout">Cerrar sesion</button>
    </div>

    <div class="grid">
      <article class="card card-primary">
        <p class="card-tag">Primer modulo</p>
        <h2>Administracion de catalogos</h2>
        <p>
          Gestiona paises, ciudades y aeropuertos siguiendo el contrato del backend.
        </p>

        <router-link class="primary-btn" to="/admin">
          Abrir modulo
        </router-link>
      </article>

      <article class="card">
        <p class="card-tag">Estado actual</p>
        <h2>Autenticacion lista</h2>
        <p>
          El JWT se conserva en <code>localStorage</code> y las rutas privadas quedan protegidas por el router.
        </p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/')
}
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 1.5rem;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.75rem;
  border-radius: 24px;
  background: linear-gradient(135deg, #0f172a, #1d4ed8);
  color: #f8fafc;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
}

.eyebrow,
.card-tag {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  opacity: 0.72;
}

.lead {
  max-width: 48rem;
  margin-top: 0.75rem;
  color: rgba(248, 250, 252, 0.86);
}

.grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.card {
  display: grid;
  gap: 0.85rem;
  padding: 1.5rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}

.card-primary {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(219, 234, 254, 0.95));
}

.primary-btn,
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.75rem 1.1rem;
  border-radius: 999px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.primary-btn {
  width: fit-content;
  background: #0f172a;
  color: white;
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.16);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.22);
}

@media (max-width: 720px) {
  .hero {
    display: grid;
  }
}
</style>
