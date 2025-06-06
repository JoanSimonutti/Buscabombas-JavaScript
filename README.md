# 🎯 Buscaminas-JavaScript

Este proyecto es una versión web del clásico juego **Buscaminas**, desarrollada completamente con **HTML**, **CSS** y **JavaScript** puro, sin frameworks ni librerías externas (excepto SweetAlert para los mensajes de alerta). El objetivo es encontrar todas las minas en el tablero sin hacerlas explotar, utilizando lógica y marcando cuidadosamente las casillas sospechosas.

---

## 🔹 ¿Cómo se juega?

- Hacé clic izquierdo para revelar una celda.
- Hacé clic derecho para marcar o desmarcar una celda con una bandera 🚩.
- Si revelás una mina 💣, perdés la partida.
- Si lográs descubrir todas las celdas sin minas, ganás.

Además, el juego incluye un **temporizador de 60 segundos**, sonidos personalizados y un **menú de ajustes** donde podés cambiar el tamaño del tablero y la cantidad de minas.

---

## 🛠️ Estructura del proyecto

```
buscaminas/
│
├── index.html           # Archivo principal del juego
├── styles.css           # Estilos visuales del tablero y la UI
├── game.js              # Lógica del juego (tablero, minas, eventos)
├── timer.js             # Control del temporizador
├── sounds.js            # Reproducción de efectos de sonido
├── /assets/             # Carpeta con archivos de audio
│   ├── sonido_ganador.ogg
│   ├── sonido_win.ogg
│   ├── sonido_perdedor.ogg
│   ├── sonido_gameover.ogg
│   ├── sonido_descubrir.ogg
│   ├── sonido_nuevojuego.ogg
│   ├── sonido_abrirarea.ogg
│   └── sonido_marca.ogg
```

---

## 🚀 Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- SweetAlert2 (para las alertas emergentes)
- [Font Awesome](https://fontawesome.com/) (iconos del menú)

---

## 📆 Cómo ejecutar el proyecto

1. Cloná el repositorio o descargá el ZIP.
2. Abrí el archivo `index.html` en tu navegador.
3. ¡Listo! Ya podés jugar.

---

## 📌 Notas adicionales

- Podés personalizar los sonidos o la lógica de dificultad desde los archivos `sounds.js` y `game.js`.
- Este proyecto es ideal para practicar manipulación del DOM, eventos, lógica condicional y timers en JavaScript.

---

## ✨ Autor

Desarrollado por **Joan Simonutti** como parte de su práctica en desarrollo web con JavaScript.
