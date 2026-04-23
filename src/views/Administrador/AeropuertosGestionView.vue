<template>
  <section>
    <h1>Aeropuertos ✈️</h1>

    <!-- MENSAJES -->
    <p v-if="errorMsg" style="color:red">{{ errorMsg }}</p>
    <p v-if="successMsg" style="color:green">{{ successMsg }}</p>

    <!-- FORM -->
    <form @submit.prevent="submitAeropuerto">
      <h3>{{ form.idAeropuerto ? 'Editar aeropuerto' : 'Nuevo aeropuerto' }}</h3>

      <input v-model="form.codigoIata" placeholder="IATA" required />
      <input v-model="form.codigoIcao" placeholder="ICAO" />

      <input v-model="form.nombre" placeholder="Nombre" required />

      <select v-model="form.idPais" required>
        <option value="">Seleccione país</option>
        <option v-for="p in paises" :key="p.idPais" :value="p.idPais">
          {{ p.nombre }}
        </option>
      </select>

      <select v-model="form.idCiudad">
        <option value="">Seleccione ciudad</option>
        <option v-for="c in ciudades" :key="c.idCiudad" :value="c.idCiudad">
          {{ c.nombre }}
        </option>
      </select>

      <input v-model="form.zonaHoraria" placeholder="Zona Horaria" />
      <input v-model="form.latitud" type="number" placeholder="Latitud" />
      <input v-model="form.longitud" type="number" placeholder="Longitud" />

      <button type="submit">
        {{ form.idAeropuerto ? 'Actualizar' : 'Crear' }}
      </button>

      <button v-if="form.idAeropuerto" type="button" @click="resetForm">
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
          <th>IATA</th>
          <th>ICAO</th>
          <th>País</th>
          <th>Ciudad</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="a in aeropuertos" :key="a.idAeropuerto">
          <td>{{ a.idAeropuerto }}</td>
          <td>{{ a.nombre }}</td>
          <td>{{ a.codigoIata }}</td>
          <td>{{ a.codigoIcao }}</td>
          <td>{{ getPaisNombre(a.idPais) }}</td>
          <td>{{ getCiudadNombre(a.idCiudad) }}</td>
          <td>{{ a.estado }}</td>
          <td>
            <button @click="editAeropuerto(a)">Editar</button>
            <button @click="deleteAeropuertoAction(a)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const aeropuertos = ref([])
const paises = ref([])
const ciudades = ref([])

const errorMsg = ref('')
const successMsg = ref('')

const form = reactive({
  idAeropuerto: null,
  codigoIata: '',
  codigoIcao: '',
  nombre: '',
  idPais: '',
  idCiudad: '',
  zonaHoraria: '',
  latitud: '',
  longitud: ''
})

function resetForm() {
  form.idAeropuerto = null
  form.codigoIata = ''
  form.codigoIcao = ''
  form.nombre = ''
  form.idPais = ''
  form.idCiudad = ''
  form.zonaHoraria = ''
  form.latitud = ''
  form.longitud = ''
}

function getPaisNombre(id) {
  return paises.value.find(p => p.idPais === id)?.nombre || id
}

function getCiudadNombre(id) {
  return ciudades.value.find(c => c.idCiudad === id)?.nombre || id
}

function editAeropuerto(a) {
  form.idAeropuerto = a.idAeropuerto
  form.codigoIata = a.codigoIata
  form.codigoIcao = a.codigoIcao
  form.nombre = a.nombre
  form.idPais = a.idPais
  form.idCiudad = a.idCiudad
  form.zonaHoraria = a.zonaHoraria
  form.latitud = a.latitud
  form.longitud = a.longitud
}

function buildPayload() {
  return {
    codigoIata: form.codigoIata.toUpperCase(),
    codigoIcao: form.codigoIcao || null,
    nombre: form.nombre,
    idCiudad: form.idCiudad ? Number(form.idCiudad) : null,
    idPais: form.idPais ? Number(form.idPais) : null,
    zonaHoraria: form.zonaHoraria || null,
    latitud: form.latitud ? Number(form.latitud) : null,
    longitud: form.longitud ? Number(form.longitud) : null
  }
}

function manejarError(error) {
  successMsg.value = ''

  if (error.response?.data?.errors) {
    errorMsg.value = Object.values(error.response.data.errors)
      .flat()
      .join(' | ')
  } else {
    errorMsg.value =
      error.response?.data?.title ||
      error.response?.data?.mensaje ||
      error.message ||
      'Error inesperado'
  }

  console.log("ERROR:", error.response?.data)
}

async function fetchAeropuertos() {
  try {
    const res = await api.get('/aeropuertos')
    console.log("LISTA:", res.data)
    aeropuertos.value = res.data.data || res.data
  } catch (e) {
    manejarError(e)
  }
}

async function fetchPaises() {
  const res = await api.get('/paises')
  paises.value = res.data.data || res.data
}

async function fetchCiudades() {
  const res = await api.get('/ciudades')
  ciudades.value = res.data.data || res.data
}

async function submitAeropuerto() {
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const payload = buildPayload()
    console.log("ENVIANDO:", payload)

    if (form.idAeropuerto) {
      await api.put(`/aeropuertos/${form.idAeropuerto}`, {
        ...payload,
        estado: 'ACTIVO'
      })
      successMsg.value = 'Aeropuerto actualizado'
    } else {
      const res = await api.post('/aeropuertos', payload)
      console.log("RESPUESTA:", res.data)
      successMsg.value = 'Aeropuerto creado'
    }

    resetForm()
    await fetchAeropuertos()
  } catch (e) {
    manejarError(e)
  }
}

async function deleteAeropuertoAction(a) {
  if (!confirm('¿Eliminar aeropuerto?')) return

  try {
    await api.delete(`/aeropuertos/${a.idAeropuerto}`)
    successMsg.value = 'Eliminado correctamente'
    await fetchAeropuertos()
  } catch (e) {
    manejarError(e)
  }
}

onMounted(() => {
  fetchAeropuertos()
  fetchPaises()
  fetchCiudades()
})
</script>