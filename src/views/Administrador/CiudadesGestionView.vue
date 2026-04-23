<template>
  <section>
    <h1>Ciudades 🌎</h1>

    <!-- MENSAJES -->
    <p v-if="errorMsg" style="color:red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color:green">{{ successMsg }}</p>

    <!-- FORM -->
    <form @submit.prevent="submitCiudad">
      <h3>{{ form.idCiudad ? 'Editar ciudad' : 'Nueva ciudad' }}</h3>

      <select v-model="form.idPais" required>
        <option value="">Seleccione país</option>
        <option v-for="p in paises" :key="p.idPais" :value="p.idPais">
          {{ p.nombre }}
        </option>
      </select>

      <input v-model="form.nombre" placeholder="Nombre" required />

      <input v-model="form.zonaHoraria" placeholder="Zona Horaria" />

      <input v-model="form.latitud" type="number" placeholder="Latitud" />
      <input v-model="form.longitud" type="number" placeholder="Longitud" />

      <button type="submit">
        {{ form.idCiudad ? 'Actualizar' : 'Crear' }}
      </button>

      <button v-if="form.idCiudad" type="button" @click="resetForm">
        Cancelar
      </button>
    </form>

    <hr />

    <!-- TABLA -->
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>País</th>
          <th>Zona Horaria</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="c in ciudades" :key="c.idCiudad">
          <td>{{ c.idCiudad }}</td>
          <td>{{ c.nombre }}</td>
          <td>{{ getPaisNombre(c.idPais) }}</td>
          <td>{{ c.zonaHoraria }}</td>
          <td>{{ c.estado }}</td>
          <td>
            <button @click="editCiudad(c)">Editar</button>
            <button @click="deleteCiudadAction(c)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const ciudades = ref([])
const paises = ref([])

const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  idCiudad: null,
  idPais: '',
  nombre: '',
  zonaHoraria: '',
  latitud: '',
  longitud: ''
})

function resetForm() {
  form.idCiudad = null
  form.idPais = ''
  form.nombre = ''
  form.zonaHoraria = ''
  form.latitud = ''
  form.longitud = ''
}

function getPaisNombre(id) {
  return paises.value.find(p => p.idPais === id)?.nombre || id
}

function editCiudad(c) {
  form.idCiudad = c.idCiudad
  form.idPais = c.idPais
  form.nombre = c.nombre
  form.zonaHoraria = c.zonaHoraria
  form.latitud = c.latitud
  form.longitud = c.longitud
}

function buildPayload() {
  return {
    idPais: Number(form.idPais),
    nombre: form.nombre,
    zonaHoraria: form.zonaHoraria || null,
    latitud: form.latitud ? Number(form.latitud) : null,
    longitud: form.longitud ? Number(form.longitud) : null
  }
}

function manejarError(error) {
  successMsg.value = ''

  // 🔥 manejo de errores de validación backend
  if (error.response?.data?.errors) {
    const errores = error.response.data.errors

    errorMsg.value = Object.values(errores)
      .flat()
      .join(' | ')
  } else {
    errorMsg.value =
      error.response?.data?.title ||
      error.response?.data?.mensaje ||
      error.message ||
      'Error inesperado'
  }
}

async function fetchCiudades() {
  try {
    const res = await api.get('/ciudades')
    ciudades.value = res.data.data
  } catch (e) {
    manejarError(e)
  }
}

async function fetchPaises() {
  try {
    const res = await api.get('/paises')
    paises.value = res.data.data
  } catch (e) {
    manejarError(e)
  }
}

async function submitCiudad() {
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const payload = buildPayload()

    if (form.idCiudad) {
      await api.put(`/ciudades/${form.idCiudad}`, payload)
      successMsg.value = 'Ciudad actualizada correctamente'
    } else {
      const res = await api.post('/ciudades', payload)
      successMsg.value = `Ciudad creada: ${res.data.data.nombre}`
    }

    resetForm()
    fetchCiudades()
  } catch (e) {
    manejarError(e)
  }
}

async function deleteCiudadAction(c) {
  if (!confirm('¿Eliminar ciudad?')) return

  try {
    await api.delete(`/ciudades/${c.idCiudad}`)
    successMsg.value = 'Ciudad eliminada'
    fetchCiudades()
  } catch (e) {
    manejarError(e)
  }
}

onMounted(() => {
  fetchCiudades()
  fetchPaises()
})
</script>