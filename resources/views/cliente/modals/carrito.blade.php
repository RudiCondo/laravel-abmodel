{{-- resources/views/cliente/modals/carrito.blade.php --}}
<div class="modal-carrito" id="modal-carrito">
  <div class="modal-content">
    <div class="modal-header">
      <h3>🛒 Mi Carrito</h3>
      <button class="modal-close" onclick="cerrarModalCarrito()">
        <i class="fas fa-times"></i>
      </button>
    </div>
    
    <div class="modal-body">
      <!-- El contenido del carrito se carga dinámicamente -->
      <div class="loading">Cargando carrito...</div>
    </div>
    
    <div class="modal-footer">
      <div class="carrito-total">
        <span>Total:</span>
        <span id="carrito-total-modal">Bs. 0.00</span>
      </div>
      <button class="btn-comprar" onclick="crearPedido()">
        <i class="fas fa-credit-card"></i>
        Realizar Pedido
      </button>
    </div>
  </div>
</div>