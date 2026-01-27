const singleGames = new Map();

export const setSingleGame = (userId, game) => {
  singleGames.set(userId, game);
};

export const getSingleGame = (userId) => {
  return singleGames.get(userId);
};

export const deleteSingleGame = (userId) => {
    singleGames.delete(userId);
}