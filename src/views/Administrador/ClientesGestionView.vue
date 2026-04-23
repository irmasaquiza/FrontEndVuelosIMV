<template>
  <section class="admin-page">

    <h1>Clientes 👤</h1>

    <p v-if="errorMsg"   class="error">{{ errorMsg }}</p>
    <p v-if="successMsg" class="success">{{ successMsg }}</p>

    <div class="panel">
      <h3>{{ editingCliente ? 'Editar Cliente' : 'Nuevo Cliente' }}</h3>

      <form @submit.prevent="submitCliente" class="grid">

        <!-- Tipo ID (solo en creación) -->
        <select v-model="form.tipoIdentificacion" :disabled="!!editingCliente">
          <option value="CEDULA">Cédula</option>
          <option value="PASAPORTE">Pasaporte</option>
          <option value="RUC">RUC</option>
        </select>

        <input v-model="form.numeroIdentificacion" placeholder="Número ID" :disabled="!!editingCliente" required />

        <input v-model="form.nombres"   placeholder="Nombres"   required />
        <input v-model="form.apellidos" placeholder="Apellidos" required />
        <input v-model="form.correo"    placeholder="Correo"    />
        <input v-model="form.telefono"  placeholder="Teléfono"  />
        <input v-model="form.direccion" placeholder="Dirección" />

        <!-- Buscador país -->
        <div style="grid-column: span 3">
          <label>País de nacionalidad</label>
          <input v-model="busquedaPais" placeholder="Buscar país..." style="width:100%;margin-bottom:4px" />
          <select v-model="form.idPaisNacionalidad" style="width:100%">
            <option value="">-- Seleccionar país --</option>
            <option v-for="p in paisesFiltrados" :key="p.idPais" :value="p.idPais">
              {{ p.nombre }}
            </option>
          </select>
        </div>

        <!-- ✅ Ciudad filtrada por país seleccionado -->
        <div style="grid-column: span 3">
          <label>Ciudad de residencia</label>
          <select v-model="form.idCiudadResidencia" style="width:100%">
            <option value="">-- Seleccionar ciudad --</option>
            <option v-for="c in ciudadesFiltradas" :key="c.idCiudad" :value="c.idCiudad">
              {{ c.nombre }}
            </option>
          </select>
          <small v-if="!form.idPaisNacionalidad" style="color:#999">Selecciona un país primero</small>
        </div>

        <input v-model="form.fechaNacimiento" type="datetime-local" />
        <input v-model="form.nacionalidad"    placeholder="Nacionalidad" />

        <select v-model="form.genero">
          <option value="MASCULINO">Masculino</option>
          <option value="FEMENINO">Femenino</option>
          <option value="OTRO">Otro</option>
        </select>

        <!-- Estado (solo en edición) -->
        <select v-if="editingCliente" v-model="form.estado">
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>

        <div style="grid-column: span 3; display:flex; gap:10px">
          <button type="submit">{{ editingCliente ? 'Actualizar' : 'Crear' }}</button>
          <button type="button" @click="resetForm" style="background:#999">Cancelar</button>
        </div>

      </form>
    </div>

    <!-- TABLA -->
    <table class="tabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Identificación</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in clientes" :key="c.idCliente">
          <td>{{ c.nombres }} {{ c.apellidos }}</td>
          <td>{{ c.tipoIdentificacion }} - {{ c.numeroIdentificacion }}</td>
          <td>{{ c.correo }}</td>
          <td>{{ c.telefono }}</td>
          <td>{{ c.estado }}</td>
          <td>
            <button @click="editCliente(c)">Editar</button>
            <button @click="deleteCliente(c)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/axios'

const clientes  = ref([])
const paises    = ref([])
const ciudades  = ref([])

const busquedaPais    = ref('')
const errorMsg        = ref('')
const successMsg      = ref('')
const editingCliente  = ref(null)

const form = reactive({
  tipoIdentificacion:   'CEDULA',
  numeroIdentificacion: '',
  nombres:              '',
  apellidos:            '',
  razonSocial:          '',
  correo:               '',
  telefono:             '',
  direccion:            '',
  idCiudadResidencia:   null,
  idPaisNacionalidad:   null,
  fechaNacimiento:      '',
  nacionalidad:         '',
  genero:               'MASCULINO',
  estado:               'ACTIVO'
})

// ── Filtros ───────────────────────────────────────────────────────
const paisesFiltrados = computed(() =>
  paises.value.filter(p =>
    p.nombre.toLowerCase().includes(busquedaPais.value.toLowerCase())
  )
)

const ciudadesFiltradas = computed(() => {
  if (!form.idPaisNacionalidad) return []
  return ciudades.value.filter(c => c.idPais === form.idPaisNacionalidad)
})

// ── Mensajes ──────────────────────────────────────────────────────
function setError(e) {
  successMsg.value = ''
  if (e.response?.data?.errors) {
    errorMsg.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    errorMsg.value = e.response?.data?.title || e.response?.data?.message || e.message
  }
  console.error('API error:', e.response?.data ?? e)
}

function setSuccess(msg) {
  errorMsg.value   = ''
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 3000)
}

// ── Fetch ─────────────────────────────────────────────────────────
async function fetchClientes() {
  const res = await api.get('/clientes', { params: { page: 1, page_size: 50 } })
  clientes.value = res.data.data
}

async function fetchPaises() {
  const res = await api.get('/paises', { params: { page: 1, page_size: 200 } })
  paises.value = res.data.data
}

async function fetchCiudades() {
  const res = await api.get('/ciudades', { params: { page: 1, page_size: 200 } })
  ciudades.value = res.data.data
}

// ── Editar ────────────────────────────────────────────────────────
function editCliente(c) {
  editingCliente.value = c
  busquedaPais.value   = ''

  // ✅ Asignamos cada campo explícitamente para no perder nulos vs undefined
  form.tipoIdentificacion   = c.tipoIdentificacion   ?? 'CEDULA'
  form.numeroIdentificacion = c.numeroIdentificacion ?? ''
  form.nombres              = c.nombres              ?? ''
  form.apellidos            = c.apellidos            ?? ''
  form.razonSocial          = c.razonSocial          ?? ''
  form.correo               = c.correo               ?? ''
  form.telefono             = c.telefono             ?? ''
  form.direccion            = c.direccion            ?? ''
  form.nacionalidad         = c.nacionalidad         ?? ''
  form.genero               = c.genero               ?? 'MASCULINO'
  form.estado               = c.estado               ?? 'ACTIVO'
  form.fechaNacimiento      = c.fechaNacimiento      ? c.fechaNacimiento.slice(0, 16) : ''

  // ✅ País primero, luego ciudad (el orden importa para el computed)
  form.idPaisNacionalidad  = c.idPaisNacionalidad  ?? null
  form.idCiudadResidencia  = c.idCiudadResidencia  ?? null
}

// ── Payloads ──────────────────────────────────────────────────────
function buildPostPayload() {
  return {
    tipoIdentificacion:   form.tipoIdentificacion,
    numeroIdentificacion: form.numeroIdentificacion,
    nombres:              form.nombres,
    apellidos:            form.apellidos,
    razonSocial:          form.razonSocial || null,
    correo:               form.correo,
    telefono:             form.telefono,
    direccion:            form.direccion,
    idCiudadResidencia:   form.idCiudadResidencia  ? Number(form.idCiudadResidencia)  : null,
    idPaisNacionalidad:   form.idPaisNacionalidad  ? Number(form.idPaisNacionalidad)  : null,
    fechaNacimiento:      form.fechaNacimiento ? new Date(form.fechaNacimiento).toISOString() : null,
    nacionalidad:         form.nacionalidad,
    genero:               form.genero
  }
}

// ✅ PUT tiene exactamente los campos que pide la API (sin tipoIdentificacion ni numeroIdentificacion)
function buildPutPayload() {
  return {
    nombres:              form.nombres,
    apellidos:            form.apellidos,
    razonSocial:          form.razonSocial || null,
    correo:               form.correo,
    telefono:             form.telefono,
    direccion:            form.direccion,
    idCiudadResidencia:   form.idCiudadResidencia  ? Number(form.idCiudadResidencia)  : null,
    idPaisNacionalidad:   form.idPaisNacionalidad  ? Number(form.idPaisNacionalidad)  : null,
    fechaNacimiento:      form.fechaNacimiento ? new Date(form.fechaNacimiento).toISOString() : null,
    nacionalidad:         form.nacionalidad,
    genero:               form.genero,
    estado:               form.estado   // ✅ Viene del form, no hardcodeado
  }
}

// ── Submit ────────────────────────────────────────────────────────
async function submitCliente() {
  errorMsg.value = ''

  try {
    if (editingCliente.value) {
      const payload = buildPutPayload()
      console.log('🚀 PUT payload:', payload)
      await api.put(`/clientes/${editingCliente.value.idCliente}`, payload)
      setSuccess('Cliente actualizado ✅')
    } else {
      const payload = buildPostPayload()
      console.log('🚀 POST payload:', payload)
      await api.post('/clientes', payload)
      setSuccess('Cliente creado ✅')
    }

    resetForm()
    fetchClientes()
  } catch (e) {
    setError(e)
  }
}

// ── Delete ────────────────────────────────────────────────────────
async function deleteCliente(c) {
  if (!confirm(`¿Eliminar a ${c.nombres} ${c.apellidos}?`)) return
  try {
    await api.delete(`/clientes/${c.idCliente}`)
    setSuccess('Cliente eliminado')
    fetchClientes()
  } catch (e) {
    setError(e)
  }
}

// ── Reset ─────────────────────────────────────────────────────────
function resetForm() {
  form.tipoIdentificacion   = 'CEDULA'
  form.numeroIdentificacion = ''
  form.nombres              = ''
  form.apellidos            = ''
  form.razonSocial          = ''
  form.correo               = ''
  form.telefono             = ''
  form.direccion            = ''
  form.idCiudadResidencia   = null
  form.idPaisNacionalidad   = null
  form.fechaNacimiento      = ''
  form.nacionalidad         = ''
  form.genero               = 'MASCULINO'
  form.estado               = 'ACTIVO'
  busquedaPais.value        = ''
  editingCliente.value      = null
}

// ── Init ──────────────────────────────────────────────────────────
onMounted(() => {
  fetchClientes()
  fetchPaises()
  fetchCiudades()
})
</script>

<style scoped>
.admin-page  { padding: 20px; font-family: sans-serif }
.panel       { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 10px }
.grid        { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px }
.tabla       { width: 100%; margin-top: 15px; border-collapse: collapse }
.tabla th,
.tabla td    { border: 1px solid #ccc; padding: 8px }
.error       { color: red;   font-weight: bold }
.success     { color: green; font-weight: bold }
</style>