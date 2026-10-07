// ============================================================
//  TILIN FL — script.js  (minimalista + carrito por WhatsApp)
// ============================================================

const productos = [
  {
    nombre: "Tilin Perros 4.5 a 10 kg",
    grupo: "tilin",
    tipo: "cut",
    tag: "4.5 — 10 kg",
    cap: "Tilin FL Pequeño · Antipulgas, garrapatas y ácaros",
    imagen: "images/tilin-pequeno.webp",
    opciones: [
      { tipo: "Unidad", precio: 35 },
      { tipo: "PROMO: Docena (12 unid. a S/25 c/u)", precio: 300 },
      { tipo: "PROMO: 6 Docenas (72 unid. a S/25 c/u)", precio: 1800 },
      { tipo: "PROMO: 12 Docenas (144 unid. a S/25 c/u)", precio: 3600 },
      { tipo: "PROMO: 24 Docenas (288 unid. a S/25 c/u)", precio: 7200 },
    ],
  },
  {
    nombre: "Tilin Perros 10 a 20 kg",
    grupo: "tilin",
    tipo: "cut",
    tag: "10 — 20 kg",
    cap: "Tilin FL Mediano · Antipulgas, garrapatas y ácaros",
    imagen: "images/tilin-mediano.webp",
    opciones: [
      { tipo: "Unidad", precio: 40 },
      { tipo: "PROMO: Docena (12 unid. a S/27.50 c/u)", precio: 330 },
      { tipo: "PROMO: 6 Docenas (72 unid. a S/27.50 c/u)", precio: 1980 },
      { tipo: "PROMO: 12 Docenas (144 unid. a S/27.50 c/u)", precio: 3960 },
      { tipo: "PROMO: 24 Docenas (288 unid. a S/27.50 c/u)", precio: 7920 },
    ],
  },
  {
    nombre: "Tilin Perros 20 a 40 kg",
    grupo: "tilin",
    tipo: "cut",
    tag: "20 — 40 kg",
    cap: "Tilin FL Grande · Antipulgas, garrapatas y ácaros",
    imagen: "images/tilin-grande.webp",
    opciones: [
      { tipo: "Unidad", precio: 45 },
      { tipo: "PROMO: Docena (12 unid. a S/30 c/u) ", precio: 360 },
      { tipo: "PROMO: 6 Docenas (72 unid. a S/30 c/u) ", precio: 2160 },
      {
        tipo: "PROMO: 12 Docenas (144 unid + 1 DOC de Regalo. a S/30 c/u) ",
        precio: 4320,
      },
      {
        tipo: "PROMO: 24 Docenas (288 unid + 4 DOC de Regalo. a S/30 c/u) ",
        precio: 8640,
      },
    ],
  },
  {
    nombre: "PACK TILIN 360",
    grupo: "pack360",
    tipo: "cut wide",
    tag: "Pack 360°",
    cap: "Desparasitación total · Interna y externa",
    descripcion:
      "Protección total: contra pulgas, garrapatas, ácaros y parásitos internos por hasta 3 meses continuos.",
    imagen: "images/tilin-pack360.webp",
    opciones: [
      { tipo: "4.5–10 kg: 1 tableta interna + 1 antipulgas ", precio: 45 },
      { tipo: "10–20 kg: 2 tabletas internas + 1 antipulgas ", precio: 50 },
      { tipo: "20–40 kg: 4 tabletas internas + 1 antipulgas ", precio: 60 },
    ],
  },
  {
    nombre: "MATAX: MATA CUCARACHAS",
    grupo: "matax",
    tipo: "plate",
    tag: "Cucarachas",
    cap: "Matax · Elimina adultos y larvas",
    imagen: "images/cucarachas.png",
    posicion: "50% 60%",
    opciones: [
      { tipo: "Unidad", precio: 9.9 },
      { tipo: "Media docena (6 unid.)", precio: 59.4 },
      { tipo: "Docena (12 unid.)", precio: 118.8 },
    ],
  },
  {
    nombre: "MATAX: MATA HORMIGAS",
    grupo: "matax",
    tipo: "plate",
    tag: "Hormigas",
    cap: "Matax · Controla colonias",
    imagen: "images/hormigas.png",
    posicion: "50% 60%",
    opciones: [
      { tipo: "Unidad", precio: 9.9 },
      { tipo: "Media docena (6 unid.)", precio: 59.4 },
      { tipo: "Docena (12 unid.)", precio: 118.8 },
    ],
  },
];

// Números de ventas (el cliente elige a cuál escribir al finalizar el pedido)
const NUMEROS = [
  "984455040",
  "963195119",
  "967810477",
  "969780198",
  "969382661",
];
const fmtNum = (n) => `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
let numeroElegido = "";
try {
  const guardado = localStorage.getItem("tilin-wa") || "";
  if (NUMEROS.includes(guardado)) numeroElegido = guardado;
} catch (_) {}

const $ = (id) => document.getElementById(id);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

// ── Carrito ──────────────────────────────────────────────────
let carrito = [];
try {
  carrito = JSON.parse(localStorage.getItem("tilin-carrito") || "[]");
  if (!Array.isArray(carrito)) carrito = [];
} catch (_) {
  carrito = [];
}

function guardarCarrito() {
  try {
    localStorage.setItem("tilin-carrito", JSON.stringify(carrito));
  } catch (_) {}
}

function agregarAlCarrito(idx, opcionIdx) {
  const producto = productos[idx];
  const opcion = producto.opciones[opcionIdx];
  carrito.push({
    nombre: `${producto.nombre} — ${opcion.tipo}`,
    precio: opcion.precio,
  });
  guardarCarrito();
  actualizarContadorCarrito(true);
  renderCarrito();
  mostrarToast("Agregado al carrito");
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarContadorCarrito();
  renderCarrito();
}

function actualizarContadorCarrito(bump) {
  $$(".cart-count").forEach((el) => {
    el.textContent = carrito.length;
    if (bump) {
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    }
  });
}

function renderCarrito() {
  const lista = $("lista-carrito");
  const btn = $("whatsapp-btn");
  lista.innerHTML = "";

  if (carrito.length === 0) {
    lista.innerHTML = `<li class="cart-empty">
      <p>Tu carrito está vacío</p>
      <a href="#inicio" data-close-cart>Ver productos</a>
    </li>`;
    $("subtotal").textContent = "S/ 0.00";
    $("total-carrito").textContent = "S/ 0.00";
    btn.href = "#";
    btn.setAttribute("aria-disabled", "true");
    btn.onclick = (e) => e.preventDefault();
    return;
  }
  btn.removeAttribute("aria-disabled");

  let suma = 0;
  carrito.forEach((item, index) => {
    suma += item.precio;
    const li = document.createElement("li");
    const info = document.createElement("span");
    info.textContent = item.nombre;
    const precio = document.createElement("strong");
    precio.textContent = `S/ ${item.precio.toFixed(2)}`;
    info.appendChild(precio);
    const rm = document.createElement("button");
    rm.className = "rm";
    rm.setAttribute("aria-label", "Quitar del carrito");
    rm.textContent = "✕";
    rm.addEventListener("click", () => eliminarDelCarrito(index));
    li.append(info, rm);
    lista.appendChild(li);
  });

  const sumaStr = suma.toFixed(2);
  $("subtotal").textContent = `S/ ${sumaStr}`;
  $("total-carrito").textContent = `S/ ${sumaStr}`;

  const msg = encodeURIComponent(
    `Hola, quiero comprar:\n${carrito.map((p) => `- ${p.nombre} (S/ ${p.precio.toFixed(2)})`).join("\n")}\nTotal: S/ ${sumaStr}`,
  );
  btn.href = numeroElegido
    ? `https://wa.me/51${numeroElegido}?text=${msg}`
    : "#";

  btn.onclick = (e) => {
    e.preventDefault();
    if (!numeroElegido) {
      pedirNumero();
      return;
    }
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

function pedirNumero() {
  const box = $("wa-numbers");
  box.classList.remove("shake");
  void box.offsetWidth;
  box.classList.add("shake");
  $("wa-legend").textContent = "Elige un número para continuar";
  mostrarToast("Elige un número de ventas");
}

function renderNumeros() {
  const list = $("num-list");
  if (!list) return;
  NUMEROS.forEach((n) => {
    const label = document.createElement("label");
    label.className = "num";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "wa-num";
    input.value = n;
    input.checked = n === numeroElegido;
    const span = document.createElement("span");
    span.textContent = fmtNum(n);
    label.append(input, span);
    list.appendChild(label);
  });
  list.addEventListener("change", (e) => {
    numeroElegido = e.target.value;
    try {
      localStorage.setItem("tilin-wa", numeroElegido);
    } catch (_) {}
    $("wa-legend").textContent = "¿A qué número quieres escribir?";
    renderCarrito();
  });
}

function mostrarToast(msg) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ── Panel del carrito ────────────────────────────────────────
function abrirCarrito() {
  renderCarrito();
  $("drawer").classList.add("open");
  $("drawer").setAttribute("aria-hidden", "false");
  $("overlay").classList.add("open");
  document.body.classList.add("no-scroll");
}
function cerrarCarrito() {
  $("drawer").classList.remove("open");
  $("drawer").setAttribute("aria-hidden", "true");
  $("overlay").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function initCarritoUI() {
  $("open-cart").addEventListener("click", abrirCarrito);
  $("close-cart").addEventListener("click", cerrarCarrito);
  $("overlay").addEventListener("click", cerrarCarrito);
  $("drawer").addEventListener("click", (e) => {
    if (e.target.closest("[data-close-cart]")) cerrarCarrito();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      cerrarCarrito();
      toggleMenu(false);
    }
  });
  renderNumeros();
  actualizarContadorCarrito();
  renderCarrito();
}

// ── Productos ────────────────────────────────────────────────
function renderProductos() {
  productos.forEach((p, i) => {
    const cont = document.querySelector(`[data-group="${p.grupo}"]`);
    if (!cont) return;

    const item = document.createElement("article");
    item.className = `item ${p.tipo}`;
    item.setAttribute("data-reveal", "");
    item.style.setProperty("--d", `${(i % 3) * 0.14}s`);

    const media = document.createElement("div");
    media.className = "item-media";
    const img = document.createElement("img");
    img.src = p.imagen;
    img.alt = p.nombre;
    img.loading = i === 0 ? "eager" : "lazy";
    if (p.posicion) img.style.objectPosition = p.posicion;
    media.appendChild(img);

    const tag = document.createElement("p");
    tag.className = "tag";
    tag.textContent = p.tag;
    const cap = document.createElement("p");
    cap.className = "item-cap";
    cap.textContent = p.cap;

    const buy = document.createElement("div");
    buy.className = "buy";
    const select = document.createElement("select");
    select.className = "p-select";
    select.setAttribute("aria-label", `Opciones de ${p.nombre}`);
    p.opciones.forEach((o, k) => {
      const opt = document.createElement("option");
      opt.value = k;
      opt.textContent = `${o.tipo.trim()} — S/ ${o.precio.toFixed(2)}`;
      select.appendChild(opt);
    });
    const foot = document.createElement("div");
    foot.className = "buy-foot";
    const price = document.createElement("span");
    price.className = "p-price";
    price.textContent = `S/ ${p.opciones[0].precio.toFixed(2)}`;
    const add = document.createElement("button");
    add.className = "btn-line";
    add.textContent = "Agregar +";
    foot.append(price, add);
    buy.append(select, foot);

    select.addEventListener("change", () => {
      price.textContent = `S/ ${p.opciones[Number(select.value)].precio.toFixed(2)}`;
    });
    add.addEventListener("click", () =>
      agregarAlCarrito(i, Number(select.value)),
    );

    item.append(media, tag, cap);
    if (p.descripcion) {
      const desc = document.createElement("p");
      desc.className = "item-desc";
      desc.textContent = p.descripcion;
      item.appendChild(desc);
    }
    item.appendChild(buy);
    cont.appendChild(item);
  });
}

// ── Menú ─────────────────────────────────────────────────────
function toggleMenu(force) {
  const menu = $("menu");
  const btn = $("menu-btn");
  const open = force ?? !menu.classList.contains("open");
  menu.classList.toggle("open", open);
  menu.setAttribute("aria-hidden", String(!open));
  btn.setAttribute("aria-expanded", String(open));
  $("site-header").classList.toggle("menu-open", open);
  document.body.classList.toggle("no-scroll", open);
}

function initMenu() {
  $("menu-btn").addEventListener("click", () => toggleMenu());
  $("menu").addEventListener("click", (e) => {
    if (e.target.closest("a")) toggleMenu(false);
  });
}

// ── Palabra gigante: letras que suben ────────────────────────
function splitChars(el) {
  const text = el.textContent.trim();
  el.textContent = "";
  [...text].forEach((c, i) => {
    const ch = document.createElement("span");
    ch.className = c === " " ? "ch sp" : "ch";
    ch.setAttribute("aria-hidden", "true");
    const s = document.createElement("span");
    s.textContent = c === " " ? "\u00a0" : c;
    s.style.setProperty("--i", i);
    ch.appendChild(s);
    el.appendChild(ch);
  });
}

// ── Revelado al hacer scroll ─────────────────────────────────
function initReveal() {
  $$("[data-word]").forEach(splitChars);
  const targets = $$("[data-reveal], [data-word]");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("in"));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
  );
  targets.forEach((t) => obs.observe(t));
}

// ── Header + parallax de las palabras ────────────────────────
function initScrollFx() {
  const header = $("site-header");
  const scenes = $$(".bb");
  let ticking = false;

  const run = () => {
    ticking = false;
    header.classList.toggle("scrolled", window.scrollY > 30);
    if (reducedMotion) return;
    const vh = window.innerHeight;
    scenes.forEach((sc) => {
      const r = sc.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      sc.style.setProperty("--py", `${clamp(-r.top * 0.16, -160, 160)}px`);
    });
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(run);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", run);
  run();
}

// ── Opiniones (una a una) ────────────────────────────────────
function initOpiniones() {
  const quotes = $$(".quote");
  if (!quotes.length) return;
  let idx = 0;
  const count = $("q-count");
  const show = (n) => {
    idx = (n + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle("active", k === idx));
    count.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(quotes.length).padStart(2, "0")}`;
  };
  $("q-prev").addEventListener("click", () => show(idx - 1));
  $("q-next").addEventListener("click", () => show(idx + 1));
  show(0);
}

// ── Pantalla de carga ────────────────────────────────────────
function initLoading(onDone) {
  const screen = $("loading-screen");
  const t0 = performance.now();
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    const wait = Math.max(0, 600 - (performance.now() - t0));
    setTimeout(() => {
      screen.classList.add("hide");
      document.body.classList.remove("is-loading");
      onDone();
    }, wait);
  };
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(finish, 4000);
}

// ── Compatibilidad con enlaces antiguos ──────────────────────
function rutearHash() {
  const h = location.hash;
  if (h === "#carrito") {
    abrirCarrito();
    history.replaceState(null, "", location.pathname);
  } else if (h === "#productos") {
    $("tilin")?.scrollIntoView();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderProductos();
  initCarritoUI();
  initMenu();
  initScrollFx();
  initOpiniones();
  initLoading(() => {
    initReveal();
    rutearHash();
  });
});
window.addEventListener("hashchange", rutearHash);
