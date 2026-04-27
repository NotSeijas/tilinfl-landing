// ============================================================
//  TILIN FL — script.js  (versión completa optimizada)
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
var carrito = [];
var currentIndex = 0;
var particlesActive = false;

// ── Utilidades ──────────────────────────────────────────────
var $ = function (id) {
  return document.getElementById(id);
};
var $$ = function (sel) {
  return document.querySelectorAll(sel);
};

// ── Navegación de secciones ─────────────────────────────────
var SECCIONES = ["inicio", "productos", "contacto", "carrito", "proyectos"];

function ocultarTodasLasSecciones() {
  SECCIONES.forEach(function (id) {
    var el = $(id);
    if (el) el.classList.remove("seccion-visible");
  });
  $("nav-arrows").classList.remove("seccion-visible");
  $("footer-inicio").classList.remove("seccion-visible");
  desactivarParticulas();
}

function mostrarSeccion(id, opts) {
  opts = opts || {};
  ocultarTodasLasSecciones();
  var el = $(id);
  if (!el) return;
  requestAnimationFrame(function () {
    el.classList.add("seccion-visible");
    if (opts.arrows) $("nav-arrows").classList.add("seccion-visible");
    if (opts.footer) $("footer-inicio").classList.add("seccion-visible");
    if (opts.particles) activarParticulas();
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
  menu.setAttribute("aria-expanded", String(isOpen));
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

// ── Productos mejorado ──────────────────────────────────────
function actualizarProducto() {
  var producto = productos[currentIndex];
  var img = $("product-img");

  // Contador
  var counter = $("product-counter");
  if (counter)
    counter.textContent = currentIndex + 1 + " de " + productos.length;

  // Animación slide
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

  // Select de opciones
  var select = $("product-options");
  select.innerHTML = "";
  producto.opciones.forEach(function (opcion, i) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = opcion.tipo + " — S/ " + opcion.precio.toFixed(2);
    select.appendChild(option);
  });

  // Actualizar thumbnails
  actualizarThumbs();
}

function actualizarThumbs() {
  var thumbs = $$(".product-thumb");
  thumbs.forEach(function (t, i) {
    t.classList.toggle("active", i === currentIndex);
  });
}

function irAProducto(idx) {
  currentIndex = idx;
  actualizarProducto();
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

  // Estado vacío
  if (carrito.length === 0) {
    lista.innerHTML =
      '<div class="carrito-vacio">' +
      '<span class="empty-icon">🛒</span>' +
      "<p>Tu carrito está vacío</p>" +
      '<a href="#productos" onclick="mostrarProductos()">Ver productos</a>' +
      "</div>";
    if (subtotalEl) subtotalEl.textContent = "S/ 0.00";
    if (totalEl) totalEl.textContent = "S/ 0.00";
    btn.href = "#";
    btn.onclick = function (e) {
      e.preventDefault();
    };
    return;
  }

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

// ── Partículas CSS (sin librería externa) ────────────────────
var particleEls = [];

function crearParticulas() {
  var container = $("particles-css");
  if (!container || container.children.length > 0) return;
  var colores = ["#903f7d", "#c04fa0", "#d4a0c0", "#e8c8dc"];
  for (var i = 0; i < 40; i++) {
    var p = document.createElement("span");
    p.className = "particle";
    var size = Math.random() * 6 + 3;
    var left = Math.random() * 100;
    var delay = Math.random() * 12;
    var duration = Math.random() * 10 + 8;
    var color = colores[Math.floor(Math.random() * colores.length)];
    p.style.cssText =
      "width:" +
      size +
      "px;" +
      "height:" +
      size +
      "px;" +
      "left:" +
      left +
      "%;" +
      "background:" +
      color +
      ";" +
      "animation-duration:" +
      duration +
      "s;" +
      "animation-delay:" +
      delay +
      "s;";
    container.appendChild(p);
  }
}

function activarParticulas() {
  if (particlesActive) return;
  crearParticulas();
  var container = $("particles-css");
  if (container) container.classList.add("active");
  particlesActive = true;
}

function desactivarParticulas() {
  if (!particlesActive) return;
  var container = $("particles-css");
  if (container) container.classList.remove("active");
  particlesActive = false;
}

// ── Barra de anuncio ─────────────────────────────────────────
function initAnnouncementBar() {
  var bar = document.querySelector(".announcement-bar");
  if (!bar) return;
  var barH = bar.offsetHeight;
  document.documentElement.style.setProperty("--bar-h", barH + "px");
  document.body.classList.add("has-announcement");
}

function cerrarAnuncio() {
  var bar = document.querySelector(".announcement-bar");
  if (!bar) return;
  bar.style.transition = "opacity 0.3s, transform 0.3s";
  bar.style.opacity = "0";
  bar.style.transform = "translateY(-100%)";
  setTimeout(function () {
    bar.remove();
    document.body.classList.remove("has-announcement");
    document.documentElement.style.removeProperty("--bar-h");
  }, 300);
}

// ── Stats animados ───────────────────────────────────────────
function animarContador(el, target, duracion, sufijo) {
  var inicio = 0;
  var incremento = target / (duracion / 16);
  var timer = setInterval(function () {
    inicio = Math.min(inicio + incremento, target);
    el.textContent = Math.floor(inicio) + sufijo;
    if (inicio >= target) clearInterval(timer);
  }, 16);
}

function initStats() {
  var statsBar = document.querySelector(".stats-bar");
  if (!statsBar) return;
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll("[data-count]").forEach(function (item) {
          animarContador(
            item,
            parseFloat(item.dataset.count),
            1400,
            item.dataset.suffix || "",
          );
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );
  observer.observe(statsBar);
}

// ── Animaciones scroll (IntersectionObserver) ─────────────────
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
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".anim").forEach(function (el) {
    observer.observe(el);
  });
}

// ── Carrusel testimonios ─────────────────────────────────────
(function () {
  var track,
    total,
    current = 0;

  function init() {
    track = document.querySelector(".testimonios-track");
    if (!track) return;
    total = track.children.length;
    renderDots();
    update();
    setInterval(function () {
      mover(1);
    }, 5500);
  }

  function renderDots() {
    var c = document.querySelector(".testimonios-dots");
    if (!c) return;
    c.innerHTML = "";
    for (var i = 0; i < total; i++) {
      var d = document.createElement("span");
      d.className = "dot" + (i === 0 ? " active" : "");
      d.setAttribute("data-i", i);
      d.onclick = (function (idx) {
        return function () {
          current = idx;
          update();
        };
      })(i);
      c.appendChild(d);
    }
  }

  function update() {
    if (track) track.style.transform = "translateX(-" + current * 100 + "%)";
    $$(".testimonios-dots .dot").forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });
  }

  function mover(dir) {
    current = (current + dir + total) % total;
    update();
  }

  window.prevTestimonio = function () {
    mover(-1);
  };
  window.nextTestimonio = function () {
    mover(1);
  };
  document.addEventListener("DOMContentLoaded", init);
})();

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
  var rutas = {
    productos: mostrarProductos,
    contacto: mostrarContacto,
    proyectos: mostrarProyectos,
    carrito: mostrarCarritoManual,
  };
  (rutas[window.location.hash.slice(1)] || mostrarInicio)();
}

// ── Inicialización ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  initScrollAnimations();
  initSwipe();
  initStats();
  initAnnouncementBar();
  rutearHash();
});

window.addEventListener("hashchange", rutearHash);

// Exponer al scope global para onclick inline
Object.assign(window, {
  toggleMenu,
  mostrarInicio,
  mostrarProductos,
  mostrarContacto,
  mostrarProyectos,
  mostrarCarritoManual,
  agregarAlCarrito,
  eliminarDelCarrito,
  nextSlide,
  prevSlide,
  irAProducto,
  cerrarAnuncio,
});
