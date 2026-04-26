<template>
  <ClientesGestionPanel
    v-model:busqueda-pais="busquedaPais"
    v-model:clientes-page-size="clientesPageSize"
    :can-next-cliente-page="canNextClientePage"
    :ciudades-filtradas="ciudadesFiltradas"
    :clientes="clientes"
    :clientes-page="clientesPage"
    :clientes-total="clientesTotal"
    :clientes-total-pages="clientesTotalPages"
    :editing-cliente="editingCliente"
    :error-msg="errorMsg"
    :form="form"
    :loading-clientes="loadingClientes"
    :paises-filtrados="paisesFiltrados"
    :success-msg="successMsg"
    @delete-cliente="deleteCliente"
    @edit-cliente="editCliente"
    @fetch-clientes="fetchClientes"
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
  canNextClientePage,
  ciudadesFiltradas,
  clientesPage,
  clientesPageSize,
  clientesTotal,
  clientesTotalPages,
  deleteCliente,
  editCliente,
  editingCliente,
  errorMsg,
  fetchClientes,
  form,
  loadingClientes,
  paisesFiltrados,
  resetForm,
  submitCliente,
  successMsg
} = useClientesGestion()
</script>
