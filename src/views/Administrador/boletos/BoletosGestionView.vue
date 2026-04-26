<template>
  <section class="container-fluid p-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-start gap-3 p-4 mb-4 rounded-4 text-white"
         style="background: linear-gradient(135deg, #d60f2b, #a00824, #6b0016);">
      <div>
        <p class="text-uppercase fw-semibold small mb-1" style="opacity:0.65;letter-spacing:2px;">Administrador</p>
        <h1 class="fw-bold mb-2">Gestión de boletos</h1>
        <p class="mb-0" style="opacity:0.75;">Emite boletos a partir de reservas y facturas, enlazando vuelo y asiento.</p>
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

    <!-- ═══════════════ FORM EMITIR BOLETO ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-2-1.46A4.01 4.01 0 0 0 18 12c0 1.48.81 2.77 2 3.46V18H4v-2.54A4.01 4.01 0 0 0 6 12c0-1.48-.81-2.77-2-3.46V6h16v2.54z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Emitir boleto</h2>
            <p class="text-muted small mb-0">El precio se calcula automáticamente. El cargo de equipaje inicia en $0.</p>
          </div>
        </div>

        <form @submit.prevent="submitBoleto">
          <div class="row g-3">

            <!-- Reserva -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Reserva *</label>
              <select v-model="form.idReserva" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onReservaChange">
                <option value="">Selecciona una reserva</option>
                <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
                  {{ r.codigoReserva || 'Reserva #' + r.idReserva }}
                </option>
              </select>
            </div>

            <!-- Factura -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Factura *
                <span v-if="!form.idReserva" class="text-muted fw-normal" style="font-size:0.68rem;"> — selecciona primero una reserva</span>
              </label>
              <select v-model="form.idFactura" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="">Selecciona una factura</option>
                <option v-for="f in facturasFiltradas" :key="f.idFactura" :value="f.idFactura">
                  {{ f.numeroFactura || 'Factura #' + f.idFactura }}
                </option>
              </select>
            </div>

            <!-- Vuelo -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Vuelo *</label>
              <select v-model="form.idVuelo" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onVueloChange">
                <option value="">Selecciona un vuelo</option>
                <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
                  {{ v.numeroVuelo }}
                </option>
              </select>
            </div>

            <!-- Asiento -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">
                Asiento
                <span class="text-muted fw-normal" style="font-size:0.68rem;"> — opcional</span>
              </label>
              <select v-model="form.idAsiento"
                      :disabled="!form.idVuelo || cargandoAsientos"
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;"
                      @change="onAsientoChange">
                <option value="">{{ cargandoAsientos ? 'Cargando...' : 'Sin asiento' }}</option>
                <option v-for="a in asientosDisponibles" :key="a.idAsiento" :value="a.idAsiento">
                  {{ a.numeroAsiento }} — {{ a.clase }}{{ a.posicion ? ' · ' + a.posicion : '' }}{{ a.precioExtra > 0 ? ' (+$' + a.precioExtra + ')' : '' }}
                </option>
              </select>
              <div class="mt-1" style="font-size:0.72rem;">
                <span v-if="!form.idVuelo" class="text-muted">Selecciona un vuelo primero</span>
                <span v-else-if="asientosDisponibles.length === 0 && !cargandoAsientos" style="color:#dc2626;">Sin asientos disponibles</span>
                <span v-else style="color:#16a34a;">{{ asientosDisponibles.length }} disponible(s)</span>
              </div>
            </div>

            <!-- Clase -->
            <div class="col-12 col-md-4">
              <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Clase *</label>
              <select v-model="form.clase" required
                      class="form-select"
                      style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                <option value="ECONOMICA">Económica</option>
                <option value="EJECUTIVA">Ejecutiva</option>
                <option value="PRIMERA">Primera</option>
              </select>
            </div>

            <!-- Resumen de precios -->
            <div class="col-12">
              <div class="row g-0 rounded-3 overflow-hidden" style="border:1px solid #f0f0f0;">
                <div class="col-6 col-md text-center p-3" style="background:#fafafa;border-right:1px solid #f0f0f0;">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.65rem;letter-spacing:0.5px;">Vuelo base</div>
                  <div class="fw-bold mt-1">${{ form.precioVueloBase.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md text-center p-3" style="background:#fafafa;border-right:1px solid #f0f0f0;">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.65rem;letter-spacing:0.5px;">Extra asiento</div>
                  <div class="fw-bold mt-1">${{ form.precioAsientoExtra.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md text-center p-3" style="background:#f0f9ff;border-right:1px solid #f0f0f0;">
                  <div class="fw-bold small text-uppercase" style="font-size:0.65rem;letter-spacing:0.5px;color:#3b5bdb;">Impuestos 15%</div>
                  <div class="fw-bold mt-1" style="color:#3b5bdb;">${{ form.impuestosBoleto.toFixed(2) }}</div>
                </div>
                <div class="col-6 col-md text-center p-3" style="background:#fafafa;border-right:1px solid #f0f0f0;">
                  <div class="text-muted small text-uppercase fw-bold" style="font-size:0.65rem;letter-spacing:0.5px;">Cargo equipaje</div>
                  <div class="fw-bold mt-1">${{ form.cargoEquipaje.toFixed(2) }}</div>
                </div>
                <div class="col-12 col-md text-center p-3" style="background:#f0fdf4;">
                  <div class="fw-bold small text-uppercase" style="font-size:0.65rem;letter-spacing:0.5px;color:#065f46;">Total final</div>
                  <div class="fw-bold mt-1" style="font-size:1.15rem;color:#d60f2b;">${{ form.precioFinal.toFixed(2) }}</div>
                </div>
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
                      class="btn fw-bold rounded-pill px-5 text-white"
                      style="background:#d60f2b;min-height:44px;"
                      :disabled="loadingSubmit">
                <span v-if="loadingSubmit" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" class="me-2">
                  <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="white"/>
                </svg>
                {{ loadingSubmit ? 'Guardando...' : 'Emitir boleto' }}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>

    <!-- ═══════════════ FILTROS ═══════════════ -->
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
            <h2 class="h5 fw-bold mb-0">Buscar boletos</h2>
            <p class="text-muted small mb-0">Filtra por código, reserva, vuelo, clase o estado.</p>
          </div>
        </div>

        <div class="row g-3 p-3 rounded-3" style="background:#fafafa;border:1px solid #f0f0f0;">

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Código boleto</label>
            <input v-model="filtros.CodigoBoleto" placeholder="Ej. BOL-0001"
                   class="form-control"
                   style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;" />
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Reserva</label>
            <select v-model="filtros.IdReserva"
                    class="form-select"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
              <option value="">Todas las reservas</option>
              <option v-for="r in reservas" :key="r.idReserva" :value="r.idReserva">
                {{ r.codigoReserva || 'Reserva #' + r.idReserva }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Vuelo</label>
            <select v-model="filtros.IdVuelo"
                    class="form-select"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
              <option value="">Todos los vuelos</option>
              <option v-for="v in vuelos" :key="v.idVuelo" :value="v.idVuelo">
                {{ v.numeroVuelo }}
              </option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Clase</label>
            <select v-model="filtros.Clase"
                    class="form-select"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
              <option value="">Todas las clases</option>
              <option value="ECONOMICA">Económica</option>
              <option value="EJECUTIVA">Ejecutiva</option>
              <option value="PRIMERA">Primera</option>
            </select>
          </div>

          <div class="col-12 col-md-4">
            <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Estado</label>
            <select v-model="filtros.EstadoBoleto"
                    class="form-select"
                    style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:38px;">
              <option value="">Todos los estados</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="USADO">USADO</option>
              <option value="CANCELADO">CANCELADO</option>
            </select>
          </div>

          <div class="col-12 col-md-4 d-flex align-items-end gap-2">
            <button class="btn btn-outline-secondary fw-bold rounded-pill flex-grow-1"
                    :disabled="loadingList"
                    @click="limpiarFiltros">
              Limpiar
            </button>
            <button class="btn fw-bold rounded-pill flex-grow-1 text-white"
                    style="background:#d60f2b;"
                    :disabled="loadingList"
                    @click="fetchBoletos">
              <span v-if="loadingList" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
              {{ loadingList ? 'Buscando...' : 'Buscar' }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════ TABLA BOLETOS ═══════════════ -->
    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body p-4">

        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:48px;height:48px;background:#fff0f2;">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="#d60f2b"/>
            </svg>
          </div>
          <div>
            <h2 class="h5 fw-bold mb-0">Listado de boletos</h2>
            <p class="text-muted small mb-0">{{ boletos.length }} {{ boletos.length === 1 ? 'boleto en esta página' : 'boletos en esta página' }}</p>
          </div>
        </div>

        <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
          <table class="table table-hover align-middle mb-0">
            <thead style="background:#fafafa;">
              <tr>
                <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Boleto</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Reserva</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Vuelo</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Asiento</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Clase</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Impuestos</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Equipaje</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Total</th>
                <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                <th class="text-uppercase small fw-bold pe-4 py-3 text-end" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loadingList">
                <td colspan="10" class="text-center text-muted py-5">
                  <span class="spinner-border spinner-border-sm me-2" style="color:#d60f2b;"></span>
                  Cargando boletos...
                </td>
              </tr>
              <tr v-else-if="!boletos.length">
                <td colspan="10" class="text-center text-muted py-5">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" class="d-block mx-auto mb-2">
                    <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-2 .89-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="#ddd"/>
                  </svg>
                  Sin boletos registrados.
                </td>
              </tr>
              <tr v-for="b in boletos" :key="b.idBoleto">
                <td class="ps-4">
                  <div class="fw-bold small" style="color:#d60f2b;">
                    {{ b.codigoBoleto || '#' + b.idBoleto }}
                  </div>
                  <div class="text-muted" style="font-size:0.72rem;">{{ formatDate(b.fechaEmision) }}</div>
                </td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        style="background:#f0f4ff;color:#3b5bdb;font-size:0.78rem;">
                    {{ getReservaNombre(b.idReserva) }}
                  </span>
                </td>
                <td class="fw-semibold small">{{ getVueloNombre(b.idVuelo) }}</td>
                <td class="text-muted small">{{ b.idAsiento ? '#' + b.idAsiento : '—' }}</td>
                <td>
                  <span class="badge fw-semibold px-2 py-1 rounded"
                        :style="b.clase === 'PRIMERA'   ? 'background:#fef9c3;color:#854d0e;' :
                                b.clase === 'EJECUTIVA' ? 'background:#f0f4ff;color:#3b5bdb;' :
                                'background:#f3f4f6;color:#6b7280;'">
                    {{ b.clase }}
                  </span>
                </td>
                <td class="text-muted small">${{ Number(b.impuestosBoleto || 0).toFixed(2) }}</td>
                <td class="text-muted small">${{ Number(b.cargoEquipaje   || 0).toFixed(2) }}</td>
                <td class="fw-bold" style="color:#d60f2b;">${{ Number(b.precioFinal || 0).toFixed(2) }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2 fw-semibold"
                        :style="b.estadoBoleto === 'ACTIVO'    ? 'background:#d1fae5;color:#065f46;' :
                                b.estadoBoleto === 'USADO'     ? 'background:#dbeafe;color:#1e40af;' :
                                'background:#fee2e2;color:#991b1b;'">
                    {{ b.estadoBoleto }}
                  </span>
                </td>
                <td class="pe-4 text-end">
                  <button class="btn btn-sm fw-bold me-1"
                          style="background:#f0f4ff;color:#3b5bdb;border-radius:6px;"
                          @click="verDetalle(b)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#3b5bdb"/>
                    </svg>
                    Detalle
                  </button>
                  <button class="btn btn-sm fw-bold"
                          style="background:#fff0f2;color:#d60f2b;border-radius:6px;"
                          @click="verEquipaje(b)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="me-1">
                      <path d="M20 6h-2.18c.07-.31.18-.62.18-1 0-1.66-1.34-3-3-3h-6C7.34 2 6 3.34 6 5c0 .38.11.69.18 1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 5h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 14H4V8h16v11z" fill="#d60f2b"/>
                    </svg>
                    Equipaje
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
          <p class="text-muted small mb-0">Página {{ page }} de {{ totalPaginas }}</p>
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary fw-semibold"
                    :disabled="page <= 1 || loadingList"
                    @click="cambiarPagina(page - 1)">
              Anterior
            </button>
            <button class="btn btn-sm btn-outline-secondary fw-semibold"
                    :disabled="page >= totalPaginas || loadingList"
                    @click="cambiarPagina(page + 1)">
              Siguiente
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ═══════════════ MODAL DETALLE ═══════════════ -->
    <div v-if="detalleBoleto"
         class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
         style="background:rgba(0,0,0,.45);z-index:1050;"
         @click.self="detalleBoleto = null">
      <div class="card border-0 shadow" style="width:95%;max-width:640px;max-height:85vh;overflow-y:auto;">
        <div class="card-body p-4">

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                   style="width:42px;height:42px;background:#f0f4ff;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" fill="#3b5bdb"/>
                </svg>
              </div>
              <div>
                <h3 class="h6 fw-bold mb-0">Detalle del boleto</h3>
                <p class="small mb-0 fw-semibold" style="color:#d60f2b;">
                  {{ detalleBoleto.codigoBoleto || 'Boleto #' + detalleBoleto.idBoleto }}
                </p>
              </div>
            </div>
            <button class="btn btn-outline-secondary fw-bold rounded-pill px-3"
                    @click="detalleBoleto = null">Cerrar</button>
          </div>

          <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
            <table class="table align-middle mb-0">
              <tbody>
                <tr v-for="(val, key) in detalleBoleto" :key="key">
                  <th class="ps-4 py-2 text-uppercase small fw-bold"
                      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;width:180px;background:#fafafa;">
                    {{ key }}
                  </th>
                  <td class="py-2 small">{{ val ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>

    <!-- ═══════════════ MODAL EQUIPAJE ═══════════════ -->
    <div v-if="boletoEquipaje"
         class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
         style="background:rgba(0,0,0,.45);z-index:1050;"
         @click.self="cerrarEquipaje">
      <div class="card border-0 shadow" style="width:95%;max-width:780px;max-height:90vh;overflow-y:auto;">
        <div class="card-body p-4">

          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                   style="width:42px;height:42px;background:#fff0f2;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6h-2.18c.07-.31.18-.62.18-1 0-1.66-1.34-3-3-3h-6C7.34 2 6 3.34 6 5c0 .38.11.69.18 1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 5h6c.55 0 1 .45 1 1s-.45 1-1 1H9c-.55 0-1-.45-1-1s.45-1 1-1zm11 14H4V8h16v11z" fill="#d60f2b"/>
                </svg>
              </div>
              <div>
                <h3 class="h6 fw-bold mb-0">Equipaje</h3>
                <p class="small mb-0 fw-semibold" style="color:#d60f2b;">
                  {{ boletoEquipaje.codigoBoleto || 'Boleto #' + boletoEquipaje.idBoleto }}
                </p>
              </div>
            </div>
            <button class="btn btn-outline-secondary fw-bold rounded-pill px-3"
                    @click="cerrarEquipaje">Cerrar</button>
          </div>

          <!-- Form agregar equipaje -->
          <div class="p-3 rounded-3 mb-4" style="background:#fafafa;border:1px solid #f0f0f0;">
            <p class="text-uppercase fw-bold small mb-3" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Agregar pieza de equipaje</p>
            <div class="row g-3 align-items-end">

              <div class="col-12 col-md-3">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Tipo *</label>
                <select v-model="equipajeForm.tipo"
                        class="form-select"
                        style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;">
                  <option value="MANO">Mano</option>
                  <option value="BODEGA">Bodega</option>
                  <option value="ESPECIAL">Especial</option>
                </select>
                <div v-if="equipajeForm.tipo === 'MANO'"
                     class="small mt-1 fw-semibold" style="color:#d97706;">
                  Máx. 10 kg
                </div>
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Peso (kg) *</label>
                <input v-model.number="equipajeForm.pesoKg" type="number" min="0.01" step="0.01"
                       class="form-control"
                       :style="(equipajeForm.tipo === 'MANO' && equipajeForm.pesoKg > 10)
                         ? 'border:1.5px solid #f59e0b;border-radius:8px;min-height:42px;'
                         : 'border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;'" />
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Precio extra ($)</label>
                <input v-model.number="equipajeForm.precioExtra" type="number" min="0" step="0.01"
                       class="form-control"
                       style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Dimensiones (cm)</label>
                <input v-model="equipajeForm.dimensionesCm" placeholder="55x40x20"
                       class="form-control"
                       style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              </div>

              <div class="col-12 col-md-2">
                <label class="form-label text-uppercase fw-bold small" style="font-size:0.72rem;letter-spacing:0.5px;color:#555;">Descripción</label>
                <input v-model="equipajeForm.descripcionEquipaje" placeholder="Maleta gris..."
                       class="form-control"
                       style="border:1.5px solid #e0e0e0;border-radius:8px;min-height:42px;" />
              </div>

              <div class="col-12 col-md-1 d-flex align-items-end">
                <button class="btn fw-bold w-100 text-white"
                        style="background:#d60f2b;border-radius:8px;min-height:42px;"
                        :disabled="loadingEquipaje"
                        @click="submitEquipaje">
                  <span v-if="loadingEquipaje" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white"/>
                  </svg>
                </button>
              </div>

            </div>
          </div>

          <!-- Tabla equipaje -->
          <div class="table-responsive rounded-3" style="border:1px solid #f0f0f0;">
            <table class="table table-hover align-middle mb-0">
              <thead style="background:#fafafa;">
                <tr>
                  <th class="text-uppercase small fw-bold ps-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Etiqueta</th>
                  <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Tipo</th>
                  <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Peso</th>
                  <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Dimensiones</th>
                  <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Precio extra</th>
                  <th class="text-uppercase small fw-bold py-3"      style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Estado</th>
                  <th class="text-uppercase small fw-bold pe-4 py-3" style="color:#888;letter-spacing:0.5px;font-size:0.72rem;">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="!equipajes.length">
                  <td colspan="7" class="text-center text-muted py-4">Sin equipaje registrado.</td>
                </tr>
                <tr v-for="e in equipajes" :key="e.idEquipaje">
                  <td class="ps-4">
                    <span class="badge fw-bold px-2 py-1 rounded"
                          style="background:#fff0f2;color:#d60f2b;font-size:0.8rem;">
                      {{ e.numeroEtiqueta || 'EQ-' + e.idEquipaje }}
                    </span>
                  </td>
                  <td class="small fw-semibold">{{ e.tipo }}</td>
                  <td class="text-muted small">{{ Number(e.pesoKg).toFixed(2) }} kg</td>
                  <td class="text-muted small">{{ e.dimensionesCm || '—' }}</td>
                  <td class="text-muted small">${{ Number(e.precioExtra || 0).toFixed(2) }}</td>
                  <td>
                    <select class="form-select form-select-sm fw-semibold"
                            style="border-radius:6px;font-size:0.78rem;width:auto;"
                            :value="e.estadoEquipaje"
                            @change="cambiarEstadoEquipaje(e, $event.target.value)">
                      <option value="REGISTRADO">REGISTRADO</option>
                      <option value="EMBARCADO">EMBARCADO</option>
                      <option value="EN_TRANSITO">EN_TRANSITO</option>
                      <option value="ENTREGADO">ENTREGADO</option>
                      <option value="PERDIDO">PERDIDO</option>
                      <option value="DAÑADO">DAÑADO</option>
                      <option value="CANCELADO">CANCELADO</option>
                    </select>
                  </td>
                  <td class="pe-4 text-muted small">{{ e.descripcionEquipaje || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/api/axios'

const reservas         = ref([])
const facturas         = ref([])
const vuelos           = ref([])
const asientosVuelo    = ref([])
const boletos          = ref([])
const equipajes        = ref([])

const detalleBoleto    = ref(null)
const boletoEquipaje   = ref(null)
const cargandoAsientos = ref(false)
const loadingList      = ref(false)
const loadingSubmit    = ref(false)
const loadingEquipaje  = ref(false)

const errorMsg   = ref('')
const successMsg = ref('')

const page         = ref(1)
const pageSize     = 10
const totalPaginas = ref(1)

const form = reactive({
  idReserva: '', idVuelo: '', idAsiento: '', idFactura: '',
  clase: 'ECONOMICA',
  precioVueloBase: 0, precioAsientoExtra: 0,
  impuestosBoleto: 0, cargoEquipaje: 0, precioFinal: 0
})

const equipajeForm = reactive({
  tipo: 'MANO', pesoKg: 0, precioExtra: 0,
  dimensionesCm: '', descripcionEquipaje: ''
})

const filtros = reactive({
  CodigoBoleto: '', IdReserva: '', IdVuelo: '', Clase: '', EstadoBoleto: ''
})

const facturasFiltradas = computed(() => {
  if (!form.idReserva) return facturas.value
  return facturas.value.filter(f => String(f.idReserva) === String(form.idReserva))
})

const asientosDisponibles = computed(() =>
  asientosVuelo.value.filter(a => a.disponible === true || a.disponible === 'true')
)

function setError(e, fallback = '') {
  successMsg.value = ''
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
  console.error('API error:', e?.response?.data ?? e)
}

function setSuccess(msg) {
  errorMsg.value   = ''
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 3000)
}

function formatDate(d) { return d ? String(d).replace('T', ' ').slice(0, 16) : '—' }
function getReservaNombre(id) {
  const r = reservas.value.find(r => r.idReserva === id)
  return r ? (r.codigoReserva || `Reserva #${id}`) : `#${id}`
}
function getVueloNombre(id) {
  const v = vuelos.value.find(v => v.idVuelo === id)
  return v ? v.numeroVuelo : `#${id}`
}

function recalcular() {
  const base           = (form.precioVueloBase || 0) + (form.precioAsientoExtra || 0)
  form.impuestosBoleto = +(base * 0.15).toFixed(2)
  form.cargoEquipaje   = 0
  form.precioFinal     = +(base + form.impuestosBoleto).toFixed(2)
}

function onReservaChange() {
  const r = reservas.value.find(r => r.idReserva == form.idReserva)
  if (r) {
    form.idVuelo            = r.idVuelo   ?? ''
    form.idAsiento          = r.idAsiento ?? ''
    form.precioVueloBase    = r.subtotalReserva ?? r.precioBase ?? 0
    form.precioAsientoExtra = 0
    recalcular()
    if (form.idVuelo) fetchAsientosVuelo()
  }
}

async function onVueloChange() {
  form.idAsiento = ''; form.precioAsientoExtra = 0; asientosVuelo.value = []
  const v = vuelos.value.find(v => v.idVuelo == form.idVuelo)
  if (v) { form.precioVueloBase = v.precioBase ?? 0; recalcular() }
  await fetchAsientosVuelo()
}

function onAsientoChange() {
  const a = asientosVuelo.value.find(a => a.idAsiento == form.idAsiento)
  if (a) { form.precioAsientoExtra = a.precioExtra ?? 0; form.clase = a.clase ?? form.clase }
  else   { form.precioAsientoExtra = 0 }
  recalcular()
}

async function fetchAll() {
  try {
    const [rr, rf, rv] = await Promise.all([
      api.get('/reservas', { params: { page: 1, page_size: 500 } }),
      api.get('/facturas', { params: { page: 1, page_size: 500 } }),
      api.get('/vuelos',   { params: { page: 1, page_size: 500 } })
    ])
    reservas.value = rr.data.data ?? rr.data ?? []
    facturas.value = rf.data.data ?? rf.data ?? []
    vuelos.value   = rv.data.data ?? rv.data ?? []
    fetchBoletos()
  } catch (e) { setError(e) }
}

async function fetchAsientosVuelo() {
  if (!form.idVuelo) return
  cargandoAsientos.value = true; asientosVuelo.value = []
  try {
    const res = await api.get(`/vuelos/${form.idVuelo}/asientos`)
    asientosVuelo.value = res.data.data ?? res.data ?? []
  } catch (e) { setError(e) }
  finally { cargandoAsientos.value = false }
}

async function fetchBoletos() {
  loadingList.value = true
  try {
    const params = { Page: page.value, PageSize: pageSize }
    if (filtros.CodigoBoleto) params.CodigoBoleto = filtros.CodigoBoleto
    if (filtros.IdReserva)    params.IdReserva    = Number(filtros.IdReserva)
    if (filtros.IdVuelo)      params.IdVuelo      = Number(filtros.IdVuelo)
    if (filtros.Clase)        params.Clase        = filtros.Clase
    if (filtros.EstadoBoleto) params.EstadoBoleto = filtros.EstadoBoleto
    const res = await api.get('/boletos', { params })
    boletos.value      = res.data.data       ?? res.data ?? []
    totalPaginas.value = res.data.totalPages ?? res.data.meta?.totalPages ?? 1
  } catch (e) { setError(e) }
  finally { loadingList.value = false }
}

async function submitBoleto() {
  errorMsg.value = ''
  if (!form.idReserva || !form.idVuelo || !form.idFactura) {
    errorMsg.value = 'Reserva, vuelo y factura son obligatorios'; return
  }
  loadingSubmit.value = true
  try {
    const payload = {
      idReserva: Number(form.idReserva), idVuelo: Number(form.idVuelo),
      idAsiento: form.idAsiento ? Number(form.idAsiento) : null,
      idFactura: Number(form.idFactura), clase: form.clase,
      precioVueloBase: Number(form.precioVueloBase),
      precioAsientoExtra: Number(form.precioAsientoExtra),
      impuestosBoleto: Number(form.impuestosBoleto),
      cargoEquipaje: 0, precioFinal: Number(form.precioFinal)
    }
    console.log('POST /boletos:', payload)
    await api.post('/boletos', payload)
    setSuccess('Boleto emitido correctamente')
    resetForm(); fetchBoletos()
  } catch (e) { setError(e) }
  finally { loadingSubmit.value = false }
}

async function verDetalle(b) {
  try {
    const res = await api.get(`/boletos/${b.idBoleto}`)
    detalleBoleto.value = res.data.data ?? res.data
  } catch (e) { setError(e) }
}

async function verEquipaje(b) {
  boletoEquipaje.value = b; resetEquipajeForm()
  await fetchEquipaje(b.idBoleto)
}

async function fetchEquipaje(idBoleto) {
  try {
    const res = await api.get(`/boletos/${idBoleto}/equipaje`)
    equipajes.value = res.data.data ?? res.data ?? []
  } catch (e) { equipajes.value = []; setError(e) }
}

async function submitEquipaje() {
  if (!equipajeForm.pesoKg || equipajeForm.pesoKg <= 0) {
    errorMsg.value = 'El peso es obligatorio'; return
  }
  loadingEquipaje.value = true
  try {
    await api.post(`/boletos/${boletoEquipaje.value.idBoleto}/equipaje`, {
      idBoleto:            boletoEquipaje.value.idBoleto,
      tipo:                equipajeForm.tipo,
      pesoKg:              Number(equipajeForm.pesoKg),
      descripcionEquipaje: equipajeForm.descripcionEquipaje || null,
      precioExtra:         Number(equipajeForm.precioExtra  || 0),
      dimensionesCm:       equipajeForm.dimensionesCm       || null
    })
    setSuccess('Equipaje agregado correctamente')
    resetEquipajeForm()
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
    fetchBoletos()
  } catch (e) { setError(e) }
  finally { loadingEquipaje.value = false }
}

async function cambiarEstadoEquipaje(e, nuevoEstado) {
  if (nuevoEstado === e.estadoEquipaje) return
  try {
    await api.patch(
      `/boletos/${boletoEquipaje.value.idBoleto}/equipaje/${e.idEquipaje}/estado`,
      { estadoEquipaje: nuevoEstado }
    )
    setSuccess(`Estado actualizado a ${nuevoEstado}`)
    await fetchEquipaje(boletoEquipaje.value.idBoleto)
  } catch (err) { setError(err) }
}

function cerrarEquipaje() { boletoEquipaje.value = null; equipajes.value = []; resetEquipajeForm() }
function cambiarPagina(n) { page.value = n; fetchBoletos() }
function limpiarFiltros() { Object.keys(filtros).forEach(k => { filtros[k] = '' }); page.value = 1; fetchBoletos() }

function resetForm() {
  form.idReserva = ''; form.idVuelo = ''; form.idAsiento = ''; form.idFactura = ''
  form.clase = 'ECONOMICA'; form.precioVueloBase = 0; form.precioAsientoExtra = 0
  form.impuestosBoleto = 0; form.cargoEquipaje = 0; form.precioFinal = 0
  asientosVuelo.value = []
}

function resetEquipajeForm() {
  equipajeForm.tipo = 'MANO'; equipajeForm.pesoKg = 0; equipajeForm.precioExtra = 0
  equipajeForm.dimensionesCm = ''; equipajeForm.descripcionEquipaje = ''
}

onMounted(fetchAll)
</script>