https://github.com/Gonzalo-Emanuel-Soto/Proyecto_Final_JS/new/main?filename=README.md
☕ Café Aroma

Simulador de compra online de una tienda de café de especialidad. Es la entrega final del curso de JavaScript de la diplomatura **Full Stack Web Developer** de Coderhouse.

> Es un simulador con fines educativos: no se realizan cobros reales ni hay registro de usuarios.

## Qué se puede hacer

El circuito de compra está completo de punta a punta:

1. Ver el catálogo de productos (café en grano, café molido, cápsulas, accesorios e infusiones).
2. Buscar por texto, filtrar por categoría y ordenar por precio o nombre.
3. Agregar productos al carrito.
4. Modificar cantidades, quitar productos o vaciar el carrito.
5. Ver el subtotal, el costo de envío (gratis desde $30.000) y el total.
6. Completar los datos de entrega y elegir el método de pago.
7. Confirmar la compra y ver el comprobante del pedido.

El carrito, los datos del cliente y el último pedido se guardan en el navegador, así que no se pierden al recargar la página.

## Tecnologías

- HTML5
- CSS3 (diseño propio, sin frameworks)
- JavaScript
- [SweetAlert2](https://sweetalert2.github.io/) para los cuadros de confirmación
- [Toastify](https://apvarun.github.io/toastify-js/) para los avisos

## Cómo ejecutarlo

El catálogo se carga con `fetch` desde `data/productos.json`, por eso **no funciona abriendo `index.html` con doble clic**. Hay que usar un servidor local:

- **VS Code:** instalar la extensión *Live Server* y hacer clic en "Go Live".
- **Terminal:** `npx serve` o `python -m http.server`, y abrir la dirección que indica.

Necesita conexión a internet para cargar las librerías y las tipografías.

## Estructura del proyecto

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── api.js           # fetch del archivo JSON
│   ├── storage.js       # funciones de localStorage
│   └── app.js           # DOM y lógica del simulador
├── data/
│   └── productos.json   # base de datos simulada
└── assets/
    └── img/             # logo e imágenes de los productos
```

## Requisitos de la consigna

| Requisito | Dónde está |
|---|---|
| Interacción solo por la interfaz (sin `prompt`, `alert` ni `confirm`) | Todo el proyecto |
| Manipulación dinámica del DOM | `app.js`: catálogo, carrito, modales y comprobante |
| Array de objetos en `.json` consumido con `fetch` | `data/productos.json` y `api.js` |
| `async/await` con `try/catch/finally` | `cargarCatalogo` en `app.js` |
| Funciones de orden superior | `map`, `filter`, `find`, `reduce`, `forEach` y `sort` |
| localStorage: guardar, modificar, borrar y vaciar | `storage.js` y `app.js` |
| Operador ternario, operador OR y destructuring | `app.js` |
| Librerías externas | SweetAlert2 y Toastify |
| Circuito completo del simulador | Catálogo → carrito → datos → confirmación → comprobante |

## Autor

Gonzalo, estudiante de la diplomatura Full Stack Web Developer en Coderhouse.
