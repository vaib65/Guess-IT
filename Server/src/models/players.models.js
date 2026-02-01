class Player {
  constructor({ userId, socketId, username }) {
    this.userId = userId;
    this.socketId = socketId;
    this.username = username;
    this.score = 0;
    this.hasGuessed = false;
    this.connected = true;
    this.disconnectTimeout = null; 
  }

  addScore(points = 1) {
    this.score += points;
  }

  resetScore() {
    this.score = 0;
  }

  resetState() {
    this.hasGuessed = false;
  }
}

export default Player;
