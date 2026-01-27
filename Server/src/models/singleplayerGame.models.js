class SingleGame {
    constructor() {
        this.usedFrames = [];
        this.currentFrame = null;
        this.correctAnswer = null;
        this.isOver = false;
        this.score = 0;
    }

    getUnUsedFrame(frames) {
        //filter frames which are not used  
        const available = frames.filter((f) => !this.usedFrames.includes(f));
        if (!available.length) return null;

        //select random frame from available frames
        const frame = available[Math.floor(Math.random() * available.length)];
        this.usedFrames.push(frame);
        return frame;
    }

    setFrame(frame, answer) {
        this.currentFrame = frame,
        this.correctAnswer=answer
    }

    submitGuess(guess) {
        if (this.isOver) return { over: true }
        
        if (guess.trim().toLowerCase() === this.correctAnswer.toLowerCase()) {
            this.score++;
            return {correct:true,score:this.score}
        }
            
        this.isOver = true;
        return {correct:false,score:this.score}
    }

    reset() {
        this.usedFrames = [];
        this.currentFrame = null;
        this.correctAnswer = null;
        this.score = 0;
        this.isOver = false;
    }
}
export default SingleGame;
