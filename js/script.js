// ============================================================
//  TILIN FL — script.js  (versión final completa)
// ============================================================

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

// ── Estado ──────────────────────────────────────────────────
let carrito = [];
let currentIndex = 0;
let particlesActive = false;

const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ── Secciones ────────────────────────────────────────────────
const SECCIONES = ["inicio", "productos", "contacto", "carrito", "proyectos"];

function ocultarTodasLasSecciones() {
  SECCIONES.forEach((id) => {
    const el = $(id);
    if (el) el.classList.remove("seccion-visible");
  });
  $("nav-arrows").classList.remove("seccion-visible");
  $("footer-inicio").classList.remove("seccion-visible");
  desactivarParticulas();
}

function mostrarSeccion(id, opts = {}) {
  ocultarTodasLasSecciones();
  const el = $(id);
  if (!el) return;
  requestAnimationFrame(() => {
    el.classList.add("seccion-visible");
    if (opts.arrows) $("nav-arrows").classList.add("seccion-visible");
    if (opts.footer) $("footer-inicio").classList.add("seccion-visible");
    if (opts.particles) activarParticulas();
    actualizarNavActivo(id);
  });
}

// ── Nav activo ───────────────────────────────────────────────
function actualizarNavActivo(seccionId) {
  $$("nav a").forEach((a) => {
    const href = a.getAttribute("href")?.replace("#", "");
    a.classList.toggle("nav-active", href === seccionId);
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

// ── Menú hamburguesa ─────────────────────────────────────────
function toggleMenu() {
  const menu = $("mobileMenu");
  const isOpen = menu.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(isOpen));
}

document.addEventListener("click", (e) => {
  const menu = $("mobileMenu");
  const toggle = document.querySelector(".menu-toggle");
  if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target))
    menu.classList.remove("open");
});

// ── Slider con teclado ───────────────────────────────────────
document.addEventListener("keydown", (e) => {
  if (!$("productos")?.classList.contains("seccion-visible")) return;
  if (e.key === "ArrowRight") nextSlide();
  if (e.key === "ArrowLeft") prevSlide();
});

function actualizarProducto() {
  const producto = productos[currentIndex];
  const img = $("product-img");

  const counter = $("product-counter");
  if (counter)
    counter.textContent = `${currentIndex + 1} de ${productos.length}`;

  img.classList.add("product-slide-out");
  setTimeout(() => {
    $("product-title").textContent = producto.nombre;
    $("product-desc").textContent = producto.descripcion;
    img.src = producto.imagen;
    img.alt = producto.nombre;
    img.classList.remove("product-slide-out");
    img.classList.add("product-slide-in");
    setTimeout(() => img.classList.remove("product-slide-in"), 400);
  }, 200);

  const select = $("product-options");
  select.innerHTML = "";
  producto.opciones.forEach((opcion, i) => {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${opcion.tipo} — S/ ${opcion.precio.toFixed(2)}`;
    select.appendChild(option);
  });

  $$(".product-thumb").forEach((t, i) =>
    t.classList.toggle("active", i === currentIndex),
  );
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

// ── Swipe táctil ─────────────────────────────────────────────
function initSwipe() {
  const slider = $("productos");
  if (!slider) return;
  let startX = 0;
  slider.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );
  slider.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
  });
}

// ── Carrito ──────────────────────────────────────────────────
function agregarAlCarrito() {
  const producto = productos[currentIndex];
  const opcion = producto.opciones[Number($("product-options").value)];
  carrito.push({
    nombre: `${producto.nombre} — ${opcion.tipo}`,
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
  $$(".cart-count").forEach((el) => (el.textContent = carrito.length));
}

function renderCarrito() {
  const lista = $("lista-carrito");
  const btn = $("whatsapp-btn");

  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<div class="carrito-vacio">
      <span class="empty-icon">🛒</span>
      <p>Tu carrito está vacío</p>
      <a href="#productos" onclick="mostrarProductos()">Ver productos</a>
    </div>`;
    $("subtotal").textContent = "S/ 0.00";
    $("total-carrito").textContent = "S/ 0.00";
    btn.href = "#";
    btn.onclick = (e) => e.preventDefault();
    return;
  }

  let suma = 0;
  carrito.forEach((item, index) => {
    suma += item.precio;
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.nombre} — <strong>S/ ${item.precio.toFixed(2)}</strong></span>
      <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">✕</button>`;
    lista.appendChild(li);
  });

  const sumaStr = suma.toFixed(2);
  $("subtotal").textContent = `S/ ${sumaStr}`;
  $("total-carrito").textContent = `S/ ${sumaStr}`;

  const msg = encodeURIComponent(
    `Hola, quiero comprar:\n${carrito.map((p) => `- ${p.nombre} (S/ ${p.precio.toFixed(2)})`).join("\n")}\nTotal: S/ ${sumaStr}`,
  );
  btn.href = `https://wa.me/+51963195119?text=${msg}`;

  btn.onclick = (e) => {
    e.preventDefault();
    if (suma > 0 && typeof gtag !== "undefined") {
      gtag("event", "conversion", {
        send_to: "AW-17490215386/mUR0CMH9-IgbENqD_pNB",
        value: suma,
        currency: "PEN",
        event_callback: () => {
          window.location.href = btn.href;
        },
      });
      setTimeout(() => {
        window.location.href = btn.href;
      }, 1000);
    } else {
      window.location.href = btn.href;
    }
  };
}

// ── Toast ─────────────────────────────────────────────────────
function mostrarToast(msg) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Partículas CSS ───────────────────────────────────────────
function crearParticulas() {
  const container = $("particles-css");
  if (!container || container.children.length > 0) return;
  const colores = ["#903f7d", "#c04fa0", "#e0529a", "#d4a0c0", "#f0c8e0"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    const size = Math.random() * 6 + 3;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random() * 100}%;background:${colores[i % colores.length]};animation-duration:${Math.random() * 10 + 8}s;animation-delay:${Math.random() * 12}s;`;
    container.appendChild(p);
  }
}

function activarParticulas() {
  if (particlesActive) return;
  crearParticulas();
  $("particles-css")?.classList.add("active");
  particlesActive = true;
}

function desactivarParticulas() {
  if (!particlesActive) return;
  $("particles-css")?.classList.remove("active");
  particlesActive = false;
}

// ── Barra de anuncio ─────────────────────────────────────────
function initAnnouncementBar() {
  const bar = document.querySelector(".announcement-bar");
  if (!bar) return;
  document.documentElement.style.setProperty(
    "--bar-h",
    bar.offsetHeight + "px",
  );
  document.body.classList.add("has-announcement");
}

function cerrarAnuncio() {
  const bar = document.querySelector(".announcement-bar");
  if (!bar) return;
  bar.style.cssText =
    "opacity:0;transform:translateY(-100%);transition:opacity 0.3s,transform 0.3s";
  setTimeout(() => {
    bar.remove();
    document.body.classList.remove("has-announcement");
    document.documentElement.style.removeProperty("--bar-h");
  }, 300);
}

// ── Stats animados ───────────────────────────────────────────
function animarContador(el, target, ms, suffix) {
  const step = target / (ms / 16);
  let val = 0;
  const t = setInterval(() => {
    val = Math.min(val + step, target);
    el.textContent = Math.floor(val) + suffix;
    if (val >= target) clearInterval(t);
  }, 16);
}

function initStats() {
  const bar = document.querySelector(".stats-bar");
  if (!bar) return;
  new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target
          .querySelectorAll("[data-count]")
          .forEach((el) =>
            animarContador(
              el,
              parseFloat(el.dataset.count),
              1400,
              el.dataset.suffix || "",
            ),
          );
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  ).observe(bar);
}

// ── IntersectionObserver — scroll animations ─────────────────
function initScrollAnimations() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
  );
  $$(".anim, .anim-left, .anim-right").forEach((el) => obs.observe(el));
}

// ── Carrusel testimonios ─────────────────────────────────────
(function () {
  let track,
    total,
    current = 0,
    autoTimer;

  function init() {
    track = document.querySelector(".testimonios-track");
    if (!track) return;
    total = track.children.length;
    renderDots();
    update();
    autoTimer = setInterval(() => mover(1), 5500);

    // Swipe en testimonios
    let sx = 0;
    track.addEventListener(
      "touchstart",
      (e) => {
        sx = e.touches[0].clientX;
        clearInterval(autoTimer);
      },
      { passive: true },
    );
    track.addEventListener("touchend", (e) => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) mover(diff > 0 ? 1 : -1);
      autoTimer = setInterval(() => mover(1), 5500);
    });
  }

  function renderDots() {
    const c = document.querySelector(".testimonios-dots");
    if (!c) return;
    c.innerHTML = [...Array(total)]
      .map(
        (_, i) =>
          `<span class="dot${i === 0 ? " active" : ""}" onclick="irATestimonio(${i})"></span>`,
      )
      .join("");
  }

  function update() {
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    $$(".testimonios-dots .dot").forEach((d, i) =>
      d.classList.toggle("active", i === current),
    );
  }

  function mover(dir) {
    current = (current + dir + total) % total;
    update();
  }

  window.prevTestimonio = () => {
    mover(-1);
  };
  window.nextTestimonio = () => {
    mover(1);
  };
  window.irATestimonio = (i) => {
    current = i;
    update();
  };

  document.addEventListener("DOMContentLoaded", init);
})();

// ── Routing y arranque ────────────────────────────────────────
function rutearHash() {
  const rutas = {
    productos: mostrarProductos,
    contacto: mostrarContacto,
    proyectos: mostrarProyectos,
    carrito: mostrarCarritoManual,
  };
  (rutas[window.location.hash.slice(1)] || mostrarInicio)();
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  initSwipe();
  initStats();
  initAnnouncementBar();
  rutearHash();
});

window.addEventListener("hashchange", rutearHash);

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
