// Importa funciones necesarias desde el archivo principal de la app
// - navigateTo: cambia de pantalla
// - socket: mantiene la conexión WebSocket con el servidor
// - makeRequest: función para hacer peticiones HTTP al backend
import { navigateTo, socket, makeRequest } from "../app.js";

// Exporta la función que renderiza la pantalla del lobby (sala de espera)
export default function renderLobbyScreen(data) {
  // Selecciona el contenedor principal del DOM donde se renderizan las pantallas
  const app = document.getElementById("app");

  // Inyecta el HTML correspondiente al lobby
  app.innerHTML = `
    <div id="lobby-screen">
      <h2 id="nickname-display">${data.nickname}</h2> <!-- Muestra el nickname del usuario -->
      <p>
        Esperando a que otros se unan:
        <b id="users-count"><b>0</b></b> usuarios en la sala <!-- Contador de usuarios conectados -->
      </p>
      <button id="start-button">Start game</button> <!-- Botón para iniciar el juego -->
    </div>
  `;

  // Referencia al botón de iniciar juego
  const startButton = document.getElementById("start-button");

  // Referencia al elemento donde se muestra el número de jugadores conectados
  const usersCount = document.getElementById("users-count");

  // Inicializa el contador de usuarios con la cantidad recibida al entrar
  usersCount.innerHTML = data?.players.length || 0;

  // Escucha eventos enviados desde el servidor cuando un usuario nuevo se une
  socket.on("userJoined", (data) => {
    console.log(data); // Imprime la información del evento en consola
    // Actualiza el número de jugadores en pantalla
    usersCount.innerHTML = data?.players.length || 0;
  });

  // Evento: cuando el usuario que ve esta pantalla hace clic en "Start game"
  startButton.addEventListener("click", async () => {
    // Hace una petición al backend para iniciar el juego
    await makeRequest("/api/game/start", "POST");
  });

  // Escucha el evento enviado por el servidor cuando el juego comienza
  socket.on("startGame", (role) => {
    // Navega a la pantalla del juego, pasando el nickname y el rol asignado
    navigateTo("/game", { nickname: data.nickname, role });
  });
}
