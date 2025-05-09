// Importa funciones/utilidades del archivo principal de la app
import { navigateTo, socket, makeRequest } from "../app.js";

// Esta función renderiza la pantalla principal del juego
export default function renderGameGround(data) {
  // Obtiene el contenedor principal de la app
  const app = document.getElementById("app");

  // Inyecta el HTML de la interfaz del juego con datos del jugador
  app.innerHTML = `
    <div id="game-ground">
      <h2 id="game-nickname-display">${data.nickname}</h2>
      <p>Tu rol es:</p>
      <h2 id="role-display">${data.role}</h2>
      <h2 id="shout-display"></h2> <!-- Aquí se mostrará el grito de Marco -->
      <div id="pool-players"></div> <!-- Contenedor para mostrar jugadores Polo -->
      <button id="shout-button">Gritar ${data.role}</button> <!-- Botón para gritar -->
    </div>
  `;

  // Guarda datos útiles en variables
  const nickname = data.nickname; // Apodo del jugador
  const polos = [];               // Lista de jugadores Polo que han gritado
  const myRole = data.role;       // Rol del jugador (marco, polo, polo-especial)
  const shoutbtn = document.getElementById("shout-button");   // Botón para gritar
  const shoutDisplay = document.getElementById("shout-display"); // Texto con el grito de Marco
  const container = document.getElementById("pool-players");     // Contenedor para botones Polo

  // Si el jugador no es Marco, se oculta el botón de gritar
  if (myRole !== "marco") {
    shoutbtn.style.display = "none";
  }

  // Por defecto se oculta el mensaje del grito
  shoutDisplay.style.display = "none";

  // Evento: cuando se hace clic en el botón de gritar
  shoutbtn.addEventListener("click", async () => {
    // Si el jugador es Marco, hace una petición al backend para emitir su grito
    if (myRole === "marco") {
      await makeRequest("/api/game/marco", "POST", {
        socketId: socket.id, // Envía su ID de socket
      });
    }

    // Este bloque es redundante porque los Polos no ven el botón, pero se incluye por seguridad
    if (myRole === "polo" || myRole === "polo-especial") {
      await makeRequest("/api/game/polo", "POST", {
        socketId: socket.id,
      });
    }

    // Una vez grita, se desactiva el botón
    shoutbtn.style.display = "none";
  });

  // Evento delegado: si Marco hace clic en un jugador Polo
  container.addEventListener("click", async function (event) {
    // Verifica si el clic fue en un botón
    if (event.target.tagName === "BUTTON") {
      const key = event.target.dataset.key; // Obtiene el ID del Polo
      // Envía al backend el Polo que Marco seleccionó
      await makeRequest("/api/game/select-polo", "POST", {
        socketId: socket.id,
        poloId: key,
      });
    }
  });

  // Escucha el evento "notification" enviado por el servidor (vía WebSocket)
  socket.on("notification", (data) => {
    console.log("Notification", data);

    if (myRole === "marco") {
      // Si el jugador es Marco, muestra botones con los Polos que gritaron
      container.innerHTML =
        "<p>Haz click sobre el polo que quieres escoger:</p>";

      // Guarda el grito en la lista local
      polos.push(data);

      // Por cada Polo que gritó, crea un botón
      polos.forEach((elemt) => {
        const button = document.createElement("button");
        button.innerHTML = `Un jugador gritó: ${elemt.message}`; // Muestra el mensaje
        button.setAttribute("data-key", elemt.userId); // Guarda el ID en un atributo
        container.appendChild(button); // Lo agrega al contenedor
      });
    } else {
      // Si el jugador es Polo, muestra el grito de Marco
      shoutbtn.style.display = "block"; // Muestra el botón para gritar
      shoutDisplay.innerHTML = `Marco ha gritado: ${data.message}`; // Muestra el mensaje
      shoutDisplay.style.display = "block"; // Lo hace visible
    }
  });

  // Evento que indica que el juego ha terminado
  socket.on("notifyGameOver", (data) => {
    // Redirige al jugador a la pantalla de fin de juego con un mensaje
    navigateTo("/gameOver", { message: data.message, nickname });
  });
}
