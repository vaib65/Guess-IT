
const rooms = new Map();

export const createMemoryRoom = (roomCode, game) => {
  rooms.set(roomCode, {
    game,
    timer: null,
  });
};

export const getMemoryRoom = (roomCode) => {
  return rooms.get(roomCode) || null;
};

export const deleteMemoryRoom = (roomCode) => {
  rooms.delete(roomCode);
};

export const getAllMemoryRooms = () => {
  return rooms;
};
