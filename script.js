// Game variables
let currentLevel = 1;
let score = 0;
let lives = 3;
let currentPuzzle = null;
let timer = null;
let timeLeft = 30;
let isAnswered = false;
let currentLanguage = 'en';
let questionCounter = 0;
let sequentialOrder = ['addition', 'subtraction', 'multiplication', 'division', 'square', 'cube', 'squareRoot'];
let isMultiStep = false;

// Puzzle types
const puzzleTypes = [
    'addition',
    'subtraction', 
    'multiplication',
    'division',
    'square',
    'cube',
    'squareRoot',
    'mixed'
];

// Initialize game
function initGame() {
    soundManager.resumeAudio(); // Resume audio context for browsers
    updateDisplay();
    generatePuzzle();
}

// Generate math puzzle
function generatePuzzle() {
    isAnswered = false;
    hideMessage();
    document.getElementById('nextBtn').style.display = 'none';
    
    // Reset timer
    clearInterval(timer);
    timeLeft = Math.max(15, 35 - currentLevel * 2); // Timer gets shorter as levels increase
    updateTimer();
    startTimer();
    
    // Select puzzle type based on level (sequential order)
    let puzzleType;
    if (currentLevel <= 2) {
        puzzleType = 'addition';
    } else if (currentLevel <= 4) {
        // Sequential: addition → subtraction
        puzzleType = sequentialOrder[questionCounter % 2];
    } else if (currentLevel <= 6) {
        // Sequential: addition → subtraction → multiplication
        puzzleType = sequentialOrder[questionCounter % 3];
    } else if (currentLevel <= 8) {
        // Sequential: addition → subtraction → multiplication → division
        puzzleType = sequentialOrder[questionCounter % 4];
    } else if (currentLevel <= 10) {
        // Sequential: addition → subtraction → multiplication → division → square
        puzzleType = sequentialOrder[questionCounter % 5];
    } else if (currentLevel <= 12) {
        // Sequential: addition → subtraction → multiplication → division → square → cube
        puzzleType = sequentialOrder[questionCounter % 6];
    } else if (currentLevel <= 15) {
        // Sequential: all operations including square root
        puzzleType = sequentialOrder[questionCounter % 7];
    } else {
        // Level 16+: Sequential through all operations
        puzzleType = sequentialOrder[questionCounter % 7];
    }
    
    questionCounter++; // Increment for next question
    
    // Randomly decide if this should be a multi-step question (30% chance for levels 5+)
    if (currentLevel >= 5 && Math.random() < 0.3) {
        isMultiStep = true;
    } else {
        isMultiStep = false;
    }
    
    currentPuzzle = createPuzzle(puzzleType);
    displayPuzzle();
}

// Create specific puzzle
function createPuzzle(type) {
    let num1, num2, answer, question, options;
    
    switch(type) {
        case 'addition':
            if (isMultiStep) {
                // Multi-step addition: 5+3+8+4 = ?
                const numCount = Math.floor(Math.random() * 3) + 3; // 3-5 numbers
                const numbers = [];
                answer = 0;
                for (let i = 0; i < numCount; i++) {
                    const num = Math.floor(Math.random() * (currentLevel * 5)) + 1;
                    numbers.push(num);
                    answer += num;
                }
                question = numbers.join(' + ') + ' = ?';
            } else {
                // Single-step addition
                num1 = Math.floor(Math.random() * (currentLevel * 10)) + 1;
                num2 = Math.floor(Math.random() * (currentLevel * 10)) + 1;
                answer = num1 + num2;
                question = `${num1} + ${num2} = ?`;
            }
            break;
            
        case 'subtraction':
            if (isMultiStep) {
                // Multi-step subtraction: 50-10-5-3 = ?
                const numCount = Math.floor(Math.random() * 2) + 2; // 2-3 subtractions
                const numbers = [];
                let total = Math.floor(Math.random() * (currentLevel * 20)) + 30;
                numbers.push(total);
                answer = total;
                
                for (let i = 0; i < numCount; i++) {
                    const num = Math.floor(Math.random() * (currentLevel * 5)) + 1;
                    if (answer > num) {
                        numbers.push(num);
                        answer -= num;
                    } else {
                        numbers.push(1);
                        answer -= 1;
                    }
                }
                question = numbers.join(' - ') + ' = ?';
            } else {
                // Single-step subtraction
                num1 = Math.floor(Math.random() * (currentLevel * 10)) + 10;
                num2 = Math.floor(Math.random() * num1) + 1;
                answer = num1 - num2;
                question = `${num1} - ${num2} = ?`;
            }
            break;
            
        case 'multiplication':
            if (isMultiStep) {
                // Multi-step multiplication: 2×3×4 = ?
                const numCount = Math.floor(Math.random() * 2) + 2; // 2-3 multiplications
                const numbers = [];
                answer = 1;
                for (let i = 0; i < numCount; i++) {
                    const num = Math.floor(Math.random() * Math.min(currentLevel + 2, 6)) + 1;
                    numbers.push(num);
                    answer *= num;
                }
                question = numbers.join(' × ') + ' = ?';
            } else {
                // Single-step multiplication
                num1 = Math.floor(Math.random() * Math.min(currentLevel + 5, 12)) + 1;
                num2 = Math.floor(Math.random() * Math.min(currentLevel + 5, 12)) + 1;
                answer = num1 * num2;
                question = `${num1} × ${num2} = ?`;
            }
            break;
            
        case 'division':
            if (isMultiStep) {
                // Multi-step division: 48 ÷ 2 ÷ 4 = ?
                const numCount = Math.floor(Math.random() * 2) + 2; // 2-3 divisions
                const numbers = [];
                answer = Math.floor(Math.random() * Math.min(currentLevel + 3, 8)) + 2;
                
                for (let i = 0; i < numCount; i++) {
                    const divisor = Math.floor(Math.random() * Math.min(currentLevel + 2, 6)) + 1;
                    numbers.unshift(answer * divisor);
                    answer = divisor;
                }
                
                // Build the question from left to right
                let result = numbers[0];
                question = `${result}`;
                for (let i = 1; i < numbers.length; i++) {
                    question += ` ÷ ${numbers[i]}`;
                    result = Math.floor(result / numbers[i]);
                }
                answer = result;
                question += ' = ?';
            } else {
                // Single-step division
                num2 = Math.floor(Math.random() * Math.min(currentLevel + 3, 10)) + 1;
                answer = Math.floor(Math.random() * Math.min(currentLevel + 5, 10)) + 1;
                num1 = num2 * answer;
                question = `${num1} ÷ ${num2} = ?`;
            }
            break;
            
        case 'square':
            num1 = Math.floor(Math.random() * Math.min(currentLevel + 5, 15)) + 1;
            answer = num1 * num1;
            question = `${num1}² = ?`;
            break;
            
        case 'cube':
            num1 = Math.floor(Math.random() * Math.min(currentLevel + 2, 8)) + 1;
            answer = num1 * num1 * num1;
            question = `${num1}³ = ?`;
            break;
            
        case 'squareRoot':
            answer = Math.floor(Math.random() * Math.min(currentLevel + 5, 15)) + 1;
            num1 = answer * answer;
            question = `√${num1} = ?`;
            break;
            
        case 'mixed':
            // Use sequential order even for mixed mode
            return createPuzzle(sequentialOrder[questionCounter % 7]);
    }
    
    // Generate wrong options
    options = [answer];
    while (options.length < 4) {
        let wrongOption;
        if (Math.random() < 0.5) {
            wrongOption = answer + Math.floor(Math.random() * 10) - 5;
        } else {
            wrongOption = answer + Math.floor(Math.random() * 20) - 10;
        }
        
        if (wrongOption > 0 && !options.includes(wrongOption)) {
            options.push(wrongOption);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    return {
        question: question,
        answer: answer,
        options: options
    };
}

// Display puzzle
function displayPuzzle() {
    document.getElementById('puzzleQuestion').textContent = currentPuzzle.question;
    
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    currentPuzzle.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option, button);
        optionsContainer.appendChild(button);
    });
}

// Check answer
function checkAnswer(selectedAnswer, buttonElement) {
    if (isAnswered) return;
    
    isAnswered = true;
    clearInterval(timer);
    
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.style.pointerEvents = 'none');
    
    if (selectedAnswer === currentPuzzle.answer) {
        buttonElement.classList.add('correct');
        score += currentLevel * 10;
        soundManager.playCorrectSound();
        showMessage(translations[currentLanguage].correct, 'success');
        
        // Level up every 3 correct answers
        if (score > 0 && score % 30 === 0) {
            currentLevel++;
            soundManager.playLevelUpSound();
            showMessage(`${translations[currentLanguage].correct} ${translations[currentLanguage].levelUp} ${currentLevel}!`, 'success');
        }
    } else {
        buttonElement.classList.add('wrong');
        lives--;
        soundManager.playWrongSound();
        showMessage(`${translations[currentLanguage].wrong} ${currentPuzzle.answer}.`, 'error');
        
        // Show correct answer
        buttons.forEach(btn => {
            if (btn.textContent == currentPuzzle.answer) {
                btn.classList.add('correct');
            }
        });
        
        if (lives <= 0) {
            setTimeout(gameOver, 2000);
            return;
        }
    }
    
    updateDisplay();
    document.getElementById('nextBtn').style.display = 'inline-block';
}

// Next puzzle
function nextPuzzle() {
    generatePuzzle();
}

// Timer functions
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 5) {
        document.getElementById('timer').style.color = '#ff0000';
        if (timeLeft <= 3) {
            soundManager.playTimerWarning(); // Play warning tick sound
        }
    } else {
        document.getElementById('timer').style.color = '#ff416c';
    }
}

function timeUp() {
    if (isAnswered) return;
    
    isAnswered = true;
    lives--;
    soundManager.playWrongSound();
    showMessage(`${translations[currentLanguage].timeUp} ${currentPuzzle.answer}.`, 'error');
    
    // Show correct answer
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => {
        btn.style.pointerEvents = 'none';
        if (btn.textContent == currentPuzzle.answer) {
            btn.classList.add('correct');
        }
    });
    
    updateDisplay();
    
    if (lives <= 0) {
        setTimeout(gameOver, 2000);
    } else {
        document.getElementById('nextBtn').style.display = 'inline-block';
    }
}

// Display functions
function updateDisplay() {
    document.getElementById('level').textContent = currentLevel;
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
    messageEl.style.display = 'block';
}

function hideMessage() {
    document.getElementById('message').style.display = 'none';
}

// Game over
function gameOver() {
    clearInterval(timer);
    soundManager.playGameOverSound();
    
    // Save score to leaderboard
    saveScore();
    
    document.getElementById('puzzleContainer').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalLevel').textContent = currentLevel;
    document.getElementById('timer').style.display = 'none';
}

// Restart game
function restartGame() {
    currentLevel = 1;
    score = 0;
    lives = 3;
    timeLeft = 30;
    isAnswered = false;
    
    document.getElementById('puzzleContainer').style.display = 'block';
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('timer').style.display = 'block';
    
    initGame();
}

// Language translations
const translations = {
    en: {
        title: 'Math Puzzle Game',
        description: 'Solve math problems and increase your score!',
        level: 'Level',
        score: 'Score',
        lives: 'Lives',
        time: 'Time',
        seconds: 'seconds',
        loading: 'Loading...',
        nextQuestion: 'Next Question',
        gameOver: '🎮 Game Over!',
        finalScore: 'Your Final Score',
        reachedLevel: 'You reached level',
        playAgain: 'Play Again',
        correct: 'Correct Answer! 🎉',
        wrong: 'Wrong Answer! 😔 The correct answer was',
        timeUp: "Time's Up! 😔 The correct answer was",
        levelUp: 'Advance to level'
    },
    hi: {
        title: 'मैथ पहेली गेम',
        description: 'गणित के प्रश्नों को हल करें और स्कोर बढ़ाएं!',
        level: 'स्तर',
        score: 'स्कोर',
        lives: 'जीवन',
        time: 'समय',
        seconds: 'सेकंड',
        loading: 'लोड हो रहा है...',
        nextQuestion: 'अगला प्रश्न',
        gameOver: '🎮 खेल समाप्त!',
        finalScore: 'आपका अंतिम स्कोर',
        reachedLevel: 'आपने',
        playAgain: 'फिर से खेलें',
        correct: 'सही जवाब! 🎉',
        wrong: 'गलत जवाब! 😔 सही जवाब',
        timeUp: 'समय समाप्त! 😔 सही जवाब',
        levelUp: 'स्तर में आगे बढ़ें'
    }
};

// Change language function
function changeLanguage(lang) {
    soundManager.playClickSound();
    currentLanguage = lang;
    updateLanguage();
    updateLanguageButtons();
}

// Toggle sound function
function toggleSound() {
    const isSoundEnabled = soundManager.toggleSound();
    const soundBtn = document.getElementById('soundBtn');
    soundBtn.textContent = isSoundEnabled ? '🔊' : '🔇';
    soundBtn.classList.toggle('muted', !isSoundEnabled);
    soundManager.playClickSound(); // Play click sound when toggling
}

// Update language buttons
function updateLanguageButtons() {
    document.getElementById('langEn').classList.toggle('active', currentLanguage === 'en');
    document.getElementById('langHi').classList.toggle('active', currentLanguage === 'hi');
}

// Update all text elements
function updateLanguage() {
    const t = translations[currentLanguage];
    document.getElementById('gameTitle').textContent = t.title;
    document.getElementById('gameDescription').textContent = t.description;
    document.getElementById('levelLabel').textContent = t.level;
    document.getElementById('scoreLabel').textContent = t.score;
    document.getElementById('livesLabel').textContent = t.lives;
    document.getElementById('timeLabel').textContent = t.time;
    document.getElementById('secondsLabel').textContent = t.seconds;
    document.getElementById('loadingText').textContent = t.loading;
    document.getElementById('nextQuestionText').textContent = t.nextQuestion;
    document.getElementById('gameOverTitle').textContent = t.gameOver;
    document.getElementById('finalScoreLabel').textContent = t.finalScore;
    document.getElementById('reachedLevelText').textContent = t.reachedLevel;
    document.getElementById('playAgainBtn').textContent = t.playAgain;
}

// Leaderboard functions
function saveScore() {
    const leaderboard = getLeaderboard();
    const newScore = {
        score: score,
        level: currentLevel,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now()
    };
    
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score); // Sort by score (highest first)
    
    // Keep only top 5 scores
    if (leaderboard.length > 5) {
        leaderboard.splice(5);
    }
    
    localStorage.setItem('mathPuzzleLeaderboard', JSON.stringify(leaderboard));
}

function getLeaderboard() {
    const saved = localStorage.getItem('mathPuzzleLeaderboard');
    return saved ? JSON.parse(saved) : [];
}

function showLeaderboard() {
    soundManager.playClickSound();
    const leaderboard = getLeaderboard();
    const leaderboardList = document.getElementById('leaderboardList');
    
    if (leaderboard.length === 0) {
        leaderboardList.innerHTML = '<p style="text-align: center; color: #666;">No high scores yet. Play to set records!</p>';
    } else {
        leaderboardList.innerHTML = '';
        leaderboard.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'leaderboard-entry';
            
            // Add special classes for top 3
            if (index === 0) entryDiv.classList.add('gold');
            else if (index === 1) entryDiv.classList.add('silver');
            else if (index === 2) entryDiv.classList.add('bronze');
            
            const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            
            entryDiv.innerHTML = `
                <span class="rank">${rankEmoji}</span>
                <div class="score-info">
                    <div class="score-value">${entry.score} points</div>
                    <div class="level-info">Level ${entry.level} • ${entry.date}</div>
                </div>
            `;
            
            leaderboardList.appendChild(entryDiv);
        });
    }
    
    // Update modal title based on language
    const t = translations[currentLanguage];
    document.getElementById('leaderboardTitle').textContent = `🏆 ${t.level} High Scores`;
    document.getElementById('clearScoresBtn').textContent = 'Clear All Scores';
    
    document.getElementById('leaderboardModal').style.display = 'block';
}

function closeLeaderboard() {
    soundManager.playClickSound();
    document.getElementById('leaderboardModal').style.display = 'none';
}

function clearLeaderboard() {
    if (confirm('Are you sure you want to clear all high scores?')) {
        soundManager.playClickSound();
        localStorage.removeItem('mathPuzzleLeaderboard');
        showLeaderboard(); // Refresh the display
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('leaderboardModal');
    if (event.target === modal) {
        closeLeaderboard();
    }
}

// Start game when page loads
window.onload = function() {
    initGame();
    updateLanguageButtons();
    // Add click sound to all buttons
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' && !e.target.onclick) {
            soundManager.playClickSound();
        }
    });
};
