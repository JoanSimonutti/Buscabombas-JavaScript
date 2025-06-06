let tablero = [];
let filas = 10;
let columnas = 10;
let minasTotales = 10;

function generarTablero() {
    const tabla = document.getElementById("tablero");
    tabla.innerHTML = "";
    tablero = [];

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
    const celda = tablero[x][y];
    if (celda.abierta || celda.marcada) return;

    celda.abierta = true;
    document.getElementById(`celda-${x}-${y}`).classList.add("abierta");

    if (celda.mina) {
        document.getElementById(`celda-${x}-${y}`).textContent = "💣";
        perder();
    } else {
        const minasCerca = contarMinasCerca(x, y);
        if (minasCerca > 0) {
            document.getElementById(`celda-${x}-${y}`).textContent = minasCerca;
        } else {
            // Abrir celdas vecinas
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
            if (nx >= 0 && nx < filas && ny >= 0 && ny < columnas) {
                if (tablero[nx][ny].mina) cuenta++;
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
}

function perder() {
    detenerTimer();
    Swal.fire({
        title: "¡Has perdido!",
        icon: "error",
        confirmButtonText: "Intentar de nuevo"
    }).then(() => nuevoJuego());
}

function nuevoJuego() {
    generarTablero();
    iniciarTimer();
}

function ajustes() {
    Swal.fire({
        title: "Ajustes",
        html: `
      <label>Tamaño:</label>
      <select id="tamano">
        <option value="10">10x10</option>
        <option value="15">15x15</option>
        <option value="20">20x20</option>
      </select>
      <br/><br/>
      <label>Cantidad de Minas:</label>
      <input type="number" id="cantidadMinas" min="1" max="400" value="${minasTotales}" />
    `,
        confirmButtonText: "Aplicar"
    }).then(result => {
        if (result.isConfirmed) {
            filas = columnas = parseInt(document.getElementById("tamano").value);
            minasTotales = parseInt(document.getElementById("cantidadMinas").value);
            nuevoJuego();
        }
    });
}
