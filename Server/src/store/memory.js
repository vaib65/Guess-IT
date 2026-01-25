const rooms = new Map();

export const createRoom = (roomCode, game) => {
  rooms.set(roomCode, {
    game,
    timer: null,
  });
};

export const getRoom = (roomCode) => {
  return rooms.get(roomCode);
};

export const deleteRoom = (roomCode) => {
  rooms.delete(roomCode);
};

export const roomExists = (roomCode) => {
  return rooms.has(roomCode);
};

export const getAllRooms = () => {
  return rooms;
};
