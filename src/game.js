let tablero = [];
let filas = 10;
let columnas = 10;
let minasTotales = 10;
let minasMarcadas = 0;
let juegoPausado = false;
let juegoIniciado = false;

function generarTablero() {
    const tabla = document.getElementById("tablero");
    tabla.innerHTML = "";
    tablero = [];
    minasMarcadas = 0;
    actualizarContadorMinas();

    for (let i = 0; i < filas; i++) {
        let fila = [];
        const tr = document.createElement("tr");

        for (let j = 0; j < columnas; j++) {
            const td = document.createElement("td");
            td.id = `celda-${i}-${j}`;
            td.addEventListener("click", () => descubrir(i, j));
            td.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                marcar(i, j);
            });
            tr.appendChild(td);
            fila.push({ mina: false, abierta: false, marcada: false });
        }

        tabla.appendChild(tr);
        tablero.push(fila);
    }

    colocarMinas();
}

function colocarMinas() {
    let minasRestantes = minasTotales;
    while (minasRestantes > 0) {
        const x = Math.floor(Math.random() * filas);
        const y = Math.floor(Math.random() * columnas);
        if (!tablero[x][y].mina) {
            tablero[x][y].mina = true;
            minasRestantes--;
        }
    }
}

function descubrir(x, y) {
    if (juegoPausado) return;

    if (!juegoIniciado) {
        iniciarTimer();
        juegoIniciado = true;
    }

    const celda = tablero[x][y];
    if (celda.abierta || celda.marcada) return;

    celda.abierta = true;
    const td = document.getElementById(`celda-${x}-${y}`);
    td.classList.add("abierta");

    if (celda.mina) {
        td.textContent = "💣";
        mostrarTodasLasMinas();
        perder();
    } else {
        const minasCerca = contarMinasCerca(x, y);
        if (minasCerca > 0) {
            td.textContent = minasCerca;
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const nx = x + i;
                    const ny = y + j;
                    if (nx >= 0 && nx < filas && ny >= 0 && ny < columnas) {
                        descubrir(nx, ny);
                    }
                }
            }
        }
    }
}

function contarMinasCerca(x, y) {
    let cuenta = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = x + i;
            const ny = y + j;
            if (
                nx >= 0 && nx < filas && ny >= 0 && ny < columnas &&
                tablero[nx][ny].mina
            ) {
                cuenta++;
            }
        }
    }
    return cuenta;
}

function marcar(x, y) {
    const celda = tablero[x][y];
    if (celda.abierta) return;
    celda.marcada = !celda.marcada;
    const td = document.getElementById(`celda-${x}-${y}`);
    td.textContent = celda.marcada ? "🚩" : "";
    minasMarcadas += celda.marcada ? 1 : -1;
    actualizarContadorMinas();
}

function mostrarTodasLasMinas() {
    for (let i = 0; i < filas; i++) {
        for (let j = 0; j < columnas; j++) {
            const celda = tablero[i][j];
            const td = document.getElementById(`celda-${i}-${j}`);
            if (celda.mina && !celda.abierta) {
                td.textContent = "💣";
                td.classList.add("abierta");
            }
        }
    }
}

function perder() {
    detenerTimer();
    Swal.fire({
        title: "¡Has perdido!",
        icon: "error",
        confirmButtonText: "Intentar de nuevo"
    }).then(() => nuevoJuego());
}

function actualizarContadorMinas() {
    const restantes = minasTotales - minasMarcadas;
    document.getElementById("minas").textContent = `Minas: ${restantes
        .toString()
        .padStart(3, "0")}`;
}

function togglePausa() {
    const boton = document.getElementById("pausar");
    juegoPausado = !juegoPausado;

    if (juegoPausado) {
        detenerTimer();
        boton.textContent = "Reanudar";
        document.getElementById("tablero").classList.add("bloqueado");
    } else {
        iniciarTimer();
        boton.textContent = "Pausar";
        document.getElementById("tablero").classList.remove("bloqueado");
    }
}


function nuevoJuego() {
    generarTablero();
    detenerTimer();
    actualizarTimer();
    juegoIniciado = false;
    juegoPausado = false;
    document.getElementById("pausar").textContent = "Pausar";
    document.getElementById("tablero").classList.remove("bloqueado");
}

/*
function ajustes() {
    Swal.fire({
        title: "Ajustes",
        html: `
      <label>Dificultad:</label>
      <select id="dificultad">
        <option value="facil">Fácil (10x10 - 10)</option>
        <option value="media">Media (15x15 - 30)</option>
        <option value="dificil">Difícil (20x20 - 60)</option>
      </select>
      <br/><br/>
      <label>Personalizado:</label><br/>
      Filas: <input type="number" id="filas" min="5" max="30" value="${filas}" /><br/>
      Columnas: <input type="number" id="columnas" min="5" max="30" value="${columnas}" /><br/>
      Minas: <input type="number" id="cantidadMinas" min="1" max="500" value="${minasTotales}" /><br/>
    `,
        confirmButtonText: "Aplicar"
    }).then(result => {
        if (result.isConfirmed) {
            const dif = document.getElementById("dificultad").value;
            if (dif === "facil") {
                filas = columnas = 10;
                minasTotales = 10;
            } else if (dif === "media") {
                filas = columnas = 15;
                minasTotales = 30;
            } else if (dif === "dificil") {
                filas = columnas = 20;
                minasTotales = 60;
            } else {
                filas = parseInt(document.getElementById("filas").value);
                columnas = parseInt(document.getElementById("columnas").value);
                minasTotales = parseInt(document.getElementById("cantidadMinas").value);
            }
            nuevoJuego();
        } 
    });
    
}*/
