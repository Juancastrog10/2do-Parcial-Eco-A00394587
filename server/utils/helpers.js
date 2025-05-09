// Función para asignar roles únicos a los jugadores del juego
// Requiere al menos 3 jugadores conectados
const assignRoles = (players) => {
  // Validación: si hay menos de 3 jugadores, no se pueden asignar todos los roles
  if (players.length < 3) {
    throw new Error("Se necesitan al menos 3 jugadores para asignar roles únicos.");
  }

  // Crea una copia del array de jugadores y lo mezcla aleatoriamente
  const shuffled = [...players].sort(() => 0.5 - Math.random());

  // Asigna el rol "marco" al primer jugador del arreglo mezclado
  shuffled[0].role = "marco";

  // Asigna el rol "polo-especial" al segundo jugador
  shuffled[1].role = "polo-especial";

  // A los jugadores restantes se les asigna el rol "polo"
  for (let i = 2; i < shuffled.length; i++) {
    shuffled[i].role = "polo";
  }

  // Devuelve el arreglo actualizado con los roles asignados
  return shuffled;
};

// Exporta la función para que pueda ser utilizada en otros archivos del backend
module.exports = { assignRoles };
