const sonidos = {
    nuevojuego: new Audio("assets/sonido_nuevojuego.ogg"),
    perdedor: new Audio("assets/sonido_perdedor.ogg"),
    marcar: new Audio("assets/sonido_marca.ogg"),
    descubrir: new Audio("assets/sonido_descubrir.ogg"),
    abrirarea: new Audio("assets/sonido_abrirarea.ogg"),
    win: new Audio("assets/sonido_win.ogg"),
    gameover: new Audio("assets/sonido_gameover.ogg"),
};

function reproducirSonido(nombre) {
    if (sonidos[nombre]) {
        sonidos[nombre].currentTime = 0;
        sonidos[nombre].play();
    }
}
