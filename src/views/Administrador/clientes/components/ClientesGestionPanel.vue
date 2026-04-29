<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de clientes</h1>
        <p class="mb-0" style="opacity:0.75;">Registra clientes, actualiza sus datos y controla su estado en el sistema.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ errorMsg }}
    </div>
    <div v-if="successMsg" class="alert alert-success d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0f5132"/>
      </svg>
      {{ successMsg }}
    </div>

    <!-- ═══════════════ FORMULARIO ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">{{ editingCliente ? 'Editar cliente' : 'Nuevo cliente' }}</h2>
            <p class="text-muted small mb-0">{{ editingCliente ? 'Modifica los datos del cliente seleccionado.' : 'Completa los campos para registrar un nuevo cliente.' }}</p>
          </div>
        </div>

        <form @submit.prevent="submitCliente">
          <div class="row g-3">

            <!-- Tipo ID -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Tipo de identificación</label>
              <select v-model="form.tipoIdentificacion"
                      :disabled="!!editingCliente"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="$emit('document-type-change')">
                <option value="CEDULA">Cédula</option>
                <option value="PASAPORTE">Pasaporte</option>
                <option value="RUC">RUC</option>
              </select>
            </div>

            <!-- Número ID -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Número de identificación *</label>
              <input v-model="form.numeroIdentificacion" required
                     :disabled="!!editingCliente"
                     :placeholder="documentMeta.placeholder"
                     :inputmode="documentMeta.inputMode"
                     :maxlength="documentMeta.maxLength"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.numeroIdentificacion }"
                     @input="$emit('document-input')"
                     @blur="$emit('validate-document')"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.numeroIdentificacion" class="invalid-feedback">
                {{ validationErrors.numeroIdentificacion }}
              </div>
            </div>

            <!-- Género -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Género</label>
              <select v-model="form.genero"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <!-- Nombres -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nombres *</label>
              <input v-model="form.nombres" required placeholder="Ej. Juan Carlos"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Apellidos -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Apellidos *</label>
              <input v-model="form.apellidos" required placeholder="Ej. Pérez Gómez"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Fecha nacimiento -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha de nacimiento</label>
              <input v-model="form.fechaNacimiento" type="datetime-local"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.fechaNacimiento }"
                     @blur="$emit('validate-birth-date')"
                     @change="$emit('validate-birth-date')"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.fechaNacimiento" class="invalid-feedback">
                {{ validationErrors.fechaNacimiento }}
              </div>
            </div>

            <!-- Correo -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Correo electrónico</label>
              <input v-model="form.correo" type="email" placeholder="Ej. juan@email.com"
                     class="form-control"
                     :class="{ 'is-invalid': validationErrors.correo }"
                     @input="$emit('email-input')"
                     @blur="$emit('validate-email')"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.correo" class="invalid-feedback">
                {{ validationErrors.correo }}
              </div>
            </div>

            <!-- Teléfono -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Teléfono</label>
              <input v-model="form.telefono" placeholder="Ej. +593 99 123 4567"
                     class="form-control"
                     inputmode="numeric"
                     maxlength="10"
                     :class="{ 'is-invalid': validationErrors.telefono }"
                     @input="$emit('phone-input')"
                     @blur="$emit('validate-phone')"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              <div v-if="validationErrors.telefono" class="invalid-feedback">
                {{ validationErrors.telefono }}
              </div>
            </div>

            <!-- Nacionalidad -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Nacionalidad</label>
              <input v-model="form.nacionalidad" placeholder="Ej. Ecuatoriana"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Dirección -->
            <div class="col-12">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Dirección</label>
              <input v-model="form.direccion" placeholder="Ej. Av. Amazonas N23-45, Quito"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Buscador de país -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">País de nacionalidad</label>
              <input :value="busquedaPais"
                     placeholder="Buscar país..."
                     class="form-control mb-2"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                     @input="$emit('update:busquedaPais', $event.target.value)" />
              <select v-model="form.idPaisNacionalidad"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Seleccione un país</option>
                <option v-for="p in paisesFiltrados" :key="p.idPais" :value="p.idPais">
                  {{ p.nombre }}
                </option>
              </select>
            </div>

            <!-- Ciudad filtrada por país -->
            <div class="col-12 col-md-6">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Ciudad de residencia
                <span v-if="!form.idPaisNacionalidad" class="text-muted fw-normal" style="font-size:0.68rem;"> — selecciona primero un país</span>
              </label>
              <select v-model="form.idCiudadResidencia"
                      class="form-select"
                      :disabled="!form.idPaisNacionalidad"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;margin-top:42px;">
                <option value="">Seleccione una ciudad</option>
                <option v-for="c in ciudadesFiltradas" :key="c.idCiudad" :value="c.idCiudad">
                  {{ c.nombre }}
                </option>
              </select>
              <div v-if="form.idPaisNacionalidad && !ciudadesFiltradas.length"
                   class="text-muted small mt-1">
                No hay ciudades registradas para este país.
              </div>
            </div>

            <!-- Estado (solo edición) -->
            <div v-if="editingCliente" class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Estado</label>
              <select v-model="form.estado"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
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
                {{ editingCliente ? 'Actualizar cliente' : 'Crear cliente' }}
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
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de clientes</h2>
            <p class="text-muted small mb-0">
              {{ clientes.length }} {{ clientes.length === 1 ? 'cliente visible' : 'clientes visibles' }}
              <span v-if="clientesTotal">de {{ clientesTotal }} registrados</span>
            </p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Nombre</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Identificación</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Correo</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Teléfono</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingClientes">
                <td colspan="6" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando clientes...
                </td>
              </tr>
              <tr v-else-if="!clientes.length">
                <td colspan="6" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#ddd"/>
                  </svg>
                  No hay clientes registrados.
                </td>
              </tr>
              <tr v-for="c in clientes" :key="c.idCliente">
                <td class="ps-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                         style="width:34px;height:34px;background:#d60f2b;font-size:0.8rem;">
                      {{ c.nombres?.charAt(0) }}{{ c.apellidos?.charAt(0) }}
                    </div>
                    <div>
                      <div class="fw-semibold small">{{ c.nombres }} {{ c.apellidos }}</div>
                      <div class="text-muted" style="font-size:0.72rem;">{{ c.genero }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ c.tipoIdentificacion }}
                  </span>
                  <span class="text-muted small ms-1">{{ c.numeroIdentificacion }}</span>
                </td>
                <td class="text-muted small">{{ c.correo || '-' }}</td>
                <td class="text-muted small">{{ c.telefono || '-' }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="c.estado === 'ACTIVO'
                          ? 'background:#d1fae5;color:#065f46;'
                          : 'background:#f3f4f6;color:#6b7280;'">
                    {{ c.estado }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-2"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="editCliente(c)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#d60f2b"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#f3f4f6;color:#6b7280;border-radius:6px;"
                          @click="deleteCliente(c)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#6b7280"/>
                    </svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">
            Pagina {{ clientesPage }} de {{ clientesTotalPages }}
            <span v-if="clientesTotal">- {{ clientesTotal }} clientes registrados</span>
          </p>

          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small mb-0" for="clientes-page-size">Mostrar</label>
            <select
              id="clientes-page-size"
              :value="clientesPageSize"
              class="form-select form-select-sm"
              style="width:auto;"
              :disabled="loadingClientes"
              @change="onPageSizeChange"
            >
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
              <option :value="500">500</option>
            </select>

            <div class="btn-group btn-group-sm" role="group" aria-label="Paginacion de clientes">
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingClientes || clientesPage <= 1"
                @click="fetchClientes(clientesPage - 1)"
              >
                Anterior
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary fw-semibold"
                :disabled="loadingClientes || !canNextClientePage"
                @click="fetchClientes(clientesPage + 1)"
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
import { computed } from 'vue'

const props = defineProps({
  busquedaPais:       { type: String,  default: ''         },
  canNextClientePage: { type: Boolean, default: false      },
  ciudadesFiltradas:  { type: Array,   default: () => []   },
  clientes:           { type: Array,   default: () => []   },
  clientesPage:       { type: Number,  default: 1          },
  clientesPageSize:   { type: Number,  default: 20         },
  clientesTotal:      { type: Number,  default: 0          },
  clientesTotalPages: { type: Number,  default: 1          },
  editingCliente:     { type: Object,  default: null       },
  errorMsg:           { type: String,  default: ''         },
  form:               { type: Object,  required: true      },
  documentMeta:       { type: Object,  default: () => ({ inputMode: 'numeric', maxLength: 10, placeholder: 'Ej. 1712345678' }) },
  hasValidationErrors:{ type: Boolean, default: false      },
  loadingClientes:    { type: Boolean, default: false      },
  paisesFiltrados:    { type: Array,   default: () => []   },
  successMsg:         { type: String,  default: ''         },
  validationErrors:   { type: Object,  default: () => ({}) }
})

const emit = defineEmits([
  'delete-cliente',
  'edit-cliente',
  'fetch-clientes',
  'document-input',
  'document-type-change',
  'email-input',
  'phone-input',
  'reset-form',
  'submit-cliente',
  'validate-birth-date',
  'validate-document',
  'validate-email',
  'validate-phone',
  'update:clientesPageSize',
  'update:busquedaPais'
])

const busquedaPais = computed({
  get:  () => props.busquedaPais,
  set: (v) => emit('update:busquedaPais', v)
})

function submitCliente()        { emit('submit-cliente')        }
function resetForm()            { emit('reset-form')            }
function editCliente(c)         { emit('edit-cliente', c)       }
function deleteCliente(c)       { emit('delete-cliente', c)     }
function fetchClientes(page)     { emit('fetch-clientes', page)  }

function onPageSizeChange(event) {
  emit('update:clientesPageSize', Number(event.target.value))
  emit('fetch-clientes', 1)
}
</script>
