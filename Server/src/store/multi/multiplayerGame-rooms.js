import redis from "../../redis/client.js";

export const createRoom = async (roomCode) => {
  await redis.set(`room:${roomCode}`, "1");
};

export const roomExists = async (roomCode) => {
  return await redis.exists(`room:${roomCode}`);
};

export const getRoom = async (roomCode) => {
  const exists = await redis.exists(`room:${roomCode}`);
  if (!exists) return null;
  return { roomCode };
};

export const deleteRoom = async (roomCode) => {
  await redis.del(`room:${roomCode}`);
};

export const getAllRooms = async () => {
  return await redis.keys("room:*");
};
