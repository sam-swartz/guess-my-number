'use strict';

const gmnDataManager = {
    maxNum: 20,
    score: 10,
    hp: 5,
    highScore: 0,
    gameStatus: 'neutral',
    generateSecretNumber: function() {
        this.secretNumber = Math.trunc(Math.random() * this.maxNum) + 1;
    },
    displayMessage: function(message) {
        document.querySelector('.message').textContent = message;
    },
    displayScore: function() {
        document.querySelector('.score').textContent = this.score;
    },
    displayHighScore: function() {
        document.querySelector('.highscore').textContent = this.highScore;
    },
    displayHalfHp: function(hpCount) {
        document.querySelector(`.hp${hpCount}`).style.backgroundImage =
            "url('./assets/icon/half-hp-icon.svg')";
        document.querySelector(`.hp${hpCount}`).style.width = '60px';
        document.querySelector(`.hp${hpCount}`).style.scale = 1.2;

        // setTimeout(this.changeBodyBg('#A93226'), 1000);
        // this.changeBodyBg('#222');
    },
    hideHp: function(hpCount) {
        document.querySelector(`.hp${hpCount}`).style.display = 'none';

        // setTimeout(this.changeBodyBg('#A93226'), 1000);
        // this.changeBodyBg('#222');
    },
    hpStatusReverse: function() {
        const hpIcons = document.querySelectorAll('.hp-icon');
        hpIcons.forEach(e => {
            e.style.backgroundImage = "url('./assets/icon/hp-icon.svg')";
            e.style.width = '50px';
            e.style.scale = 1;
            e.style.display = 'block';
        });
    },
    disableElements: function(value) {
        if (this.gameStatus === 'game over' || 'win' || 'highscored win') {
            document.querySelector('.guess').disabled = value;
            document.querySelector('.check').disabled = value;
        }
    },
    changeBodyBg: function(bgColor) {
        document.querySelector('body').style.backgroundColor = bgColor;
    },
    numberStyleWidth: function(width) {
        document.querySelector('.number').style.width = width;
    },
    guessChecker: function() {
        const guess = Number(document.querySelector('.guess').value);

        // When there is NO Input
        if (!guess) {
            this.displayMessage('⛔ No Number!');
        }

        // when the Guess are -negative
        else if (guess < 0) {
            this.displayMessage('Negative Numbers are not allowed! ❌');
        }

        // when the Guess above max number
        else if (guess > this.maxNum) {
            this.displayMessage(`Above ${this.maxNum} not allowed to guess! ❌`);
        }

        // when the Guess was Correct
        else if (guess === this.secretNumber) {
            document.querySelector('.number').textContent = this.secretNumber;
            this.gameStatus = 'win';
            this.displayMessage('🎉 Correct Number!');
            this.changeBodyBg('#60b347');
            this.numberStyleWidth('30rem');
            startConfettiTimer(2000);
            this.disableElements(true);

            if (this.highScore < this.score) {
                this.gameStatus = 'highscored win';
                this.highScoreVictoryEffect.play();
                this.highScore = this.score;
                this.displayHighScore();
                this.disableElements(true);
            } else {
                this.victoryEffect.play();
            }
        }

        //When the Guess was Different
        else if (guess !== this.secretNumber) {
            if (this.score > 1) {
                this.displayMessage(
                    guess >= this.secretNumber - 5 && guess < this.secretNumber ?
                    '📉 Guessing Number is little Low!' :
                    guess <= this.secretNumber + 5 && guess > this.secretNumber ?
                    '📈 Guessing Number is little High!' :
                    guess < this.secretNumber - 5 ?
                    '📉 Guessing Number is Too Low!' :
                    '📈 Guessing Number is too High!'
                );
                this.score--;
                this.scoreCheckHp = this.score % 2;

                if (this.scoreCheckHp) {
                    this.displayHalfHp(this.hp);
                } else {
                    this.hideHp(this.hp);
                    this.hp--;
                }
                this.displayScore();
                this.hitEffect.play();
            }

            // Game Over
            else {
                this.gameStatus = 'game over';
                this.gameOverEffect.play();
                this.displayMessage('🤕 Game Over!');
                this.score = 0;
                this.disableElements(true);
                if (this.score <= 0) {
                    this.hideHp(1);
                }
                this.displayScore();
                this.changeBodyBg('#A93226');
            }
        }
    },
    restartAgain: function() {
        this.generateSecretNumber();
        this.score = 10;
        this.hp = 5;
        this.gameStatus = 'neutral';

        this.displayMessage('Start guessing...');
        this.changeBodyBg('#222');
        this.numberStyleWidth('15rem');

        this.displayScore();
        document.querySelector('.number').textContent = '?';
        document.querySelector('.guess').value = '';
        this.disableElements(false);
        this.hpStatusReverse();

        console.log(this.score, this.secretNumber);
    },
    hitEffect: document.querySelector('.hitEffect'),
    victoryEffect: document.querySelector('.victoryEffect'),
    highScoreVictoryEffect: document.querySelector('.highScoreVictoryEffect'),
    gameOverEffect: document.querySelector('.gameOverEffect'),
};

gmnDataManager.generateSecretNumber();

document.querySelector('.check').addEventListener('click', function() {
    gmnDataManager.guessChecker();
});

document.querySelector('.again').addEventListener('click', function() {
    gmnDataManager.restartAgain();
});

document.addEventListener('keydown', function(e) {
    if (gmnDataManager.gameStatus === 'neutral') {
        if (e.key === 'ArrowUp') {
            let guess = document.querySelector('.guess').value;
            guess++;
            document.querySelector('.guess').value = guess;
        } else if (e.key === 'ArrowDown') {
            let guess = document.querySelector('.guess').value;
            guess--;
            document.querySelector('.guess').value = guess;
        } else if (e.key === 'Enter') gmnDataManager.guessChecker();
    } else {
        e.preventDefault();
        return false;
    }
});

// ---------- Custom Modal Functionalitys  ---------- //

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const showModalBtn = document.querySelector('.show-modal');
const hideModalBtn = document.querySelector('.close-modal');

const showModal = function() {
    if (
        modal.classList.contains('hidden') &&
        overlay.classList.contains('hidden')
    ) {
        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }
};

const hideModal = function() {
    if (!modal.classList.contains('hidden') &&
        !overlay.classList.contains('hidden')
    ) {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
};

showModalBtn.addEventListener('click', showModal);
hideModalBtn.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hideModal();
});