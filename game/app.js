// Importa las funciones que renderizan cada pantalla del juego
import renderHomeScreen from "./screens/homeScreen.js";
import renderLobbyScreen from "./screens/lobbyScreen.js";
import renderGameGround from "./screens/gameGround.js";
import renderGameOverScreen from "./screens/gameOverScreen.js";

// Establece la conexión WebSocket con el servidor
// Usa "/" como namespace y "/real-time" como path personalizado para la conexión
const socket = io("/", { path: "/real-time" });

// Esta función borra el contenido actual del contenedor principal
function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

// Define una variable de ruta actual, iniciando en la raíz "/"
let route = { path: "/", data: {} };

// Renderiza por primera vez la pantalla correspondiente a la ruta actual
renderRoute(route);

// Función que renderiza la pantalla adecuada según la ruta recibida
function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts(); // Limpia el contenido anterior
      renderHomeScreen(currentRoute?.data); // Muestra pantalla de inicio
      break;
    case "/lobby":
      clearScripts();
      renderLobbyScreen(currentRoute?.data); // Muestra la sala de espera
      break;
    case "/game":
      clearScripts();
      renderGameGround(currentRoute?.data); // Muestra el juego en sí
      break;
    case "/gameOver":
      clearScripts();
      renderGameOverScreen(currentRoute?.data); // Muestra la pantalla final del juego
      break;
    default:
      // Si la ruta no coincide con ninguna conocida, muestra error 404
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

// Función pública que permite cambiar de pantalla desde cualquier componente
// Guarda la nueva ruta y llama a renderRoute() para mostrarla
function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

// Función reutilizable para hacer peticiones HTTP al backend
// url: endpoint del backend (ej. "/api/game/start")
// method: método HTTP (GET, POST, etc.)
// body: objeto que será enviado como JSON en el cuerpo de la petición
async function makeRequest(url, method, body) {
  try {
    const BASE_URL = "http://localhost:5050"; // Dirección base del backend
    let response = await fetch(`${BASE_URL}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json", // Se indica que se envía JSON
      },
      body: JSON.stringify(body), // Convierte el body a JSON
    });

    // Si la respuesta no es OK (códigos como 400, 500, etc.), lanza un error
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Convierte la respuesta en JSON y la retorna
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API request failed:", error);
    // En caso de error, devuelve un objeto con success: false
    return { success: false, error: error.message };
  }
}

// Exporta funciones/objetos para que otros archivos puedan usarlos
export { navigateTo, socket, makeRequest };
