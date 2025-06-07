// Configuración inicial
const filas = 12;
const columnas = 15;
const minasCantidad = 15;
const lado = 30;

let tablero = [];
let juegoEnCurso = true;
let minasMarcadas = 0;
let timerInterval = null;
let tiempoSegundos = 0;
let juegoIniciado = false;

const tableroElement = document.getElementById("tablero");
const minasElement = document.getElementById("minas");
const temporizadorElement = document.getElementById("temporizador");
const botonReinicio = document.getElementById("boton-reinicio");

// Inicializar juego
nuevoJuego();

botonReinicio.addEventListener("click", () => {
    nuevoJuego();
});

function nuevoJuego() {
    juegoEnCurso = true;
    minasMarcadas = 0;
    tiempoSegundos = 0;
    juegoIniciado = false;
    clearInterval(timerInterval);
    temporizadorElement.textContent = "000";
    minasElement.textContent = minasCantidad.toString().padStart(3, "0");
    botonReinicio.textContent = "🙂";

    tablero = [];
    tableroElement.innerHTML = "";

    // Crear matriz
    for (let f = 0; f < filas; f++) {
        const fila = [];
        const tr = document.createElement("tr");
        for (let c = 0; c < columnas; c++) {
            const td = document.createElement("td");
            td.id = `celda-${c}-${f}`;
            td.addEventListener("click", (e) => manejarClick(e, c, f));
            td.addEventListener("contextmenu", (e) => manejarClickDerecho(e, c, f));
            fila.push({
                mina: false,
                abierto: false,
                marcado: false,
                minasAlrededor: 0,
                td,
            });
            tr.appendChild(td);
        }
        tablero.push(fila);
        tableroElement.appendChild(tr);
    }

    colocarMinas();
    calcularMinasAlrededor();
    actualizarMinasMarcadas();
}

// Coloca minas al azar
function colocarMinas() {
    let minasColocadas = 0;
    while (minasColocadas < minasCantidad) {
        const fila = Math.floor(Math.random() * filas);
        const columna = Math.floor(Math.random() * columnas);
        if (!tablero[fila][columna].mina) {
            tablero[fila][columna].mina = true;
            minasColocadas++;
        }
    }
}

// Calcula minas alrededor de cada celda
function calcularMinasAlrededor() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[f][c].mina) continue;
            let contador = 0;
            for (let y = f - 1; y <= f + 1; y++) {
                for (let x = c - 1; x <= c + 1; x++) {
                    if (
                        x >= 0 &&
                        x < columnas &&
                        y >= 0 &&
                        y < filas &&
                        tablero[y][x].mina
                    ) {
                        contador++;
                    }
                }
            }
            tablero[f][c].minasAlrededor = contador;
        }
    }
}

// Manejar click izquierdo
function manejarClick(e, c, f) {
    if (!juegoEnCurso) return;
    if (!juegoIniciado) iniciarTemporizador();
    juegoIniciado = true;

    const celda = tablero[f][c];
    if (celda.abierto || celda.marcado) return;

    abrirCelda(f, c);

    verificarVictoria();
}

// Manejar click derecho para marcar/desmarcar
function manejarClickDerecho(e, c, f) {
    e.preventDefault();
    if (!juegoEnCurso) return;

    const celda = tablero[f][c];
    if (celda.abierto) return;

    if (celda.marcado) {
        celda.marcado = false;
        minasMarcadas--;
        celda.td.classList.remove("marca");
        celda.td.textContent = "";
    } else {
        if (minasMarcadas < minasCantidad) {
            celda.marcado = true;
            minasMarcadas++;
            celda.td.classList.add("marca");
            celda.td.textContent = "🚩";
        }
    }
    actualizarMinasMarcadas();
}

// Abrir celda y propagar si es cero
function abrirCelda(f, c) {
    const celda = tablero[f][c];
    if (celda.abierto || celda.marcado) return;

    celda.abierto = true;
    celda.td.classList.add("abierto");

    if (celda.mina) {
        celda.td.classList.add("mina");
        celda.td.textContent = "💣";
        juegoPerdido();
        return;
    }

    if (celda.minasAlrededor > 0) {
        celda.td.textContent = celda.minasAlrededor;
        celda.td.classList.add(`num${celda.minasAlrededor}`);
    } else {
        celda.td.textContent = "";
        // abrir vecinos
        for (let y = f - 1; y <= f + 1; y++) {
            for (let x = c - 1; x <= c + 1; x++) {
                if (x >= 0 && x < columnas && y >= 0 && y < filas) {
                    if (!(x === c && y === f)) abrirCelda(y, x);
                }
            }
        }
    }
}

// Actualizar contador minas marcadas
function actualizarMinasMarcadas() {
    const restantes = minasCantidad - minasMarcadas;
    minasElement.textContent = restantes.toString().padStart(3, "0");
}

// Iniciar temporizador
function iniciarTemporizador() {
    timerInterval = setInterval(() => {
        tiempoSegundos++;
        temporizadorElement.textContent = tiempoSegundos.toString().padStart(3, "0");
    }, 1000);
}

// Detener temporizador
function detenerTemporizador() {
    clearInterval(timerInterval);
}

// Perder el juego
function juegoPerdido() {
    juegoEnCurso = false;
    detenerTemporizador();
    botonReinicio.textContent = "😵";

    // Mostrar todas las minas
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = tablero[f][c];
            if (celda.mina && !celda.marcado) {
                celda.td.classList.add("mina");
                celda.td.textContent = "💣";
            }
            if (!celda.mina && celda.marcado) {
                celda.td.textContent = "❌";
                celda.td.classList.add("abierto");
            }
            celda.td.style.cursor = "default";
        }
    }
}

// Verificar si ganó
function verificarVictoria() {
    let abiertas = 0;
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[f][c].abierto) abiertas++;
        }
    }

    if (abiertas === filas * columnas - minasCantidad) {
        juegoGanado();
    }
}

// Ganar juego
function juegoGanado() {
    juegoEnCurso = false;
    detenerTemporizador();
    botonReinicio.textContent = "😎";

    // Marcar todas las minas
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = tablero[f][c];
            if (celda.mina) {
                celda.marcado = true;
                celda.td.classList.add("marca");
                celda.td.textContent = "🚩";
            }
            celda.td.style.cursor = "default";
        }
    }

    Swal.fire({
        icon: "success",
        title: "¡Ganaste!",
        showConfirmButton: true,
    });
}
