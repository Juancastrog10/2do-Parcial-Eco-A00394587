// Importa funciones y objetos necesarios desde el archivo principal de la app
import { makeRequest, navigateTo, socket } from "../app.js";

// Función que renderiza la pantalla de "Game Over"
export default function renderGameOverScreen(data) {
  // Selecciona el contenedor principal de la aplicación
  const app = document.getElementById("app");

  // Inyecta el HTML para la pantalla de fin del juego
  app.innerHTML = `
    <div id="game-over">
      <h1>Game Over</h1> <!-- Título principal -->
      <h2 id="game-result">${data.message}</h2> <!-- Muestra mensaje final (ganó Marco, Polo, etc.) -->
      <button id="restart-button">Restart game</button> <!-- Botón para reiniciar la partida -->
    </div>
  `;

  // Imprime los datos recibidos por consola (útil para depurar)
  console.log("data", data);

  // Selecciona el botón de reinicio del DOM
  const restartButton = document.getElementById("restart-button");

  // Agrega un evento al botón para reiniciar el juego cuando se hace clic
  restartButton.addEventListener("click", async () => {
    // Envía una petición POST al servidor para iniciar una nueva partida
    await makeRequest("/api/game/start", "POST");
  });

  // Escucha el evento del servidor cuando se inicia un nuevo juego
  socket.on("startGame", (role) => {
    // Navega a la pantalla de juego, pasando el nickname anterior y el nuevo rol asignado
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
