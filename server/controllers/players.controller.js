// Importa el módulo de base de datos de jugadores (simulado o en memoria)
// Este módulo contiene funciones para obtener, agregar, modificar o eliminar jugadores
const playersDb = require("../db/players.db");

// Controlador que maneja la petición para obtener todos los jugadores
const getPlayers = async (req, res) => {
  try {
    // Llama a la función que devuelve la lista de todos los jugadores
    const players = playersDb.getAllPlayers();

    // Responde con un estado 200 (OK) y envía la lista en formato JSON
    res.status(200).json(players);
  } catch (err) {
    // Si ocurre un error, responde con estado 500 (Error del servidor)
    // e incluye el mensaje del error para depuración
    res.status(500).json({ error: err.message });
  }
};

// Exporta el controlador para que pueda ser utilizado en las rutas
module.exports = {
  getPlayers,
};
