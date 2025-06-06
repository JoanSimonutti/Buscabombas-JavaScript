let tiempoRestante = 60;
let intervalo;

function iniciarTimer() {
    tiempoRestante = 60;
    actualizarTimer();
    if (intervalo) clearInterval(intervalo);
    intervalo = setInterval(() => {
        tiempoRestante--;
        if (tiempoRestante <= 0) {
            perder();
        }
        actualizarTimer();
    }, 1000);
}

function detenerTimer() {
    clearInterval(intervalo);
}

function actualizarTimer() {
    const minutos = Math.floor(tiempoRestante / 60).toString().padStart(2, "0");
    const segundos = (tiempoRestante % 60).toString().padStart(2, "0");
    document.getElementById("timer").textContent = `${minutos}:${segundos}`;
}
