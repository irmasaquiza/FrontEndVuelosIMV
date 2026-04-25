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
import { computed } from 'vue'

const props = defineProps({
  busquedaPais: { type: String, default: '' },
  ciudadesFiltradas: { type: Array, default: () => [] },
  clientes: { type: Array, default: () => [] },
  editingCliente: { type: Object, default: null },
  errorMsg: { type: String, default: '' },
  form: { type: Object, required: true },
  paisesFiltrados: { type: Array, default: () => [] },
  successMsg: { type: String, default: '' }
})

const emit = defineEmits([
  'delete-cliente',
  'edit-cliente',
  'reset-form',
  'submit-cliente',
  'update:busquedaPais'
])

const busquedaPais = computed({
  get: () => props.busquedaPais,
  set: (value) => emit('update:busquedaPais', value)
})

function submitCliente() {
  emit('submit-cliente')
}

function resetForm() {
  emit('reset-form')
}

function editCliente(cliente) {
  emit('edit-cliente', cliente)
}

function deleteCliente(cliente) {
  emit('delete-cliente', cliente)
}
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
