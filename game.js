let filas = 9;
let columnas = 9;
let lado = 30;
let minas = 10;

let tablero = [];
let enJuego = true;
let marcas = 0;
let juegoIniciado = false;

let tiempo = 0;
let intervalo;

function nuevoJuego() {
    clearInterval(intervalo);
    reiniciarVariables();
    generarTableroHTML();
    generarTableroJuego();
    añadirEventos();
    actualizarContadores();
}

function reiniciarVariables() {
    tablero = [];
    enJuego = true;
    juegoIniciado = false;
    marcas = 0;
    tiempo = 0;
    document.getElementById("boton-reinicio").textContent = "😊";
    document.getElementById("temporizador").textContent = "000";
}

function generarTableroJuego() {
    for (let f = 0; f < filas; f++) {
        tablero[f] = [];
        for (let c = 0; c < columnas; c++) {
            tablero[f][c] = { mina: false, abierta: false, marcada: false, numero: 0 };
        }
    }

    let colocadas = 0;
    while (colocadas < minas) {
        let f = Math.floor(Math.random() * filas);
        let c = Math.floor(Math.random() * columnas);
        if (!tablero[f][c].mina) {
            tablero[f][c].mina = true;
            colocadas++;
        }
    }

    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[f][c].mina) continue;
            let n = 0;
            for (let df = -1; df <= 1; df++) {
                for (let dc = -1; dc <= 1; dc++) {
                    let nf = f + df;
                    let nc = c + dc;
                    if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas && tablero[nf][nc].mina) n++;
                }
            }
            tablero[f][c].numero = n;
        }
    }
}

function generarTableroHTML() {
    const tabla = document.getElementById("tablero");
    tabla.innerHTML = "";
    for (let f = 0; f < filas; f++) {
        const tr = document.createElement("tr");
        for (let c = 0; c < columnas; c++) {
            const td = document.createElement("td");
            td.id = `celda-${f}-${c}`;
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
}

function añadirEventos() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = document.getElementById(`celda-${f}-${c}`);
            celda.addEventListener("mousedown", (e) => {
                if (!enJuego) return;
                if (!juegoIniciado) {
                    intervalo = setInterval(() => {
                        tiempo++;
                        document.getElementById("temporizador").textContent = tiempo.toString().padStart(3, "0");
                    }, 1000);
                    juegoIniciado = true;
                }
                if (e.button === 0) {
                    abrirCelda(f, c);
                } else if (e.button === 2) {
                    marcarCelda(f, c);
                }
                actualizarContadores();
            });
        }
    }
}

function abrirCelda(f, c) {
    let celda = tablero[f][c];
    if (celda.abierta || celda.marcada) return;

    celda.abierta = true;
    const td = document.getElementById(`celda-${f}-${c}`);
    td.classList.add("abierta");
    td.classList.remove("bandera");

    if (celda.mina) {
        td.classList.add("mina");
        td.style.background = "red";
        perder();
        return;
    }

    if (celda.numero > 0) {
        td.textContent = celda.numero;
        td.classList.add(`num-${celda.numero}`);
    } else {
        for (let df = -1; df <= 1; df++) {
            for (let dc = -1; dc <= 1; dc++) {
                let nf = f + df;
                let nc = c + dc;
                if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) {
                    abrirCelda(nf, nc);
                }
            }
        }
    }

    if (verificarVictoria()) {
        ganar();
    }
}

function marcarCelda(f, c) {
    const celda = tablero[f][c];
    const td = document.getElementById(`celda-${f}-${c}`);
    if (celda.abierta) return;

    if (celda.marcada) {
        celda.marcada = false;
        td.classList.remove("bandera");
        marcas--;
    } else {
        celda.marcada = true;
        td.classList.add("bandera");
        marcas++;
    }
}

function actualizarContadores() {
    let restante = minas - marcas;
    if (restante < 0) restante = 0;
    document.getElementById("contador-minas").textContent = restante.toString().padStart(3, "0");
}

function perder() {
    enJuego = false;
    clearInterval(intervalo);
    document.getElementById("boton-reinicio").textContent = "😵";

    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = tablero[f][c];
            const td = document.getElementById(`celda-${f}-${c}`);
            if (celda.mina && !celda.abierta) {
                td.classList.add("mina");
            }
        }
    }
}

function ganar() {
    enJuego = false;
    clearInterval(intervalo);
    document.getElementById("boton-reinicio").textContent = "😎";
}

function verificarVictoria() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = tablero[f][c];
            if (!celda.mina && !celda.abierta) return false;
        }
    }
    return true;
}

nuevoJuego();
