export default class MultiplayerGame {
  constructor() {
    this.players = [];
    this.time = 60;
    this.totalTime = 60;
    this.totalRounds = 5;
    this.currentRound = 1;

    this.currentFrame = null;
    this.correctAnswer = null;
    this.usedFrames = [];

    this.isStarted = false;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(playerId) {
    this.players = this.players.filter((p) => p.id !== playerId);
  }

  getPlayers() {
    return this.players;
  }

  getUnUsedFrame(frames) {
    const available = frames.filter((f) => !this.usedFrames.includes(f));
    if (!available.length) return null;

    const frame = available[Math.floor(Math.random() * available.length)];
    this.usedFrames.push(frame);
    return frame;
  }

  setFrame(frame, answer) {
    this.currentFrame = frame;
    this.correctAnswer = answer;
  }

  resetTimer() {
    this.time = this.totalTime;
  }

  tick() {
    this.time--;
  }

  hasEveryoneGuessed() {
    return this.players.every((p) => p.hasGuessed);
  }

  startGame() {
    this.isStarted = true;
  }

  startNewRound() {
    this.players.forEach((p) => p.resetState());
    this.currentRound++;
  }

  isLastRound() {
    return this.currentRound === this.totalRounds;
  }

  resetGame() {
    this.time = this.totalTime;
    this.currentRound = 1;
    this.isStarted = false;
    this.usedFrames = [];
    this.players.forEach((p) => {
      p.resetState();
      p.resetScore();
    });
  }
}
