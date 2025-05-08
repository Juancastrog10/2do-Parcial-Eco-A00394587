import { navigateTo, socket } from "../app.js";

export default function renderScreen1() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="screen1">
      <h2>Puntajes en Tiempo Real</h2>
      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody id="scoreboard"></tbody>
      </table>
    </div>
  `;

  // Renderiza los puntajes en la tabla
  const renderScoreboard = (players) => {
    const tbody = document.getElementById("scoreboard");
    if (!tbody) return;

    tbody.innerHTML = players
      .map(
        (player) => `
          <tr>
            <td>${player.nickname}</td>
            <td>${player.score ?? 0}</td>
          </tr>
        `
      )
      .join("");
  };

  // Escuchar evento de cambio de pantalla
  socket.on("next-screen", (data) => {
    navigateTo("/screen2", { name: "Hola" });
  });

  // Escuchar actualizaciones en tiempo real de puntajes
  socket.on("updateScoreboard", (players) => {
    renderScoreboard(players);
  });

  // 🔥 NUEVO: Escuchar cuando alguien gana y redirigir a la pantalla final
  socket.on("gameOverLeaderboard", (data) => {
    navigateTo("/screen2", data); // Pasa los datos a screen2
  });
}
