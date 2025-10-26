const Player = require("./Player");

class Game {
  constructor() {
    this.playerList = [];
    this.time = 60;
    this.totalTime = 60;
    this.totalRounds = 3;
    this.currentRound = 1;
    this.currentFrame = null;
    this.correctAnswer = null;
    this.isStarted = false;
    this.usedFrames = [];
    this.correct = false;
  }

  getUnUsedFrame(allFrames) {
    const unUsedFrames = allFrames.filter((frame) => !this.usedFrames.includes(frame));

    if (unUsedFrames.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * unUsedFrames.length);
    const selectedFrame = unUsedFrames[randomIndex];

    this.usedFrames.push(selectedFrame);

    return selectedFrame;
  }
  //add new frame
  setNewFrame(frame, answer) {
    this.currentFrame = frame;
    this.correctAnswer = answer;
  }

  //add player to playerList
  addPlayer(player) {
    this.playerList.push(player);
  }

  //get playerList
  getPlayers() {
    return this.playerList;
  }

  //remove player
  removePlayer(playerToRemove) {
    this.playerList = this.playerList.filter(
      (player) => player.id !== playerToRemove
    );
  }

  //method check for last round
  checkForLastRound() {
    return this.currentRound === this.totalRounds;
  }

  // method get time
  getTime() {
    return this.time;
  }

  // method to tell game that one second passed and to update the timer.
  oneSecondPassed() {
    this.time--;
  }

  // starting the game
  startGame() {
    this.isStarted = true;
  }

  //start new round
  startNewRound() {
    this.playerList.forEach((player) => {
      player.hasGuessed = false;
    });
    this.currentRound++;
  }

  //method to reset the game
  reset() {
    this.time = this.totalTime;
    this.totalRounds = 5;
    this.currentRound = 1;
    this.isStarted = false;
    this.currentFrame = null;
    this.correctAnswer = null;
    this.usedFrames = [];
    this.playerList.forEach((player) => {
      player.hasGuessed = false;
      player.resetScore();
    });

  }

  //reset singleGame
  singleGameReset() {
    this.usedFrames = [];
    this.correct = false;
    this.currentFrame = null;
    this.correctAnswer = null;
    this.playerList.forEach((player) => {
      player.resetScore();
    });
  }

  resetTimer() {
    this.time = this.totalTime;
  }

  //get users who have guessed
  getGuessedUsers() {
    return this.playerList.filter((player) => player.hasGuessed);
  }

  //method to check if everyone has guessed
  hasEveryoneGuessed() {
    if (this.getGuessedUsers().length === this.playerList.length) {
      return true;
    } else {
      return false;
    }
  }

  //reset player state
  resetPlayerState() {
    this.playerList.forEach((player) => player.resetState());
  }
}


module.exports = Game;