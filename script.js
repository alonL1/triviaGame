class TriviaGame {
    constructor() {
        this.currentScreen = 'topic-screen';
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.scores = { player1: 0, player2: 0 };
        this.playerSelections = { player1: null, player2: null };
        this.timer = null;
        this.timeLeft = 15;
        this.gameInProgress = false;
        this.questionAnswered = false;

        this.initializeEventListeners();
        this.bindKeyboardEvents();
    }

    initializeEventListeners() {
        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            const topic = document.getElementById('topic-input').value.trim();
            if (topic) {
                this.startGame(topic);
            } else {
                alert('Please enter a topic!');
            }
        });

        // Play again button
        document.getElementById('play-again-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Enter key on topic input
        document.getElementById('topic-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('start-game-btn').click();
            }
        });
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameInProgress || this.questionAnswered) return;

            const key = e.key.toLowerCase();
            let selectedIndex = null;
            let player = null;

            // Player 1 controls (WASD)
            switch(key) {
                case 'w': selectedIndex = 0; player = 'player1'; break;
                case 'a': selectedIndex = 1; player = 'player1'; break;
                case 's': selectedIndex = 2; player = 'player1'; break;
                case 'd': selectedIndex = 3; player = 'player1'; break;
            }

            // Player 2 controls (Arrow keys)
            switch(key) {
                case 'arrowup': selectedIndex = 0; player = 'player2'; break;
                case 'arrowleft': selectedIndex = 1; player = 'player2'; break;
                case 'arrowdown': selectedIndex = 2; player = 'player2'; break;
                case 'arrowright': selectedIndex = 3; player = 'player2'; break;
            }

            if (selectedIndex !== null && player) {
                e.preventDefault();
                this.selectAnswer(player, selectedIndex);
            }
        });
    }

    async startGame(topic) {
        this.showScreen('loading-screen');
        document.getElementById('loading-topic').textContent = topic;

        try {
            await this.generateQuestions(topic);
            this.showScreen('game-screen');
            this.gameInProgress = true;
            this.currentQuestionIndex = 0;
            this.scores = { player1: 0, player2: 0 };
            this.updateScoreDisplay();
            this.showQuestion();
        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Sorry, there was an error generating questions. Please try again.');
            this.showScreen('topic-screen');
        }
    }

    async generateQuestions(topic) {
        try {
            // Try to fetch from API first
            const response = await fetch('/api/generate-questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic })
            });

            if (response.ok) {
                const data = await response.json();
                this.questions = data.questions;

                // Update loading message based on source
                const loadingTopic = document.getElementById('loading-topic');
                if (data.source === 'openai') {
                    loadingTopic.innerHTML = `<strong>${topic}</strong> trivia with AI-generated questions! 🤖`;
                } else {
                    loadingTopic.innerHTML = `<strong>${topic}</strong> trivia with curated questions! 📝`;
                }

                if (data.warning) {
                    console.warn('API Warning:', data.warning);
                }
            } else {
                throw new Error('API request failed');
            }
        } catch (error) {
            console.warn('API unavailable, using fallback questions:', error);
            // Fallback to local questions if API is unavailable
            this.questions = await this.getFallbackQuestions(topic);
        }
    }

    async getFallbackQuestions(topic) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Fallback questions for when API is unavailable
        const fallbackQuestions = {
            science: [
                {
                    question: "What is the chemical symbol for gold?",
                    answers: ["Au", "Ag", "Go", "Gd"],
                    correct: 0
                },
                {
                    question: "How many bones are in the adult human body?",
                    answers: ["206", "208", "204", "210"],
                    correct: 0
                },
                {
                    question: "What planet is known as the Red Planet?",
                    answers: ["Mars", "Venus", "Jupiter", "Saturn"],
                    correct: 0
                },
                {
                    question: "What gas makes up about 78% of Earth's atmosphere?",
                    answers: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
                    correct: 0
                },
                {
                    question: "What is the speed of light in a vacuum?",
                    answers: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "298,792,458 m/s"],
                    correct: 0
                }
            ],
            history: [
                {
                    question: "In which year did World War II end?",
                    answers: ["1945", "1944", "1946", "1943"],
                    correct: 0
                },
                {
                    question: "Who was the first person to walk on the moon?",
                    answers: ["Neil Armstrong", "Buzz Aldrin", "John Glenn", "Alan Shepard"],
                    correct: 0
                },
                {
                    question: "Which ancient wonder of the world was located in Alexandria?",
                    answers: ["Lighthouse of Alexandria", "Hanging Gardens", "Colossus of Rhodes", "Temple of Artemis"],
                    correct: 0
                },
                {
                    question: "What year did the Berlin Wall fall?",
                    answers: ["1989", "1987", "1991", "1985"],
                    correct: 0
                },
                {
                    question: "Who was the first President of the United States?",
                    answers: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"],
                    correct: 0
                }
            ],
            movies: [
                {
                    question: "Who directed the movie 'Jaws'?",
                    answers: ["Steven Spielberg", "George Lucas", "Martin Scorsese", "Francis Ford Coppola"],
                    correct: 0
                },
                {
                    question: "Which movie won the Academy Award for Best Picture in 1994?",
                    answers: ["Forrest Gump", "Pulp Fiction", "The Lion King", "The Shawshank Redemption"],
                    correct: 0
                },
                {
                    question: "What is the highest-grossing film of all time?",
                    answers: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
                    correct: 0
                },
                {
                    question: "Who played the character of Jack Sparrow?",
                    answers: ["Johnny Depp", "Orlando Bloom", "Geoffrey Rush", "Keira Knightley"],
                    correct: 0
                },
                {
                    question: "In which year was the first Star Wars movie released?",
                    answers: ["1977", "1975", "1979", "1980"],
                    correct: 0
                }
            ]
        };

        // Try to match topic to existing categories
        const topicKey = topic.toLowerCase();
        if (fallbackQuestions[topicKey]) {
            return fallbackQuestions[topicKey];
        }

        // Generate generic questions for any topic
        return this.generateGenericQuestions(topic);
    }

    generateGenericQuestions(topic) {
        return [
            {
                question: `What is a key characteristic of ${topic}?`,
                answers: ["Complexity", "Simplicity", "Rarity", "Abundance"],
                correct: 0
            },
            {
                question: `When did ${topic} first become popular?`,
                answers: ["20th century", "19th century", "18th century", "21st century"],
                correct: 0
            },
            {
                question: `Which field is most associated with ${topic}?`,
                answers: ["General knowledge", "Specialized study", "Entertainment", "Sports"],
                correct: 0
            },
            {
                question: `What makes ${topic} interesting to study?`,
                answers: ["Its depth", "Its simplicity", "Its age", "Its novelty"],
                correct: 0
            },
            {
                question: `How would you describe ${topic} to a beginner?`,
                answers: ["Fascinating subject", "Boring topic", "Too complex", "Very simple"],
                correct: 0
            }
        ];
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        this.questionAnswered = false;
        this.playerSelections = { player1: null, player2: null };

        // Update question counter
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;

        // Show question
        document.getElementById('question-text').textContent = question.question;

        // Show answers
        question.answers.forEach((answer, index) => {
            document.getElementById(`answer-${index}`).textContent = answer;
        });

        // Reset answer options styling
        document.querySelectorAll('.answer-option').forEach(option => {
            option.className = 'answer-option';
        });

        // Reset player selections display
        this.updatePlayerSelections();

        // Start timer
        this.startTimer();
    }

    selectAnswer(player, answerIndex) {
        if (this.questionAnswered) return;

        this.playerSelections[player] = answerIndex;
        this.updatePlayerSelections();
        this.highlightPlayerSelection(player, answerIndex);

        // Check if both players have answered
        if (this.playerSelections.player1 !== null && this.playerSelections.player2 !== null) {
            this.processAnswers();
        }
    }

    highlightPlayerSelection(player, answerIndex) {
        // Remove previous selections for this player
        document.querySelectorAll(`.selected-${player}`).forEach(el => {
            el.classList.remove(`selected-${player}`);
        });

        // Add selection highlight
        const answerOption = document.querySelector(`[data-index="${answerIndex}"]`);
        answerOption.classList.add(`selected-${player}`);
    }

    updatePlayerSelections() {
        const getAnswerText = (index) => {
            if (index === null) return 'No selection';
            const letters = ['A', 'B', 'C', 'D'];
            return `${letters[index]} - ${this.questions[this.currentQuestionIndex].answers[index]}`;
        };

        document.getElementById('player1-selection').textContent = getAnswerText(this.playerSelections.player1);
        document.getElementById('player2-selection').textContent = getAnswerText(this.playerSelections.player2);
    }

    startTimer() {
        this.timeLeft = 15;
        this.updateTimerDisplay();

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.processAnswers();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        document.getElementById('timer-text').textContent = this.timeLeft;
        const percentage = (this.timeLeft / 15) * 100;
        document.getElementById('timer-fill').style.width = percentage + '%';
    }

    processAnswers() {
        if (this.questionAnswered) return;

        this.questionAnswered = true;
        clearInterval(this.timer);

        const question = this.questions[this.currentQuestionIndex];
        const correctIndex = question.correct;

        // Highlight correct answer
        document.querySelector(`[data-index="${correctIndex}"]`).classList.add('correct');

        // Check player answers and update scores
        if (this.playerSelections.player1 === correctIndex) {
            this.scores.player1++;
        } else if (this.playerSelections.player1 !== null) {
            document.querySelector(`[data-index="${this.playerSelections.player1}"]`).classList.add('incorrect');
        }

        if (this.playerSelections.player2 === correctIndex) {
            this.scores.player2++;
        } else if (this.playerSelections.player2 !== null) {
            document.querySelector(`[data-index="${this.playerSelections.player2}"]`).classList.add('incorrect');
        }

        this.updateScoreDisplay();

        // Move to next question after delay
        setTimeout(() => {
            this.currentQuestionIndex++;
            this.showQuestion();
        }, 3000);
    }

    updateScoreDisplay() {
        document.getElementById('player1-score').textContent = this.scores.player1;
        document.getElementById('player2-score').textContent = this.scores.player2;
    }

    endGame() {
        this.gameInProgress = false;
        this.showScreen('results-screen');

        // Update final scores
        document.getElementById('final-player1-score').textContent = this.scores.player1;
        document.getElementById('final-player2-score').textContent = this.scores.player2;

        // Determine winner
        const winnerAnnouncement = document.getElementById('winner-announcement');
        if (this.scores.player1 > this.scores.player2) {
            winnerAnnouncement.innerHTML = '<h2>Player 1 Wins! 🎉</h2>';
        } else if (this.scores.player2 > this.scores.player1) {
            winnerAnnouncement.innerHTML = '<h2>Player 2 Wins! 🎉</h2>';
        } else {
            winnerAnnouncement.innerHTML = '<h2>It\'s a Tie! 🤝</h2>';
        }
    }

    resetGame() {
        this.currentQuestionIndex = 0;
        this.scores = { player1: 0, player2: 0 };
        this.playerSelections = { player1: null, player2: null };
        this.gameInProgress = false;
        this.questionAnswered = false;
        clearInterval(this.timer);

        // Clear topic input
        document.getElementById('topic-input').value = '';

        this.showScreen('topic-screen');
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TriviaGame();
});

// Add some visual feedback for key presses
document.addEventListener('keydown', (e) => {
    const keyMappings = {
        'w': 0, 'a': 1, 's': 2, 'd': 3,
        'arrowup': 0, 'arrowleft': 1, 'arrowdown': 2, 'arrowright': 3
    };

    const key = e.key.toLowerCase();
    if (keyMappings.hasOwnProperty(key)) {
        const answerIndex = keyMappings[key];
        const answerOption = document.querySelector(`[data-index="${answerIndex}"]`);
        if (answerOption) {
            answerOption.style.transform = 'scale(0.95)';
            setTimeout(() => {
                answerOption.style.transform = '';
            }, 100);
        }
    }
});