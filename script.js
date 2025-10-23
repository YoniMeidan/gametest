// Game state
let currentLevel = 1;
let waitTime = 10000; // Initial wait time: 10 seconds
let displayTime = 1000; // Initial display time: 1 second
let currentNumber = '';
let isGameActive = false;
let animationSpeed = 3000; // Base animation speed in ms
let animalIntervals = []; // Store intervals for random movements

// Progress tracking
let levelHistory = {}; // Store level data: { levelNum: { retries, waitTime, displayTime, digits, animals } }
let completedLevels = []; // Array of completed level numbers

// Game settings (customizable)
let gameSettings = {
    waitTimeIncrease: 10, // Percentage increase per level
    displayTimeDecrease: 10, // Percentage decrease per level
    animalSpeedIncrease: 5, // Percentage increase per level
    animalStartLevel: 3, // Level to start adding animals
    animalsPerInterval: 3, // Add animals every X levels
    animalsCountIncrement: 3 // Number of animals to add each time
};

// DOM elements
const circle = document.getElementById('circle');
const numberDisplay = document.getElementById('number-display');
const levelDisplay = document.getElementById('level-display');
const statusMessage = document.getElementById('status-message');
const inputModal = document.getElementById('input-modal');
const successModal = document.getElementById('success-modal');
const failureModal = document.getElementById('failure-modal');
const settingsModal = document.getElementById('settings-modal');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const startGameBtn = document.getElementById('start-game-btn');
const correctNumberDisplay = document.getElementById('correct-number');
const clapSound = document.getElementById('clap-sound');
const monkeyContainer = document.getElementById('monkey-container');
const tooltipWait = document.getElementById('tooltip-wait');
const tooltipDisplay = document.getElementById('tooltip-display');
const tooltipDigits = document.getElementById('tooltip-digits');
const tooltipAnimals = document.getElementById('tooltip-animals');
const progressLevels = document.getElementById('progress-levels');

// Settings inputs
const waitTimeIncreaseInput = document.getElementById('wait-time-increase');
const displayTimeDecreaseInput = document.getElementById('display-time-decrease');
const animalSpeedIncreaseInput = document.getElementById('animal-speed-increase');
const animalStartLevelInput = document.getElementById('animal-start-level');
const animalsPerIntervalInput = document.getElementById('animals-per-interval');
const animalsCountIncrementInput = document.getElementById('animals-count-increment');

// Load settings from inputs
function loadSettings() {
    gameSettings.waitTimeIncrease = parseFloat(waitTimeIncreaseInput.value) || 10;
    gameSettings.displayTimeDecrease = parseFloat(displayTimeDecreaseInput.value) || 10;
    gameSettings.animalSpeedIncrease = parseFloat(animalSpeedIncreaseInput.value) || 5;
    gameSettings.animalStartLevel = parseInt(animalStartLevelInput.value) || 3;
    gameSettings.animalsPerInterval = parseInt(animalsPerIntervalInput.value) || 3;
    gameSettings.animalsCountIncrement = parseInt(animalsCountIncrementInput.value) || 3;
}

// Start game from settings
function startGameFromSettings() {
    loadSettings();
    settingsModal.classList.add('hidden');
    initGame();
}

// Initialize game
function initGame() {
    currentLevel = 1;
    waitTime = 10000;
    displayTime = 1000;
    animationSpeed = 3000;
    levelHistory = {};
    completedLevels = [];
    updateLevelDisplay();
    initLevelHistory();
    updateProgressBar();
    startLevel();
}

// Initialize level history for current level
function initLevelHistory() {
    if (!levelHistory[currentLevel]) {
        levelHistory[currentLevel] = {
            retries: 0,
            waitTime: waitTime,
            displayTime: displayTime,
            digits: getDigitsForLevel(currentLevel),
            animals: getAnimalCount(currentLevel)
        };
    }
}

// Update level display and tooltip
function updateLevelDisplay() {
    levelDisplay.childNodes[0].textContent = currentLevel;
    tooltipWait.textContent = (waitTime / 1000).toFixed(1) + 's';
    tooltipDisplay.textContent = (displayTime / 1000).toFixed(2) + 's';
    tooltipDigits.textContent = getDigitsForLevel(currentLevel);
    tooltipAnimals.textContent = getAnimalCount(currentLevel);
}

// Update progress bar with completed levels
function updateProgressBar() {
    progressLevels.innerHTML = '';

    // Add all levels that have been attempted or completed
    const allLevels = [...new Set([...completedLevels, currentLevel])].sort((a, b) => a - b);

    allLevels.forEach(level => {
        const levelData = levelHistory[level];
        if (!levelData) return;

        const levelIndicator = document.createElement('div');
        levelIndicator.className = 'level-indicator';
        if (level === currentLevel) {
            levelIndicator.classList.add('current');
        }

        // Level number
        const levelNumber = document.createElement('span');
        levelNumber.className = 'level-number';
        levelNumber.textContent = level;
        levelIndicator.appendChild(levelNumber);

        // Retry count (only show if > 0)
        if (levelData.retries > 0) {
            const retryCount = document.createElement('span');
            retryCount.className = 'retry-count';
            retryCount.textContent = levelData.retries;
            levelIndicator.appendChild(retryCount);
        }

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'progress-level-tooltip';
        tooltip.innerHTML = `
            <div>Level: ${level}</div>
            <div>Max Wait Time: ${(levelData.waitTime / 1000).toFixed(1)}s</div>
            <div>Display Time: ${(levelData.displayTime / 1000).toFixed(2)}s</div>
            <div>Digits: ${levelData.digits}</div>
            <div>Animals: ${levelData.animals}</div>
            <div>Retries: ${levelData.retries}</div>
        `;
        levelIndicator.appendChild(tooltip);

        // Click handler to jump to level
        levelIndicator.addEventListener('click', () => jumpToLevel(level));

        progressLevels.appendChild(levelIndicator);
    });
}

// Jump to a specific level
function jumpToLevel(level) {
    if (level === currentLevel) return; // Already on this level

    // Calculate the game state for the target level
    currentLevel = level;

    // Recalculate wait time, display time, and animation speed using settings
    const waitIncrease = 1 + (gameSettings.waitTimeIncrease / 100);
    const displayDecrease = 1 - (gameSettings.displayTimeDecrease / 100);
    const speedIncrease = 1 - (gameSettings.animalSpeedIncrease / 100);

    waitTime = 10000 * Math.pow(waitIncrease, level - 1);
    displayTime = Math.max(100, 1000 * Math.pow(displayDecrease, level - 1));
    animationSpeed = Math.max(500, 3000 * Math.pow(speedIncrease, level - 1));

    // Update level history if this level doesn't exist
    initLevelHistory();

    // Update displays
    updateLevelDisplay();
    updateProgressBar();

    // Start the level
    startLevel();
}

// Start a new level
function startLevel() {
    isGameActive = true;
    userInput.value = '';
    hideAllModals();

    // Calculate number of digits based on level
    const digits = getDigitsForLevel(currentLevel);

    // Calculate random wait time within the maximum wait time
    // Minimum of 2 seconds, maximum of the current waitTime setting
    const minWaitTime = Math.min(2000, waitTime);
    const actualWaitTime = minWaitTime + Math.random() * (waitTime - minWaitTime);

    // Show status message
    statusMessage.textContent = `Get ready... Number will appear within ${(waitTime / 1000).toFixed(1)} seconds`;

    // Add animal animations from the configured start level onwards
    if (currentLevel >= gameSettings.animalStartLevel) {
        addAnimalAnimations();
    } else {
        removeAnimalAnimations();
    }

    // Wait random time before showing the number
    setTimeout(() => {
        showNumber(digits);
    }, actualWaitTime);
}

// Calculate number of digits based on level
function getDigitsForLevel(level) {
    // Start with 4 digits, add 1 digit every 5 levels
    return 4 + Math.floor((level - 1) / 5);
}

// Calculate number of animals based on level
function getAnimalCount(level) {
    // No animals before the start level
    if (level < gameSettings.animalStartLevel) return 0;

    // Calculate how many intervals have passed since animals started
    const levelsSinceStart = level - gameSettings.animalStartLevel;
    const intervals = Math.floor(levelsSinceStart / gameSettings.animalsPerInterval) + 1;

    return gameSettings.animalsCountIncrement * intervals;
}

// Generate random number with specified digits
function generateRandomNumber(digits) {
    let number = '';
    for (let i = 0; i < digits; i++) {
        // First digit shouldn't be 0
        if (i === 0) {
            number += Math.floor(Math.random() * 9) + 1;
        } else {
            number += Math.floor(Math.random() * 10);
        }
    }
    return number;
}

// Show the number in the circle
function showNumber(digits) {
    currentNumber = generateRandomNumber(digits);
    numberDisplay.textContent = currentNumber;
    numberDisplay.classList.add('show');
    statusMessage.textContent = 'Remember this number!';

    // Hide the number after displayTime
    setTimeout(() => {
        numberDisplay.classList.remove('show');
        numberDisplay.textContent = '';
        statusMessage.textContent = 'What was the number?';

        // Show input modal
        setTimeout(() => {
            showInputModal();
        }, 300);
    }, displayTime);
}

// Show input modal
function showInputModal() {
    inputModal.classList.remove('hidden');
    userInput.focus();
}

// Hide all modals
function hideAllModals() {
    inputModal.classList.add('hidden');
    successModal.classList.add('hidden');
    failureModal.classList.add('hidden');
}

// Check user answer
function checkAnswer() {
    const userAnswer = userInput.value.trim();

    if (userAnswer === currentNumber) {
        // Correct answer
        hideAllModals();
        playClapSound();
        showSuccessModal();

        // Mark level as completed if not already
        if (!completedLevels.includes(currentLevel)) {
            completedLevels.push(currentLevel);
        }
        updateProgressBar();
    } else {
        // Wrong answer - increment retry count
        levelHistory[currentLevel].retries++;
        hideAllModals();
        showFailureModal();
        updateProgressBar();
    }
}

// Play clapping sound
function playClapSound() {
    // Try to play the sound file first
    clapSound.play().catch(err => {
        // If sound file doesn't exist, generate sound with Web Audio API
        playWebAudioClap();
    });
}

// Generate clapping sound using Web Audio API
function playWebAudioClap() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a series of short bursts to simulate clapping
        const times = [0, 0.15, 0.3];

        times.forEach(time => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // White noise effect
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime + time);

            // Quick attack and decay for clap sound
            gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + time + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.1);

            oscillator.start(audioContext.currentTime + time);
            oscillator.stop(audioContext.currentTime + time + 0.1);
        });

        // Add a higher frequency component for brightness
        const brightOsc = audioContext.createOscillator();
        const brightGain = audioContext.createGain();

        brightOsc.connect(brightGain);
        brightGain.connect(audioContext.destination);

        brightOsc.type = 'sine';
        brightOsc.frequency.setValueAtTime(800, audioContext.currentTime);

        brightGain.gain.setValueAtTime(0, audioContext.currentTime);
        brightGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
        brightGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        brightOsc.start(audioContext.currentTime);
        brightOsc.stop(audioContext.currentTime + 0.3);
    } catch (err) {
        console.log('Web Audio API not supported');
    }
}

// Show success modal
function showSuccessModal() {
    successModal.classList.remove('hidden');
}

// Show failure modal
function showFailureModal() {
    correctNumberDisplay.textContent = currentNumber;
    failureModal.classList.remove('hidden');
}

// Advance to next level
function nextLevel() {
    currentLevel++;

    // Apply custom wait time increase
    const waitIncrease = 1 + (gameSettings.waitTimeIncrease / 100);
    waitTime *= waitIncrease;

    // Apply custom display time decrease
    const displayDecrease = 1 - (gameSettings.displayTimeDecrease / 100);
    displayTime = Math.max(100, displayTime * displayDecrease);

    // Apply custom animation speed increase (faster = lower duration)
    const speedIncrease = 1 - (gameSettings.animalSpeedIncrease / 100);
    animationSpeed = Math.max(500, animationSpeed * speedIncrease);

    // Initialize level history for new level
    initLevelHistory();

    updateLevelDisplay();
    updateProgressBar();
    startLevel();
}

// Retry current level
function retryLevel() {
    startLevel();
}

// Add animal animations
function addAnimalAnimations() {
    // Clear existing animals and intervals
    removeAnimalAnimations();

    const animalCount = getAnimalCount(currentLevel);
    const animalEmojis = ['🐵', '🙈', '🙉', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐔', '🦆', '🦉'];

    for (let i = 0; i < animalCount; i++) {
        const animal = document.createElement('div');
        animal.className = 'animal';
        animal.textContent = animalEmojis[i % animalEmojis.length];

        // Random starting position
        animal.style.left = Math.random() * 80 + 10 + '%';
        animal.style.top = Math.random() * 80 + 10 + '%';

        monkeyContainer.appendChild(animal);

        // Start random movement for this animal
        startRandomMovement(animal);
    }
}

// Remove animal animations
function removeAnimalAnimations() {
    // Clear all intervals
    animalIntervals.forEach(interval => clearInterval(interval));
    animalIntervals = [];

    // Clear all animals
    monkeyContainer.innerHTML = '';
}

// Start random movement for an animal
function startRandomMovement(animal) {
    // Update position at regular intervals based on current animation speed
    const interval = setInterval(() => {
        // Random target position
        const targetLeft = Math.random() * 80 + 10;
        const targetTop = Math.random() * 80 + 10;

        // Random rotation
        const rotation = Math.random() * 720 - 360;

        // Random scale
        const scale = 0.8 + Math.random() * 0.7;

        // Apply smooth transition
        animal.style.transition = `all ${animationSpeed}ms linear`;
        animal.style.left = targetLeft + '%';
        animal.style.top = targetTop + '%';
        animal.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    }, animationSpeed);

    animalIntervals.push(interval);
}

// Event listeners
submitBtn.addEventListener('click', checkAnswer);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

nextLevelBtn.addEventListener('click', nextLevel);

tryAgainBtn.addEventListener('click', retryLevel);

startGameBtn.addEventListener('click', startGameFromSettings);

// Show settings modal when page loads
window.addEventListener('load', () => {
    settingsModal.classList.remove('hidden');
});
