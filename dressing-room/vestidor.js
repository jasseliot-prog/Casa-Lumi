/* Casa-Lumi · Vestidor mágico 2D
   Colocar junto a vestidor.html, vestidor.css y las imágenes .webp.
*/
(() => {
  'use strict';

  const prendas = [
    { id: 'invierno', nombre: 'Invierno', archivo: 'invierno.webp', descripcion: 'Un abrigo para los días fríos. ❄️' },
    { id: 'primavera', nombre: 'Primavera', archivo: 'primavera.webp', descripcion: 'Flores y magia de primavera. 🌸' },
    { id: 'verano', nombre: 'Verano', archivo: 'verano.webp', descripcion: 'Un atuendo para días soleados. ☀️' },
    { id: 'otono', nombre: 'Otoño', archivo: 'otono.webp', descripcion: 'Colores cálidos de otoño. 🍂' },
    { id: 'pijama-invierno', nombre: 'Pijama de invierno', archivo: 'pijama-invierno.webp', descripcion: 'Lista para descansar en noches frías. 🌙' },
    { id: 'pijama-verano', nombre: 'Pijama de verano', archivo: 'pijama-verano.webp', descripcion: 'Una pijama ligera para descansar. ✨' },
    { id: 'navidad', nombre: 'Navidad', archivo: 'navidad.webp', descripcion: 'Una celebración llena de estrellas. 🎄' },
    { id: 'ano-nuevo', nombre: 'Año Nuevo', archivo: 'año-nuevo.webp', descripcion: '¡Un nuevo año para soñar! 🎆' },
    { id: 'fiestas-patrias', nombre: 'Fiestas Patrias', archivo: 'fiestas-patrias.webp', descripcion: 'Un atuendo para celebrar. 🇨🇱' },
    { id: 'san-valentin', nombre: 'San Valentín', archivo: 'san-valentin.webp', descripcion: 'Un día de cariño y amistad. 💜' }
  ];

  const imagen = document.getElementById('lumi-imagen');
  const titulo = document.getElementById('lumi-titulo');
  const descripcion = document.getElementById('lumi-descripcion');
  const opciones = document.getElementById('lumi-opciones');
  if (!imagen || !titulo || !descripcion || !opciones) return;

  const clave = 'casaLumi.vestidor.seleccion';
  const guardar = (id) => {
    try { localStorage.setItem(clave, id); } catch (_) { /* almacenamiento opcional */ }
  };
  const recuperar = () => {
    try { return localStorage.getItem(clave); } catch (_) { return null; }
  };

  function vestir(id) {
    const prenda = prendas.find((p) => p.id === id) || prendas[0];
    imagen.onerror = () => {
      descripcion.textContent = `No se pudo cargar ${prenda.archivo}. Revisa que esté junto a vestidor.html y que el nombre coincida.`;
    };
    imagen.src = encodeURI(prenda.archivo);
    imagen.alt = `Lumi con vestuario de ${prenda.nombre.toLowerCase()}`;
    titulo.textContent = prenda.nombre;
    descripcion.textContent = prenda.descripcion;
    opciones.querySelectorAll('button').forEach((boton) => {
      const activo = boton.dataset.vestuario === prenda.id;
      boton.setAttribute('aria-pressed', String(activo));
      boton.classList.toggle('activo', activo);
      boton.classList.toggle('active', activo);
    });
    guardar(prenda.id);
  }

  prendas.forEach((prenda) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = prenda.nombre;
    boton.dataset.vestuario = prenda.id;
    boton.addEventListener('click', () => vestir(prenda.id));
    opciones.appendChild(boton);
  });

  vestir(recuperar() || 'invierno');
})();
