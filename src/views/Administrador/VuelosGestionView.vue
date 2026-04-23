<template>
  <section class="container">

    <h1>✈️ Gestión de Vuelos</h1>

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <!-- FORM VUELO -->
    <div class="card">
      <h3>{{ vueloForm.idVuelo ? 'Editar vuelo' : 'Nuevo vuelo' }}</h3>

      <div class="grid">
        <select v-model="vueloForm.idAeropuertoOrigen">
          <option value="">Origen</option>
          <option v-for="a in aeropuertos" :key="a.idAeropuerto" :value="a.idAeropuerto">
            {{ a.codigoIata }} - {{ a.nombre }}
          </option>
        </select>

        <select v-model="vueloForm.idAeropuertoDestino">
          <option value="">Destino</option>
          <option v-for="a in aeropuertos" :key="a.idAeropuerto" :value="a.idAeropuerto">
            {{ a.codigoIata }} - {{ a.nombre }}
          </option>
        </select>

        <input v-model="vueloForm.numeroVuelo" placeholder="Número vuelo" />
        <input v-model="vueloForm.fechaHoraSalida" type="datetime-local" />
        <input v-model="vueloForm.fechaHoraLlegada" type="datetime-local" />
        <input :value="vueloForm.duracionMin" disabled placeholder="Duración (min)" />
        <input v-model="vueloForm.precioBase" type="number" placeholder="Precio" />
        <input v-model="vueloForm.capacidadTotal" type="number" placeholder="Capacidad" />
      </div>

      <button @click="submitVuelo">Guardar</button>
    </div>

    <!-- TABLA VUELOS -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Vuelo</th>
          <th>Ruta</th>
          <th>Salida</th>
          <th>Llegada</th>
          <th>Duración</th>
          <th>Precio</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in vuelos" :key="v.idVuelo">
          <td>{{ v.numeroVuelo }}</td>
          <td>{{ getAeropuerto(v.idAeropuertoOrigen) }} → {{ getAeropuerto(v.idAeropuertoDestino) }}</td>
          <td>{{ formatDate(v.fechaHoraSalida) }}</td>
          <td>{{ formatDate(v.fechaHoraLlegada) }}</td>
          <td>{{ v.duracionMin }} min</td>
          <td>${{ v.precioBase }}</td>
          <td>
            <select :value="v.estadoVuelo" @change="changeEstado(v, $event.target.value)">
              <option v-for="e in estados" :key="e">{{ e }}</option>
            </select>
          </td>
          <td>
            <button @click="editVuelo(v)">✏️</button>
            <button @click="deleteVuelo(v)">🗑️</button>
            <button @click="selectVuelo(v)">📍</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ESCALAS -->
    <div v-if="selectedVuelo" class="card">
      <h2>Escalas - {{ selectedVuelo.numeroVuelo }}</h2>

      <div class="grid">
        <select v-model="escalaForm.idAeropuerto">
          <option value="">Aeropuerto</option>
          <option v-for="a in aeropuertos" :key="a.idAeropuerto" :value="a.idAeropuerto">
            {{ a.codigoIata }} - {{ a.nombre }}
          </option>
        </select>

        <input v-model.number="escalaForm.orden" type="number" placeholder="Orden" />
        <input v-model="escalaForm.fechaHoraLlegada" type="datetime-local" placeholder="Llegada a escala" />
        <input v-model="escalaForm.fechaHoraSalida"  type="datetime-local" placeholder="Salida de escala" />

        <!-- ✅ Usa el computed para mostrar duración calculada automáticamente -->
        <input :value="duracionEscalaComputada" disabled placeholder="Duración escala (min)" />

        <input v-model="escalaForm.tipoEscala"    placeholder="Tipo escala"   />
        <input v-model="escalaForm.terminal"      placeholder="Terminal"      />
        <input v-model="escalaForm.puerta"        placeholder="Puerta"        />
        <input v-model="escalaForm.observaciones" placeholder="Observaciones" />
      </div>

      <button style="margin-top:10px" @click="submitEscala">Agregar escala</button>

      <!-- TABLA ESCALAS -->
      <table class="tabla" style="margin-top:15px">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Aeropuerto</th>
            <th>Llegada</th>
            <th>Salida</th>
            <th>Duración</th>
            <th>Tipo</th>
            <th>Terminal</th>
            <th>Puerta</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in escalas" :key="e.idEscala">
            <td>{{ e.orden }}</td>
            <td>{{ getAeropuerto(e.idAeropuerto) }}</td>
            <td>{{ formatDate(e.fechaHoraLlegada) }}</td>
            <td>{{ formatDate(e.fechaHoraSalida) }}</td>
            <td>{{ e.duracionMin }} min</td>
            <td>{{ e.tipoEscala }}</td>
            <td>{{ e.terminal }}</td>
            <td>{{ e.puerta }}</td>
            <td><button @click="deleteEscala(e)">❌</button></td>
          </tr>
        </tbody>
      </table>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import api from '@/api/axios'

const vuelos        = ref([])
const aeropuertos   = ref([])
const escalas       = ref([])
const selectedVuelo = ref(null)

const errorMsg = ref('')
const estados  = ['PROGRAMADO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO', 'DEMORADO']

// ── Formulario vuelo ──────────────────────────────────────────────
const vueloForm = reactive({
  idVuelo: null,
  idAeropuertoOrigen: '',
  idAeropuertoDestino: '',
  numeroVuelo: '',
  fechaHoraSalida: '',
  fechaHoraLlegada: '',
  duracionMin: 0,
  precioBase: '',
  capacidadTotal: ''
})

// ── Formulario escala ─────────────────────────────────────────────
const escalaForm = reactive({
  idAeropuerto:     '',
  orden:            '',
  fechaHoraLlegada: '',
  fechaHoraSalida:  '',
  duracionMin:      0,
  tipoEscala:       '',
  terminal:         '',
  puerta:           '',
  observaciones:    ''
})

// ── Duración vuelo (watch manual está bien aquí) ──────────────────
watch(
  () => [vueloForm.fechaHoraSalida, vueloForm.fechaHoraLlegada],
  () => {
    if (!vueloForm.fechaHoraSalida || !vueloForm.fechaHoraLlegada) {
      vueloForm.duracionMin = 0; return
    }
    const diff = (new Date(vueloForm.fechaHoraLlegada) - new Date(vueloForm.fechaHoraSalida)) / 60000
    vueloForm.duracionMin = diff > 0 ? Math.floor(diff) : 0
  }
)

// ✅ Duración escala como computed (reactivo y fiable) ─────────────
const duracionEscalaComputada = computed(() => {
  if (!escalaForm.fechaHoraLlegada || !escalaForm.fechaHoraSalida) return 0
  const diff = (new Date(escalaForm.fechaHoraSalida) - new Date(escalaForm.fechaHoraLlegada)) / 60000
  return diff > 0 ? Math.floor(diff) : 0
})

// ✅ Sincroniza el computed con escalaForm.duracionMin para el POST
watch(duracionEscalaComputada, (val) => {
  escalaForm.duracionMin = val
})

// ── Helpers ───────────────────────────────────────────────────────
function getAeropuerto(id) {
  return aeropuertos.value.find(a => a.idAeropuerto === id)?.codigoIata || id
}

function formatDate(d) {
  return d ? d.replace('T', ' ').slice(0, 16) : ''
}

function manejarError(e) {
  if (e.response?.data?.errors) {
    errorMsg.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    errorMsg.value = e.response?.data?.message || e.message
  }
}

// ── Vuelos CRUD ───────────────────────────────────────────────────
function buildVuelo() {
  return {
    idAeropuertoOrigen:  Number(vueloForm.idAeropuertoOrigen),
    idAeropuertoDestino: Number(vueloForm.idAeropuertoDestino),
    numeroVuelo:         vueloForm.numeroVuelo,
    fechaHoraSalida:     vueloForm.fechaHoraSalida,
    fechaHoraLlegada:    vueloForm.fechaHoraLlegada,
    duracionMin:         vueloForm.duracionMin,
    precioBase:          Number(vueloForm.precioBase),
    capacidadTotal:      Number(vueloForm.capacidadTotal)
  }
}

async function submitVuelo() {
  errorMsg.value = ''
  try {
    vueloForm.idVuelo
      ? await api.put(`/vuelos/${vueloForm.idVuelo}`, buildVuelo())
      : await api.post('/vuelos', buildVuelo())
    fetchVuelos()
  } catch (e) { manejarError(e) }
}

async function fetchVuelos() {
  const r = await api.get('/vuelos', { params: { page: 1, page_size: 100 } })
  vuelos.value = r.data.data
}

async function fetchAeropuertos() {
  const r = await api.get('/aeropuertos', { params: { page: 1, page_size: 200 } })
  aeropuertos.value = r.data.data
}

function editVuelo(v) {
  Object.assign(vueloForm, v)
  vueloForm.fechaHoraSalida  = v.fechaHoraSalida.slice(0, 16)
  vueloForm.fechaHoraLlegada = v.fechaHoraLlegada.slice(0, 16)
}

async function deleteVuelo(v) {
  await api.delete(`/vuelos/${v.idVuelo}`)
  fetchVuelos()
}

async function changeEstado(v, e) {
  await api.patch(`/vuelos/${v.idVuelo}/estado`, { estadoVuelo: e, motivo: 'manual' })
  fetchVuelos()
}

// ── Escalas CRUD ──────────────────────────────────────────────────
function selectVuelo(v) {
  selectedVuelo.value = v
  fetchEscalas()
}

async function fetchEscalas() {
  try {
    const r = await api.get(`/vuelos/${selectedVuelo.value.idVuelo}/escalas`)
    escalas.value = Array.isArray(r.data) ? r.data : (r.data.data ?? [])
  } catch (e) { manejarError(e) }
}

async function submitEscala() {
  errorMsg.value = ''

  if (!escalaForm.idAeropuerto || escalaForm.orden === '') {
    errorMsg.value = 'Aeropuerto y orden son obligatorios'
    return
  }

  try {
    await api.post(`/vuelos/${selectedVuelo.value.idVuelo}/escalas`, {
      idAeropuerto:     Number(escalaForm.idAeropuerto),
      orden:            Number(escalaForm.orden),
      fechaHoraLlegada: escalaForm.fechaHoraLlegada || null,
      fechaHoraSalida:  escalaForm.fechaHoraSalida  || null,
      duracionMin:      escalaForm.duracionMin,       // ✅ ya sincronizado por el watch
      tipoEscala:       escalaForm.tipoEscala      || null,
      terminal:         escalaForm.terminal        || null,
      puerta:           escalaForm.puerta          || null,
      observaciones:    escalaForm.observaciones   || null
    })

    Object.assign(escalaForm, {
      idAeropuerto: '', orden: '',
      fechaHoraLlegada: '', fechaHoraSalida: '',
      duracionMin: 0, tipoEscala: '',
      terminal: '', puerta: '', observaciones: ''
    })

    fetchEscalas()
  } catch (e) { manejarError(e) }
}

async function deleteEscala(e) {
  try {
    await api.delete(`/vuelos/${selectedVuelo.value.idVuelo}/escalas/${e.idEscala}`)
    fetchEscalas()
  } catch (err) { manejarError(err) }
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(() => {
  fetchAeropuertos()
  fetchVuelos()
})
</script>

<style>
.container { padding: 20px; font-family: sans-serif }
.card { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 10px }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px }
.tabla { width: 100%; margin-top: 15px; border-collapse: collapse }
.tabla th, .tabla td { border: 1px solid #ccc; padding: 8px }
.error { color: red; font-weight: bold }
</style>