// ============================================================
//  TILIN FL — script.js  (scroll continuo + carrito por WhatsApp)
// ============================================================

const productos = [
  {
    nombre: "Tilin Perros 4.5 a 10 kg",
    categoria: "perros",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 4.5 a 10 kg. Protección eficaz para perros pequeños y medianos. DURANTE 3 MESES.",
    imagen: "images/Perros-4.5-10kg.jpg",
    posicion: "50% 78%",
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
    categoria: "perros",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 10 a 20 kg. Ideal para razas medianas. DURANTE 3 MESES.",
    imagen: "images/Perros-10-20kg.jpg",
    posicion: "50% 78%",
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
    categoria: "perros",
    descripcion:
      "Pastilla antipulgas, garrapatas y ácaros para perros de 20 a 40 kg. Protección avanzada para perros grandes. DURANTE 3 MESES.",
    imagen: "images/Perros-20-40kg.jpg",
    posicion: "50% 78%",
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
    categoria: "perros",
    descripcion:
      "Protección total: contra pulgas, garrapatas, ácaros y parásitos internos por hasta 3 meses continuos.",
    imagen: "images/TILIN360.png",
    posicion: "50% 55%",
    opciones: [
      { tipo: "4.5–10 kg: 1 tableta interna + 1 antipulgas ", precio: 45 },
      { tipo: "10–20 kg: 2 tabletas internas + 1 antipulgas ", precio: 50 },
      { tipo: "20–40 kg: 4 tabletas internas + 1 antipulgas ", precio: 60 },
    ],
  },
  {
    nombre: "MATAX: MATA CUCARACHAS",
    categoria: "hogar",
    descripcion:
      "Insecticida potente contra cucarachas. Elimina adultos y larvas, inhibe la reproducción. Control efectivo y de larga duración.",
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
    categoria: "hogar",
    descripcion:
      "Spray MATAX para hormigas. Controla colonias, bloquea la reproducción y ofrece protección duradera en interiores y exteriores.",
    imagen: "images/hormigas.png",
    posicion: "50% 60%",
    opciones: [
      { tipo: "Unidad", precio: 9.9 },
      { tipo: "Media docena (6 unid.)", precio: 59.4 },
      { tipo: "Docena (12 unid.)", precio: 118.8 },
    ],
  },
];

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
  mostrarToast("Producto agregado al carrito");
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
    lista.innerHTML = `<li class="cart-empty" style="display:block;border:0">
      <p>Tu carrito está vacío</p>
      <a href="#productos" data-close-cart>Ver productos</a>
    </li>`;
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

function mostrarToast(msg) {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
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
      cerrarVideo();
    }
  });
  actualizarContadorCarrito();
  renderCarrito();
}

// ── Catálogo ─────────────────────────────────────────────────
function renderCatalogo() {
  const grid = $("catalog-grid");
  if (!grid) return;

  productos.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "p-card";
    card.dataset.cat = p.categoria;
    card.setAttribute("data-reveal", "");
    card.style.setProperty("--d", `${(i % 3) * 0.12}s`);

    const media = document.createElement("div");
    media.className = "p-media";
    const img = document.createElement("img");
    img.src = p.imagen;
    img.alt = p.nombre;
    img.loading = "lazy";
    img.style.objectPosition = p.posicion;
    const num = document.createElement("span");
    num.className = "p-num";
    num.textContent = String(i + 1).padStart(2, "0");
    media.append(img, num);

    const body = document.createElement("div");
    body.className = "p-body";
    const h3 = document.createElement("h3");
    h3.textContent = p.nombre;
    const desc = document.createElement("p");
    desc.textContent = p.descripcion;

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
    foot.className = "p-foot";
    const price = document.createElement("span");
    price.className = "p-price";
    price.textContent = `S/ ${p.opciones[0].precio.toFixed(2)}`;
    const add = document.createElement("button");
    add.className = "btn btn-fill";
    add.textContent = "Agregar +";
    foot.append(price, add);

    select.addEventListener("change", () => {
      price.textContent = `S/ ${p.opciones[Number(select.value)].precio.toFixed(2)}`;
    });
    add.addEventListener("click", () =>
      agregarAlCarrito(i, Number(select.value)),
    );

    body.append(h3, desc, select, foot);
    card.append(media, body);
    grid.appendChild(card);
  });

  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.toggle("active", c === chip));
      const f = chip.dataset.filter;
      $$(".p-card").forEach((c) => {
        c.hidden = !(f === "todos" || c.dataset.cat === f);
        if (!c.hidden) c.classList.add("in");
      });
    }),
  );
}

// ── Texto dividido en palabras (animación de títulos) ────────
function splitWords(el) {
  let i = 0;
  const walk = (node, parent) => {
    node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) {
            parent.appendChild(document.createTextNode(" "));
            return;
          }
          const w = document.createElement("span");
          w.className = "w";
          w.setAttribute("aria-hidden", "true");
          const s = document.createElement("span");
          s.textContent = tok;
          s.style.setProperty("--i", i++);
          w.appendChild(s);
          parent.appendChild(w);
        });
      } else if (n.nodeName === "BR") {
        parent.appendChild(document.createElement("br"));
      } else if (n.nodeType === 1) {
        const c = n.cloneNode(false);
        parent.appendChild(c);
        walk(n, c);
      }
    });
  };
  const label = el.textContent.replace(/\s+/g, " ").trim();
  const frag = document.createElement("div");
  walk(el, frag);
  el.setAttribute("aria-label", label);
  el.innerHTML = "";
  while (frag.firstChild) el.appendChild(frag.firstChild);
}

// ── Revelado al hacer scroll ─────────────────────────────────
function initReveal() {
  $$("[data-split]").forEach(splitWords);
  const targets = $$("[data-reveal], [data-split]");
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
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  targets.forEach((t) => obs.observe(t));
}

// ── Contadores ───────────────────────────────────────────────
function animarContador(el, target, ms, suffix) {
  const t0 = performance.now();
  const tick = (now) => {
    const p = clamp((now - t0) / ms, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function initStats() {
  const nums = $$("[data-count]");
  if (!nums.length || reducedMotion) return;
  nums.forEach((el) => {
    el.textContent = "0" + (el.dataset.suffix || "");
  });
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        animarContador(
          el,
          parseFloat(el.dataset.count),
          1600,
          el.dataset.suffix || "",
        );
        obs.unobserve(el);
      });
    },
    { threshold: 0.6 },
  );
  nums.forEach((n) => obs.observe(n));
}

// ── Escena fijada: protección por tamaño ─────────────────────
function initPin() {
  const section = document.querySelector("[data-pin]");
  if (!section) return;
  const imgs = $$(".pin-stage img", section);
  const steps = $$(".pin-steps button", section);
  const kgs = ["4.5 — 10 kg", "10 — 20 kg", "20 — 40 kg"];
  const bar = $("pin-bar");
  let current = -1;

  const setStep = (i) => {
    if (i === current) return;
    current = i;
    imgs.forEach((im, k) => im.classList.toggle("active", k === i));
    steps.forEach((b, k) => b.classList.toggle("active", k === i));
    $("pin-num").textContent = String(i + 1).padStart(2, "0");
    $("pin-kg").textContent = kgs[i];
  };

  const update = () => {
    const rect = section.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = clamp(-rect.top / total, 0, 1);
    bar.style.transform = `scaleX(${p})`;
    setStep(clamp(Math.floor(p * 3), 0, 2));
  };

  steps.forEach((b) =>
    b.addEventListener("click", () => {
      const i = Number(b.dataset.step);
      const total = section.offsetHeight - window.innerHeight;
      const top = section.offsetTop + ((i + 0.5) / 3) * total;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
    }),
  );

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// ── Parallax suave + header ──────────────────────────────────
function initScrollFx() {
  const header = $("site-header");
  const heroImg = document.querySelector(".hero-media img");
  const doc = document.querySelector(".doctor-photo img");
  const docWrap = document.querySelector(".doctor");
  let ticking = false;

  const run = () => {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    if (reducedMotion) return;
    if (heroImg && y < window.innerHeight * 1.2) {
      document.documentElement.style.setProperty("--py", `${y * 0.12}px`);
    }
    if (doc && docWrap) {
      const r = docWrap.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        doc.style.setProperty("--dy", `${(0.5 - p) * 60}px`);
      }
    }
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
  run();
}

// ── Navegación ───────────────────────────────────────────────
function initNav() {
  const burger = $("burger");
  const links = $("nav-links");

  const toggle = (force) => {
    const open = force ?? !links.classList.contains("open");
    links.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  };
  burger.addEventListener("click", () => toggle());
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) toggle(false);
  });

  // Enlace activo según la sección visible
  const map = {};
  $$("[data-nav]").forEach((a) => (map[a.dataset.nav] = a));
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        Object.values(map).forEach((a) => a.classList.remove("active"));
        map[e.target.id]?.classList.add("active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  Object.keys(map).forEach((id) => {
    const s = $(id);
    if (s) obs.observe(s);
  });

  // Barra de anuncio
  $("announce-close").addEventListener("click", () =>
    $("announce").classList.add("closed"),
  );
}

// ── Opiniones (carrusel con scroll-snap) ─────────────────────
function initReviews() {
  const track = $("reviews-track");
  if (!track) return;
  const cards = $$(".review", track);
  const count = $("reviews-count");
  const bar = $("rev-bar");

  const step = () =>
    cards[0].getBoundingClientRect().width +
    parseFloat(getComputedStyle(track).columnGap || 0);

  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    bar.style.transform = `scaleX(${Math.max(p, 0.06)})`;
    const idx = clamp(Math.round(track.scrollLeft / step()), 0, cards.length - 1);
    count.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
  };

  $("rev-prev").addEventListener("click", () =>
    track.scrollBy({ left: -step(), behavior: "smooth" }),
  );
  $("rev-next").addEventListener("click", () =>
    track.scrollBy({ left: step(), behavior: "smooth" }),
  );
  track.addEventListener("scroll", update, { passive: true });
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") track.scrollBy({ left: step(), behavior: "smooth" });
    if (e.key === "ArrowLeft") track.scrollBy({ left: -step(), behavior: "smooth" });
  });

  // Arrastrar con el mouse
  let down = false,
    startX = 0,
    startLeft = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    track.classList.add("dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (!down) return;
    track.scrollLeft = startLeft - (e.clientX - startX);
  });
  window.addEventListener("pointerup", () => {
    if (!down) return;
    down = false;
    track.classList.remove("dragging");
  });
  update();
}

// ── Video (modal, se carga solo al abrirlo) ──────────────────
function abrirVideo() {
  const v = $("modal-video");
  if (!v.getAttribute("src")) v.src = "images/manopatita.mp4";
  $("video-modal").classList.add("open");
  $("video-modal").setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  v.play().catch(() => {});
}
function cerrarVideo() {
  const modal = $("video-modal");
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  $("modal-video").pause();
  document.body.classList.remove("no-scroll");
}
function initVideo() {
  $("open-video").addEventListener("click", abrirVideo);
  $("close-video").addEventListener("click", cerrarVideo);
  $("video-modal").addEventListener("click", (e) => {
    if (e.target === $("video-modal")) cerrarVideo();
  });
}

// ── Pantalla de carga ────────────────────────────────────────
function initLoading(onDone) {
  const screen = $("loading-screen");
  const t0 = performance.now();
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    const wait = Math.max(0, 700 - (performance.now() - t0));
    setTimeout(() => {
      screen.classList.add("hide");
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-ready");
      onDone();
    }, wait);
  };
  if (document.readyState === "complete") finish();
  else window.addEventListener("load", finish);
  setTimeout(finish, 4000);
}

// ── Compatibilidad con enlaces antiguos (#carrito) ───────────
function rutearHash() {
  if (location.hash === "#carrito") {
    abrirCarrito();
    history.replaceState(null, "", location.pathname);
  }
}

// ── Inicio ───────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCatalogo();
  initCarritoUI();
  initNav();
  initScrollFx();
  initPin();
  initReviews();
  initVideo();
  initLoading(() => {
    initReveal();
    initStats();
    rutearHash();
  });
});
window.addEventListener("hashchange", rutearHash);
