// Variables del juego
let tiempoAnterior = 0;
let dt = 0;
let dinoY = 22;
let velDino = 0;
let sueloX = 0;
let velocidad = 1;
let puntos = 0;
let tiempoSiguienteObstaculo = 2;
let tiempoSiguienteNube = 0.5;
let obstaculos = [];
let nubes = [];

// Elementos HTML
let contenedor;
let dino;
let marcador;
let suelo;
let gameOver;

const IMPULSO = 900;
const GRAVEDAD = 2500;
const VELOCIDAD_BASE = 1280 / 3;

function iniciar() {
  contenedor = document.querySelector(".contenedor");
  dino = document.querySelector(".dino");
  marcador = document.querySelector(".score");
  suelo = document.querySelector(".suelo");
  gameOver = document.querySelector(".game-over");

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 32) {
      saltar();
    }
  });

  tiempoAnterior = new Date();
  bucle();
}

function bucle() {
  dt = (new Date() - tiempoAnterior) / 1000;
  tiempoAnterior = new Date();
  actualizar();
  requestAnimationFrame(bucle);
}

function actualizar() {
  if (gameOver.style.display === "block") {
    return;
  }
  moverDino();
  moverSuelo();
  crearObstaculoSiCorresponde();
  crearNubeSiCorresponde();
  moverObstaculos();
  moverNubes();
  detectarChoque();
}

function saltar() {
  if (dinoY === 22) {
    velDino = IMPULSO;
    dino.classList.remove("dino-corriendo");
  }
}

function moverDino() {
  dinoY += velDino * dt;

  if (dinoY < 22) {
    dinoY = 22;
    velDino = 0;
    dino.classList.add("dino-corriendo");
  }

  dino.style.bottom = dinoY + "px";
  velDino -= GRAVEDAD * dt;
}

function moverSuelo() {
  sueloX += VELOCIDAD_BASE * dt * velocidad;
  suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function crearObstaculoSiCorresponde() {
  tiempoSiguienteObstaculo -= dt;
  if (tiempoSiguienteObstaculo <= 0) {
    crearObstaculo();
  }
}

function crearNubeSiCorresponde() {
  tiempoSiguienteNube -= dt;
  if (tiempoSiguienteNube <= 0) {
    crearNube();
  }
}

function crearObstaculo() {
  let obstaculo = document.createElement("div");
  obstaculo.className = "cactus" + (Math.random() > 0.5 ? " cactus2" : "");
  obstaculo.pos = contenedor.clientWidth;
  obstaculo.style.left = obstaculo.pos + "px";
  contenedor.appendChild(obstaculo);
  obstaculos.push(obstaculo);
  tiempoSiguienteObstaculo = (0.7 + Math.random() * 1.1) / velocidad;
}

function crearNube() {
  let nube = document.createElement("div");
  nube.className = "nube";
  nube.pos = contenedor.clientWidth;
  nube.style.left = nube.pos + "px";
  nube.style.bottom = 100 + Math.random() * 170 + "px";
  contenedor.appendChild(nube);
  nubes.push(nube);
  tiempoSiguienteNube = (0.7 + Math.random() * 2) / velocidad;
}

function moverObstaculos() {
  for (let i = obstaculos.length - 1; i >= 0; i--) {
    let obstaculo = obstaculos[i];
    obstaculo.pos -= VELOCIDAD_BASE * dt * velocidad;
    obstaculo.style.left = obstaculo.pos + "px";

    if (obstaculo.pos < -obstaculo.clientWidth) {
      obstaculo.remove();
      obstaculos.splice(i, 1);
      sumarPunto();
    }
  }
}

function moverNubes() {
  for (let i = nubes.length - 1; i >= 0; i--) {
    let nube = nubes[i];
    nube.pos -= VELOCIDAD_BASE * dt * velocidad * 0.5;
    nube.style.left = nube.pos + "px";

    if (nube.pos < -nube.clientWidth) {
      nube.remove();
      nubes.splice(i, 1);
    }
  }
}

function sumarPunto() {
  puntos += 1;
  marcador.innerText = puntos;

  if (puntos === 5) {
    velocidad = 1.5;
    contenedor.classList.add("mediodia");
  } else if (puntos === 10) {
    velocidad = 2;
    contenedor.classList.add("tarde");
  } else if (puntos === 20) {
    velocidad = 3;
    contenedor.classList.add("noche");
  }

  suelo.style.animationDuration = 3 / velocidad + "s";
}

function detectarChoque() {
  for (let i = 0; i < obstaculos.length; i++) {
    let obstaculo = obstaculos[i];
    if (obstaculo.pos > 42 + dino.clientWidth) {
      break;
    }

    if (hayChoque(dino, obstaculo, 10, 30, 15, 20)) {
      gameOver.style.display = "block";
      dino.classList.remove("dino-corriendo");
      dino.classList.add("dino-estrellado");
      break;
    }
  }
}

function hayChoque(a, b, arriba, derecha, abajo, izquierda) {
  let aRect = a.getBoundingClientRect();
  let bRect = b.getBoundingClientRect();

  return !(
    aRect.top + aRect.height - abajo < bRect.top ||
    aRect.top + arriba > bRect.top + bRect.height ||
    aRect.left + aRect.width - derecha < bRect.left ||
    aRect.left + izquierda > bRect.left + bRect.width
  );
}

document.addEventListener("DOMContentLoaded", iniciar);
