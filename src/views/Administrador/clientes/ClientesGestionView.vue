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
    :document-meta="documentMeta"
    :editing-cliente="editingCliente"
    :error-msg="errorMsg"
    :form="form"
    :has-validation-errors="hasValidationErrors"
    :loading-clientes="loadingClientes"
    :paises-filtrados="paisesFiltrados"
    :success-msg="successMsg"
    :validation-errors="validationErrors"
    @delete-cliente="deleteCliente"
    @document-input="handleDocumentInput"
    @document-type-change="handleDocumentTypeChange"
    @edit-cliente="editCliente"
    @email-input="handleEmailInput"
    @fetch-clientes="fetchClientes"
    @phone-input="handlePhoneInput"
    @reset-form="resetForm"
    @submit-cliente="submitCliente"
    @validate-birth-date="validateBirthDate"
    @validate-document="validateDocument"
    @validate-email="validateEmail"
    @validate-phone="validatePhone"
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
  documentMeta,
  editCliente,
  editingCliente,
  errorMsg,
  fetchClientes,
  form,
  handleDocumentInput,
  handleDocumentTypeChange,
  handleEmailInput,
  handlePhoneInput,
  hasValidationErrors,
  loadingClientes,
  paisesFiltrados,
  resetForm,
  submitCliente,
  successMsg,
  validateBirthDate,
  validateDocument,
  validateEmail,
  validatePhone,
  validationErrors
} = useClientesGestion()
</script>
