const CLAVE_CARRITO = "carrito";
const CLAVE_CLIENTE = "cliente";
const CLAVE_ULTIMO_PEDIDO = "ultimoPedido";

function leerStorage(clave, valorPorDefecto) {
  return JSON.parse(localStorage.getItem(clave)) || valorPorDefecto;
}

function guardarStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function cargarCarrito() {
  return leerStorage(CLAVE_CARRITO, []);
}

function guardarCarrito(carrito) {
  guardarStorage(CLAVE_CARRITO, carrito);
}

function borrarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
}

function cargarCliente() {
  return leerStorage(CLAVE_CLIENTE, {});
}

function guardarCliente(cliente) {
  guardarStorage(CLAVE_CLIENTE, cliente);
}

function cargarUltimoPedido() {
  return leerStorage(CLAVE_ULTIMO_PEDIDO, null);
}

function guardarUltimoPedido(pedido) {
  guardarStorage(CLAVE_ULTIMO_PEDIDO, pedido);
}

function vaciarStorage() {
  localStorage.clear();
}
