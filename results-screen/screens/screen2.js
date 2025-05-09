import { navigateTo, socket } from "../app.js";

export default function renderScreen2(data) {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div id="screen2">
      <h2>Resultados Finales</h2>
      <p id="winner">Ganador: ...</p>

      <button id="toggleOrder">Ordenar alfabéticamente</button>
      <button id="resetGame">🔁 Reiniciar juego</button>

      <div id="resetStatus" style="margin-top: 10px;"></div>

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

  let currentPlayers = [];
  let orderBy = "score";

  const renderTable = () => {
    const tbody = document.getElementById("resultTable");
    let sorted = [...currentPlayers];

    if (orderBy === "score") {
      sorted.sort((a, b) => b.score - a.score);
    } else {
      sorted.sort((a, b) => a.nickname.localeCompare(b.nickname));
    }

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

  if (data?.players && data?.winner) {
    currentPlayers = data.players;
    document.getElementById("winner").textContent = `🏆 Ganador: ${data.winner.nickname} con ${data.winner.score} puntos`;
    renderTable();
  }

  socket.on("gameOverLeaderboard", ({ winner, players }) => {
    currentPlayers = players;
    document.getElementById("winner").textContent = `Ganador: ${winner.nickname}`;
    renderTable();
  });

  document.getElementById("toggleOrder").addEventListener("click", () => {
    orderBy = orderBy === "score" ? "alphabet" : "score";
    renderTable();
  });

  // ✅ Botón para reiniciar juego SIN recargar página
  document.getElementById("resetGame").addEventListener("click", async () => {
    const status = document.getElementById("resetStatus");
    status.textContent = "Reiniciando juego...";
    try {
      const response = await fetch("/api/game/reset", { method: "POST" });
      const result = await response.json();
      if (result.success) {
        status.textContent = "✔️ Juego reiniciado correctamente.";
        // No hace falta hacer más: el servidor emitirá "reset-client"
      } else {
        status.textContent = "❌ No se pudo reiniciar el juego.";
      }
    } catch (err) {
      console.error("Error al reiniciar:", err);
      status.textContent = "❌ Error al conectar con el servidor.";
    }
  });
}
