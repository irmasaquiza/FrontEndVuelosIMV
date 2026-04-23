<template>
  <section class="admin-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administrador</p>
        <h1>Modulo de administracion</h1>
        <p class="subtitle">
          Escoge la gestion que quieres trabajar y entra directo al mantenimiento correspondiente.
        </p>
      </div>

      <div class="header-actions">
        <router-link class="ghost-btn" to="/home">Volver al inicio</router-link>
        <button class="ghost-btn" @click="logout">Cerrar sesion</button>
      </div>
    </header>

    <section class="admin-grid">
      <article class="admin-card">
        <p class="card-tag">Consulta</p>
        <h2>Gestion de paises</h2>
        <p>
          Revisa el catalogo de paises y aplica filtros por continente o estado.
        </p>

        <router-link class="primary-btn" to="/admin/paises">
          Ir a paises
        </router-link>
      </article>

      <article class="admin-card">
        <p class="card-tag">CRUD</p>
        <h2>Gestion de ciudades</h2>
        <p>
          Crea, actualiza y elimina ciudades relacionandolas con su pais.
        </p>

        <router-link class="primary-btn" to="/admin/ciudades">
          Ir a ciudades
        </router-link>
      </article>

      <article class="admin-card">
        <p class="card-tag">CRUD</p>
        <h2>Gestion de aeropuertos</h2>
        <p>
          Administra aeropuertos con sus codigos, ubicacion y filtros por pais y ciudad.
        </p>

        <router-link class="primary-btn" to="/admin/aeropuertos">
          Ir a aeropuertos
        </router-link>
      </article>

      <article class="admin-card featured">
        <p class="card-tag">Operaciones</p>
        <h2>Gestion de vuelos y escalas</h2>
        <p>
          Programa vuelos, define origen y destino, y agrega escalas por aeropuertos intermedios.
        </p>

        <router-link class="primary-btn" to="/admin/vuelos">
          Ir a vuelos
        </router-link>
      </article>

      <article class="admin-card">
        <p class="card-tag">Cabina</p>
        <h2>Gestion de asientos</h2>
        <p>
          Selecciona un vuelo, crea asientos por clase y controla su disponibilidad.
        </p>

        <router-link class="primary-btn" to="/admin/asientos">
          Ir a asientos
        </router-link>
      </article>

      <article class="admin-card">
        <p class="card-tag">CRM</p>
        <h2>Gestion de clientes</h2>
        <p>
          Registra clientes, actualiza sus datos y controla su estado segun el contrato.
        </p>

        <router-link class="primary-btn" to="/admin/clientes">
          Ir a clientes
        </router-link>
      </article>
    </section>
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

<style scoped src="./admin.css"></style>
