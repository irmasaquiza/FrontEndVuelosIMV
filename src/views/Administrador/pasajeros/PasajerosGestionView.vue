<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de pasajeros</h1>
        <p class="mb-0" style="opacity:0.75;">Registra pasajeros y administra sus datos de viaje.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="feedbackError" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ feedbackError }}
    </div>
    <div v-if="feedbackSuccess" class="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0f5132"/>
      </svg>
      {{ feedbackSuccess }}
    </div>

    <!-- ═══════════════ FORMULARIO ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#d60f2b"/>
              <path d="M19 3h-1.5v1.5h1.5V6h1.5V4.5H22V3h-1.5V1.5H19V3z" fill="#a00824"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">{{ form.idPasajero ? 'Editar pasajero' : 'Nuevo pasajero' }}</h2>
            <p class="text-muted small mb-0">{{ form.idPasajero ? 'Modifica los datos del pasajero seleccionado.' : 'Completa los campos para registrar un nuevo pasajero.' }}</p>
          </div>
        </div>

        <form @submit.prevent="submitPasajero">
          <div class="row g-3">

            <!-- Cliente vinculado -->
            <div class="col-12">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Cliente vinculado
                <span class="text-muted fw-normal" style="font-size:0.68rem;"> — opcional</span>
              </label>
              <select v-model="form.idCliente"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Sin cliente vinculado</option>
                <option v-for="c in clientes" :key="c.idCliente" :value="c.idCliente">
                  {{ c.nombres }} {{ c.apellidos }}
                </option>
              </select>
            </div>

            <!-- Nombre / Apellido -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nombre *</label>
              <input v-model="form.nombrePasajero" required placeholder="Ej. Juan"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Apellido *</label>
              <input v-model="form.apellidoPasajero" required placeholder="Ej. Pérez"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Género -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Género</label>
              <select v-model="form.generoPasajero"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </select>
            </div>

            <!-- Tipo doc / Número doc -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Tipo de documento</label>
              <select v-model="form.tipoDocumentoPasajero"
                      class="form-select"
                      @change="handleDocumentTypeChange"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="CEDULA">Cédula</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Número de documento *</label>
              <input v-model="form.numeroDocumentoPasajero" required placeholder="Ej. 1712345678"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.numeroDocumentoPasajero }"
                     :inputmode="documentMeta.inputMode"
                     :maxlength="documentMeta.maxLength"
                     @input="handleDocumentInput"
                     @blur="validateDocument"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.numeroDocumentoPasajero" class="invalid-feedback">
                {{ validationErrors.numeroDocumentoPasajero }}
              </div>
            </div>

            <!-- Fecha nacimiento -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha de nacimiento</label>
              <input v-model="form.fechaNacimientoPasajero" type="datetime-local"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.fechaNacimientoPasajero }"
                     @blur="validateBirthDate"
                     @change="validateBirthDate"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.fechaNacimientoPasajero" class="invalid-feedback">
                {{ validationErrors.fechaNacimientoPasajero }}
              </div>
            </div>

            <!-- Nacionalidad -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nacionalidad</label>
              <input v-model="form.nacionalidadPasajero" placeholder="Ej. Ecuatoriana"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Email -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Correo de contacto</label>
              <input v-model="form.emailContactoPasajero" type="email" placeholder="Ej. juan@email.com"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.emailContactoPasajero }"
                     @input="handleEmailInput"
                     @blur="validateEmail"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.emailContactoPasajero" class="invalid-feedback">
                {{ validationErrors.emailContactoPasajero }}
              </div>
            </div>

            <!-- Teléfono -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Teléfono de contacto</label>
              <input v-model="form.telefonoContactoPasajero" placeholder="Ej. +593 99 123 4567"
                     class="form-control"
                     inputmode="numeric"
                     maxlength="10"
                     :class="{ 'is-invalid': validationErrors.telefonoContactoPasajero }"
                     @input="handlePhoneInput"
                     @blur="validatePhone"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.telefonoContactoPasajero" class="invalid-feedback">
                {{ validationErrors.telefonoContactoPasajero }}
              </div>
            </div>

            <!-- Observaciones -->
            <div class="col-12 col-md-8">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Observaciones</label>
              <input v-model="form.observacionesPasajero" placeholder="Observaciones opcionales"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Requiere asistencia -->
            <div class="col-12 col-md-4 d-flex align-items-end">
              <div class="form-check form-switch ps-0 d-flex align-items-center gap-3"
                   style="min-height:42px;">
                <input v-model="form.requiereAsistencia"
                       type="checkbox"
                       role="switch"
                       class="form-check-input ms-0"
                       id="asistencia"
                       style="width:3rem;height:1.5rem;cursor:pointer;" />
                <label class="form-check-label fw-semibold small" for="asistencia"
                       style="color:#555;">
                  Requiere asistencia especial
                </label>
              </div>
            </div>

            <!-- Botones -->
            <div class="col-12 d-flex gap-2 justify-content-end pt-2">
              <button type="button"
                      class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                      @click="resetForm">
                Cancelar
              </button>
              <button type="submit"
                      class="btn fw-bold rounded-pill px-4 text-white"
                      :disabled="hasValidationErrors"
                      style="background:#d60f2b;">
                {{ form.idPasajero ? 'Actualizar pasajero' : 'Crear pasajero' }}
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>

    <!-- ═══════════════ TABLA ═══════════════ -->
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de pasajeros</h2>
            <p class="text-muted small mb-0">
              {{ pasajeros.length }} {{ pasajeros.length === 1 ? 'pasajero visible' : 'pasajeros visibles' }}
              <span v-if="pasajerosTotal">de {{ pasajerosTotal }} registrados</span>
            </p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Pasajero</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Documento</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Nacionalidad</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Contacto</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Asistencia</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingPasajeros">
                <td colspan="6" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando pasajeros...
                </td>
              </tr>
              <tr v-else-if="!pasajeros.length">
                <td colspan="6" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#ddd"/>
                  </svg>
                  No hay pasajeros registrados.
                </td>
              </tr>
              <tr v-for="p in pasajeros" :key="p.idPasajero">
                <td class="ps-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                         style="width:34px;height:34px;background:#d60f2b;font-size:0.8rem;">
                      {{ p.nombrePasajero?.charAt(0) }}{{ p.apellidoPasajero?.charAt(0) }}
                    </div>
                    <div>
                      <div class="fw-semibold small">{{ p.nombrePasajero }} {{ p.apellidoPasajero }}</div>
                      <div class="text-muted" style="font-size:0.72rem;">{{ p.generoPasajero }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded me-1"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ p.tipoDocumentoPasajero }}
                  </span>
                  <span class="text-muted small">{{ p.numeroDocumentoPasajero }}</span>
                </td>
                <td class="text-muted small">{{ p.nacionalidadPasajero || '-' }}</td>
                <td>
                  <div class="small text-muted">{{ p.emailContactoPasajero || '-' }}</div>
                  <div class="small text-muted">{{ p.telefonoContactoPasajero || '-' }}</div>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="p.requiereAsistencia
                          ? 'background:#fef9c3;color:#854d0e;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ p.requiereAsistencia ? 'Sí requiere' : 'No requiere' }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="editPasajero(p)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#d60f2b"/>
                    </svg>
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">
            Pagina {{ pasajerosPage }} de {{ pasajerosTotalPages }}
            <span v-if="pasajerosTotal">- {{ pasajerosTotal }} pasajeros registrados</span>
          </p>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small mb-0" for="pasajeros-page-size">Mostrar</label>
            <select
              id="pasajeros-page-size"
              v-model.number="pasajerosPageSize"
              class="form-select form-select-sm"
              style="width:auto;"
              :disabled="loadingPasajeros"
              @change="fetchPasajeros(1)"
            >
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>

            <div class="btn-group btn-group-sm" role="group" aria-label="Paginacion de pasajeros">
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingPasajeros || pasajerosPage <= 1"
                @click="fetchPasajeros(pasajerosPage - 1)"
              >
                Anterior
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingPasajeros || !canNextPasajeroPage"
                @click="fetchPasajeros(pasajerosPage + 1)"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue'
import api from '@/api/axios'
import {
  getDocumentError,
  getDocumentMeta,
  getEmailError,
  getPhoneError,
  sanitizeDocument,
  sanitizeEmail,
  sanitizePhone
} from '@/utils/personValidation'

const pasajeros = ref([])
const loadingPasajeros = ref(false)
const pasajerosPage = ref(1)
const pasajerosPageSize = ref(20)
const pasajerosTotal = ref(0)
const pasajerosTotalPages = ref(1)
const clientes  = ref([])

const feedbackError   = ref('')
const feedbackSuccess = ref('')

const form = reactive({
  idPasajero:               null,
  idCliente:                '',
  nombrePasajero:           '',
  apellidoPasajero:         '',
  tipoDocumentoPasajero:    'CEDULA',
  numeroDocumentoPasajero:  '',
  fechaNacimientoPasajero:  '',
  nacionalidadPasajero:     '',
  emailContactoPasajero:    '',
  telefonoContactoPasajero: '',
  generoPasajero:           'MASCULINO',
  requiereAsistencia:       false,
  observacionesPasajero:    ''
})

const validationErrors = reactive({
  numeroDocumentoPasajero: '',
  emailContactoPasajero: '',
  fechaNacimientoPasajero: '',
  telefonoContactoPasajero: ''
})

const documentMeta = computed(() => getDocumentMeta(form.tipoDocumentoPasajero))
const hasValidationErrors = computed(() => Object.values(validationErrors).some(Boolean))

const canNextPasajeroPage = computed(() => {
  if (pasajerosTotalPages.value > pasajerosPage.value) {
    return true
  }

  return !pasajerosTotal.value && pasajeros.value.length === pasajerosPageSize.value
})

function setError(e, fallback = '') {
  console.log('ERROR:', e?.response?.data)
  if (e?.response?.data?.errors) {
    feedbackError.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    feedbackError.value =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title   ||
      e?.message ||
      fallback ||
      'Ha ocurrido un error inesperado.'
  }
}

function setSuccess(msg) {
  feedbackError.value   = ''
  feedbackSuccess.value = msg
}

function validateDocument() {
  validationErrors.numeroDocumentoPasajero = getDocumentError(
    form.numeroDocumentoPasajero,
    form.tipoDocumentoPasajero
  )
  return !validationErrors.numeroDocumentoPasajero
}

function validateEmail() {
  validationErrors.emailContactoPasajero = getEmailError(form.emailContactoPasajero)
  return !validationErrors.emailContactoPasajero
}

function validateBirthDate() {
  const value = form.fechaNacimientoPasajero
  const date = value ? new Date(value) : null
  validationErrors.fechaNacimientoPasajero = !value || Number.isNaN(date.getTime()) || date > new Date()
    ? 'Ingresa una fecha de nacimiento válida'
    : ''
  return !validationErrors.fechaNacimientoPasajero
}

function validatePhone() {
  validationErrors.telefonoContactoPasajero = getPhoneError(form.telefonoContactoPasajero)
  return !validationErrors.telefonoContactoPasajero
}

function validateFormFields() {
  return [validateDocument(), validateEmail(), validateBirthDate(), validatePhone()].every(Boolean)
}

function handleDocumentTypeChange() {
  form.numeroDocumentoPasajero = ''
  validationErrors.numeroDocumentoPasajero = ''
}

function handleDocumentInput() {
  form.numeroDocumentoPasajero = sanitizeDocument(form.numeroDocumentoPasajero, form.tipoDocumentoPasajero)
  validateDocument()
}

function handleEmailInput() {
  form.emailContactoPasajero = sanitizeEmail(form.emailContactoPasajero)
  validateEmail()
}

function handlePhoneInput() {
  form.telefonoContactoPasajero = sanitizePhone(form.telefonoContactoPasajero)
  validatePhone()
}

async function fetchClientes() {
  const res = await api.get('/clientes', {
    params: {
      Page: 1,
      PageSize: 500,
      page: 1,
      page_size: 500
    }
  })
  clientes.value = res.data.data ?? res.data ?? []
}

function readPasajerosMeta(response) {
  const meta = response.data?.meta || {}
  const total =
    response.data?.total ||
    response.data?.totalRecords ||
    response.data?.total_registros ||
    meta.total ||
    meta.totalRecords ||
    meta.total_registros ||
    0

  const totalPages =
    response.data?.totalPages ||
    response.data?.total_pages ||
    meta.totalPages ||
    meta.total_pages ||
    0

  pasajerosTotal.value = Number(total || 0)

  if (totalPages) {
    pasajerosTotalPages.value = Number(totalPages)
    return
  }

  if (total) {
    pasajerosTotalPages.value = Math.max(1, Math.ceil(total / pasajerosPageSize.value))
    return
  }

  pasajerosTotalPages.value = pasajeros.value.length === pasajerosPageSize.value
    ? pasajerosPage.value + 1
    : pasajerosPage.value
}

async function fetchPasajeros(page = pasajerosPage.value) {
  loadingPasajeros.value = true
  try {
    const res = await api.get('/pasajeros', {
      params: {
        Page: page,
        PageSize: pasajerosPageSize.value,
        page,
        page_size: pasajerosPageSize.value
      }
    })
    pasajeros.value = res.data.data ?? res.data ?? []
    pasajerosPage.value = page
    readPasajerosMeta(res)
  } catch (e) {
    setError(e)
  } finally {
    loadingPasajeros.value = false
  }
}

function editPasajero(p) {
  Object.assign(form, {
    ...p,
    fechaNacimientoPasajero: p.fechaNacimientoPasajero
      ? p.fechaNacimientoPasajero.slice(0, 16)
      : ''
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function getPasajeroById(id) {
  const res = await api.get(`/pasajeros/${id}`)
  return res.data.data
}

function buildPayload() {
  return {
    idCliente:                form.idCliente ? Number(form.idCliente) : null,
    nombrePasajero:           form.nombrePasajero,
    apellidoPasajero:         form.apellidoPasajero,
    tipoDocumentoPasajero:    form.tipoDocumentoPasajero,
    numeroDocumentoPasajero:  form.numeroDocumentoPasajero,
    fechaNacimientoPasajero:  form.fechaNacimientoPasajero
      ? new Date(form.fechaNacimientoPasajero).toISOString()
      : null,
    nacionalidadPasajero:     form.nacionalidadPasajero,
    emailContactoPasajero:    form.emailContactoPasajero,
    telefonoContactoPasajero: form.telefonoContactoPasajero,
    generoPasajero:           form.generoPasajero,
    requiereAsistencia:       form.requiereAsistencia,
    observacionesPasajero:    form.observacionesPasajero
  }
}

async function submitPasajero() {
  if (!validateFormFields()) {
    feedbackError.value = 'Revisa los campos marcados antes de continuar.'
    return
  }

  try {
    const payload = buildPayload()
    console.log('JSON:', payload)
    if (form.idPasajero) {
      await api.put(`/pasajeros/${form.idPasajero}`, payload)
      setSuccess('Pasajero actualizado correctamente')
    } else {
      await api.post('/pasajeros', payload)
      setSuccess('Pasajero creado correctamente')
    }
    resetForm()
    fetchPasajeros()
  } catch (e) { setError(e) }
}

function resetForm() {
  Object.keys(form).forEach(k => form[k] = '')
  form.requiereAsistencia    = false
  form.generoPasajero        = 'MASCULINO'
  form.tipoDocumentoPasajero = 'CEDULA'
  form.idPasajero            = null
  validationErrors.numeroDocumentoPasajero = ''
  validationErrors.emailContactoPasajero = ''
  validationErrors.fechaNacimientoPasajero = ''
  validationErrors.telefonoContactoPasajero = ''
}

onMounted(() => {
  fetchClientes()
  fetchPasajeros()
})
</script>
