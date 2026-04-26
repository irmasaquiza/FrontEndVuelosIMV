<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de reservas</h1>
        <p class="mb-0" style="opacity:0.75;">Crea reservas, consulta por filtros avanzados y actualiza su estado.</p>
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

    <!-- ═══════════════ FORM NUEVA RESERVA ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Nueva reserva</h2>
            <p class="text-muted small mb-0">Relaciona cliente, pasajero, vuelo y asiento. El sistema calcula el total estimado.</p>
          </div>
        </div>

        <form @submit.prevent="submitReserva">
          <div class="row g-3">

            <!-- Cliente / Pasajero / Vuelo -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Cliente *</label>
              <select v-model="form.idCliente" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onClienteChange">
                <option value="">Selecciona cliente</option>
                <option v-for="cliente in clientes"
                        :key="entityId(cliente, ['id_cliente','idCliente'])"
                        :value="String(entityId(cliente, ['id_cliente','idCliente']))">
                  {{ getClienteNombre(cliente) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Pasajero *</label>
              <select v-model="form.idPasajero" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Selecciona pasajero</option>
                <option v-for="pasajero in pasajerosFiltrados"
                        :key="entityId(pasajero, ['id_pasajero','idPasajero'])"
                        :value="String(entityId(pasajero, ['id_pasajero','idPasajero']))">
                  {{ getPasajeroNombre(pasajero) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Vuelo *</label>
              <select v-model="form.idVuelo" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onVueloChange">
                <option value="">Selecciona vuelo</option>
                <option v-for="vuelo in vuelos"
                        :key="entityId(vuelo, ['id_vuelo','idVuelo'])"
                        :value="String(entityId(vuelo, ['id_vuelo','idVuelo']))">
                  {{ getVueloEtiqueta(vuelo) }}
                </option>
              </select>
            </div>

            <!-- Asiento / Fechas -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Asiento *
                <span v-if="!form.idVuelo" class="text-muted fw-normal" style="font-size:0.68rem;"> — selecciona primero un vuelo</span>
              </label>
              <select v-model="form.idAsiento" required
                      :disabled="!form.idVuelo || loadingAsientos"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="calcularPrecios">
                <option value="">{{ loadingAsientos ? 'Cargando asientos...' : 'Selecciona asiento' }}</option>
                <option v-for="asiento in asientosDisponibles"
                        :key="entityId(asiento, ['id_asiento','idAsiento'])"
                        :value="String(entityId(asiento, ['id_asiento','idAsiento']))">
                  {{ getAsientoEtiqueta(asiento) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha inicio viaje *</label>
              <input v-model="form.fechaInicio" type="datetime-local" required
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha fin viaje *</label>
              <input v-model="form.fechaFin" type="datetime-local" required
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Totales (readonly) -->
            <div class="col-12">
              <div class="row g-3 p-3 rounded-3" style="background:#fafafa;border:1px solid #f0f0f0;">
                <div class="col-4 text-center">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.5px;">Subtotal</div>
                  <div class="fw-bold mt-1" style="font-size:1.1rem;">${{ formatMoney(form.subtotalReserva) }}</div>
                </div>
                <div class="col-4 text-center" style="border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.5px;">IVA (15%)</div>
                  <div class="fw-bold mt-1" style="font-size:1.1rem;">${{ formatMoney(form.valorIva) }}</div>
                </div>
                <div class="col-4 text-center">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.68rem;letter-spacing:0.5px;">Total</div>
                  <div class="fw-bold mt-1" style="font-size:1.1rem;color:#d60f2b;">${{ formatMoney(form.totalReserva) }}</div>
                </div>
              </div>
            </div>

            <!-- Canal / Email / Teléfono -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Canal</label>
              <input v-model="form.origenCanalReserva" placeholder="WEB"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Email de contacto</label>
              <input v-model="form.contactoEmail" type="email" placeholder="cliente@email.com"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Teléfono de contacto</label>
              <input v-model="form.contactoTelefono" placeholder="0999999999"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <!-- Observaciones -->
            <div class="col-12">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Observaciones</label>
              <input v-model="form.observaciones" placeholder="Notas de la reserva"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
            </div>

            <div class="col-12 d-flex justify-content-end pt-2">
              <button type="submit"
                      class="btn fw-bold rounded-pill px-5 text-white"
                      style="background:#d60f2b;min-height:44px;"
                      :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                {{ loadingSubmit ? 'Guardando...' : 'Crear reserva' }}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>

    <!-- ═══════════════ FILTROS Y TABLA ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Buscar reservas</h2>
            <p class="text-muted small mb-0">Filtra por cualquier combinación de criterios.</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="p-3 rounded-3 mb-4" style="background:#fafafa;border:1px solid #f0f0f0;">
          <div class="row g-3">

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Código reserva</label>
              <input v-model="filters.CodigoReserva" placeholder="RSV-0001"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Cliente</label>
              <select v-model="filters.IdCliente"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
                <option value="">Todos</option>
                <option v-for="c in clientes"
                        :key="entityId(c, ['id_cliente','idCliente'])"
                        :value="String(entityId(c, ['id_cliente','idCliente']))">
                  {{ getClienteNombre(c) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Pasajero</label>
              <select v-model="filters.IdPasajero"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
                <option value="">Todos</option>
                <option v-for="p in pasajeros"
                        :key="entityId(p, ['id_pasajero','idPasajero'])"
                        :value="String(entityId(p, ['id_pasajero','idPasajero']))">
                  {{ getPasajeroNombre(p) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Vuelo</label>
              <select v-model="filters.IdVuelo"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
                <option value="">Todos</option>
                <option v-for="v in vuelos"
                        :key="entityId(v, ['id_vuelo','idVuelo'])"
                        :value="String(entityId(v, ['id_vuelo','idVuelo']))">
                  {{ getVueloEtiqueta(v) }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Estado</label>
              <select v-model="filters.EstadoReserva"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
                <option value="">Todos</option>
                <option v-for="estado in estadosReserva" :key="estado.code" :value="estado.code">
                  {{ estado.code }} — {{ estado.label }}
                </option>
              </select>
            </div>

            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Canal</label>
              <input v-model="filters.OrigenCanalReserva" placeholder="WEB / APP / CALLCENTER"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Total mínimo</label>
              <input v-model="filters.TotalMin" type="number" min="0" step="0.01"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Total máximo</label>
              <input v-model="filters.TotalMax" type="number" min="0" step="0.01"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha reserva inicio</label>
              <input v-model="filters.FechaReservaInicio" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha reserva fin</label>
              <input v-model="filters.FechaReservaFin" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha inicio viaje</label>
              <input v-model="filters.FechaInicioViaje" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Fecha fin viaje</label>
              <input v-model="filters.FechaFinViaje" type="datetime-local"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Página</label>
              <input v-model="filters.Page" type="number" min="1"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 col-md-3">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Tamaño página</label>
              <input v-model="filters.PageSize" type="number" min="1"
                     class="form-control"
                     style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
            </div>

            <div class="col-12 d-flex gap-2 justify-content-end pt-1">
              <button type="button"
                      class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                      :disabled="loadingList"
                      @click="limpiarFiltros">
                Limpiar filtros
              </button>
              <button type="button"
                      class="btn fw-bold rounded-pill px-4 text-white"
                      style="background:#d60f2b;"
                      :disabled="loadingList"
                      @click="fetchReservas">
                <span v-if="loadingList" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                {{ loadingList ? 'Buscando...' : 'Buscar reservas' }}
              </button>
            </div>

          </div>
        </div>

        <!-- Tabla resultados -->
        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Reserva</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Cliente</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Pasajero</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Vuelo</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Asiento</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Total</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingList">
                <td colspan="8" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Buscando reservas...
                </td>
              </tr>
              <tr v-else-if="!reservas.length">
                <td colspan="8" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="#ddd"/>
                  </svg>
                  No hay reservas para mostrar.
                </td>
              </tr>
              <tr v-for="reserva in reservas"
                  :key="entityId(reserva, ['id_reserva','idReserva'])">
                <td class="ps-4">
                  <div class="fw-bold small" style="color:#d60f2b;">
                    {{ entityValue(reserva, ['codigo_reserva','codigoReserva']) || `#${entityId(reserva, ['id_reserva','idReserva'])}` }}
                  </div>
                  <div class="text-muted" style="font-size:0.72rem;">
                    {{ formatDateTime(entityValue(reserva, ['fecha_reserva','fechaReserva'])) }}
                  </div>
                </td>
                <td class="small">{{ getClienteNombreById(entityValue(reserva, ['id_cliente','idCliente'])) }}</td>
                <td class="small">{{ getPasajeroNombreById(entityValue(reserva, ['id_pasajero','idPasajero'])) }}</td>
                <td class="small text-muted">{{ getVueloNombreById(entityValue(reserva, ['id_vuelo','idVuelo'])) }}</td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    #{{ entityValue(reserva, ['id_asiento','idAsiento']) }}
                  </span>
                </td>
                <td class="fw-bold" style="color:#d60f2b;">
                  ${{ formatMoney(entityValue(reserva, ['total_reserva','totalReserva'])) }}
                </td>
                <td>
                  <select class="form-select form-select-sm fw-semibold"
                          style="border-radius:6px;font-size:0.78rem;width:auto;min-width:130px;"
                          :value="entityValue(reserva, ['estado_reserva','estadoReserva'])"
                          @change="cambiarEstado(reserva, $event.target.value)">
                    <option v-for="estado in estadosReserva" :key="estado.code" :value="estado.code">
                      {{ estado.code }} — {{ estado.label }}
                    </option>
                  </select>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold"
                          style="background:#f0f4ff;color:#3b5bdb;border-radius:6px;"
                          @click="verDetalle(reserva)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#3b5bdb"/>
                    </svg>
                    Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">
            Página {{ meta.page || filters.Page }} de {{ meta.total_pages || 1 }}
            <span v-if="meta.total"> — {{ meta.total }} reservas encontradas</span>
          </p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary fw-semibold"
                    :disabled="loadingList || (meta.page || filters.Page) <= 1"
                    @click="filters.Page = Number(filters.Page) - 1; fetchReservas()">
              Anterior
            </button>
            <button class="btn btn-sm btn-outline-secondary fw-semibold"
                    :disabled="loadingList || (meta.page || filters.Page) >= (meta.total_pages || 1)"
                    @click="filters.Page = Number(filters.Page) + 1; fetchReservas()">
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════ DETALLE RESERVA ═══════════════ -->
    <div v-if="detalleReserva" class="card border-0 shadow-sm">
      <div class="card-body p-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                 style="width:48px;height:48px;background:#f0f4ff;">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#3b5bdb"/>
              </svg>
            </div>
            <div>
              <h2 class="h5 fw-bold mb-0">Detalle de la reserva</h2>
              <p class="text-muted small mb-0 fw-semibold" style="color:#d60f2b!important;">
                {{ entityValue(detalleReserva, ['codigo_reserva','codigoReserva']) }}
              </p>
            </div>
          </div>
          <button class="btn btn-outline-secondary fw-bold rounded-pill px-4"
                  @click="detalleReserva = null">
            Cerrar
          </button>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table align-middle mb-0">
            <tbody>
              <tr v-for="(value, key) in detalleReserva" :key="key">
                <th class="ps-4 py-2 text-uppercase small fw-bold"
                    style="color:#888;letter-spacing:0.5px;font-size:0.72rem;width:200px;background:#fafafa;">
                  {{ key }}
                </th>
                <td class="py-2 small">{{ value ?? '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>

  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import {
  createReserva,
  listAeropuertos,
  listAsientos,
  listClientes,
  listPasajeros,
  listReservas,
  listVuelos,
  updateReservaEstado
} from '../../../services/adminService'

const clientes       = ref([])
const pasajeros      = ref([])
const vuelos         = ref([])
const aeropuertos    = ref([])
const asientos       = ref([])
const reservas       = ref([])
const detalleReserva = ref(null)
const meta           = ref({})

const loadingList    = ref(false)
const loadingSubmit  = ref(false)
const loadingAsientos = ref(false)
const feedbackError  = ref('')
const feedbackSuccess = ref('')

const estadosReserva = [
  { code: 'PEN', label: 'Pendiente'  },
  { code: 'CON', label: 'Confirmada' },
  { code: 'CAN', label: 'Cancelada'  },
  { code: 'EXP', label: 'Expirada'   },
  { code: 'FIN', label: 'Finalizada' },
  { code: 'EMI', label: 'Emitida'    }
]

const form = reactive({
  idCliente: '', idPasajero: '', idVuelo: '', idAsiento: '',
  fechaInicio: '', fechaFin: '',
  subtotalReserva: 0, valorIva: 0, totalReserva: 0,
  origenCanalReserva: 'WEB',
  contactoEmail: '', contactoTelefono: '', observaciones: ''
})

const filters = reactive({
  IdCliente: '', IdPasajero: '', IdVuelo: '', CodigoReserva: '',
  EstadoReserva: '', OrigenCanalReserva: '',
  TotalMin: '', TotalMax: '',
  FechaReservaInicio: '', FechaReservaFin: '',
  FechaInicioViaje: '', FechaFinViaje: '',
  Page: 1, PageSize: 20
})

const pasajerosFiltrados = computed(() => {
  if (!form.idCliente) return pasajeros.value
  const relacionados = pasajeros.value.filter((p) =>
    String(entityValue(p, ['id_cliente','idCliente']) ?? '') === String(form.idCliente)
  )
  return relacionados.length ? relacionados : pasajeros.value
})

const asientosDisponibles = computed(() =>
  asientos.value.filter((a) => {
    const d = entityValue(a, ['disponible'])
    return d === true || d === 'true' || d === 1
  })
)

function entityId(entity, keys)    { return entityValue(entity, keys) }
function entityValue(entity, keys) {
  if (!entity) return undefined
  for (const key of keys) {
    if (entity[key] !== undefined && entity[key] !== null) return entity[key]
  }
  return undefined
}

function setError(error, fallback = '') {
  feedbackSuccess.value = ''
  if (error?.response?.data?.errors) {
    feedbackError.value = Object.values(error.response.data.errors).flat().join(' | ')
  } else {
    feedbackError.value =
      error?.response?.data?.mensaje ||
      error?.response?.data?.message ||
      error?.response?.data?.detalle ||
      error?.response?.data?.title ||
      error?.message ||
      fallback ||
      'Ha ocurrido un error inesperado.'
  }
}

function setSuccess(message) {
  feedbackError.value   = ''
  feedbackSuccess.value = message
}

function formatDateTime(value) {
  return value ? String(value).replace('T', ' ').slice(0, 16) : '-'
}

function formatMoney(value) {
  return Number(value || 0).toFixed(2)
}

function toIsoStringOrNull(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function getClienteNombre(c) {
  const n = entityValue(c, ['nombres','nombre'])
  const a = entityValue(c, ['apellidos','apellido'])
  return [n, a].filter(Boolean).join(' ') || `Cliente #${entityId(c, ['id_cliente','idCliente'])}`
}
function getClienteNombreById(id) {
  const c = clientes.value.find((i) => String(entityId(i, ['id_cliente','idCliente'])) === String(id))
  return c ? getClienteNombre(c) : `#${id}`
}

function getPasajeroNombre(p) {
  const n = entityValue(p, ['nombres','nombre_pasajero','nombrePasajero'])
  const a = entityValue(p, ['apellidos','apellido_pasajero','apellidoPasajero'])
  return [n, a].filter(Boolean).join(' ') || `Pasajero #${entityId(p, ['id_pasajero','idPasajero'])}`
}
function getPasajeroNombreById(id) {
  const p = pasajeros.value.find((i) => String(entityId(i, ['id_pasajero','idPasajero'])) === String(id))
  return p ? getPasajeroNombre(p) : `#${id}`
}

function getAeropuertoCodigo(id) {
  const a = aeropuertos.value.find((i) => String(entityId(i, ['id_aeropuerto','idAeropuerto'])) === String(id))
  return entityValue(a, ['codigo_iata','codigoIata']) || `#${id}`
}

function getVueloEtiqueta(v) {
  const num    = entityValue(v, ['numero_vuelo','numeroVuelo'])
  const origen = getAeropuertoCodigo(entityValue(v, ['id_aeropuerto_origen','idAeropuertoOrigen']))
  const dest   = getAeropuertoCodigo(entityValue(v, ['id_aeropuerto_destino','idAeropuertoDestino']))
  return `${num} — ${origen} → ${dest}`
}
function getVueloNombreById(id) {
  const v = vuelos.value.find((i) => String(entityId(i, ['id_vuelo','idVuelo'])) === String(id))
  return v ? getVueloEtiqueta(v) : `#${id}`
}

function getAsientoEtiqueta(a) {
  const num    = entityValue(a, ['numero_asiento','numeroAsiento'])
  const clase  = entityValue(a, ['clase'])
  const pos    = entityValue(a, ['posicion'])
  const extra  = entityValue(a, ['precio_extra','precioExtra'])
  const partes = [`${num}`, clase]
  if (pos)              partes.push(pos)
  if (Number(extra||0) > 0) partes.push(`+$${formatMoney(extra)}`)
  return partes.join(' — ')
}

function calcularPrecios() {
  const v  = vuelos.value.find((i) => String(entityId(i, ['id_vuelo','idVuelo'])) === String(form.idVuelo))
  const a  = asientos.value.find((i) => String(entityId(i, ['id_asiento','idAsiento'])) === String(form.idAsiento))
  const base  = Number(entityValue(v, ['precio_base','precioBase']) || 0)
  const extra = Number(entityValue(a, ['precio_extra','precioExtra']) || 0)
  const sub   = base + extra
  const iva   = sub * 0.15
  form.subtotalReserva = Number(sub.toFixed(2))
  form.valorIva        = Number(iva.toFixed(2))
  form.totalReserva    = Number((sub + iva).toFixed(2))
}

function onClienteChange() {
  const c = clientes.value.find((i) => String(entityId(i, ['id_cliente','idCliente'])) === String(form.idCliente))
  if (c) {
    form.contactoEmail    = entityValue(c, ['correo','email']) || ''
    form.contactoTelefono = entityValue(c, ['telefono','telefono_principal']) || ''
  }
  if (!pasajerosFiltrados.value.some((p) => String(entityId(p, ['id_pasajero','idPasajero'])) === String(form.idPasajero))) {
    form.idPasajero = ''
  }
}

async function onVueloChange() {
  const v = vuelos.value.find((i) => String(entityId(i, ['id_vuelo','idVuelo'])) === String(form.idVuelo))
  if (v) {
    const salida  = entityValue(v, ['fecha_hora_salida','fechaHoraSalida'])
    const llegada = entityValue(v, ['fecha_hora_llegada','fechaHoraLlegada'])
    form.fechaInicio = salida  ? String(salida).slice(0, 16)  : ''
    form.fechaFin    = llegada ? String(llegada).slice(0, 16) : ''
  }
  form.idAsiento  = ''
  asientos.value  = []
  calcularPrecios()
  await fetchAsientos()
}

function buildReservaPayload() {
  return {
    idCliente: Number(form.idCliente),
    idPasajero: Number(form.idPasajero),
    idVuelo: Number(form.idVuelo),
    idAsiento: Number(form.idAsiento),
    fechaInicio: new Date(form.fechaInicio).toISOString(),
    fechaFin: new Date(form.fechaFin).toISOString(),
    subtotalReserva: Number(form.subtotalReserva),
    valorIva: Number(form.valorIva),
    totalReserva: Number(form.totalReserva),
    origenCanalReserva: form.origenCanalReserva || 'WEB',
    contactoEmail: form.contactoEmail    || null,
    contactoTelefono: form.contactoTelefono || null,
    observaciones: form.observaciones    || null
  }
}

function buildReservaFilters() {
  return {
    IdCliente:          filters.IdCliente    ? Number(filters.IdCliente)    : undefined,
    IdPasajero:         filters.IdPasajero   ? Number(filters.IdPasajero)   : undefined,
    IdVuelo:            filters.IdVuelo      ? Number(filters.IdVuelo)      : undefined,
    CodigoReserva:      filters.CodigoReserva      || undefined,
    EstadoReserva:      filters.EstadoReserva      || undefined,
    OrigenCanalReserva: filters.OrigenCanalReserva || undefined,
    TotalMin:           filters.TotalMin !== '' ? Number(filters.TotalMin) : undefined,
    TotalMax:           filters.TotalMax !== '' ? Number(filters.TotalMax) : undefined,
    FechaReservaInicio: toIsoStringOrNull(filters.FechaReservaInicio) || undefined,
    FechaReservaFin:    toIsoStringOrNull(filters.FechaReservaFin)    || undefined,
    FechaInicioViaje:   toIsoStringOrNull(filters.FechaInicioViaje)   || undefined,
    FechaFinViaje:      toIsoStringOrNull(filters.FechaFinViaje)      || undefined,
    Page:     Number(filters.Page || 1),
    PageSize: Number(filters.PageSize || 20)
  }
}

async function fetchCatalogs() {
  try {
    const [cr, pr, vr, ar] = await Promise.all([
      listClientes   ({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listPasajeros  ({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listVuelos     ({ Page: 1, PageSize: 500, page: 1, page_size: 500 }),
      listAeropuertos({ Page: 1, PageSize: 500, page: 1, page_size: 500 })
    ])
    clientes.value    = Array.isArray(cr.data) ? cr.data : []
    pasajeros.value   = Array.isArray(pr.data) ? pr.data : []
    vuelos.value      = Array.isArray(vr.data) ? vr.data : []
    aeropuertos.value = Array.isArray(ar.data) ? ar.data : []
    if (!pasajeros.value.length) {
      feedbackError.value = 'No se recibieron pasajeros desde el endpoint.'
    }
  } catch (error) { setError(error, 'No se pudieron cargar los catálogos.') }
}

async function fetchAsientos() {
  if (!form.idVuelo) { asientos.value = []; return }
  loadingAsientos.value = true
  try {
    const data = await listAsientos(form.idVuelo)
    asientos.value = Array.isArray(data) ? data : []
  } catch (error) { setError(error, 'No se pudieron cargar los asientos.') }
  finally { loadingAsientos.value = false }
}

async function fetchReservas() {
  loadingList.value = true
  try {
    const { data, meta: m } = await listReservas(buildReservaFilters())
    reservas.value = Array.isArray(data) ? data : []
    meta.value = m || {}
  } catch (error) { setError(error, 'No se pudieron cargar las reservas.') }
  finally { loadingList.value = false }
}

async function submitReserva() {
  if (!form.fechaInicio || !form.fechaFin) {
    feedbackError.value = 'Las fechas del viaje son obligatorias.'
    return
  }
  loadingSubmit.value = true
  try {
    await createReserva(buildReservaPayload())
    setSuccess('Reserva creada correctamente.')
    resetForm()
    await fetchReservas()
  } catch (error) { setError(error, 'No se pudo crear la reserva.') }
  finally { loadingSubmit.value = false }
}

async function cambiarEstado(reserva, nuevoEstado) {
  const id     = entityId(reserva, ['id_reserva','idReserva'])
  const actual = entityValue(reserva, ['estado_reserva','estadoReserva'])
  if (nuevoEstado === actual) return
  try {
    await updateReservaEstado(id, {
      estadoReserva: nuevoEstado,
      motivoCancelacion: nuevoEstado === 'CAN' ? 'Cambio manual desde administración' : null
    })
    setSuccess(`Estado actualizado a ${nuevoEstado}.`)
    await fetchReservas()
  } catch (error) { setError(error, 'No se pudo actualizar el estado.') }
}

function verDetalle(reserva) { detalleReserva.value = reserva }

function resetForm() {
  form.idCliente = ''; form.idPasajero = ''; form.idVuelo = ''; form.idAsiento = ''
  form.fechaInicio = ''; form.fechaFin = ''
  form.subtotalReserva = 0; form.valorIva = 0; form.totalReserva = 0
  form.origenCanalReserva = 'WEB'
  form.contactoEmail = ''; form.contactoTelefono = ''; form.observaciones = ''
  asientos.value = []
}

async function limpiarFiltros() {
  filters.IdCliente = ''; filters.IdPasajero = ''; filters.IdVuelo = ''
  filters.CodigoReserva = ''; filters.EstadoReserva = ''; filters.OrigenCanalReserva = ''
  filters.TotalMin = ''; filters.TotalMax = ''
  filters.FechaReservaInicio = ''; filters.FechaReservaFin = ''
  filters.FechaInicioViaje = ''; filters.FechaFinViaje = ''
  filters.Page = 1; filters.PageSize = 20
  await fetchReservas()
}

onMounted(async () => {
  await fetchCatalogs()
  await fetchReservas()
})
</script>