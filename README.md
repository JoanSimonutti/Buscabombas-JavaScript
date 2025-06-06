## Buscaminas-JavaScript

Este proyecto es una versión web del clásico juego **Buscaminas**, desarrollada completamente con **HTML**, **CSS** y **JavaScript** puro, sin frameworks ni librerías externas (excepto SweetAlert para los mensajes de alerta). El objetivo es encontrar todas las minas en el tablero sin hacerlas explotar, utilizando lógica y marcando cuidadosamente las casillas sospechosas.

---

### ¿Cómo se juega?

- Hacé clic izquierdo para revelar una celda.
- Hacé clic derecho para marcar o desmarcar una celda con una bandera 🚩.
- Si revelás una mina 💣, perdés la partida.
- Si lográs descubrir todas las celdas sin minas, ganás.

Además, el juego incluye:

- **temporizador de 60 segundos**
- **menú de ajustes** donde podés elegir el tamaño del tablero y la cantidad de minas.

---

### Estructura del proyecto

```
buscaminas/
│
├── index.html           # Archivo principal del juego
├── styles.css           # Estilos visuales del tablero y la UI
├── game.js              # Lógica del juego (tablero, minas, eventos)
├── timer.js             # Control del temporizador
├── /assets/             # Carpeta con archivos varios
```

---

### Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript, este proyecto es para practicar manipulación del DOM, eventos, lógica condicional y timers.
- SweetAlert2 (para las alertas emergentes)
- [Font Awesome](https://fontawesome.com/) (iconos del menú)

---

<div align="end">

Creado por [Joan Simonutti](https://www.linkedin.com/in/joansimonutti/) | 2025

</div>
