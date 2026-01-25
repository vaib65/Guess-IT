 class Player {
   constructor(id, username) {
     this.id = id;
     this.username = username;
     this.score = 0;
     this.hasGuessed = false;
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

export default Player