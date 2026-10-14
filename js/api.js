const RUTA_PRODUCTOS = "./data/productos.json";

async function obtenerProductos() {
  const respuesta = await fetch(RUTA_PRODUCTOS);

  if (!respuesta.ok) {
    throw new Error("No pudimos cargar el catálogo (código " + respuesta.status + ").");
  }

  return await respuesta.json();
}
