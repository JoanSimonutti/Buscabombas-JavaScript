let filas = 20;
let columnas = 20;
let lado = 30;

let marcas = 0;
let minas = Math.floor(filas * columnas * 0.1);
let tablero = [];

let enJuego = true;
let juegoIniciado = false;

nuevoJuego();

function nuevoJuego() {
    reiniciarVariables();
    generarTableroHTML();
    generarTableroJuego();
    añadirEventos();
    refrescarTablero();
}

/* (ELIMINO LA OPCION DE AJUSTES)

async function ajustes() {
    const { value: ajustes } = await Swal.fire({
        title: "Ajustes",
        html: `
      Dificultad &nbsp; (minas/área)<br><br>
      <input onchange="cambiarValor()" oninput="this.onchange()" id="dificultad" type="range" min="10" max="40" step="1" value="${100 * minas / (filas * columnas)}">
      <span id="valor-dificultad">${100 * minas / (filas * columnas)}%</span><br><br>
      Filas<br>
      <input class="swal2-input" type="number" value=${filas} placeholder="filas" id="filas" min="10" max="1000"><br>
      Columnas<br>
      <input class="swal2-input" type="number" value=${columnas} placeholder="columnas" id="columnas" min="10" max="1000"><br>
    `,
        confirmButtonText: "Establecer",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        preConfirm: () => {
            return {
                columnas: document.getElementById("columnas").value,
                filas: document.getElementById("filas").value,
                dificultad: document.getElementById("dificultad").value
            };
        }
    });

    if (!ajustes) return;

    filas = Math.floor(ajustes.filas);
    columnas = Math.floor(ajustes.columnas);
    minas = Math.floor(columnas * filas * ajustes.dificultad / 100);
    nuevoJuego();
}

*/

function reiniciarVariables() {
    marcas = 0;
    enJuego = true;
    juegoIniciado = false;
}

function generarTableroHTML() {
    let html = "";
    for (let f = 0; f < filas; f++) {
        html += `<tr>`;
        for (let c = 0; c < columnas; c++) {
            html += `<td id="celda-${c}-${f}" style="width:${lado}px;height:${lado}px"></td>`;
        }
        html += `</tr>`;
    }
    const tableroHTML = document.getElementById("tablero");
    tableroHTML.innerHTML = html;
    tableroHTML.style.width = columnas * lado + "px";
    tableroHTML.style.height = filas * lado + "px";
    tableroHTML.style.background = "slategray";
}

function generarTableroJuego() {
    tablero = [];

    for (let f = 0; f < filas; f++) {
        tablero[f] = [];
        for (let c = 0; c < columnas; c++) {
            tablero[f][c] = {
                mina: false,
                abierta: false,
                marcada: false,
                numero: 0
            };
        }
    }

    let minasRestantes = minas;
    while (minasRestantes > 0) {
        let f = Math.floor(Math.random() * filas);
        let c = Math.floor(Math.random() * columnas);
        if (!tablero[f][c].mina) {
            tablero[f][c].mina = true;
            minasRestantes--;
        }
    }

    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[f][c].mina) continue;

            let total = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nf = f + i;
                    let nc = c + j;
                    if (
                        nf >= 0 &&
                        nf < filas &&
                        nc >= 0 &&
                        nc < columnas &&
                        tablero[nf][nc].mina
                    ) {
                        total++;
                    }
                }
            }

            tablero[f][c].numero = total;
        }
    }
}

function refrescarTablero() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const celda = document.getElementById(`celda-${c}-${f}`);
            const casilla = tablero[f][c];

            celda.className = "";

            if (casilla.abierta) {
                celda.style.background = "#ccc";
                if (casilla.mina) {
                    celda.innerHTML = "💣";
                } else if (casilla.numero > 0) {
                    celda.textContent = casilla.numero;
                } else {
                    celda.textContent = "";
                }
            } else if (casilla.marcada) {
                celda.textContent = "🚩";
                celda.style.background = "orange";
            } else {
                celda.textContent = "";
                celda.style.background = "darkgray";
            }
        }
    }

    document.getElementById("minas").textContent =
        String(minas - marcas).padStart(3, "0");
}

function añadirEventos() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            let celda = document.getElementById(`celda-${c}-${f}`);
            celda.addEventListener("dblclick", function (me) {
                dobleClic(celda, c, f, me);
            });
            celda.addEventListener("mouseup", function (me) {
                clicSimple(celda, c, f, me);
            });
        }
    }
}

function clicSimple(celda, c, f, evento) {
    if (!enJuego) return;

    const casilla = tablero[f][c];

    if (evento.button === 2) {
        // Click derecho
        if (!casilla.abierta) {
            casilla.marcada = !casilla.marcada;
            marcas += casilla.marcada ? 1 : -1;
        }
    } else if (evento.button === 0) {
        // Click izquierdo
        if (!casilla.abierta && !casilla.marcada) {
            casilla.abierta = true;

            if (casilla.mina) {
                enJuego = false;
                mostrarTodasLasMinas();
                Swal.fire("💥 ¡BOOM!", "Has perdido", "error");
            } else if (casilla.numero === 0) {
                abrirArea(f, c);
            }
        }
    }

    refrescarTablero();
    revisarVictoria();
}

function dobleClic(celda, c, f, evento) {
    if (!enJuego) return;

    const casilla = tablero[f][c];
    if (!casilla.abierta || casilla.numero === 0) return;

    let marcadas = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nf = f + i;
            let nc = c + j;
            if (
                nf >= 0 &&
                nf < filas &&
                nc >= 0 &&
                nc < columnas &&
                tablero[nf][nc].marcada
            ) {
                marcadas++;
            }
        }
    }

    if (marcadas === casilla.numero) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let nf = f + i;
                let nc = c + j;
                if (
                    nf >= 0 &&
                    nf < filas &&
                    nc >= 0 &&
                    nc < columnas &&
                    !tablero[nf][nc].marcada
                ) {
                    clicSimple(null, nc, nf, { button: 0 });
                }
            }
        }
    }
}

function abrirArea(f, c) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let nf = f + i;
            let nc = c + j;
            if (
                nf >= 0 &&
                nf < filas &&
                nc >= 0 &&
                nc < columnas &&
                !tablero[nf][nc].abierta &&
                !tablero[nf][nc].marcada
            ) {
                tablero[nf][nc].abierta = true;
                if (tablero[nf][nc].numero === 0) {
                    abrirArea(nf, nc);
                }
            }
        }
    }
}

function mostrarTodasLasMinas() {
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            const casilla = tablero[f][c];
            if (casilla.mina) {
                casilla.abierta = true;
            }
        }
    }
}

function revisarVictoria() {
    let abiertas = 0;
    for (let f = 0; f < filas; f++) {
        for (let c = 0; c < columnas; c++) {
            if (tablero[f][c].abierta) abiertas++;
        }
    }

    if (abiertas === filas * columnas - minas) {
        enJuego = false;
        Swal.fire("🎉 ¡Felicidades!", "Has ganado", "success");
    }
}
