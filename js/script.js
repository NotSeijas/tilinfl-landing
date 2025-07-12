const products = [
  {
    title: "Tilin Cats",
    desc: "Pipeta antipulgas para gatos de hasta 8kg. Elimina pulgas y garrapatas, exclusivo para gatos. Aprox. 3ml.",
    img: "images/pipeta-cats.png",
    bg: "linear-gradient(to right, #a0e9f3, #008bd6)",
    color: "#008bd6",
  },
  {
    title: "Tilin Perros 10kg",
    desc: "Pipeta antipulgas para perros de hasta 10kg. Eficaz contra pulgas y garrapatas. Aprox. 1.5ml.",
    img: "images/tilin-pipeta-10.png",
    bg: "linear-gradient(to right, #ffc4c4, #ff6666)",
    color: "#d63031",
  },
  {
    title: "Tilin Perros 20kg",
    desc: "Pipeta antipulgas para perros de hasta 20kg. Ideal para razas medianas y grandes. Aprox. 3ml.",
    img: "images/tilin-grandes.png",
    bg: "linear-gradient(to right, #c7f5c4, #4caf50)",
    color: "#388e3c",
  },
];

let index = 0;

function showSlide(i) {
  const product = products[i];
  document.getElementById("product-title").textContent = product.title;
  document.getElementById("product-desc").textContent = product.desc;
  document.getElementById("product-img").src = product.img;
  document.getElementById("product-img").alt = product.title;
  document.getElementById("main-body").style.background = product.bg;
  document.getElementById("product-btn").style.background = product.color;
  document.getElementById("product-btn").style.color = "#fff";
}

function nextSlide() {
  index = (index + 1) % products.length;
  showSlide(index);
}

function prevSlide() {
  index = (index - 1 + products.length) % products.length;
  showSlide(index);
}

function initParticles() {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 40,
      },
      shape: {
        type: "image",
        image: {
          src: "images/patitas.svg",
          width: 20,
          height: 20,
        },
      },
      size: {
        value: 16,
      },
      opacity: {
        value: 1,
      },
      move: {
        enable: true,
        speed: 2,
      },
    },
    retina_detect: true,
  });
}

function destroyParticles() {
  const canvas = document.querySelector("#particles-js canvas");
  if (canvas) canvas.remove();
}

function mostrarInicio() {
  document.getElementById("inicio").style.display = "flex";
  document.getElementById("productos").style.display = "none";
  document.getElementById("contacto").style.display = "none";
  initParticles();
}

function mostrarProductos() {
  document.getElementById("inicio").style.display = "none";
  document.getElementById("productos").style.display = "block";
  document.getElementById("contacto").style.display = "none";
  destroyParticles();
}

window.onload = () => {
  showSlide(index);
  mostrarInicio();
};
