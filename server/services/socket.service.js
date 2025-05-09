// Importa la clase Server desde el paquete socket.io para crear el servidor de WebSocket
const { Server } = require("socket.io");

// Variable global que almacenará la instancia de Socket.IO una vez inicializada
let io;

// Función para inicializar la instancia de Socket.IO
// Se llama desde el archivo principal del servidor (por ejemplo, server.js)
// Recibe el servidor HTTP (creado con Express) como argumento
const initSocketInstance = (httpServer) => {
  io = new Server(httpServer, {
    // Define un path personalizado para las conexiones WebSocket
    path: "/real-time",
    // Configura CORS para permitir conexiones desde cualquier origen (útil para desarrollo)
    cors: {
      origin: "*",
    },
  });
};

// Función para emitir un evento a un cliente específico usando su socketId
// - socketId: ID del cliente que recibirá el evento
// - eventName: nombre del evento que se va a emitir (ej: "startGame")
// - data: datos que se enviarán junto al evento
const emitToSpecificClient = (socketId, eventName, data) => {
  if (!io) {
    // Si la instancia aún no ha sido inicializada, lanza un error
    throw new Error("Socket.io instance is not initialized");
  }
  // Envía el evento con los datos al socket correspondiente
  io.to(socketId).emit(eventName, data);
};

// Función para emitir un evento global a todos los clientes conectados
// - eventName: nombre del evento global (ej: "userJoined")
// - data: datos que acompañan al evento
const emitEvent = (eventName, data) => {
  if (!io) {
    // Si la instancia aún no ha sido inicializada, lanza un error
    throw new Error("Socket.io instance is not initialized");
  }
  // Emite el evento a todos los sockets conectados
  io.emit(eventName, data);
};

// Exporta todas las funciones para que puedan ser utilizadas en otros módulos del backend
module.exports = {
  emitEvent,              // Emitir a todos los clientes
  initSocketInstance,     // Inicializar la instancia de socket.io
  emitToSpecificClient,   // Emitir a un cliente específico
};
