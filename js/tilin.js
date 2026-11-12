// ============================================================
//  TILIN FL — rediseño 2026-11
//  Selector por peso, pedido por WhatsApp (5 números), promo
//  de 6 unidades y Tilín, la mascota de la página.
// ============================================================

const TILIN = {
  p: { nombre: "Tilin Perros 4.5 a 10 kg", titulo: "Tilin FL Pequeño", rango: "Para perros de 4.5 a 10 kg", img: "images/tilin-pequeno.webp", unidad: 35, promo: 25, flu: "250 mg", sil: "50 mg" },
  m: { nombre: "Tilin Perros 10 a 20 kg", titulo: "Tilin FL Mediano", rango: "Para perros de 10 a 20 kg", img: "images/tilin-mediano.webp", unidad: 40, promo: 27.5, flu: "560 mg", sil: "100 mg" },
  g: { nombre: "Tilin Perros 20 a 40 kg", titulo: "Tilin FL Grande", rango: "Para perros de 20 a 40 kg", img: "images/tilin-grande.webp", unidad: 45, promo: 30, flu: "1000 mg", sil: "200 mg" },
};
const PACK360 = [
  { peso: "4.5 a 10 kg", incluye: "1 tableta interna + 1 antipulgas", precio: 45 },
  { peso: "10 a 20 kg", incluye: "2 tabletas internas + 1 antipulgas", precio: 50 },
  { peso: "20 a 40 kg", incluye: "4 tabletas internas + 1 antipulgas", precio: 60 },
];
const MATAX = [
  { nombre: "Matax Mata Cucarachas", texto: "Elimina adultos y larvas e inhibe su reproducción.", img: "images/cucarachas.png", precio: 9.9 },
  { nombre: "Matax Mata Hormigas", texto: "Controla colonias con protección duradera.", img: "images/hormigas.png", precio: 9.9 },
];
const NUMEROS = ["984455040", "963195119", "967810477", "969780198", "969382661"];

const $ = (id) => document.getElementById(id);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
const soles = (n) => `S/ ${n.toFixed(2)}`;
const fmtNum = (n) => `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
const leer = (k) => { try { return localStorage.getItem(k); } catch (_) { return null; } };

// ── Pedido ────────────────────────────────────────────────────
// Cada línea: { clave, nombre, precio, producto, unidades, cant }
let pedido = [];
try { pedido = JSON.parse(leer("tilin-pedido") || "[]"); if (!Array.isArray(pedido)) pedido = []; } catch (_) { pedido = []; }
let numero = NUMEROS.includes(leer("tilin-wa")) ? leer("tilin-wa") : "";

function agregar(linea) {
  const ya = pedido.find((l) => l.clave === linea.clave);
  if (ya) ya.cant += 1; else pedido.push({ ...linea, cant: 1 });
  guardar("tilin-pedido", JSON.stringify(pedido));
  pintarPedido(true);
  avisar("Agregado a tu pedido");
  Mascota.decir("¡Guau! Ya está en tu pedido.", "salta");
}

// Promo media docena: desde 6 unidades del mismo tamaño, cada unidad suelta pasa al precio promo.
function lineasConPrecio() {
  const unidades = {};
  pedido.forEach((l) => { unidades[l.producto] = (unidades[l.producto] || 0) + (l.unidades || 0) * l.cant; });
  return pedido.map((l) => {
    const t = Object.values(TILIN).find((x) => x.nombre === l.producto);
    const promo = l.unidades === 1 && t && unidades[l.producto] >= 6;
    return { ...l, precio: promo ? t.promo : l.precio, promo };
  });
}

function pintarPedido(salto) {
  const lineas = lineasConPrecio();
  const total = lineas.reduce((s, l) => s + l.precio * l.cant, 0);
  const cuenta = pedido.reduce((s, l) => s + l.cant, 0);
  $$(".contador").forEach((el) => {
    el.textContent = cuenta;
    if (salto) { el.classList.remove("salta"); void el.offsetWidth; el.classList.add("salta"); }
  });
  $("barra-total").textContent = soles(total);
  $("pedido-total").textContent = soles(total);
  document.body.classList.toggle("con-pedido", cuenta > 0);

  const lista = $("pedido-lista");
  lista.textContent = "";
  const btn = $("btn-whatsapp");
  if (!cuenta) {
    lista.innerHTML = `<li class="vacio"><svg><use href="#i-bolsa"/></svg><p>Tu pedido está vacío.</p><a href="#elegir" data-cerrar>Elegir según su peso</a></li>`;
    btn.setAttribute("aria-disabled", "true");
    btn.href = "#";
    return;
  }
  btn.removeAttribute("aria-disabled");

  lineas.forEach((l, i) => {
    const li = document.createElement("li");
    const nom = document.createElement("span");
    nom.className = "item-nombre";
    nom.textContent = l.nombre;
    if (l.promo) {
      const em = document.createElement("span");
      em.className = "item-promo";
      em.textContent = "Precio promo desde 6 unidades";
      nom.appendChild(em);
    }
    const pr = document.createElement("span");
    pr.className = "item-precio";
    pr.textContent = soles(l.precio * l.cant);
    const cant = document.createElement("div");
    cant.className = "cantidad";
    cant.innerHTML = `<button type="button" aria-label="Quitar uno"><svg><use href="#i-menos"/></svg></button><span aria-live="polite">${l.cant}</span><button type="button" aria-label="Agregar uno"><svg><use href="#i-mas"/></svg></button>`;
    const [menos, mas] = cant.querySelectorAll("button");
    menos.onclick = () => cambiarCant(i, -1);
    mas.onclick = () => cambiarCant(i, 1);
    li.append(nom, pr, cant);
    lista.appendChild(li);
  });

  const msg = encodeURIComponent(
    `Hola, quiero hacer este pedido:\n${lineas.map((l) => `- ${l.cant} x ${l.nombre} (${soles(l.precio)} c/u${l.promo ? ", promo desde 6 unid." : ""})`).join("\n")}\nTotal: ${soles(total)}`,
  );
  btn.href = numero ? `https://wa.me/51${numero}?text=${msg}` : "#";
  btn.onclick = (e) => {
    e.preventDefault();
    if (!numero) { pedirNumero(); return; }
    const ir = () => { window.location.href = btn.href; };
    if (typeof gtag !== "undefined") {
      gtag("event", "conversion", { send_to: "AW-17490215386/mUR0CMH9-IgbENqD_pNB", value: total, currency: "PEN", event_callback: ir });
      setTimeout(ir, 1000);
    } else ir();
  };
}

function cambiarCant(i, d) {
  pedido[i].cant += d;
  if (pedido[i].cant <= 0) pedido.splice(i, 1);
  guardar("tilin-pedido", JSON.stringify(pedido));
  pintarPedido();
}

function pedirNumero() {
  const caja = $("numeros");
  caja.classList.remove("tiembla"); void caja.offsetWidth; caja.classList.add("tiembla");
  $("numeros-titulo").textContent = "Elige un número para continuar";
}

function pintarNumeros() {
  const cont = $("numeros-lista");
  NUMEROS.forEach((n) => {
    const l = document.createElement("label");
    l.innerHTML = `<input type="radio" name="numero" value="${n}" ${n === numero ? "checked" : ""}><span>${fmtNum(n)}</span>`;
    cont.appendChild(l);
  });
  cont.addEventListener("change", (e) => {
    numero = e.target.value;
    guardar("tilin-wa", numero);
    $("numeros-titulo").textContent = "¿A qué número quieres escribir?";
    pintarPedido();
  });
}

let ultimoFoco = null;
function abrirPedido() {
  ultimoFoco = document.activeElement;
  pintarPedido();
  $("pedido").classList.add("abierto");
  $("pedido").setAttribute("aria-hidden", "false");
  $("velo").classList.add("abierto");
  document.body.classList.add("sin-scroll");
  Mascota.esconder(true);
  setTimeout(() => $("cerrar-pedido").focus(), 60);
}
function cerrarPedido() {
  if (!$("pedido").classList.contains("abierto")) return;
  $("pedido").classList.remove("abierto");
  $("pedido").setAttribute("aria-hidden", "true");
  $("velo").classList.remove("abierto");
  document.body.classList.remove("sin-scroll");
  Mascota.esconder(false);
  ultimoFoco?.focus?.();
}

// Deslizar hacia abajo para cerrar la hoja en celular
function arrastreHoja() {
  const hoja = $("pedido");
  let y0 = null, dy = 0, t0 = 0;
  hoja.addEventListener("pointerdown", (e) => {
    if (innerWidth >= 980 || !e.target.closest(".pedido-asa, .pedido-cabeza")) return;
    y0 = e.clientY; dy = 0; t0 = performance.now();
    hoja.setPointerCapture(e.pointerId);
    hoja.style.transition = "none";
  });
  hoja.addEventListener("pointermove", (e) => {
    if (y0 === null) return;
    dy = Math.max(0, e.clientY - y0);
    hoja.style.transform = `translateY(${dy}px)`;
  });
  const fin = () => {
    if (y0 === null) return;
    const vel = dy / Math.max(1, performance.now() - t0);
    hoja.style.transition = "";
    hoja.style.transform = "";
    if (dy > 120 || vel > 0.5) cerrarPedido();
    y0 = null;
  };
  hoja.addEventListener("pointerup", fin);
  hoja.addEventListener("pointercancel", fin);
}

// ── Selector por peso ───────────────────────────────────────
let talla = "m";
function tallaDe(kg) { return kg < 10 ? "p" : kg < 20 ? "m" : "g"; }

function mostrarTalla(t, anima = true) {
  const d = TILIN[t];
  const cambio = t !== talla;
  talla = t;
  $$(".tallas button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.talla === t)));
  $("res-nombre").textContent = d.titulo;
  $("res-rango").textContent = d.rango;
  $("res-flu").textContent = d.flu;
  $("res-sil").textContent = d.sil;
  $("res-unidad").textContent = soles(d.unidad);
  $("res-pack").textContent = soles(d.promo * 6);
  $("res-cu").textContent = `${soles(d.promo)} c/u`;
  $("res-ahorro").textContent = `Ahorras S/ ${(d.unidad * 6 - d.promo * 6).toFixed(0)}`;
  const img = $("res-img");
  if (cambio && anima && !sinMovimiento) {
    img.classList.add("cambia");
    setTimeout(() => {
      img.src = d.img;
      img.alt = `Caja de ${d.titulo}`;
      requestAnimationFrame(() => img.classList.remove("cambia"));
    }, 180);
  } else {
    img.src = d.img;
    img.alt = `Caja de ${d.titulo}`;
  }
  if (cambio) Mascota.decir(t === "p" ? "¡Los chiquitos también se protegen!" : t === "m" ? "¡Ese es mi tamaño!" : "¡Para los grandotes, la caja verde!", "mira");
}

function fijarPeso(kg, anima = true) {
  const r = $("peso");
  r.value = kg;
  pintarPeso(anima);
}

function pintarPeso(anima = true) {
  const r = $("peso");
  const kg = Number(r.value);
  const pct = ((kg - r.min) / (r.max - r.min)) * 100;
  r.style.setProperty("--pct", `${pct}%`);
  $("peso-numero").querySelector("b").textContent = Number.isInteger(kg) ? kg : kg.toFixed(1);
  mostrarTalla(tallaDe(kg), anima);
}

function initSelector() {
  const r = $("peso");
  r.addEventListener("input", () => pintarPeso());
  $$(".tallas button").forEach((b) => b.addEventListener("click", () => fijarPeso(Number(b.dataset.peso))));
  $$(".abanico .caja").forEach((b) =>
    b.addEventListener("click", () => {
      fijarPeso(Number(b.dataset.peso), false);
      $("elegir").scrollIntoView({ behavior: sinMovimiento ? "auto" : "smooth" });
    }),
  );
  $("res-agregar").addEventListener("click", () => {
    const d = TILIN[talla];
    const seis = document.querySelector('input[name="cantidad"]:checked')?.value === "6";
    agregar(
      seis
        ? { clave: `${talla}-6`, nombre: `${d.titulo} · Pack de 6 (${soles(d.promo)} c/u)`, precio: d.promo * 6, producto: d.nombre, unidades: 6 }
        : { clave: `${talla}-1`, nombre: `${d.titulo} · Unidad`, precio: d.unidad, producto: d.nombre, unidades: 1 },
    );
  });
  pintarPeso(false);
}

// ── Pack 360 y Matax ────────────────────────────────────────
function pintarPack() {
  const ul = $("pack-lista");
  PACK360.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<div><b>${p.peso}</b><small>${p.incluye}</small></div><span class="precio">${soles(p.precio)}</span><button type="button" class="btn-mas" aria-label="Agregar Pack 360 de ${p.peso}"><svg><use href="#i-mas"/></svg></button>`;
    li.querySelector("button").onclick = () =>
      agregar({ clave: `pack-${i}`, nombre: `Pack Tilin 360° · ${p.peso}`, precio: p.precio, producto: "PACK TILIN 360", unidades: 0 });
    ul.appendChild(li);
  });
}

function pintarMatax() {
  const cont = $("matax-lista");
  MATAX.forEach((m, i) => {
    const opciones = [{ t: "Unidad", n: 1 }, { t: "6 unid.", n: 6 }, { t: "12 unid.", n: 12 }];
    let elegida = 0;
    const art = document.createElement("article");
    art.className = "producto";
    art.setAttribute("data-revela", "");
    art.innerHTML = `
      <img src="${m.img}" alt="${m.nombre}" loading="lazy" width="1587" height="2245">
      <div class="producto-info">
        <h3>${m.nombre}</h3>
        <p>${m.texto}</p>
        <div class="segmento" role="group" aria-label="Cantidad de ${m.nombre}">
          ${opciones.map((o, k) => `<button type="button" aria-pressed="${k === 0}">${o.t}</button>`).join("")}
        </div>
        <div class="producto-pie"><strong>${soles(m.precio)}</strong><button type="button" class="btn-mas" aria-label="Agregar ${m.nombre}"><svg><use href="#i-mas"/></svg></button></div>
      </div>`;
    const precio = art.querySelector("strong");
    art.querySelectorAll(".segmento button").forEach((b, k) =>
      b.addEventListener("click", () => {
        elegida = k;
        art.querySelectorAll(".segmento button").forEach((x, j) => x.setAttribute("aria-pressed", String(j === k)));
        precio.textContent = soles(m.precio * opciones[k].n);
      }),
    );
    art.querySelector(".btn-mas").onclick = () => {
      const o = opciones[elegida];
      agregar({ clave: `matax-${i}-${o.n}`, nombre: `${m.nombre} · ${o.t}`, precio: m.precio * o.n, producto: m.nombre, unidades: 0 });
    };
    cont.appendChild(art);
  });
}

// ── Opiniones ───────────────────────────────────────────────
function initOpiniones() {
  const pista = $("pista");
  const paso = () => pista.querySelector("li").getBoundingClientRect().width + 12;
  $("op-ant").onclick = () => pista.scrollBy({ left: -paso(), behavior: "smooth" });
  $("op-sig").onclick = () => pista.scrollBy({ left: paso(), behavior: "smooth" });
}

// ── Menú, cabecera y abanico ────────────────────────────────
function toggleMenu(forzar) {
  const menu = $("menu");
  const abrir = forzar ?? !menu.classList.contains("abierto");
  menu.classList.toggle("abierto", abrir);
  menu.setAttribute("aria-hidden", String(!abrir));
  $("btn-menu").setAttribute("aria-expanded", String(abrir));
  $("btn-menu").setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  $("cabecera").classList.toggle("con-fondo", abrir || scrollY > 20);
  document.body.classList.toggle("sin-scroll", abrir);
  Mascota.esconder(abrir);
}

function initScroll() {
  const cab = $("cabecera");
  const abanico = $("abanico");
  let pendiente = false;
  const correr = () => {
    pendiente = false;
    if (!$("menu").classList.contains("abierto")) cab.classList.toggle("con-fondo", scrollY > 20);
    abanico.classList.toggle("abre", scrollY > 40 && scrollY < innerHeight * 1.2);
  };
  addEventListener("scroll", () => { if (!pendiente) { pendiente = true; requestAnimationFrame(correr); } }, { passive: true });
  correr();
}

function initRevela() {
  const els = $$("[data-revela]");
  if (sinMovimiento || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("visible")); return; }
  const obs = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
  }), { threshold: 0.15 });
  els.forEach((e) => obs.observe(e));
}

function avisar(texto) {
  const a = $("aviso");
  a.textContent = texto;
  a.classList.add("ver");
  clearTimeout(a._t);
  a._t = setTimeout(() => a.classList.remove("ver"), 2000);
}

// ── Tilín, la mascota ───────────────────────────────────────
// Se sienta abajo a la izquierda, saluda al entrar, comenta lo que pasa y
// se puede tocar. Nunca tapa botones: se esconde con el menú y el pedido.
const Mascota = (() => {
  let el, globo, timer, listo = false;
  const FRASES_TOQUE = [
    "¡Hola! Soy Tilín. Una pastilla y 3 meses sin pulgas.",
    "Si no sabes la dosis, mueve la barra de peso.",
    "¡Me encanta que me rasquen la panza!",
    "El pack de 6 sale más barato por unidad.",
    "¿Dudas? Escríbenos por WhatsApp.",
  ];
  let iToque = 0;
  const SECCIONES = {
    elegir: "Dime cuánto pesa tu perro y te digo cuál es.",
    pack360: "El Pack 360° protege por dentro y por fuera.",
    matax: "Esto es para la casa, no para mí.",
    opiniones: "Mira lo que dicen mis amigos.",
    envios: "Llegamos a todo el Perú.",
  };
  const dichas = new Set();

  function crear() {
    el = document.createElement("button");
    el.type = "button";
    el.className = "mascota";
    el.setAttribute("aria-label", "Tilín, la mascota. Tócalo para un consejo");
    el.innerHTML = `<span class="mascota-globo" role="status" aria-live="polite"></span><span class="mascota-cuerpo"><img src="images/mascota.webp" alt="" width="240" height="300"></span>`;
    document.body.appendChild(el);
    globo = el.querySelector(".mascota-globo");
    el.addEventListener("click", () => decir(FRASES_TOQUE[iToque++ % FRASES_TOQUE.length], "salta"));
  }

  function decir(texto, gesto = "mira") {
    if (!listo || !el) return;
    globo.textContent = texto;
    el.classList.add("habla");
    el.classList.remove("salta", "mira"); void el.offsetWidth; el.classList.add(gesto);
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove("habla"), 3600);
  }

  function esconder(si) { el?.classList.toggle("escondida", !!si); }

  function vigilarSecciones() {
    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver((ents) => ents.forEach((e) => {
      const id = e.target.id;
      if (e.isIntersecting && !dichas.has(id)) { dichas.add(id); decir(SECCIONES[id]); }
    }), { threshold: 0.45 });
    Object.keys(SECCIONES).forEach((id) => $(id) && obs.observe($(id)));
  }

  function iniciar() {
    crear();
    requestAnimationFrame(() => el.classList.add("entra"));
    setTimeout(() => {
      listo = true;
      decir("¡Hola! Soy Tilín. Tócame si necesitas ayuda.", "salta");
      vigilarSecciones();
    }, 900);
  }
  return { iniciar, decir, esconder };
})();

// ── Pantalla de carga ───────────────────────────────────────
function initCarga(alTerminar) {
  const carga = $("carga");
  const visto = document.documentElement.classList.contains("visto");
  const minimo = sinMovimiento ? 0 : visto ? 450 : 1650;
  const t0 = performance.now();
  let hecho = false;
  const terminar = () => {
    if (hecho) return;
    hecho = true;
    setTimeout(() => {
      carga.classList.add("sale");
      document.body.classList.remove("cargando");
      setTimeout(() => document.body.classList.add("listo"), sinMovimiento ? 0 : 260);
      setTimeout(() => { carga.classList.add("fuera"); alTerminar(); }, sinMovimiento ? 0 : 760);
      try { sessionStorage.setItem("tilin-visto", "1"); } catch (_) {}
    }, Math.max(0, minimo - (performance.now() - t0)));
  };
  if (document.readyState === "complete") terminar();
  else addEventListener("load", terminar);
  setTimeout(terminar, 4500);
}

// Enlaces antiguos (#carrito, #productos)
function rutear() {
  if (location.hash === "#carrito") { abrirPedido(); history.replaceState(null, "", location.pathname); }
  else if (location.hash === "#productos") $("elegir")?.scrollIntoView();
}

document.addEventListener("DOMContentLoaded", () => {
  initSelector();
  pintarPack();
  pintarMatax();
  pintarNumeros();
  pintarPedido();
  initOpiniones();
  initScroll();
  arrastreHoja();

  $("btn-menu").addEventListener("click", () => toggleMenu());
  $("menu").addEventListener("click", (e) => { if (e.target.closest("a")) toggleMenu(false); });
  $("abrir-pedido").addEventListener("click", abrirPedido);
  $("barra-pedido").addEventListener("click", abrirPedido);
  $("cerrar-pedido").addEventListener("click", cerrarPedido);
  $("velo").addEventListener("click", cerrarPedido);
  $("pedido").addEventListener("click", (e) => { if (e.target.closest("[data-cerrar]")) cerrarPedido(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") { cerrarPedido(); toggleMenu(false); } });

  initCarga(() => {
    initRevela();
    Mascota.iniciar();
    rutear();
  });
});
addEventListener("hashchange", rutear);
