<template>
  <section class="admin-page">

    <h1>Gestión de Asientos 💺</h1>

    <p v-if="feedbackError" class="error">{{ feedbackError }}</p>
    <p v-if="feedbackSuccess" class="success">{{ feedbackSuccess }}</p>

    <!-- VUELOS -->
    <div class="panel">
      <h2>Seleccionar vuelo</h2>

      <table>
        <tr v-for="vuelo in vuelos" :key="vuelo.idVuelo">
          <td>{{ vuelo.numeroVuelo }}</td>
          <td>
            <button @click="selectVuelo(vuelo)">Administrar</button>
          </td>
        </tr>
      </table>
    </div>

    <!-- ASIENTOS -->
    <div v-if="selectedVuelo" class="panel">

      <h2>Asientos - {{ selectedVuelo.numeroVuelo }}</h2>

      <!-- FORM -->
      <form @submit.prevent="submitAsiento">

        <input v-model="asientoForm.numero_asiento" placeholder="A1" required />

        <select v-model="asientoForm.clase">
          <option>ECONOMICA</option>
          <option>EJECUTIVA</option>
          <option>PRIMERA</option>
        </select>

        <select v-model="asientoForm.posicion">
          <option value="">Posición</option>
          <option>VENTANA</option>
          <option>PASILLO</option>
          <option>CENTRO</option>
        </select>

        <input v-model="asientoForm.precio_extra" type="number" />

        <button>
          {{ editingAsiento ? 'Actualizar' : 'Crear' }}
        </button>
      </form>

      <!-- LISTA -->
      <div class="seat-grid">
        <div v-for="a in asientos" :key="a.idAsiento" class="seat-card">

          <strong>{{ a.numeroAsiento }}</strong>
          <span>{{ a.clase }}</span>
          <span>{{ a.posicion }}</span>
          <span>${{ a.precioExtra }}</span>
          <span>{{ a.disponible ? 'Disponible' : 'Ocupado' }}</span>

          <button @click="editAsiento(a)">Editar</button>
          <button @click="toggleDisponibilidad(a)">Estado</button>

        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const vuelos = ref([])
const asientos = ref([])
const selectedVuelo = ref(null)

const feedbackError = ref('')
const feedbackSuccess = ref('')

const editingAsiento = ref(null)

const asientoForm = reactive({
  numero_asiento: '',
  clase: 'ECONOMICA',
  precio_extra: 0,
  posicion: ''
})

/* ---------------- ERROR ---------------- */

function setError(e) {
  console.log("ERROR:", e.response?.data)

  if (e.response?.data?.errors) {
    feedbackError.value = Object.values(e.response.data.errors)
      .flat()
      .join(' | ')
  } else {
    feedbackError.value = e.response?.data?.title || e.message
  }
}

function setSuccess(msg) {
  feedbackError.value = ''
  feedbackSuccess.value = msg
}

/* ---------------- FETCH ---------------- */

async function fetchVuelos() {
  const res = await api.get('/vuelos', {
    params: { page: 1, page_size: 50 }
  })

  vuelos.value = res.data.data
}

async function selectVuelo(v) {
  selectedVuelo.value = v
  fetchAsientos()
}

async function fetchAsientos() {
  const res = await api.get(`/vuelos/${selectedVuelo.value.idVuelo}/asientos`)
  asientos.value = res.data.data || res.data
}

/* ---------------- EDIT ---------------- */

function editAsiento(a) {
  editingAsiento.value = a

  asientoForm.numero_asiento = a.numeroAsiento
  asientoForm.clase = a.clase
  asientoForm.precio_extra = a.precioExtra
  asientoForm.posicion = a.posicion
}

/* ---------------- CREATE / UPDATE ---------------- */

async function submitAsiento() {

  const payload = {
    numeroAsiento: asientoForm.numero_asiento.toUpperCase(),
    clase: asientoForm.clase,
    disponible: true,
    precioExtra: Number(asientoForm.precio_extra || 0),
    posicion: asientoForm.posicion || null
  }

  console.log("JSON ENVIADO:", payload)

  try {

    if (editingAsiento.value) {

      // 🔥 PATCH EDITAR
      await api.patch(
        `/vuelos/${selectedVuelo.value.idVuelo}/asientos/${editingAsiento.value.idAsiento}`,
        payload
      )

      setSuccess("Asiento actualizado")

    } else {

      // POST
      await api.post(
        `/vuelos/${selectedVuelo.value.idVuelo}/asientos`,
        payload
      )

      setSuccess("Asiento creado")
    }

    resetForm()
    fetchAsientos()

  } catch (e) {
    setError(e)
  }
}

/* ---------------- TOGGLE ---------------- */

async function toggleDisponibilidad(a) {
  try {
    await api.patch(
      `/vuelos/${selectedVuelo.value.idVuelo}/asientos/${a.idAsiento}`,
      {
        numeroAsiento: a.numeroAsiento,
        clase: a.clase,
        disponible: !a.disponible,
        precioExtra: a.precioExtra,
        posicion: a.posicion
      }
    )

    setSuccess("Estado actualizado")
    fetchAsientos()

  } catch (e) {
    setError(e)
  }
}

/* ---------------- RESET ---------------- */

function resetForm() {
  asientoForm.numero_asiento = ''
  asientoForm.clase = 'ECONOMICA'
  asientoForm.precio_extra = 0
  asientoForm.posicion = ''
  editingAsiento.value = null
}

onMounted(fetchVuelos)
</script>

<style>
.panel { margin:20px; padding:10px; border:1px solid #ccc }
.seat-grid { display:grid; grid-template-columns: repeat(5,1fr); gap:10px }
.seat-card { border:1px solid #ccc; padding:10px }
.error { color:red }
.success { color:green }
</style>