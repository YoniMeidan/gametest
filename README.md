# Concentration Memory Game

A web-based memory game designed to test and improve your concentration and short-term memory skills.

## How to Play

1. Open `index.html` in your web browser
2. A black circle will appear on a white background
3. Wait for a random number to appear inside the circle
4. Remember the number - it will only be shown for a brief moment!
5. Enter the number in the popup that appears
6. Progress through increasingly difficult levels

## Game Features

### Core Mechanics
- **Initial Display**: After 10 seconds, a random 4-digit number appears in the circle
- **Brief Showing**: The number is displayed for only 1 second
- **User Input**: Enter the number you remember
- **Feedback**:
  - Correct: Celebration animation with clapping sound
  - Wrong: Error message showing the correct number

### Difficulty Progression

#### Every Level:
- Wait time increases by 10%
- Display time decreases by 10% (minimum 100ms)

#### Every 5 Levels:
- One additional digit is added to the number
  - Level 1-4: 4 digits
  - Level 5-9: 5 digits
  - Level 10-14: 6 digits
  - And so on...

### Distractions

Starting from **Level 3**, animated monkeys appear to distract you:
- Running around the circle
- Jumping around
- Making faces
- Each with different animation patterns

## Technical Features

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Responsive design
- Web Audio API for sound effects (works without external audio files)
- Smooth animations using CSS keyframes
- Modal popups for user interaction

## Files

- `index.html` - Main game structure
- `style.css` - Styling and animations
- `script.js` - Game logic and interactions

## Browser Compatibility

Works on all modern browsers that support:
- CSS3 animations
- ES6 JavaScript
- Web Audio API

## Tips for Playing

1. Focus on the center of the circle before the number appears
2. Try to visualize the number in chunks (e.g., 12-34 instead of 1-2-3-4)
3. Don't let the monkeys distract you from level 3 onwards!
4. Practice regularly to improve your memory skills

Enjoy the game and challenge yourself to reach higher levels!
