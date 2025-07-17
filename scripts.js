function buscarStock() {
  const nombreBuscado = document.getElementById('buscarProducto').value.trim().toLowerCase();
  const mensaje = document.getElementById('mensajeStock');

  if (!nombreBuscado) {
    mensaje.textContent = 'Por favor, ingresá un nombre de producto.';
    mensaje.className = 'error';
    return;
  }

  const items = document.querySelectorAll('#productos .item');
  let encontrado = false;

  for (let item of items) {
    let texto = item.querySelector('.texto').innerText.trim().toLowerCase();
    let nombre = texto.replace(/sin stock/i, '').trim().toLowerCase();

    if (nombre === nombreBuscado) {
      encontrado = true;
      let tieneStock = !texto.includes('sin stock');
      mensaje.textContent = tieneStock
        ? `El producto "${nombreBuscado}" tiene stock.`
        : `El producto "${nombreBuscado}" NO tiene stock.`;
      mensaje.className = tieneStock ? 'stock' : 'sin-stock';
      break;
    }
  }

  if (!encontrado) {
    mensaje.textContent = `No se encontró el producto "${nombreBuscado}".`;
    mensaje.className = 'error';
  }
}

function generarListas() {
  let items = document.querySelectorAll('#productos .item');
  let listaPrincipal = document.getElementById('listaProductos');

  listaPrincipal.innerHTML = '';

  items.forEach((item, index) => {
    let texto = item.querySelector('.texto').innerText.trim();
    let sinStock = texto.toLowerCase().includes('sin stock');
    let nombre = texto.replace(/sin stock/i, '').trim();
    let tieneStock = !sinStock;

    let li = document.createElement('li');
    li.textContent = `Producto ${index + 1}: ${nombre} — Tiene stock: ${tieneStock}`;
    listaPrincipal.appendChild(li);
  });
}

window.onload = () => {
  generarListas();

  const textos = document.querySelectorAll('#productos .item .texto');
  textos.forEach((nodo) => {
    const observer = new MutationObserver(() => {
      generarListas();
    });
    observer.observe(nodo, { characterData: true, subtree: true, childList: true });
  });
};

let carrito = localStorage.getItem('carrito')
  ? localStorage.getItem('carrito').split(',')
  : [];

function agregarAlCarrito(nombreProducto) {
  carrito.push(nombreProducto);
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById('carrito-list');
  const cantidad = document.getElementById('cantidad-carrito');
  if (!lista || !cantidad) return;

  lista.innerHTML = '';

  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.padding = '5px 0';

    const span = document.createElement('span');
    span.textContent = producto;

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.style.marginLeft = '10px';
    btnEliminar.style.cursor = 'pointer';
    btnEliminar.style.backgroundColor = '#ff4d4d';
    btnEliminar.style.color = 'white';
    btnEliminar.style.border = 'none';
    btnEliminar.style.borderRadius = '4px';
    btnEliminar.style.padding = '2px 6px';
    btnEliminar.addEventListener('click', () => eliminarDelCarrito(index));

    li.appendChild(span);
    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  cantidad.textContent = carrito.length;

  localStorage.setItem('carrito', carrito.join(','));
}

document.addEventListener('DOMContentLoaded', () => {
  const icono = document.getElementById('carrito-icono');
  const desplegable = document.getElementById('carrito-desplegable');
  const btnCerrar = document.getElementById('cerrar-carrito');

  icono.addEventListener('click', () => {
    if (desplegable.style.display === 'none' || desplegable.style.display === '') {
      desplegable.style.display = 'block';
    } else {
      desplegable.style.display = 'none';
    }
  });

  btnCerrar.addEventListener('click', () => {
    desplegable.style.display = 'none';
  });

  actualizarCarrito();
});

window.agregarAlCarrito = agregarAlCarrito;

function finalizarCompra() {
  carrito = [];
  localStorage.removeItem('carrito');
  window.location.href = "finalizarcompra.html";
}