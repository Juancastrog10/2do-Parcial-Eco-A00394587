// Importa funciones necesarias:
// - navigateTo: para cambiar de pantalla
// - socket: conexión WebSocket activa
import { navigateTo, socket } from "../app.js";

// Exporta la función que renderiza la pantalla de puntajes en tiempo real
export default function renderScreen1() {
  // Obtiene el contenedor principal donde se renderiza la vista
  const app = document.getElementById("app");

  // Inserta el HTML de la pantalla con una tabla vacía para los puntajes
  app.innerHTML = `
    <div id="screen1">
      <h2>Puntajes en Tiempo Real</h2> <!-- Título de la pantalla -->
      <table>
        <thead>
          <tr>
            <th>Jugador</th> <!-- Columna de nombres -->
            <th>Puntaje</th> <!-- Columna de puntajes -->
          </tr>
        </thead>
        <tbody id="scoreboard"></tbody> <!-- Cuerpo de tabla que se llenará dinámicamente -->
      </table>
    </div>
  `;

  // Función interna para renderizar la tabla con los puntajes de los jugadores
  const renderScoreboard = (players) => {
    const tbody = document.getElementById("scoreboard");
    if (!tbody) return; // Verifica que el tbody exista

    // Genera las filas HTML para cada jugador usando map + join
    tbody.innerHTML = players
      .map(
        (player) => `
          <tr>
            <td>${player.nickname}</td> <!-- Nombre del jugador -->
            <td>${player.score ?? 0}</td> <!-- Puntaje del jugador (0 si está undefined) -->
          </tr>
        `
      )
      .join(""); // Une todas las filas generadas
  };

  // Escucha evento del servidor para cambiar de pantalla
  socket.on("next-screen", (data) => {
    // Redirige a "/screen2" y pasa un objeto con nombre (puedes personalizarlo)
    navigateTo("/screen2", { name: "Hola" });
  });

  // Escucha actualizaciones en tiempo real del servidor con nuevos puntajes
  socket.on("updateScoreboard", (players) => {
    // Llama a la función que actualiza visualmente la tabla
    renderScoreboard(players);
  });

  // 🔥 Escucha un evento que indica que alguien ganó y redirige al final del juego
  socket.on("gameOverLeaderboard", (data) => {
    // Navega a screen2 pasando los datos del juego final (por ejemplo, el ganador)
    navigateTo("/screen2", data);
  });
}
