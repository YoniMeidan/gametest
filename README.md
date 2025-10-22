# Concentration Memory Game

A web-based memory game designed to test and improve your concentration and short-term memory skills.

## How to Play

1. Open `index.html` in your web browser
2. A black circle will appear on a calm, gradient background
3. Hover over the level number to see current game parameters
4. Wait for a random number to appear inside the circle
5. Remember the number - it will only be shown for a brief moment!
6. Enter the number in the popup that appears
7. Progress through increasingly difficult levels

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
- Animal animations speed up by 5%

#### Every 3 Levels:
- 3 more animals are added to distract you
  - Level 3-5: 3 animals
  - Level 6-8: 6 animals
  - Level 9-11: 9 animals
  - And so on...

#### Every 5 Levels:
- One additional digit is added to the number
  - Level 1-4: 4 digits
  - Level 5-9: 5 digits
  - Level 10-14: 6 digits
  - And so on...

### Distractions

Starting from **Level 3**, animated animals appear to distract you:
- 20 different types of animals (monkeys, dogs, cats, foxes, bears, and more!)
- Random movements across the screen
- Random rotations and scaling effects
- Animals move faster with each level
- More animals added every 3 levels for increased challenge

## Technical Features

- Pure HTML, CSS, and JavaScript (no external dependencies)
- Calming gradient background with SVG overlay
- Interactive level tooltip showing real-time game parameters
- Responsive design
- Web Audio API for sound effects (works without external audio files)
- Dynamic JavaScript-based animations for random animal movements
- Interval-based animation system with speed progression
- Modal popups for user interaction
- Smooth transitions and visual effects

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

1. Hover over the level number to see current difficulty parameters
2. Focus on the center of the circle before the number appears
3. Try to visualize the number in chunks (e.g., 12-34 instead of 1-2-3-4)
4. Don't let the animals distract you from level 3 onwards!
5. As levels increase, animals get faster and more numerous - stay focused!
6. Practice regularly to improve your memory skills

Enjoy the game and challenge yourself to reach higher levels!
