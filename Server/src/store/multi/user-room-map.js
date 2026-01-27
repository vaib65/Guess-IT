import redis from "../../redis/client.js";

export const setUserRoom = async (userId, roomCode) => {
  await redis.set(`user:${userId}`, roomCode);
};

export const getUserRoom = async (userId) => {
  return await redis.get(`user:${userId}`);
};

export const clearUserRoom = async (userId) => {
  await redis.del(`user:${userId}`);
};
