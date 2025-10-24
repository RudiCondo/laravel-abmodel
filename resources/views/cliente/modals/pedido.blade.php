{{-- resources/views/cliente/modals/pedido.blade.php --}}
<div class="modal-pedido" id="modal-pedido">
  <div class="modal-content">
    <div class="modal-header">
      <h3>📦 Detalle del Pedido</h3>
      <button class="modal-close" onclick="cerrarModalPedido()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="modal-body">
      <div class="pedido-info">
        <div class="info-item">
          <span class="info-label">Número de Pedido:</span>
          <span class="info-value" id="pedido-numero">-</span>
        </div>
        <div class="info-item">
          <span class="info-label">Estado:</span>
          <span class="info-value" id="pedido-estado">-</span>
        </div>
        <div class="info-item">
          <span class="info-label">Fecha:</span>
          <span class="info-value" id="pedido-fecha">-</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total:</span>
          <span class="info-value" id="pedido-total">-</span>
        </div>
      </div>
      
      <div class="productos-pedido" id="productos-pedido">
        <!-- Productos del pedido se cargan aquí -->
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn-secundario" onclick="cerrarModalPedido()">
        Cerrar
      </button>
      <button class="btn-cancelar" id="btn-cancelar-pedido" style="display: none;">
        Cancelar Pedido
      </button>
    </div>
  </div>
</div>