export default class MultiplayerGame {
  constructor() {
    this.players = [];
    this.totalTime = 60;
    this.totalRounds = 5;
    this.currentRound = 1;
    this.roundEndsAt = null;

    this.currentFrame = null;
    this.correctAnswer = null;
    this.usedFrames = [];

    this.isStarted = false;
  }

  setRoundTimer() {
    this.roundEndsAt = Date.now() + this.totalTime * 1000;
  }

  getRemainingTime() {
    return Math.max(0, Math.floor((this.roundEndsAt - Date.now()) / 1000));
  }

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayerByUserId(userId) {
    this.players = this.players.filter((p) => p.userId !== userId);
  }

  getPlayers() {
    return this.players;
  }

  getSafePlayers() {
    return this.players.map((p) => ({
      userId: p.userId,
      username: p.username,
      score: p.score,
      connected: p.connected,
      hasGuessed: p.hasGuessed,
    }));
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

  hasEveryoneGuessed() {
    return this.players.filter((p) => p.connected).every((p) => p.hasGuessed);
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
    this.currentRound = 1;
    this.isStarted = false;
    this.usedFrames = [];
    this.currentFrame = null;
    this.correctAnswer = null;
    this.players.forEach((p) => {
      p.resetState();
      p.resetScore();
    });
  }
}
