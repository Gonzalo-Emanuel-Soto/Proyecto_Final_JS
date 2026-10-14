const COSTO_ENVIO = 2500;
const ENVIO_GRATIS_DESDE = 30000;
const LIMITE_POR_PRODUCTO = 10;

let productos = [];
let carrito = cargarCarrito();

const listaProductos = document.getElementById("listaProductos");
const estadoCarga = document.getElementById("estadoCarga");
const estadoError = document.getElementById("estadoError");
const mensajeError = document.getElementById("mensajeError");
const botonReintentar = document.getElementById("botonReintentar");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroOrden = document.getElementById("filtroOrden");
const cantidadResultados = document.getElementById("cantidadResultados");
const umbralEnvioGratis = document.getElementById("umbralEnvioGratis");

const botonCarrito = document.getElementById("botonCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const panelCarrito = document.getElementById("panelCarrito");
const fondo = document.getElementById("fondo");
const botonCerrarCarrito = document.getElementById("botonCerrarCarrito");
const listaCarrito = document.getElementById("listaCarrito");
const resumenCarrito = document.getElementById("resumenCarrito");
const botonVaciarCarrito = document.getElementById("botonVaciarCarrito");
const botonFinalizarCompra = document.getElementById("botonFinalizarCompra");

const modalPedido = document.getElementById("modalPedido");
const botonCerrarPedido = document.getElementById("botonCerrarPedido");
const formularioPedido = document.getElementById("formularioPedido");
const campoNombre = document.getElementById("campoNombre");
const campoEmail = document.getElementById("campoEmail");
const campoTelefono = document.getElementById("campoTelefono");
const campoDireccion = document.getElementById("campoDireccion");
const campoPago = document.getElementById("campoPago");
const resumenPedido = document.getElementById("resumenPedido");

const modalComprobante = document.getElementById("modalComprobante");
const contenidoComprobante = document.getElementById("contenidoComprobante");
const botonCerrarComprobante = document.getElementById("botonCerrarComprobante");
const botonUltimoPedido = document.getElementById("botonUltimoPedido");
const botonBorrarDatos = document.getElementById("botonBorrarDatos");

/* ---------- Utilidades ---------- */

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-AR");
}

function notificar(mensaje, color) {
  Toastify({
    text: mensaje,
    duration: 2500,
    gravity: "bottom",
    position: "right",
    style: { background: color || "#1e3d32" },
  }).showToast();
}

async function pedirConfirmacion(titulo, texto, textoConfirmar) {
  const resultado = await Swal.fire({
    title: titulo,
    html: texto,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: textoConfirmar,
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#1e3d32",
  });

  return resultado.isConfirmed;
}

/* ---------- Carga del catálogo ---------- */

async function cargarCatalogo() {
  estadoCarga.hidden = false;
  estadoError.hidden = true;

  try {
    productos = await obtenerProductos();
    sincronizarCarrito();
    renderizarCategorias();
    renderizarCatalogo();
    renderizarCarrito();
  } catch (error) {
    mensajeError.textContent = error.message || "Ocurrió un error al cargar los productos.";
    estadoError.hidden = false;
    listaProductos.innerHTML = "";
    cantidadResultados.textContent = "";
    notificar("No se pudo cargar el catálogo", "#b8323a");
  } finally {
    estadoCarga.hidden = true;
  }
}

function sincronizarCarrito() {
  carrito = carrito.filter((item) => productos.find((producto) => producto.id === item.id));
  guardarCarrito(carrito);
}

/* ---------- Catálogo ---------- */

function renderizarCategorias() {
  const categorias = [];

  productos.forEach((producto) => {
    if (!categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });

  filtroCategoria.innerHTML = '<option value="todas">Todas las categorías</option>';

  categorias.forEach((categoria) => {
    filtroCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
  });
}

function obtenerProductosFiltrados() {
  const texto = buscador.value.trim().toLowerCase();
  const categoria = filtroCategoria.value;
  const orden = filtroOrden.value;

  const filtrados = productos.filter((producto) => {
    const coincideTexto = (producto.nombre + " " + producto.descripcion).toLowerCase().includes(texto);
    const coincideCategoria = categoria === "todas" || producto.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  if (orden === "precio-asc") {
    filtrados.sort((productoA, productoB) => productoA.precio - productoB.precio);
  } else if (orden === "precio-desc") {
    filtrados.sort((productoA, productoB) => productoB.precio - productoA.precio);
  } else if (orden === "nombre") {
    filtrados.sort((productoA, productoB) => productoA.nombre.localeCompare(productoB.nombre));
  }

  return filtrados;
}

function renderizarCatalogo() {
  const filtrados = obtenerProductosFiltrados();

  cantidadResultados.textContent = filtrados.length + (filtrados.length === 1 ? " producto" : " productos");
  listaProductos.innerHTML = "";

  if (filtrados.length === 0) {
    listaProductos.innerHTML =
      '<p class="sin-resultados">No encontramos productos con esa búsqueda. Probá con otra palabra o cambiá la categoría.</p>';
    return;
  }

  filtrados.forEach((producto) => {
    const { id, nombre, categoria, precio, imagen, descripcion } = producto;

    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";
    tarjeta.innerHTML = `
      <img class="tarjeta__imagen" src="${imagen}" alt="${nombre}" loading="lazy">
      <div class="tarjeta__cuerpo">
        <span class="tarjeta__categoria">${categoria}</span>
        <h3 class="tarjeta__titulo">${nombre}</h3>
        <p class="tarjeta__descripcion">${descripcion}</p>
        <div class="tarjeta__pie">
          <strong class="tarjeta__precio">${formatearPrecio(precio)}</strong>
          <button class="boton boton--primario" type="button">Agregar</button>
        </div>
      </div>`;

    tarjeta.querySelector("button").addEventListener("click", () => agregarAlCarrito(id));
    listaProductos.appendChild(tarjeta);
  });
}

/* ---------- Carrito: lógica ---------- */

function agregarAlCarrito(idProducto) {
  const itemExistente = carrito.find((item) => item.id === idProducto);
  const producto = productos.find((item) => item.id === idProducto);

  if (itemExistente) {
    if (itemExistente.cantidad >= LIMITE_POR_PRODUCTO) {
      notificar("Podés llevar hasta " + LIMITE_POR_PRODUCTO + " unidades de cada producto", "#9a6a12");
      return;
    }
    itemExistente.cantidad++;
  } else {
    carrito.push({ id: idProducto, cantidad: 1 });
  }

  actualizarCarrito();
  notificar(producto.nombre + " se agregó al carrito");
}

function cambiarCantidad(idProducto, variacion) {
  const item = carrito.find((elemento) => elemento.id === idProducto);
  const nuevaCantidad = item.cantidad + variacion;

  if (nuevaCantidad <= 0) {
    quitarDelCarrito(idProducto);
    return;
  }

  if (nuevaCantidad > LIMITE_POR_PRODUCTO) {
    notificar("Podés llevar hasta " + LIMITE_POR_PRODUCTO + " unidades de cada producto", "#9a6a12");
    return;
  }

  item.cantidad = nuevaCantidad;
  actualizarCarrito();
}

function quitarDelCarrito(idProducto) {
  carrito = carrito.filter((item) => item.id !== idProducto);
  actualizarCarrito();
}

async function vaciarCarritoCompleto() {
  const confirmado = await pedirConfirmacion(
    "¿Vaciar el carrito?",
    "Se van a quitar todos los productos que agregaste.",
    "Sí, vaciar"
  );

  if (!confirmado) return;

  carrito = [];
  borrarCarrito();
  renderizarCarrito();
  notificar("Carrito vaciado");
}

function actualizarCarrito() {
  guardarCarrito(carrito);
  renderizarCarrito();
}

function obtenerDetalleCarrito() {
  return carrito.map((item) => {
    const producto = productos.find((elemento) => elemento.id === item.id);
    return {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: item.cantidad,
      subtotal: producto.precio * item.cantidad,
    };
  });
}

function calcularTotales(detalle) {
  const subtotal = detalle.reduce((acumulado, item) => acumulado + item.subtotal, 0);
  const unidades = detalle.reduce((acumulado, item) => acumulado + item.cantidad, 0);
  const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;

  return { subtotal, envio, total: subtotal + envio, unidades };
}

/* ---------- Carrito: DOM ---------- */

function generarResumenHtml(totales) {
  const { subtotal, envio, total } = totales;
  const avisoEnvio =
    envio === 0
      ? "Tu envío es gratis."
      : "Sumá " + formatearPrecio(ENVIO_GRATIS_DESDE - subtotal) + " y el envío es gratis.";

  return `
    <dl class="resumen">
      <div><dt>Subtotal</dt><dd>${formatearPrecio(subtotal)}</dd></div>
      <div><dt>Envío</dt><dd>${envio === 0 ? "Gratis" : formatearPrecio(envio)}</dd></div>
      <div class="resumen__total"><dt>Total</dt><dd>${formatearPrecio(total)}</dd></div>
    </dl>
    <p class="resumen__aviso">${avisoEnvio}</p>`;
}

function renderizarCarrito() {
  const detalle = obtenerDetalleCarrito();
  const totales = calcularTotales(detalle);
  const carritoVacio = detalle.length === 0;

  contadorCarrito.textContent = totales.unidades;
  contadorCarrito.hidden = carritoVacio;
  botonVaciarCarrito.disabled = carritoVacio;
  botonFinalizarCompra.disabled = carritoVacio;
  listaCarrito.innerHTML = "";

  if (carritoVacio) {
    listaCarrito.innerHTML = '<li class="vacio">Tu carrito está vacío. Elegí un producto del catálogo para empezar.</li>';
    resumenCarrito.innerHTML = "";
    return;
  }

  detalle.forEach((producto) => {
    const { id, nombre, precio, imagen, cantidad, subtotal } = producto;

    const fila = document.createElement("li");
    fila.className = "item";
    fila.innerHTML = `
      <img class="item__imagen" src="${imagen}" alt="">
      <div>
        <p class="item__nombre">${nombre}</p>
        <p class="item__precio">${formatearPrecio(precio)} c/u</p>
        <div class="cantidad">
          <button class="cantidad__boton boton-restar" type="button" aria-label="Quitar una unidad de ${nombre}">−</button>
          <span class="cantidad__valor">${cantidad}</span>
          <button class="cantidad__boton boton-sumar" type="button" aria-label="Agregar una unidad de ${nombre}">+</button>
        </div>
      </div>
      <div class="item__lateral">
        <strong>${formatearPrecio(subtotal)}</strong>
        <button class="enlace boton-quitar" type="button">Quitar</button>
      </div>`;

    fila.querySelector(".boton-restar").addEventListener("click", () => cambiarCantidad(id, -1));
    fila.querySelector(".boton-sumar").addEventListener("click", () => cambiarCantidad(id, 1));
    fila.querySelector(".boton-quitar").addEventListener("click", () => quitarDelCarrito(id));
    listaCarrito.appendChild(fila);
  });

  resumenCarrito.innerHTML = generarResumenHtml(totales);
}

/* ---------- Panel y modales ---------- */

function actualizarScroll() {
  const hayCapaAbierta =
    panelCarrito.classList.contains("carrito--abierto") || !modalPedido.hidden || !modalComprobante.hidden;

  document.body.classList.toggle("sin-scroll", hayCapaAbierta);
}

function abrirCarrito() {
  panelCarrito.classList.add("carrito--abierto");
  panelCarrito.setAttribute("aria-hidden", "false");
  fondo.hidden = false;
  actualizarScroll();
}

function cerrarCarrito() {
  panelCarrito.classList.remove("carrito--abierto");
  panelCarrito.setAttribute("aria-hidden", "true");
  fondo.hidden = true;
  actualizarScroll();
}

function abrirModal(modal) {
  modal.hidden = false;
  actualizarScroll();
}

function cerrarModal(modal) {
  modal.hidden = true;
  actualizarScroll();
}

/* ---------- Checkout ---------- */

function renderizarResumenPedido() {
  const detalle = obtenerDetalleCarrito();

  resumenPedido.innerHTML = "<h3>Tu pedido</h3>";

  const lista = document.createElement("ul");
  lista.className = "lista-resumen";

  detalle.forEach((producto) => {
    const fila = document.createElement("li");
    fila.innerHTML = `<span>${producto.cantidad} × ${producto.nombre}</span><span>${formatearPrecio(producto.subtotal)}</span>`;
    lista.appendChild(fila);
  });

  resumenPedido.appendChild(lista);
  resumenPedido.innerHTML += generarResumenHtml(calcularTotales(detalle));
}

function abrirCheckout() {
  const cliente = cargarCliente();

  campoNombre.value = cliente.nombre || "";
  campoEmail.value = cliente.email || "";
  campoTelefono.value = cliente.telefono || "";
  campoDireccion.value = cliente.direccion || "";

  renderizarResumenPedido();
  cerrarCarrito();
  abrirModal(modalPedido);
}

async function confirmarPedido(evento) {
  evento.preventDefault();

  const detalle = obtenerDetalleCarrito();
  const totales = calcularTotales(detalle);
  const metodoPago = campoPago.value;

  const confirmado = await pedirConfirmacion(
    "¿Confirmás tu compra?",
    "Total a pagar: <strong>" + formatearPrecio(totales.total) + "</strong><br>Método de pago: " + metodoPago,
    "Sí, confirmar"
  );

  if (!confirmado) return;

  const cliente = {
    nombre: campoNombre.value,
    email: campoEmail.value,
    telefono: campoTelefono.value || "No informado",
    direccion: campoDireccion.value,
  };

  const pedido = {
    numero: "PED-" + Date.now(),
    fecha: new Date().toLocaleString("es-AR"),
    cliente: cliente,
    metodoPago: metodoPago,
    items: detalle,
    subtotal: totales.subtotal,
    envio: totales.envio,
    total: totales.total,
  };

  guardarCliente(cliente);
  guardarUltimoPedido(pedido);

  carrito = [];
  borrarCarrito();
  renderizarCarrito();
  actualizarBotonUltimoPedido();

  formularioPedido.reset();
  cerrarModal(modalPedido);
  mostrarComprobante(pedido);
}

function mostrarComprobante(pedido) {
  const { numero, fecha, cliente, metodoPago, items, subtotal, envio, total } = pedido;

  contenidoComprobante.innerHTML = `
    <p class="comprobante__estado">Pedido confirmado</p>
    <h2 id="tituloComprobante">¡Gracias por tu compra, <span id="comprobanteNombre"></span>!</h2>
    <p class="comprobante__meta" id="comprobanteNumero"></p>
    <ul class="comprobante__items" id="comprobanteItems"></ul>
    ${generarResumenHtml({ subtotal, envio, total })}
    <dl class="comprobante__datos">
      <dt>Entrega en</dt><dd id="comprobanteDireccion"></dd>
      <dt>Contacto</dt><dd id="comprobanteContacto"></dd>
      <dt>Pago</dt><dd id="comprobantePago"></dd>
    </dl>`;

  document.getElementById("comprobanteNombre").textContent = cliente.nombre;
  document.getElementById("comprobanteNumero").textContent = numero + " - " + fecha;
  document.getElementById("comprobanteDireccion").textContent = cliente.direccion;
  document.getElementById("comprobanteContacto").textContent = cliente.email + " / " + cliente.telefono;
  document.getElementById("comprobantePago").textContent = metodoPago;

  const listaItems = document.getElementById("comprobanteItems");

  items.forEach((item) => {
    const fila = document.createElement("li");
    const detalle = document.createElement("span");
    const importe = document.createElement("span");

    detalle.textContent = item.cantidad + " × " + item.nombre;
    importe.textContent = formatearPrecio(item.subtotal);
    fila.appendChild(detalle);
    fila.appendChild(importe);
    listaItems.appendChild(fila);
  });

  abrirModal(modalComprobante);
}

function actualizarBotonUltimoPedido() {
  botonUltimoPedido.hidden = !cargarUltimoPedido();
}

async function borrarDatosGuardados() {
  const confirmado = await pedirConfirmacion(
    "¿Borrar los datos guardados?",
    "Se van a eliminar tu carrito, tus datos de contacto y tu último pedido.",
    "Sí, borrar todo"
  );

  if (!confirmado) return;

  vaciarStorage();
  carrito = [];
  renderizarCarrito();
  actualizarBotonUltimoPedido();
  notificar("Datos guardados eliminados");
}

/* ---------- Eventos e inicio ---------- */

buscador.addEventListener("input", renderizarCatalogo);
filtroCategoria.addEventListener("change", renderizarCatalogo);
filtroOrden.addEventListener("change", renderizarCatalogo);

botonCarrito.addEventListener("click", abrirCarrito);
botonCerrarCarrito.addEventListener("click", cerrarCarrito);
fondo.addEventListener("click", cerrarCarrito);
botonVaciarCarrito.addEventListener("click", vaciarCarritoCompleto);
botonFinalizarCompra.addEventListener("click", abrirCheckout);

formularioPedido.addEventListener("submit", confirmarPedido);
botonCerrarPedido.addEventListener("click", () => cerrarModal(modalPedido));
botonCerrarComprobante.addEventListener("click", () => cerrarModal(modalComprobante));

botonUltimoPedido.addEventListener("click", () => mostrarComprobante(cargarUltimoPedido()));
botonReintentar.addEventListener("click", cargarCatalogo);
botonBorrarDatos.addEventListener("click", borrarDatosGuardados);

umbralEnvioGratis.textContent = formatearPrecio(ENVIO_GRATIS_DESDE);
actualizarBotonUltimoPedido();
cargarCatalogo();
