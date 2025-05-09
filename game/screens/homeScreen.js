// Importa las funciones necesarias desde el archivo principal de la app
// - navigateTo: para cambiar de pantalla
// - socket: conexión activa con el servidor mediante WebSocket
// - makeRequest: función para hacer peticiones HTTP (como fetch)
import { navigateTo, socket, makeRequest } from "../app.js";

// Exporta la función que renderiza la pantalla inicial del juego
export default function renderHomeScreen() {
  // Obtiene el contenedor principal del HTML donde se renderizan las pantallas
  const app = document.getElementById("app");

  // Inyecta el contenido HTML para la pantalla de bienvenida
  app.innerHTML = `
    <div id="home-welcome-screen">
      <h2>Bienvenidos</h2> <!-- Título de bienvenida -->
      <p>Ingresa tu nombre de usuario para unirte al juego</p>
      <div id="form">
        <input type="text" id="nickname" placeholder="nickname" /> <!-- Campo de texto para el apodo -->
        <button id="join-button">Join Game</button> <!-- Botón para unirse al juego -->
      </div>
    </div>
  `;

  // Referencia al input donde el usuario escribe su apodo
  const nicknameInput = document.getElementById("nickname");

  // Referencia al botón para unirse al juego
  const joinButton = document.getElementById("join-button");

  // Asigna un evento al botón cuando el usuario hace clic para unirse
  joinButton.addEventListener("click", async () => {
    // Obtiene el valor del input (el apodo del jugador)
    const userName = nicknameInput.value;

    // Valida que no esté vacío o lleno de espacios
    if (!userName.trim()) {
      alert("Please enter a nickname"); // Alerta si no hay apodo válido
      return; // Detiene la ejecución
    }

    // Hace una petición POST al servidor para unirse al juego
    // Envía el nickname y el ID del socket actual
    const result = await makeRequest("/api/game/join", "POST", {
      nickname: userName,
      socketId: socket.id,
    });

    // Si el servidor responde exitosamente (no devolvió success: false)
    if (result.success !== false) {
      // Navega a la pantalla del lobby, pasando nickname y lista de jugadores
      navigateTo("/lobby", { nickname: userName, players: result.players });
    } else {
      // Si hubo un error, muestra una alerta
      alert("Failed to join game. Please try again.");
    }
  });
}
