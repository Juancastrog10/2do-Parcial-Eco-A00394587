// Importa el módulo Express para manejar rutas HTTP
const express = require('express');

// Importa el controlador que contiene toda la lógica del juego
const gameController = require('../controllers/game.controller');

// Crea una nueva instancia del router de Express
const router = express.Router();

// 🧭 Rutas relacionadas con el flujo del juego
// Cada ruta HTTP POST está vinculada a una función específica del controlador

// Ruta para que un jugador se una al juego (envía nickname y socketId)
router.post('/join', gameController.joinGame);

// Ruta para iniciar el juego (asigna roles y notifica a cada jugador)
router.post('/start', gameController.startGame);

// Ruta que se activa cuando "Marco" grita (notifica a los polos)
router.post('/marco', gameController.notifyMarco);

// Ruta que se activa cuando un "Polo" grita (notifica al marco)
router.post('/polo', gameController.notifyPolo);

// Ruta que se activa cuando Marco selecciona a un Polo (aplica reglas de puntuación y fin del juego)
router.post('/select-polo', gameController.selectPolo);

// ✅ Ruta añadida para reiniciar el juego desde el botón de "Reiniciar juego" en screen2
router.post('/reset', gameController.resetGameData);

// Exporta el router para que pueda ser utilizado en la aplicación principal (server.js)
module.exports = router;
