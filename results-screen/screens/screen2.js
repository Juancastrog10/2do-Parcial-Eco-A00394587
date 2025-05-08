import { navigateTo, socket } from "../app.js";

export default function renderScreen1(data) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="screen2">
      <h2>Resultados Finales</h2>
      <p id="winner">Ganador: ...</p>

      <button id="toggleOrder">Ordenar alfabéticamente</button>
      <button id="resetGame">Reiniciar juego</button>
      <button id="go-screen-back">Go to previous screen</button>

      <table>
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Puntaje</th>
          </tr>
        </thead>
        <tbody id="resultTable"></tbody>
      </table>
    </div>
  `;

  const goBackButton = document.getElementById("go-screen-back");
  goBackButton.addEventListener("click", () => {
    navigateTo("/");
  });

  let currentPlayers = [];
  let orderBy = "score"; // default

  const renderTable = () => {
    const tbody = document.getElementById("resultTable");
    let sorted = [...currentPlayers];

    if (orderBy === "score") {
      sorted.sort((a, b) => b.score - a.score);
    } else {
      sorted.sort((a, b) => a.nickname.localeCompare(b.nickname));
    }

    tbody.innerHTML = sorted
    tbody.innerHTML = sorted
    .map(
      (player, index) => `
        <tr style="font-weight: ${index === 0 ? "bold" : "normal"};">
          <td>${index + 1}. ${player.nickname}</td>
          <td>${player.score ?? 0}</td>
        </tr>
      `
    )
    .join("");  
  };

  // 🔥 USAR DATOS PASADOS DESDE navigateTo
  if (data?.players && data?.winner) {
    currentPlayers = data.players;
    document.getElementById("winner").textContent = `🏆 Ganador: ${data.winner.nickname} con ${data.winner.score} puntos`;
    renderTable();
  }

  // (Opcional) si alguien entra por otra vía, aún puede escuchar el evento
  socket.on("gameOverLeaderboard", ({ winner, players }) => {
    currentPlayers = players;
    document.getElementById("winner").textContent = `Ganador: ${winner.nickname}`;
    renderTable();
  });

  // Cambiar orden
  document.getElementById("toggleOrder").addEventListener("click", () => {
    orderBy = orderBy === "score" ? "alphabet" : "score";
    renderTable();
  });

  // Botón BONUS: reiniciar juego
  document.getElementById("resetGame").addEventListener("click", async () => {
    try {
      await fetch("/api/game/reset", { method: "POST" });
      alert("Juego reiniciado. Recarga para empezar de nuevo.");
      location.reload();
    } catch (err) {
      console.error("Error al reiniciar el juego:", err);
    }
  });
}
