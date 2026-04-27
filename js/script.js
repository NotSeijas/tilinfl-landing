// ============================================================
//  TILIN FL — script.js  (versión optimizada)
// ============================================================

// ── Datos de productos ──────────────────────────────────────
const productos = [
  {
    nombre: "Tilin Perros 4.5 a 10 kg",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 4.5 a 10 kg. Protección eficaz para perros pequeños y medianos. DURANTE 3 MESES.",
    imagen: "images/Perros-4.5-10kg.jpg",
    opciones: [
      { tipo: "Unidad", precio: 35 },
      { tipo: "Media docena (6 unid. a S/25 c/u)", precio: 150 },
      { tipo: "Docena (12 unid. a S/25 c/u)", precio: 300 },
    ],
  },
  {
    nombre: "Tilin Perros 10 a 20 kg",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 10 a 20 kg. Ideal para razas medianas. DURANTE 3 MESES.",
    imagen: "images/Perros-10-20kg.jpg",
    opciones: [
      { tipo: "Unidad", precio: 40 },
      { tipo: "Media docena (6 unid. a S/27.50 c/u)", precio: 165 },
      { tipo: "Docena (12 unid. a S/27.50 c/u)", precio: 330 },
    ],
  },
  {
    nombre: "Tilin Perros 20 a 40 kg",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 20 a 40 kg. Protección avanzada para perros grandes. DURANTE 3 MESES.",
    imagen: "images/Perros-20-40kg.jpg",
    opciones: [
      { tipo: "Unidad", precio: 45 },
      { tipo: "PROMO: Media docena (6 unid. a S/30 c/u) 👉", precio: 180 },
      { tipo: "PROMO: Docena (12 unid. a S/30 c/u) 👉", precio: 360 },
    ],
  },
  {
    nombre: "PACK TILIN 360",
    descripcion:
      "Protección total: contra pulgas, garrapatas, ácaros y parásitos internos por hasta 3 meses continuos.",
    imagen: "images/TILIN360.png",
    opciones: [
      { tipo: "4.5–10 kg: 1 tableta interna + 1 antipulgas 👉", precio: 45 },
      { tipo: "10–20 kg: 2 tabletas internas + 1 antipulgas 👉", precio: 50 },
      { tipo: "20–40 kg: 4 tabletas internas + 1 antipulgas 👉", precio: 60 },
    ],
  },
  {
    nombre: "MATAX: MATA CUCARACHAS",
    descripcion:
      "Insecticida potente contra cucarachas. Elimina adultos y larvas, inhibe la reproducción. Control efectivo y de larga duración.",
    imagen: "images/cucarachas.png",
    opciones: [
      { tipo: "Unidad", precio: 9.9 },
      { tipo: "Media docena (6 unid.)", precio: 59.4 },
      { tipo: "Docena (12 unid.)", precio: 118.8 },
    ],
  },
  {
    nombre: "MATAX: MATA HORMIGAS",
    descripcion:
      "Spray MATAX para hormigas. Controla colonias, bloquea la reproducción y ofrece protección duradera en interiores y exteriores.",
    imagen: "images/hormigas.png",
    opciones: [
      { tipo: "Unidad", precio: 9.9 },
      { tipo: "Media docena (6 unid.)", precio: 59.4 },
      { tipo: "Docena (12 unid.)", precio: 118.8 },
    ],
  },
];

// ── Estado global ───────────────────────────────────────────
let carrito = [];
let currentIndex = 0;
let particlesInitialized = false;

// ── Utilidades ──────────────────────────────────────────────
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Navegación de secciones ─────────────────────────────────
const SECCIONES = ["inicio", "productos", "contacto", "carrito", "proyectos"];

function ocultarTodasLasSecciones() {
  SECCIONES.forEach((id) => {
    const el = $(id);
    if (el) el.classList.remove("seccion-visible");
  });
  $("nav-arrows").classList.remove("seccion-visible");
  $("footer-inicio").classList.remove("seccion-visible");
}

function mostrarSeccion(id, opts) {
  const { arrows = false, footer = false, particles = false } = opts || {};
  ocultarTodasLasSecciones();
  const el = $(id);
  if (!el) return;
  requestAnimationFrame(() => {
    el.classList.add("seccion-visible");
    if (arrows) $("nav-arrows").classList.add("seccion-visible");
    if (footer) $("footer-inicio").classList.add("seccion-visible");
    if (particles) initParticles();
    else destroyParticles();
  });
}

function mostrarInicio() {
  mostrarSeccion("inicio", { footer: true, particles: true });
}
function mostrarProductos() {
  mostrarSeccion("productos", { arrows: true });
  actualizarProducto();
}
function mostrarContacto() {
  mostrarSeccion("contacto", { particles: true });
}
function mostrarProyectos() {
  mostrarSeccion("proyectos", { footer: true, particles: true });
}
function mostrarCarritoManual() {
  renderCarrito();
  mostrarSeccion("carrito");
}

// ── Menú hamburguesa ────────────────────────────────────────
function toggleMenu() {
  var menu = $("mobileMenu");
  var isOpen = menu.classList.toggle("open");
  menu.setAttribute("aria-expanded", isOpen);
}

document.addEventListener("click", function (e) {
  var menu = $("mobileMenu");
  var toggle = document.querySelector(".menu-toggle");
  if (
    menu &&
    toggle &&
    !menu.contains(e.target) &&
    !toggle.contains(e.target)
  ) {
    menu.classList.remove("open");
  }
});

// ── Productos ───────────────────────────────────────────────
function actualizarProducto() {
  var producto = productos[currentIndex];
  var img = $("product-img");

  img.classList.add("product-slide-out");
  setTimeout(function () {
    $("product-title").textContent = producto.nombre;
    $("product-desc").textContent = producto.descripcion;
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.classList.remove("product-slide-out");
    img.classList.add("product-slide-in");
    setTimeout(function () {
      img.classList.remove("product-slide-in");
    }, 400);
  }, 200);

  var select = $("product-options");
  select.innerHTML = "";
  producto.opciones.forEach(function (opcion, i) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = opcion.tipo + " — S/ " + opcion.precio.toFixed(2);
    select.appendChild(option);
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % productos.length;
  actualizarProducto();
}
function prevSlide() {
  currentIndex = (currentIndex - 1 + productos.length) % productos.length;
  actualizarProducto();
}

// ── Carrito ─────────────────────────────────────────────────
function agregarAlCarrito() {
  var producto = productos[currentIndex];
  var opcionIndex = Number($("product-options").value);
  var opcion = producto.opciones[opcionIndex];
  carrito.push({
    nombre: producto.nombre + " — " + opcion.tipo,
    precio: opcion.precio,
  });
  actualizarContadorCarrito();
  mostrarToast("Producto agregado al carrito 🛒");
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarContadorCarrito();
  renderCarrito();
}

function actualizarContadorCarrito() {
  $$(".cart-count").forEach(function (el) {
    el.textContent = carrito.length;
  });
}

function renderCarrito() {
  var lista = $("lista-carrito");
  var totalEl = $("total-carrito");
  var subtotalEl = $("subtotal");
  var btn = $("whatsapp-btn");

  lista.innerHTML = "";
  var suma = 0;

  carrito.forEach(function (item, index) {
    suma += item.precio;
    var li = document.createElement("li");
    li.innerHTML =
      "<span>" +
      item.nombre +
      " — <strong>S/ " +
      item.precio.toFixed(2) +
      "</strong></span>" +
      '<button class="btn-eliminar" aria-label="Eliminar" onclick="eliminarDelCarrito(' +
      index +
      ')">✕</button>';
    lista.appendChild(li);
  });

  var sumaStr = suma.toFixed(2);
  if (subtotalEl) subtotalEl.textContent = "S/ " + sumaStr;
  if (totalEl) totalEl.textContent = "S/ " + sumaStr;

  var msg = encodeURIComponent(
    "Hola, quiero comprar:\n" +
      carrito
        .map(function (p) {
          return "- " + p.nombre + " (S/ " + p.precio.toFixed(2) + ")";
        })
        .join("\n") +
      "\nTotal: S/ " +
      sumaStr,
  );
  btn.href = "https://wa.me/+51963195119?text=" + msg;

  btn.onclick = function (e) {
    e.preventDefault();
    if (suma > 0 && typeof gtag !== "undefined") {
      gtag("event", "conversion", {
        send_to: "AW-17490215386/mUR0CMH9-IgbENqD_pNB",
        value: suma,
        currency: "PEN",
        event_callback: function () {
          window.location.href = btn.href;
        },
      });
      setTimeout(function () {
        window.location.href = btn.href;
      }, 1000);
    } else {
      window.location.href = btn.href;
    }
  };
}

// ── Toast ────────────────────────────────────────────────────
function mostrarToast(mensaje) {
  var toast = $("toast");
  toast.textContent = mensaje;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// ── Partículas ───────────────────────────────────────────────
function initParticles() {
  if (particlesInitialized) return;
  if (typeof particlesJS === "undefined") return;
  particlesInitialized = true;
  particlesJS("particles-js", {
    particles: {
      number: { value: 45 },
      color: { value: "#903f7d" },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#903f7d",
        opacity: 0.3,
        width: 1,
      },
      move: { enable: true, speed: 2, out_mode: "out" },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
      },
      modes: { repulse: { distance: 100 }, push: { particles_nb: 3 } },
    },
    retina_detect: true,
  });
}

function destroyParticles() {
  if (!particlesInitialized) return;
  particlesInitialized = false;
  if (window.pJSDom && window.pJSDom.length > 0) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
}

// ── IntersectionObserver para animaciones de scroll ─────────
function initScrollAnimations() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  $$(".anim").forEach(function (el) {
    observer.observe(el);
  });
}

// ── Swipe táctil en el slider ────────────────────────────────
function initSwipe() {
  var slider = $("productos");
  if (!slider) return;
  var startX = 0;
  slider.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  slider.addEventListener("touchend", function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  });
}

// ── Routing por hash ─────────────────────────────────────────
function rutearHash() {
  var hash = window.location.hash.slice(1);
  var rutas = {
    productos: mostrarProductos,
    contacto: mostrarContacto,
    proyectos: mostrarProyectos,
    carrito: mostrarCarritoManual,
  };
  (rutas[hash] || mostrarInicio)();
}

// ── Inicialización ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  initScrollAnimations();
  initSwipe();
  rutearHash();
});

window.addEventListener("hashchange", rutearHash);

// ============================================================
//  INICIO — Stats animados + Carrusel de testimonios
// ============================================================

// ── Contadores animados ──────────────────────────────────────
function animarContador(el, target, duracion, sufijo) {
  var inicio = 0;
  var incremento = target / (duracion / 16);
  var timer = setInterval(function () {
    inicio += incremento;
    if (inicio >= target) {
      inicio = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(inicio) + sufijo;
  }, 16);
}

function initStats() {
  var statsBar = document.querySelector(".stats-bar");
  if (!statsBar) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var items = entry.target.querySelectorAll("[data-count]");
          items.forEach(function (item) {
            var target = parseFloat(item.dataset.count);
            var sufijo = item.dataset.suffix || "";
            animarContador(item, target, 1400, sufijo);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(statsBar);
}

// ── Carrusel de testimonios ──────────────────────────────────
(function () {
  var track, dots, total, current;

  function initCarrusel() {
    track = document.querySelector(".testimonios-track");
    if (!track) return;
    total = track.children.length;
    current = 0;
    renderDots();
    updateCarrusel();

    // Auto-play
    setInterval(function () {
      moverTestimonio(1);
    }, 5000);
  }

  function renderDots() {
    var container = document.querySelector(".testimonios-dots");
    if (!container) return;
    container.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var dot = document.createElement("span");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.dataset.index = i;
      dot.onclick = (function (idx) {
        return function () {
          irA(idx);
        };
      })(i);
      container.appendChild(dot);
    }
  }

  function updateCarrusel() {
    if (!track) return;
    track.style.transform = "translateX(-" + current * 100 + "%)";
    var allDots = document.querySelectorAll(".testimonios-dots .dot");
    allDots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function moverTestimonio(dir) {
    current = (current + dir + total) % total;
    updateCarrusel();
  }

  function irA(idx) {
    current = idx;
    updateCarrusel();
  }

  // Exponer para botones inline
  window.prevTestimonio = function () {
    moverTestimonio(-1);
  };
  window.nextTestimonio = function () {
    moverTestimonio(1);
  };

  document.addEventListener("DOMContentLoaded", initCarrusel);
})();

// Llamar initStats al cargar
document.addEventListener("DOMContentLoaded", initStats);
