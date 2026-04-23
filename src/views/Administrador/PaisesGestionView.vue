<template>
  <section class="admin-page">
    <header class="page-header">
      <div>
        <p class="eyebrow">Administrador</p>
        <h1>Gestion de paises</h1>
        <p class="subtitle">
          El contrato actual solo expone lectura para paises, por eso esta pantalla es de consulta.
        </p>
      </div>

      <div class="header-actions">
        <router-link class="ghost-btn" to="/admin">Volver al modulo</router-link>
        <router-link class="ghost-btn" to="/home">Inicio</router-link>
      </div>
    </header>

    <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>Catalogo de paises</h2>
          <p>Consulta y filtra por continente o estado.</p>
        </div>
        <button class="ghost-btn" :disabled="loading" @click="fetchPaises">
          {{ loading ? 'Cargando...' : 'Recargar' }}
        </button>
      </div>

      <div class="filters">
        <label class="field">
          <span>Continente</span>
          <input v-model="filters.continente" placeholder="Ej. America del Sur" />
        </label>

        <label class="field">
          <span>Estado</span>
          <select v-model="filters.estado">
            <option value="">Todos</option>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </label>

        <button class="primary-btn" :disabled="loading" @click="fetchPaises">
          Filtrar
        </button>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>ISO2</th>
              <th>ISO3</th>
              <th>Continente</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!paises.length && !loading">
              <td colspan="6">No hay paises para mostrar.</td>
            </tr>
                <tr v-for="pais in paises" :key="pais.idPais">
                  <td>{{ pais.idPais }}</td>
                  <td>{{ pais.nombre }}</td>
                  <td>{{ pais.codigoIso2 }}</td>
                  <td>{{ pais.codigoIso3 || '-' }}</td>
                  <td>{{ pais.continente || '-' }}</td>
                  <td>
                    <span class="status" :class="pais.estado === 'ACTIVO' ? 'ok' : 'muted'">
                      {{ pais.estado }}
                    </span>
                  </td>
                </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { listPaises } from '../../services/adminService'

const paises = ref([])
const loading = ref(false)
const errorMessage = ref('')

const filters = reactive({
  continente: '',
  estado: ''
})

async function fetchPaises() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { data } = await listPaises(filters)
    paises.value = Array.isArray(data) ? data : []
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.mensaje ||
      error?.response?.data?.detalle ||
      error?.message ||
      'No se pudieron cargar los paises.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPaises)
</script>

<style scoped src="./admin.css"></style>
