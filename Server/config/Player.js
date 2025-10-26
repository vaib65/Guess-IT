class Player {
  constructor(id, username) {
    this.username = username;
    this.id = id;
    this.score = 0;
    this.hasGuessed = false;
  }

  //method to reset score
  resetScore() {
    this.score = 0;
  }

  // method to reset player state.
  resetState() {
    this.hasGuessed = false;
  }

  addScore(points) {
    this.score += points;
  }
}
module.exports= Player;
