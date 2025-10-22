// Game state
let currentLevel = 1;
let waitTime = 10000; // Initial wait time: 10 seconds
let displayTime = 1000; // Initial display time: 1 second
let currentNumber = '';
let isGameActive = false;

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

// Initialize game
function initGame() {
    currentLevel = 1;
    waitTime = 10000;
    displayTime = 1000;
    levelDisplay.textContent = currentLevel;
    startLevel();
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

    // Add monkey animations from level 3 onwards
    if (currentLevel >= 3) {
        addMonkeyAnimations();
    } else {
        removeMonkeyAnimations();
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
    levelDisplay.textContent = currentLevel;

    // Increase wait time by 10%
    waitTime *= 1.1;

    // Decrease display time by 10%, but not less than 100ms
    displayTime = Math.max(100, displayTime * 0.9);

    startLevel();
}

// Retry current level
function retryLevel() {
    startLevel();
}

// Add monkey animations
function addMonkeyAnimations() {
    // Clear existing monkeys
    monkeyContainer.innerHTML = '';

    // Create three monkeys with different animations
    const monkeyEmojis = ['🐵', '🙈', '🙉'];
    const animationClasses = ['monkey-run', 'monkey-jump', 'monkey-face'];

    for (let i = 0; i < 3; i++) {
        const monkey = document.createElement('div');
        monkey.className = `monkey ${animationClasses[i]}`;
        monkey.textContent = monkeyEmojis[i];
        monkey.style.animationDelay = `${i * 0.5}s`;
        monkeyContainer.appendChild(monkey);
    }
}

// Remove monkey animations
function removeMonkeyAnimations() {
    monkeyContainer.innerHTML = '';
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
