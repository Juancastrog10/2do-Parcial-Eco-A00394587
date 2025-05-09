// Importa las funciones que renderizan las pantallas screen1 y screen2
import renderScreen1 from "./screens/screen1.js";
import renderScreen2 from "./screens/screen2.js";

// Establece la conexión con el servidor usando WebSocket (Socket.IO)
// Usa el path personalizado "/real-time" para la conexión
const socket = io("/", { path: "/real-time" });

// Función que limpia el contenido actual del contenedor principal
function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

// Define el estado inicial de la ruta actual (pantalla "/")
let route = { path: "/", data: {} };

// Llama por primera vez a renderRoute para renderizar la pantalla inicial
renderRoute(route);

// 🔥 Escucha un evento enviado desde el servidor llamado "reset-client"
// Cuando se recibe, limpia la ruta, borra los datos, y redirige al home
socket.on("reset-client", () => {
  route = { path: "/", data: {} }; // Borra cualquier estado o nickname anterior
  navigateTo("/"); // Redirige a la pantalla principal
});

// Función que se encarga de renderizar la pantalla correspondiente a la ruta actual
function renderRoute(currentRoute) {
  switch (currentRoute?.path) {
    case "/":
      clearScripts();
      renderScreen1(currentRoute?.data);
      break;
    case "/screen2":
      clearScripts();
      renderScreen2(currentRoute?.data);
      break;
    default:
      const app = document.getElementById("app");
      app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  }
}

// Función que permite cambiar de pantalla y pasar datos (como nickname o roles)
function navigateTo(path, data) {
  route = { path, data };
  renderRoute(route);
}

// Exporta funciones para que puedan ser usadas en otros módulos
export { navigateTo, socket };
