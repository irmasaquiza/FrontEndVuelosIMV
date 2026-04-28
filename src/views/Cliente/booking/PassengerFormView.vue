<template>
  <div class="passenger-form-shell">
    
    <!-- Navbar / Header (Simplified) -->
    <header class="client-header-solid d-flex justify-content-between align-items-center p-3 shadow-sm">
      <div class="login-logo text-dark">
        <div class="login-logo-icon bg-danger">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ffffff"/>
          </svg>
        </div>
        <span class="fw-bold fs-5 ms-2" style="color: #d60f2b;">NachoFlight</span>
      </div>
      <div>
        <button @click="$router.back()" class="btn btn-outline-secondary fw-bold rounded-pill px-4" :disabled="loading">Volver</button>
      </div>
    </header>

    <div class="container py-5">
      
      <!-- Progress Bar (Visual only) -->
      <div class="row mb-5 justify-content-center">
        <div class="col-10 col-md-8 text-center">
          <div class="d-flex justify-content-between position-relative">
            <div class="position-absolute top-50 start-0 end-0 translate-middle-y" style="height: 2px; background-color: #e9ecef; z-index: 1;"></div>
            <div class="position-absolute top-50 start-0 translate-middle-y bg-danger" style="height: 2px; width: 66%; z-index: 1;"></div>
            
            <div class="step-indicator completed rounded-circle d-flex align-items-center justify-content-center position-relative shadow-sm" style="width: 40px; height: 40px; z-index: 2; background-color: #d60f2b; color: white;">
              <i class="bi bi-check-lg"></i>
            </div>
            <div class="step-indicator completed rounded-circle d-flex align-items-center justify-content-center position-relative shadow-sm" style="width: 40px; height: 40px; z-index: 2; background-color: #d60f2b; color: white;">
              <i class="bi bi-check-lg"></i>
            </div>
            <div class="step-indicator active rounded-circle d-flex align-items-center justify-content-center position-relative shadow-sm" style="width: 40px; height: 40px; z-index: 2; background-color: #d60f2b; color: white; border: 4px solid #fff0f2;">
              3
            </div>
          </div>
          <div class="d-flex justify-content-between mt-2 text-muted small fw-bold text-uppercase">
            <span>Vuelo</span>
            <span>Asiento</span>
            <span class="text-danger">Pasajero</span>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <!-- Form Area -->
        <div class="col-lg-8">
          
          <div class="mb-4">
            <h2 class="fw-bold h3 mb-2">Datos del Pasajero</h2>
            <p class="text-muted">Ingresa la información exactamente como aparece en el documento de identidad.</p>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center gap-2 mb-4 border-0 shadow-sm" role="alert">
            <i class="bi bi-exclamation-circle-fill"></i>
            {{ errorMessage }}
          </div>

          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="submitFlow">
                <div class="row g-4">
                  
                  <!-- Nombres y Apellidos -->
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Nombre *</label>
                    <input v-model="form.nombrePasajero" type="text" class="form-control form-control-lg bg-light border-0" required placeholder="Ej. Juan Carlos" :disabled="loading" />
                  </div>
                  
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Apellido *</label>
                    <input v-model="form.apellidoPasajero" type="text" class="form-control form-control-lg bg-light border-0" required placeholder="Ej. Pérez Gómez" :disabled="loading" />
                  </div>

                  <!-- Género y Fecha Nacimiento -->
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Género *</label>
                    <select v-model="form.generoPasajero" class="form-select form-select-lg bg-light border-0" required :disabled="loading">
                      <option value="MASCULINO">Masculino</option>
                      <option value="FEMENINO">Femenino</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Fecha de Nacimiento *</label>
                    <input v-model="form.fechaNacimientoPasajero" type="date" class="form-control form-control-lg bg-light border-0" required :disabled="loading" />
                  </div>

                  <hr class="my-4 text-muted" />

                  <!-- Documento -->
                  <div class="col-md-4">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Tipo de Documento *</label>
                    <select v-model="form.tipoDocumentoPasajero" class="form-select form-select-lg bg-light border-0" required :disabled="loading">
                      <option value="CEDULA">Cédula</option>
                      <option value="PASAPORTE">Pasaporte</option>
                      <option value="RUC">RUC</option>
                    </select>
                  </div>

                  <div class="col-md-8">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Número de Documento *</label>
                    <input v-model="form.numeroDocumentoPasajero" type="text" class="form-control form-control-lg bg-light border-0" required placeholder="Ej. 1712345678" :disabled="loading" />
                  </div>

                  <div class="col-md-12">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Nacionalidad *</label>
                    <input v-model="form.nacionalidadPasajero" type="text" class="form-control form-control-lg bg-light border-0" required placeholder="Ej. Ecuatoriana" :disabled="loading" />
                  </div>

                  <hr class="my-4 text-muted" />

                  <!-- Contacto -->
                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Correo Electrónico *</label>
                    <input v-model="form.emailContactoPasajero" type="email" class="form-control form-control-lg bg-light border-0" required placeholder="correo@ejemplo.com" :disabled="loading" />
                  </div>

                  <div class="col-md-6">
                    <label class="form-label fw-bold small text-muted text-uppercase mb-1">Teléfono *</label>
                    <input v-model="form.telefonoContactoPasajero" type="tel" class="form-control form-control-lg bg-light border-0" required placeholder="Ej. 0991234567" :disabled="loading" />
                  </div>

                  <!-- Asistencia -->
                  <div class="col-12 mt-4">
                    <div class="form-check bg-light p-3 rounded-3 d-flex align-items-center gap-3">
                      <input v-model="form.requiereAsistencia" class="form-check-input ms-0 mt-0 flex-shrink-0" type="checkbox" id="asistencia" style="width: 1.5rem; height: 1.5rem;" :disabled="loading">
                      <label class="form-check-label ms-2 w-100 cursor-pointer" for="asistencia">
                        <span class="d-block fw-bold mb-1">Requiero asistencia especial</span>
                        <span class="d-block text-muted small">Silla de ruedas, asistencia auditiva/visual, o acompañamiento.</span>
                      </label>
                    </div>
                  </div>

                  <!-- Submit (Mobile only) -->
                  <div class="col-12 d-block d-lg-none mt-4">
                    <button type="submit" class="btn btn-danger w-100 fw-bold rounded-pill py-3 shadow-sm" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Procesando...' : 'Confirmar Reserva' }}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Summary Sidebar -->
        <div class="col-lg-4">
          <div class="sticky-top" style="top: 2rem;">
            
            <div class="card border-0 shadow-sm rounded-4 mb-4">
              <div class="card-body p-4 bg-danger text-white rounded-top-4" style="background: linear-gradient(135deg, #d60f2b, #a00824);">
                <h5 class="fw-bold mb-1">Tu Viaje</h5>
                <p class="mb-0 opacity-75 small">Revisa los detalles de tu vuelo</p>
              </div>
              <div class="card-body p-4">
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted small text-uppercase fw-bold">Vuelo</span>
                  <span class="fw-bold text-dark fs-5">{{ numeroVuelo }}</span>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted small text-uppercase fw-bold">Asiento</span>
                  <span class="fw-bold text-dark fs-5">{{ numeroAsiento || 'No seleccionado' }}</span>
                </div>

                <hr class="text-muted my-4" />

                <!-- El total real lo calculará el backend, pero mostramos info si la pasaron por query -->
                <div class="alert alert-light border shadow-sm mb-0">
                  <div class="d-flex align-items-start gap-2 text-muted small">
                    <i class="bi bi-info-circle text-primary mt-1"></i>
                    <span>Los impuestos, tasas y el total final serán calculados y confirmados al generar la reserva.</span>
                  </div>
                </div>

              </div>
              <div class="card-footer bg-white border-0 p-4 pt-0 d-none d-lg-block">
                <button type="button" class="btn btn-danger w-100 fw-bold rounded-pill py-3 shadow-sm" :disabled="loading" @click="submitFlow">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? 'Procesando...' : 'Confirmar Reserva' }}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createPasajero, createReserva } from '../../../services/clientService'

const route = useRoute()
const router = useRouter()

const idVuelo = route.params.id
const numeroVuelo = route.query.numeroVuelo || 'N/A'
const idAsiento = route.query.idAsiento
const numeroAsiento = route.query.numeroAsiento || ''

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  nombrePasajero: '',
  apellidoPasajero: '',
  generoPasajero: 'MASCULINO',
  fechaNacimientoPasajero: '',
  tipoDocumentoPasajero: 'CEDULA',
  numeroDocumentoPasajero: '',
  nacionalidadPasajero: '',
  emailContactoPasajero: '',
  telefonoContactoPasajero: '',
  requiereAsistencia: false,
  observacionesPasajero: ''
})

const submitFlow = async () => {
  if (!idAsiento || !idVuelo) {
    errorMessage.value = 'Faltan datos de la selección de vuelo o asiento. Por favor, regresa y vuelve a intentar.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    // 1. Crear el pasajero
    const pasajeroPayload = {
      ...form,
      fechaNacimientoPasajero: form.fechaNacimientoPasajero ? new Date(form.fechaNacimientoPasajero).toISOString() : null,
      observacionesPasajero: form.observacionesPasajero || 'NA'
    }
    
    // No enviamos idCliente explícito, el backend debería saberlo si es necesario por el token JWT
    const newPasajero = await createPasajero(pasajeroPayload)
    const idPasajeroCreado = newPasajero?.idPasajero || newPasajero?.id_pasajero || newPasajero
    
    if (!idPasajeroCreado || typeof idPasajeroCreado === 'object') {
      console.warn("Respuesta de pasajero inesperada:", newPasajero)
    }

    // 2. Crear la reserva. El backend calcula importes, factura y boleto al confirmar.
    const reservaPayload = {
      idPasajero: Number(idPasajeroCreado?.idPasajero || idPasajeroCreado),
      idVuelo: Number(idVuelo),
      idAsiento: Number(idAsiento),
      origenCanalReserva: 'WEB',
      contactoEmail: form.emailContactoPasajero || 'user@example.com',
      contactoTelefono: form.telefonoContactoPasajero || 'NA',
      observaciones: 'NA'
    }

    const newReserva = await createReserva(reservaPayload)
    const idReserva = newReserva?.idReserva || newReserva?.id_reserva || newReserva

    // 3. Redirigir a confirmación
    router.push({
      path: `/dashboard/vuelos/reserva-exitosa/${idReserva || 'ok'}`,
      query: { codigo: newReserva?.codigoReserva || newReserva?.codigo_reserva }
    })

  } catch (error) {
    console.error('Error en flujo de reserva:', error)
    if (error?.response?.data?.errors) {
      errorMessage.value = Object.values(error.response.data.errors).flat().join(' | ')
    } else {
      errorMessage.value = error?.response?.data?.mensaje || error?.response?.data?.message || 'Ocurrió un error al procesar tu reserva. Intenta nuevamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.passenger-form-shell {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.client-header-solid {
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
}

.login-logo-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}

.form-control-lg, .form-select-lg {
  font-size: 0.95rem;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
