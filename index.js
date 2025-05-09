// Importa Express para crear el servidor y manejar rutas HTTP
const express = require("express");

// Importa path para trabajar con rutas de archivos y carpetas del sistema
const path = require("path");

// Importa createServer para crear un servidor HTTP tradicional a partir de la app de Express
const { createServer } = require("http");

// Importa las rutas relacionadas con jugadores (GET /players)
const playersRouter = require("./server/routes/players.router");

// Importa las rutas relacionadas con el juego (join, start, marco, polo, etc.)
const gameRouter = require("./server/routes/game.router");

// Importa la función que inicializa Socket.IO y la conecta al servidor HTTP
const { initSocketInstance } = require("./server/services/socket.service");

// Define el puerto donde se ejecutará el servidor
const PORT = 5050;

// Crea la aplicación Express
const app = express();

// Crea el servidor HTTP pasando la app Express (para que también funcione con WebSockets)
const httpServer = createServer(app);

// Middleware que permite a Express entender solicitudes con cuerpo JSON
app.use(express.json());

// Sirve archivos estáticos del frontend del juego en la ruta "/game"
app.use("/game", express.static(path.join(__dirname, "game")));

// Sirve archivos estáticos de la pantalla de resultados en la ruta "/results"
app.use("/results", express.static(path.join(__dirname, "results-screen")));

// Rutas API: para manejar operaciones relacionadas con los jugadores
app.use("/api", playersRouter);

// Rutas API: para manejar operaciones relacionadas con el juego (lógica principal)
app.use("/api/game", gameRouter);

// Inicializa y configura Socket.IO pasando el servidor HTTP creado
initSocketInstance(httpServer);

// Inicia el servidor HTTP y lo pone a escuchar en el puerto especificado
// Al arrancar, imprime un mensaje con la URL del servidor
httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
