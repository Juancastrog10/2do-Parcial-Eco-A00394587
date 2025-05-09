// Importa la base de datos de jugadores simulada (funciones para agregar, buscar y modificar jugadores)
const playersDb = require("../db/players.db");

// Importa funciones para emitir eventos por WebSocket
const {
  emitEvent,               // Emite a todos los clientes conectados
  emitToSpecificClient,    // Emite a un cliente específico según su socket ID
} = require("../services/socket.service");

// Controlador para unirse al juego
const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body; // Extrae nickname y socketId del cuerpo de la solicitud
    playersDb.addPlayer(nickname, socketId); // Agrega el jugador a la base de datos

    const gameData = playersDb.getGameData(); // Obtiene el estado actual del juego (jugadores, etc.)
    emitEvent("userJoined", gameData);        // Notifica a todos los clientes que un jugador se ha unido

    res.status(200).json({ success: true, players: gameData.players }); // Responde con la lista de jugadores
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// Controlador para iniciar el juego
const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles(); // Asigna roles como "marco", "polo", etc.

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role); // A cada jugador se le envía su rol
    });

    res.status(200).json({ success: true }); // Respuesta exitosa
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// Controlador que maneja el grito de Marco
const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    // Encuentra todos los jugadores con rol "polo" o "polo-especial"
    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    // Notifica a cada uno que Marco ha gritado
    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true }); // Respuesta exitosa
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// Controlador que maneja el grito de Polo
const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    // Encuentra al jugador con rol "marco"
    const rolesToNotify = playersDb.findPlayersByRole("marco");

    // Notifica a Marco que alguien ha gritado "Polo"
    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true }); // Respuesta exitosa
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// Controlador cuando Marco elige a un Polo
const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body; // Marco (socketId) selecciona a un jugador (poloId)

    const myUser = playersDb.findPlayerById(socketId);     // Jugador que elige (Marco)
    const poloSelected = playersDb.findPlayerById(poloId); // Jugador seleccionado (Polo)
    const allPlayers = playersDb.getAllPlayers();          // Todos los jugadores actuales

    // 🧮 Lógica de puntajes
    if (poloSelected.role === "polo-especial") {
      playersDb.updatePlayerScore(myUser.id, 50);           // Marco gana 50
      playersDb.updatePlayerScore(poloSelected.id, -10);    // Polo especial pierde 10
    } else {
      playersDb.updatePlayerScore(myUser.id, -10);          // Marco falla y pierde 10
    }

    // Si un Polo especial no fue atrapado por Marco, gana 10
    if (poloSelected.role === "polo-especial" && myUser.role !== "marco") {
      playersDb.updatePlayerScore(poloSelected.id, 10);     // Polo especial escapa y gana
    }

    // Emite el nuevo estado de puntajes a todos los jugadores
    emitEvent("updateScoreboard", playersDb.getAllPlayers());

    // 📢 Notifica el final del juego con mensaje personalizado
    if (poloSelected.role === "polo-especial") {
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
        });
      });
    } else {
      allPlayers.forEach((player) => {
        emitToSpecificClient(player.id, "notifyGameOver", {
          message: `El marco ${myUser.nickname} ha perdido`,
        });
      });
    }

    // 🏆 Verifica si hay un jugador con puntaje para declarar ganador
    const winner = playersDb.getWinningPlayer();
    if (winner) {
      emitEvent("gameOverLeaderboard", {
        winner,
        players: playersDb.getAllPlayers(), // Envia también todos los jugadores
      });
    }

    res.status(200).json({ success: true }); // Respuesta exitosa
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// 🔄 Controlador para reiniciar el juego
const resetGameData = async (req, res) => {
  try {
    playersDb.resetGame();           // Elimina la lista de jugadores
    playersDb.resetAllScores();      // Reinicia todos los puntajes

    emitEvent("updateScoreboard", playersDb.getAllPlayers()); // Actualiza tabla en tiempo real
    emitEvent("reset-client");       // 🔥 Notifica a todos los clientes que deben volver a la pantalla inicial

    res.status(200).json({ success: true, message: "Juego reiniciado." }); // Confirma reinicio
  } catch (err) {
    res.status(500).json({ error: err.message }); // Error del servidor
  }
};

// Exporta todos los controladores para que puedan ser usados por las rutas
module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  resetGameData, // 🔁 ¡IMPORTANTE! Exportar también el reinicio del juego
};
