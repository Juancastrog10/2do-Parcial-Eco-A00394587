const playersDb = require("../db/players.db");
const {
  emitEvent,
  emitToSpecificClient,
} = require("../services/socket.service");

const joinGame = async (req, res) => {
  try {
    const { nickname, socketId } = req.body;
    playersDb.addPlayer(nickname, socketId);

    const gameData = playersDb.getGameData();
    emitEvent("userJoined", gameData);

    res.status(200).json({ success: true, players: gameData.players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const startGame = async (req, res) => {
  try {
    const playersWithRoles = playersDb.assignPlayerRoles();

    playersWithRoles.forEach((player) => {
      emitToSpecificClient(player.id, "startGame", player.role);
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyMarco = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole([
      "polo",
      "polo-especial",
    ]);

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Marco!!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const notifyPolo = async (req, res) => {
  try {
    const { socketId } = req.body;

    const rolesToNotify = playersDb.findPlayersByRole("marco");

    rolesToNotify.forEach((player) => {
      emitToSpecificClient(player.id, "notification", {
        message: "Polo!!",
        userId: socketId,
      });
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const selectPolo = async (req, res) => {
  try {
    const { socketId, poloId } = req.body;

    const myUser = playersDb.findPlayerById(socketId);
    const poloSelected = playersDb.findPlayerById(poloId);
    const allPlayers = playersDb.getAllPlayers();

    // Asignar puntos según las reglas
if (poloSelected.role === "polo-especial") {
  playersDb.updatePlayerScore(myUser.id, 50);           // Marco gana
  playersDb.updatePlayerScore(poloSelected.id, -10);    // Polo especial atrapado pierde
} else {
  playersDb.updatePlayerScore(myUser.id, -10);          // Marco falla
}

// Si el polo especial no fue atrapado, gana puntos
if (poloSelected.role === "polo-especial" && myUser.role !== "marco") {
  playersDb.updatePlayerScore(poloSelected.id, 10);     // Polo especial escapa
}


    // Emitir actualización de puntajes en tiempo real
    emitEvent("updateScoreboard", playersDb.getAllPlayers());

    // Emitir mensajes de ronda final
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

    // Verificar si alguien ganó
    const winner = playersDb.getWinningPlayer();
    if (winner) {
      emitEvent("gameOverLeaderboard", {
        winner,
        players: playersDb.getAllPlayers(),
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ NUEVA FUNCIÓN: Reiniciar datos del juego
const resetGameData = async (req, res) => {
  try {
    playersDb.resetGame(); // Eliminar jugadores
    playersDb.resetAllScores(); // Reiniciar puntajes
    emitEvent("updateScoreboard", playersDb.getAllPlayers()); // Notificar cambio
    emitEvent("reset-client"); // 🔥 Notificar a todos los clientes del juego para reiniciar
    res.status(200).json({ success: true, message: "Juego reiniciado." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  joinGame,
  startGame,
  notifyMarco,
  notifyPolo,
  selectPolo,
  resetGameData, // 🔁 ¡IMPORTANTE! Exportar el nuevo controlador
};
