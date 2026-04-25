<template>
  <ClientesGestionPanel
    v-model:busqueda-pais="busquedaPais"
    :ciudades-filtradas="ciudadesFiltradas"
    :clientes="clientes"
    :editing-cliente="editingCliente"
    :error-msg="errorMsg"
    :form="form"
    :paises-filtrados="paisesFiltrados"
    :success-msg="successMsg"
    @delete-cliente="deleteCliente"
    @edit-cliente="editCliente"
    @reset-form="resetForm"
    @submit-cliente="submitCliente"
  />
</template>

<script setup>
import ClientesGestionPanel from './components/ClientesGestionPanel.vue'
import { useClientesGestion } from './composables/useClientesGestion'

const {
  clientes,
  busquedaPais,
  ciudadesFiltradas,
  deleteCliente,
  editCliente,
  editingCliente,
  errorMsg,
  form,
  paisesFiltrados,
  resetForm,
  submitCliente,
  successMsg
} = useClientesGestion()
</script>
