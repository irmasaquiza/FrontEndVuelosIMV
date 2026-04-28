<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de vuelos</h1>
        <p class="mb-0" style="opacity:0.75;">Programa vuelos, define origen y destino, y agrega escalas por aeropuertos intermedios.</p>
      </div>
      <div class="d-flex gap-2 flex-shrink-0">
        <router-link class="btn btn-outline-light fw-bold" to="/admin">Volver al módulo</router-link>
        <router-link class="btn btn-outline-light fw-bold" to="/home">Inicio</router-link>
      </div>
    </div>

    <!-- Alerta error -->
    <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#842029"/>
      </svg>
      {{ errorMsg }}
    </div>

    <!-- ═══════════════════ FORM VUELO ═══════════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2A1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">{{ vueloForm.idVuelo ? 'Editar vuelo' : 'Nuevo vuelo' }}</h2>
            <p class="text-muted small mb-0">{{ vueloForm.idVuelo ? 'Modifica los datos del vuelo seleccionado.' : 'Completa los campos para programar un nuevo vuelo.' }}</p>
          </div>
        </div>

        <div class="row g-3">

          <div class="col-12 col-md-6">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Aeropuerto origen</label>
            <input v-model="aeropuertoOrigenSearch"
                   class="form-control mb-2"
                   placeholder="Buscar por IATA, aeropuerto, ciudad o pais"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            <select v-model="vueloForm.idAeropuertoOrigen"
                    class="form-select"
                    :disabled="loadingAeropuertos"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
              <option value="">{{ loadingAeropuertos ? 'Cargando aeropuertos...' : 'Seleccione origen' }}</option>
              <option v-for="a in aeropuertosOrigenFiltrados" :key="a.idAeropuerto" :value="a.idAeropuerto">
                {{ getAeropuertoLabel(a) }}
              </option>
            </select>
            <small class="text-muted d-block mt-1">{{ aeropuertosOrigenFiltrados.length }} resultado(s)</small>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Aeropuerto destino</label>
            <input v-model="aeropuertoDestinoSearch"
                   class="form-control mb-2"
                   placeholder="Buscar por IATA, aeropuerto, ciudad o pais"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            <select v-model="vueloForm.idAeropuertoDestino"
                    class="form-select"
                    :disabled="loadingAeropuertos"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
              <option value="">{{ loadingAeropuertos ? 'Cargando aeropuertos...' : 'Seleccione destino' }}</option>
              <option v-for="a in aeropuertosDestinoFiltrados" :key="a.idAeropuerto" :value="a.idAeropuerto">
                {{ getAeropuertoLabel(a) }}
              </option>
            </select>
            <small class="text-muted d-block mt-1">{{ aeropuertosDestinoFiltrados.length }} resultado(s)</small>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Número de vuelo</label>
            <input v-model="vueloForm.numeroVuelo" placeholder="Ej. NF-101"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha y hora de salida</label>
            <input v-model="vueloForm.fechaHoraSalida" type="datetime-local"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha y hora de llegada</label>
            <input v-model="vueloForm.fechaHoraLlegada" type="datetime-local"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Duración (min)</label>
            <input :value="vueloForm.duracionMin" disabled placeholder="Se calcula automáticamente"
                   class="form-control bg-light"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Precio base ($)</label>
            <input v-model="vueloForm.precioBase" type="number" min="0" step="0.01" placeholder="Ej. 199.99"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Capacidad total</label>
            <input v-model="vueloForm.capacidadTotal" type="number" placeholder="Ej. 180"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
          </div>

          <div class="col-12 d-flex gap-2 justify-content-end pt-2">
            <button v-if="vueloForm.idVuelo" type="button"
                    class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                    @click="resetVueloForm">
              Cancelar
            </button>
            <button type="button"
                    class="btn fw-bold rounded-pill px-4 text-white"
                    style="background:#d60f2b;"
                    @click="submitVuelo">
              {{ vueloForm.idVuelo ? 'Actualizar vuelo' : 'Crear vuelo' }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════════ TABLA VUELOS ═══════════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de vuelos</h2>
            <p class="text-muted small mb-0">
              {{ vuelos.length }} {{ vuelos.length === 1 ? 'vuelo visible' : 'vuelos visibles' }}
              <span v-if="vuelosTotal"> de {{ vuelosTotal }} registrados</span>
            </p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Vuelo</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Ruta</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Salida</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Llegada</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Duración</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Precio</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingVuelos">
                <td colspan="8" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando vuelos...
                </td>
              </tr>
              <tr v-else-if="!vuelos.length">
                <td colspan="8" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#ddd"/>
                  </svg>
                  No hay vuelos registrados.
                </td>
              </tr>
              <tr v-for="v in vuelos" :key="v.idVuelo">
                <td class="ps-4">
                  <span class="badge fw-bold px-2 py-1 rounded" style="background:#fff0f2;color:#d60f2b;font-size:0.82rem;">
                    {{ v.numeroVuelo }}
                  </span>
                </td>
                <td class="fw-semibold small">
                  {{ getAeropuerto(v.idAeropuertoOrigen) }}
                  <span class="text-muted mx-1">→</span>
                  {{ getAeropuerto(v.idAeropuertoDestino) }}
                </td>
                <td class="text-muted small">{{ formatDate(v.fechaHoraSalida) }}</td>
                <td class="text-muted small">{{ formatDate(v.fechaHoraLlegada) }}</td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded" style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ v.duracionMin }} min
                  </span>
                </td>
                <td class="fw-semibold">${{ v.precioBase }}</td>
                <td>
                  <select class="form-select form-select-sm fw-semibold"
                          style="border-radius:6px;font-size:0.78rem;width:auto;"
                          :value="v.estadoVuelo"
                          @change="changeEstado(v, $event.target.value)">
                    <option v-for="e in estados" :key="e">{{ e }}</option>
                  </select>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-1"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="editVuelo(v)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#d60f2b"/>
                    </svg>
                    Editar
                  </button>
                  <button class="btn btn-sm fw-bold me-1"
                          style="background:#f3f4f6;color:#6b7280;border-radius:6px;"
                          @click="deleteVuelo(v)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#6b7280"/>
                    </svg>
                    Eliminar
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#f0f4ff;color:#3b5bdb;border-radius:6px;"
                          @click="selectVuelo(v)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="#3b5bdb"/>
                    </svg>
                    Escalas
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">
            Página {{ vuelosPage }} de {{ vuelosTotalPages }}
            <span v-if="vuelosTotal"> — {{ vuelosTotal }} vuelos registrados</span>
          </p>
          <div class="d-flex flex-wrap align-items-center gap-2">
            <label class="text-muted small mb-0" for="vuelos-page-size">Mostrar</label>
            <select id="vuelos-page-size"
                    v-model.number="vuelosPageSize"
                    class="form-select form-select-sm"
                    style="width:auto;"
                    :disabled="loadingVuelos"
                    @change="fetchVuelos(1)">
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            <div class="btn-group btn-group-sm" role="group">
              <button type="button"
                      class="btn btn-outline-secondary fw-semibold"
                      :disabled="loadingVuelos || vuelosPage <= 1"
                      @click="fetchVuelos(vuelosPage - 1)">
                Anterior
              </button>
              <button type="button"
                      class="btn btn-outline-secondary fw-semibold"
                      :disabled="loadingVuelos || !canNextVueloPage"
                      @click="fetchVuelos(vuelosPage + 1)">
                Siguiente
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════════ ESCALAS ═══════════════════ -->
    <div v-if="selectedVuelo" class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#f0f4ff;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="#3b5bdb"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Escalas del vuelo
              <span class="badge ms-2 fw-bold" style="background:#fff0f2;color:#d60f2b;">{{ selectedVuelo.numeroVuelo }}</span>
            </h2>
            <p class="text-muted small mb-0">Agrega o elimina escalas intermedias para este vuelo.</p>
          </div>
        </div>

        <!-- Form escala -->
        <div class="p-3 rounded-3 mb-4" style="background:#fafafa;border:1px solid #f0f0f0;">
          <div class="row g-3">

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Aeropuerto</label>
              <select v-model="escalaForm.idAeropuerto"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Seleccione aeropuerto</option>
                <option v-for="a in aeropuertos" :key="a.idAeropuerto" :value="a.idAeropuerto">
                  {{ getAeropuertoLabel(a) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Orden</label>
              <input v-model.number="escalaForm.orden" type="number" placeholder="Ej. 1"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Llegada a escala</label>
              <input v-model="escalaForm.fechaHoraLlegada" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Salida de escala</label>
              <input v-model="escalaForm.fechaHoraSalida" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Duración (min)</label>
              <input :value="duracionEscalaComputada" disabled
                     class="form-control bg-light"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Tipo escala</label>
              <input v-model="escalaForm.tipoEscala" placeholder="Ej. TÉCNICA"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Terminal</label>
              <input v-model="escalaForm.terminal" placeholder="Ej. T1"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-2">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Puerta</label>
              <input v-model="escalaForm.puerta" placeholder="Ej. A12"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Observaciones</label>
              <input v-model="escalaForm.observaciones" placeholder="Observaciones opcionales"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 d-flex justify-content-end pt-1">
              <button type="button"
                      class="btn fw-bold rounded-pill px-4 text-white"
                      style="background:#3b5bdb;"
                      @click="submitEscala">
                Agregar escala
              </button>
            </div>

          </div>
        </div>

        <!-- Tabla escalas -->
        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Orden</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Aeropuerto</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Llegada</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Salida</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Duración</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Tipo</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Terminal</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!escalas.length">
                <td colspan="8" class="text-center text-muted py-4">
                  Este vuelo aún no tiene escalas registradas.
                </td>
              </tr>
              <tr v-for="e in escalas" :key="e.idEscala">
                <td class="ps-4">
                  <span class="badge rounded-pill fw-bold px-3" style="background:#f0f4ff;color:#3b5bdb;">
                    {{ e.orden }}
                  </span>
                </td>
                <td class="fw-semibold">{{ getAeropuerto(e.idAeropuerto) }}</td>
                <td class="text-muted small">{{ formatDate(e.fechaHoraLlegada) }}</td>
                <td class="text-muted small">{{ formatDate(e.fechaHoraSalida) }}</td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded" style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ e.duracionMin }} min
                  </span>
                </td>
                <td class="text-muted small">{{ e.tipoEscala || '-' }}</td>
                <td class="text-muted small">{{ e.terminal || '-' }}</td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="deleteEscala(e)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#d60f2b"/>
                    </svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import api from '@/api/axios'

const vuelos        = ref([])
const aeropuertos   = ref([])
const paises        = ref([])
const ciudades      = ref([])
const escalas       = ref([])
const selectedVuelo = ref(null)
const errorMsg      = ref('')
const loadingAeropuertos = ref(false)
const aeropuertoOrigenSearch = ref('')
const aeropuertoDestinoSearch = ref('')

// ── Paginación ────────────────────────────────────────────────────
const loadingVuelos     = ref(false)
const vuelosPage        = ref(1)
const vuelosPageSize    = ref(20)
const vuelosTotal       = ref(0)
const vuelosTotalPages  = ref(1)

const canNextVueloPage = computed(() => {
  if (vuelosTotalPages.value > vuelosPage.value) return true
  return !vuelosTotal.value && vuelos.value.length === vuelosPageSize.value
})

const estados = ['PROGRAMADO', 'EN_VUELO', 'ATERRIZADO', 'CANCELADO', 'DEMORADO']

const aeropuertosOrigenFiltrados = computed(() => filtrarAeropuertos(aeropuertoOrigenSearch.value))
const aeropuertosDestinoFiltrados = computed(() => filtrarAeropuertos(aeropuertoDestinoSearch.value))

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
  idAeropuerto: '',
  orden: '',
  fechaHoraLlegada: '',
  fechaHoraSalida: '',
  duracionMin: 0,
  tipoEscala: '',
  terminal: '',
  puerta: '',
  observaciones: ''
})

// ── Duración vuelo ────────────────────────────────────────────────
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

// ── Duración escala ───────────────────────────────────────────────
const duracionEscalaComputada = computed(() => {
  if (!escalaForm.fechaHoraLlegada || !escalaForm.fechaHoraSalida) return 0
  const diff = (new Date(escalaForm.fechaHoraSalida) - new Date(escalaForm.fechaHoraLlegada)) / 60000
  return diff > 0 ? Math.floor(diff) : 0
})

watch(duracionEscalaComputada, (val) => { escalaForm.duracionMin = val })

// ── Helpers ───────────────────────────────────────────────────────
function getAeropuerto(id) {
  return aeropuertos.value.find(a => a.idAeropuerto === id)?.codigoIata || id
}

function getPaisNombre(idPais) {
  return paises.value.find(p => p.idPais === idPais)?.nombre || ''
}

function getCiudadNombre(idCiudad) {
  return ciudades.value.find(c => c.idCiudad === idCiudad)?.nombre || ''
}

function getAeropuertoLabel(aeropuerto) {
  const ciudad = getCiudadNombre(aeropuerto.idCiudad)
  const pais = getPaisNombre(aeropuerto.idPais)
  const ubicacion = [ciudad, pais].filter(Boolean).join(', ')
  return `${aeropuerto.codigoIata} - ${aeropuerto.nombre}${ubicacion ? ` (${ubicacion})` : ''}`
}

function filtrarAeropuertos(search) {
  const term = search.trim().toLowerCase()

  if (!term) {
    return aeropuertos.value
  }

  return aeropuertos.value.filter((aeropuerto) => {
    const ciudad = getCiudadNombre(aeropuerto.idCiudad)
    const pais = getPaisNombre(aeropuerto.idPais)
    const searchable = [
      aeropuerto.codigoIata,
      aeropuerto.codigoIcao,
      aeropuerto.nombre,
      ciudad,
      pais
    ].filter(Boolean).join(' ').toLowerCase()

    return searchable.includes(term)
  })
}

function formatDate(d) {
  return d ? d.replace('T', ' ').slice(0, 16) : ''
}

function manejarError(e, fallback = '') {
  if (e?.response?.data?.errors) {
    errorMsg.value = Object.values(e.response.data.errors).flat().join(' | ')
  } else {
    errorMsg.value =
      e?.response?.data?.mensaje ||
      e?.response?.data?.message ||
      e?.response?.data?.detalle ||
      e?.response?.data?.title ||
      e?.message ||
      fallback ||
      'Ha ocurrido un error inesperado.'
  }
}

function resetVueloForm() {
  Object.assign(vueloForm, {
    idVuelo: null, idAeropuertoOrigen: '', idAeropuertoDestino: '',
    numeroVuelo: '', fechaHoraSalida: '', fechaHoraLlegada: '',
    duracionMin: 0, precioBase: '', capacidadTotal: ''
  })
}

// ── Paginación helpers ────────────────────────────────────────────
function readVuelosMeta(response) {
  const meta = response.data?.meta || {}
  const total =
    response.data?.total || response.data?.totalRecords ||
    response.data?.total_registros || meta.total ||
    meta.totalRecords || meta.total_registros || 0

  const totalPages =
    response.data?.totalPages || response.data?.total_pages ||
    meta.totalPages || meta.total_pages || 0

  vuelosTotal.value = Number(total || 0)

  if (totalPages) {
    vuelosTotalPages.value = Number(totalPages)
    return
  }
  if (total) {
    vuelosTotalPages.value = Math.max(1, Math.ceil(total / vuelosPageSize.value))
    return
  }
  vuelosTotalPages.value = vuelos.value.length === vuelosPageSize.value
    ? vuelosPage.value + 1
    : vuelosPage.value
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
    resetVueloForm()
    fetchVuelos()
  } catch (e) { manejarError(e) }
}

async function fetchVuelos(page = vuelosPage.value) {
  loadingVuelos.value = true
  try {
    const res = await api.get('/vuelos', {
      params: {
        Page: page, PageSize: vuelosPageSize.value,
        page,       page_size: vuelosPageSize.value
      }
    })
    vuelos.value = res.data.data ?? res.data ?? []
    vuelosPage.value = page
    readVuelosMeta(res)
  } catch (e) {
    manejarError(e)
  } finally {
    loadingVuelos.value = false
  }
}

async function fetchAeropuertos() {
  loadingAeropuertos.value = true
  try {
    const [aeropuertosData, paisesData, ciudadesData] = await Promise.all([
      fetchAllPages('/aeropuertos'),
      fetchAllPages('/paises'),
      fetchAllPages('/ciudades')
    ])

    aeropuertos.value = aeropuertosData
    paises.value = paisesData
    ciudades.value = ciudadesData
  } catch (e) {
    manejarError(e)
  } finally {
    loadingAeropuertos.value = false
  }
}

async function fetchAllPages(url, extraParams = {}) {
  const pageSize = 100
  const firstResponse = await api.get(url, {
    params: {
      ...extraParams,
      Page: 1,
      PageSize: pageSize,
      page: 1,
      page_size: pageSize
    }
  })

  const firstData = getResponseItems(firstResponse)
  const totalPages = getResponseTotalPages(firstResponse, firstData.length, pageSize)

  if (!totalPages) {
    const allItems = [...firstData]
    let page = 2
    let keepLoading = firstData.length === pageSize

    while (keepLoading && page <= 50) {
      const response = await api.get(url, {
        params: {
          ...extraParams,
          Page: page,
          PageSize: pageSize,
          page,
          page_size: pageSize
        }
      })
      const items = getResponseItems(response)
      allItems.push(...items)
      keepLoading = items.length === pageSize
      page += 1
    }

    return allItems
  }

  if (totalPages <= 1) {
    return firstData
  }

  const requests = []
  for (let page = 2; page <= totalPages; page += 1) {
    requests.push(api.get(url, {
      params: {
        ...extraParams,
        Page: page,
        PageSize: pageSize,
        page,
        page_size: pageSize
      }
    }))
  }

  const responses = await Promise.all(requests)
  return [
    ...firstData,
    ...responses.flatMap((response) => getResponseItems(response))
  ]
}

function getResponseItems(response) {
  const payload = response.data
  const items = payload?.data ?? payload
  return Array.isArray(items) ? items : []
}

function getResponseTotalPages(response, itemCount, pageSize) {
  const meta = response.data?.meta || {}
  const totalPages =
    response.data?.totalPages ||
    response.data?.total_pages ||
    meta.totalPages ||
    meta.total_pages

  if (totalPages) {
    return Number(totalPages)
  }

  const total =
    response.data?.total ||
    response.data?.totalRecords ||
    response.data?.total_registros ||
    meta.total ||
    meta.totalRecords ||
    meta.total_registros

  if (total) {
    return Math.max(1, Math.ceil(Number(total) / pageSize))
  }

  return itemCount === pageSize ? null : 1
}

function editVuelo(v) {
  Object.assign(vueloForm, v)
  vueloForm.fechaHoraSalida  = v.fechaHoraSalida.slice(0, 16)
  vueloForm.fechaHoraLlegada = v.fechaHoraLlegada.slice(0, 16)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function deleteVuelo(v) {
  if (!confirm('¿Eliminar este vuelo?')) return
  try {
    await api.delete(`/vuelos/${v.idVuelo}`)
    fetchVuelos()
  } catch (e) { manejarError(e) }
}

async function changeEstado(v, e) {
  try {
    await api.patch(`/vuelos/${v.idVuelo}/estado`, { estadoVuelo: e, motivo: 'manual' })
    fetchVuelos()
  } catch (err) { manejarError(err) }
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
      duracionMin:      escalaForm.duracionMin,
      tipoEscala:       escalaForm.tipoEscala      || null,
      terminal:         escalaForm.terminal        || null,
      puerta:           escalaForm.puerta          || null,
      observaciones:    escalaForm.observaciones   || null
    })
    Object.assign(escalaForm, {
      idAeropuerto: '', orden: '', fechaHoraLlegada: '', fechaHoraSalida: '',
      duracionMin: 0, tipoEscala: '', terminal: '', puerta: '', observaciones: ''
    })
    fetchEscalas()
  } catch (e) { manejarError(e) }
}

async function deleteEscala(e) {
  if (!confirm('¿Eliminar esta escala?')) return
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

