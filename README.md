# Café Aroma

Simulador de compra online de café de especialidad. Proyecto final de JavaScript (Coderhouse).

## Circuito completo
Ver productos → buscar / filtrar / ordenar → agregar al carrito → modificar cantidades → calcular total y envío → completar datos → confirmar compra → comprobante.

## Cómo ejecutarlo
El catálogo se carga con `fetch` desde `data/productos.json`, por lo que **no funciona abriendo `index.html` con doble clic** (`file://`). Usá un servidor local:

- VS Code: extensión **Live Server** → "Open with Live Server".
- O desde la terminal: `npx serve` o `python -m http.server`.

Para publicarlo online, activá **GitHub Pages** en el repositorio.

## Estructura
```
index.html
css/styles.css
js/api.js        (fetch del JSON)
js/storage.js    (localStorage)
js/app.js        (DOM y lógica del simulador)
data/productos.json
assets/img/      (logo y fotos de productos)
```

## Tecnologías
HTML, CSS, JavaScript, SweetAlert2 y Toastify.
