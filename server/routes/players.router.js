// Importa el módulo Express para crear rutas y manejadores de solicitudes HTTP
const express = require('express');

// Importa el controlador que contiene la lógica para manejar jugadores
const playersController = require('../controllers/players.controller');

// Crea una nueva instancia del router de Express
const router = express.Router();

// Define una ruta GET en "/players" que está vinculada al método getPlayers del controlador
// Esta ruta sirve para obtener la lista completa de jugadores registrados
router.get('/players', playersController.getPlayers);

// Exporta el router para que pueda ser usado dentro del archivo principal del servidor
module.exports = router;
