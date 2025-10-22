// Game state
let currentLevel = 1;
let waitTime = 10000; // Initial wait time: 10 seconds
let displayTime = 1000; // Initial display time: 1 second
let currentNumber = '';
let isGameActive = false;
let animationSpeed = 3000; // Base animation speed in ms
let animalIntervals = []; // Store intervals for random movements

// DOM elements
const circle = document.getElementById('circle');
const numberDisplay = document.getElementById('number-display');
const levelDisplay = document.getElementById('level-display');
const statusMessage = document.getElementById('status-message');
const inputModal = document.getElementById('input-modal');
const successModal = document.getElementById('success-modal');
const failureModal = document.getElementById('failure-modal');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const correctNumberDisplay = document.getElementById('correct-number');
const clapSound = document.getElementById('clap-sound');
const monkeyContainer = document.getElementById('monkey-container');
const tooltipWait = document.getElementById('tooltip-wait');
const tooltipDisplay = document.getElementById('tooltip-display');
const tooltipDigits = document.getElementById('tooltip-digits');
const tooltipAnimals = document.getElementById('tooltip-animals');

// Initialize game
function initGame() {
    currentLevel = 1;
    waitTime = 10000;
    displayTime = 1000;
    animationSpeed = 3000;
    updateLevelDisplay();
    startLevel();
}

// Update level display and tooltip
function updateLevelDisplay() {
    levelDisplay.childNodes[0].textContent = currentLevel;
    tooltipWait.textContent = (waitTime / 1000).toFixed(1) + 's';
    tooltipDisplay.textContent = (displayTime / 1000).toFixed(2) + 's';
    tooltipDigits.textContent = getDigitsForLevel(currentLevel);
    tooltipAnimals.textContent = getAnimalCount(currentLevel);
}

// Start a new level
function startLevel() {
    isGameActive = true;
    userInput.value = '';
    hideAllModals();

    // Calculate number of digits based on level
    const digits = getDigitsForLevel(currentLevel);

    // Show status message
    statusMessage.textContent = `Get ready... Number will appear in ${(waitTime / 1000).toFixed(1)} seconds`;

    // Add animal animations from level 3 onwards
    if (currentLevel >= 3) {
        addAnimalAnimations();
    } else {
        removeAnimalAnimations();
    }

    // Wait before showing the number
    setTimeout(() => {
        showNumber(digits);
    }, waitTime);
}

// Calculate number of digits based on level
function getDigitsForLevel(level) {
    // Start with 4 digits, add 1 digit every 5 levels
    return 4 + Math.floor((level - 1) / 5);
}

// Calculate number of animals based on level
function getAnimalCount(level) {
    // No animals before level 3, then add 3 animals every 3 levels
    if (level < 3) return 0;
    return 3 * (Math.floor((level - 3) / 3) + 1);
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
    } else {
        // Wrong answer
        hideAllModals();
        showFailureModal();
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

    // Increase wait time by 10%
    waitTime *= 1.1;

    // Decrease display time by 10%, but not less than 100ms
    displayTime = Math.max(100, displayTime * 0.9);

    // Decrease animation speed by 5% (faster)
    animationSpeed = Math.max(500, animationSpeed * 0.95);

    updateLevelDisplay();
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

// Start the game when page loads
window.addEventListener('load', () => {
    initGame();
});
