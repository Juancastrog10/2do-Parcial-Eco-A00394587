/**
 * Servicio de base de datos para operaciones relacionadas con jugadores
 */

// Importa la función que asigna roles a los jugadores desde utilidades
const { assignRoles } = require("../utils/helpers");

// Arreglo en memoria que almacena a todos los jugadores
const players = [];

/**
 * Obtener todos los jugadores
 * @returns {Array} Lista completa de objetos jugador
 */
const getAllPlayers = () => {
  return players;
};

/**
 * Agregar un nuevo jugador
 * @param {string} nickname - Apodo del jugador
 * @param {string} socketId - ID del socket del jugador
 * @returns {Object} Objeto jugador creado
 */
const addPlayer = (nickname, socketId) => {
  const newPlayer = { id: socketId, nickname, score: 0 }; // Crea el jugador con puntaje inicial 0
  players.push(newPlayer); // Lo agrega al arreglo global
  return newPlayer;
};

/**
 * Buscar un jugador por su socket ID
 * @param {string} socketId - ID del socket a buscar
 * @returns {Object|null} Jugador encontrado o null si no existe
 */
const findPlayerById = (socketId) => {
  return players.find((player) => player.id === socketId) || null;
};

/**
 * Asignar roles a todos los jugadores utilizando lógica externa
 * @returns {Array} Lista de jugadores con roles asignados
 */
const assignPlayerRoles = () => {
  const playersWithRoles = assignRoles(players); // Usa helper para asignar roles
  players.splice(0, players.length, ...playersWithRoles); // Reemplaza el contenido del arreglo original
  return players;
};

/**
 * Buscar jugadores por uno o más roles
 * @param {string|Array} role - Rol único o lista de roles
 * @returns {Array} Lista de jugadores con el/los roles indicados
 */
const findPlayersByRole = (role) => {
  if (Array.isArray(role)) {
    return players.filter((player) => role.includes(player.role)); // Si es array, filtra por múltiples roles
  }
  return players.filter((player) => player.role === role); // Si es string, filtra por un solo rol
};

/**
 * Actualizar el puntaje de un jugador
 * @param {string} socketId - ID del socket del jugador
 * @param {number} points - Puntos a sumar o restar
 * @returns {Object|null} Jugador actualizado o null si no se encontró
 */
const updatePlayerScore = (socketId, points) => {
  const player = findPlayerById(socketId); // Busca el jugador
  if (player) {
    player.score = (player.score || 0) + points; // Suma los puntos al puntaje actual
    return player;
  }
  return null;
};

/**
 * Reiniciar el puntaje de todos los jugadores a 0
 */
const resetAllScores = () => {
  players.forEach((player) => {
    player.score = 0;
  });
};

/**
 * Obtener el jugador que alcanzó 100 puntos o más
 * @returns {Object|null} Jugador ganador o null si nadie ha ganado
 */
const getWinningPlayer = () => {
  return players.find((p) => p.score >= 100) || null;
};

/**
 * Obtener todos los datos del juego (jugadores, etc.)
 * @returns {Object} Objeto con la propiedad players
 */
const getGameData = () => {
  return { players };
};

/**
 * Reiniciar el juego eliminando a todos los jugadores
 */
const resetGame = () => {
  players.splice(0, players.length); // Elimina todos los elementos del arreglo
};

// Exporta todas las funciones para usarlas en el resto del servidor
module.exports = {
  getAllPlayers,
  addPlayer,
  findPlayerById,
  assignPlayerRoles,
  findPlayersByRole,
  updatePlayerScore,
  resetAllScores,
  getWinningPlayer,
  getGameData,
  resetGame,
};
