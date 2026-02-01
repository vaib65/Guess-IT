import { getUserId } from "../utils/userId.js"
import api from "./axios.js"

export const startSinglePlayer = async () => {
    const userId = getUserId();
    const { data } = await api.post("/single/start", { userId });
    return data;
}

export const submitGuess = async (guess) => {
    const userId =getUserId();
    const { data } = await api.post("/single/guess", {
        userId,guess
    })
    return data;
}

export const nextFrame = async () => {
  const userId = getUserId();
  const { data } = await api.post("/single/next", { userId });
  return data;
};

export const resetSinglePlayer = async () => {
    const userId = getUserId();
   const { data } = await api.post("/single/reset", { userId });
   return data;
}