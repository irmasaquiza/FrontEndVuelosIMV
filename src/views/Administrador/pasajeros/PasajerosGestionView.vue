<template>
  <section class="admin-page">

    <h1>Pasajeros ✈️</h1>

    <p v-if="feedbackError" class="error">{{ feedbackError }}</p>
    <p v-if="feedbackSuccess" class="success">{{ feedbackSuccess }}</p>

    <!-- FORM -->
    <div class="panel">
      <h3>{{ form.idPasajero ? 'Editar pasajero' : 'Nuevo pasajero' }}</h3>

      <form @submit.prevent="submitPasajero" class="grid">

        <select v-model="form.idCliente">
          <option value="">Sin cliente</option>
          <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
            {{ c.nombres }} {{ c.apellidos }}
          </option>
        </select>

        <input v-model="form.nombrePasajero" placeholder="Nombre" required />
        <input v-model="form.apellidoPasajero" placeholder="Apellido" required />

        <select v-model="form.tipoDocumentoPasajero">
          <option>CEDULA</option>
          <option>PASAPORTE</option>
          <option>RUC</option>
        </select>

        <input v-model="form.numeroDocumentoPasajero" placeholder="Documento" required />

        <input v-model="form.fechaNacimientoPasajero" type="datetime-local" />

        <input v-model="form.nacionalidadPasajero" placeholder="Nacionalidad" />

        <input v-model="form.emailContactoPasajero" placeholder="Email" />
        <input v-model="form.telefonoContactoPasajero" placeholder="Teléfono" />

        <select v-model="form.generoPasajero">
          <option>MASCULINO</option>
          <option>FEMENINO</option>
        </select>

        <label>
          <input type="checkbox" v-model="form.requiereAsistencia" />
          Requiere asistencia
        </label>

        <input v-model="form.observacionesPasajero" placeholder="Observaciones" />

        <button>
          {{ form.idPasajero ? 'Actualizar' : 'Crear' }}
        </button>

      </form>
    </div>

    <!-- LISTA -->
    <table class="tabla">
      <tr v-for="p in pasajeros" :key="p.idPasajero">
        <td>{{ p.nombrePasajero }} {{ p.apellidoPasajero }}</td>
        <td>{{ p.numeroDocumentoPasajero }}</td>
        <td>{{ p.nacionalidadPasajero }}</td>
        <td>
          <button @click="editPasajero(p)">Editar</button>
        </td>
      </tr>
    </table>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'

const pasajeros = ref([])
const clientes = ref([])

const feedbackError = ref('')
const feedbackSuccess = ref('')

const form = reactive({
  idPasajero: null,
  idCliente: '',
  nombrePasajero: '',
  apellidoPasajero: '',
  tipoDocumentoPasajero: 'CEDULA',
  numeroDocumentoPasajero: '',
  fechaNacimientoPasajero: '',
  nacionalidadPasajero: '',
  emailContactoPasajero: '',
  telefonoContactoPasajero: '',
  generoPasajero: 'MASCULINO',
  requiereAsistencia: false,
  observacionesPasajero: ''
})

/* ---------------- ERROR ---------------- */
function setError(e){
  console.log("🔥 ERROR:", e.response?.data)
  feedbackError.value =
    e.response?.data?.detalle ||
    e.response?.data?.title ||
    e.message
}

function setSuccess(msg){
  feedbackError.value=''
  feedbackSuccess.value=msg
}

/* ---------------- FETCH ---------------- */

async function fetchClientes(){
  const res = await api.get('/clientes',{params:{page:1,page_size:100}})
  clientes.value = res.data.data
}

async function fetchPasajeros(){
  try{
    const res = await api.get('/pasajeros',{params:{page:1,page_size:50}})
    console.log("📦 PASAJEROS:", res.data)
    pasajeros.value = res.data.data || []
  }catch(e){
    setError(e)
  }
}

/* ---------------- EDIT ---------------- */

function editPasajero(p){
  Object.assign(form,{
    ...p,
    fechaNacimientoPasajero: p.fechaNacimientoPasajero
      ? p.fechaNacimientoPasajero.slice(0,16)
      : ''
  })
}

/* ---------------- GET BY ID ---------------- */

async function getPasajeroById(id){
  const res = await api.get(`/pasajeros/${id}`)
  return res.data.data
}

/* ---------------- PAYLOAD ---------------- */

function buildPayload(){
  return {
    idCliente: form.idCliente ? Number(form.idCliente) : null,
    nombrePasajero: form.nombrePasajero,
    apellidoPasajero: form.apellidoPasajero,
    tipoDocumentoPasajero: form.tipoDocumentoPasajero,
    numeroDocumentoPasajero: form.numeroDocumentoPasajero,
    fechaNacimientoPasajero: form.fechaNacimientoPasajero
      ? new Date(form.fechaNacimientoPasajero).toISOString()
      : null,
    nacionalidadPasajero: form.nacionalidadPasajero,
    emailContactoPasajero: form.emailContactoPasajero,
    telefonoContactoPasajero: form.telefonoContactoPasajero,
    generoPasajero: form.generoPasajero,
    requiereAsistencia: form.requiereAsistencia,
    observacionesPasajero: form.observacionesPasajero
  }
}

/* ---------------- CREATE / UPDATE ---------------- */

async function submitPasajero(){
  try{
    const payload = buildPayload()
    console.log("🚀 JSON:", payload)

    if(form.idPasajero){
      await api.put(`/pasajeros/${form.idPasajero}`, payload)
      setSuccess("Pasajero actualizado")
    }else{
      await api.post('/pasajeros', payload)
      setSuccess("Pasajero creado")
    }

    resetForm()
    fetchPasajeros()

  }catch(e){
    setError(e)
  }
}

/* ---------------- RESET ---------------- */

function resetForm(){
  Object.keys(form).forEach(k=>form[k]='')
  form.requiereAsistencia=false
  form.generoPasajero='MASCULINO'
  form.tipoDocumentoPasajero='CEDULA'
}

/* ---------------- INIT ---------------- */

onMounted(()=>{
  fetchClientes()
  fetchPasajeros()
})
</script>

<style>
.admin-page{padding:20px}
.panel{margin:20px 0;padding:15px;border:1px solid #ccc}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.tabla{width:100%;margin-top:15px;border-collapse:collapse}
.tabla td,.tabla th{border:1px solid #ccc;padding:8px}
.error{color:red}
.success{color:green}
</style>