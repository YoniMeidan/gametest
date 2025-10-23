# Concentration Memory Game

A web-based memory game designed to test and improve your concentration and short-term memory skills.

## How to Play

1. Open `index.html` in your web browser
2. Configure your game settings in the popup that appears:
   - **Wait Time Increase Per Level** - How much longer you wait for the number each level (default: 10%)
   - **Display Time Decrease Per Level** - How much shorter the number appears each level (default: 10%)
   - **Animal Speed Increase Per Level** - How much faster animals move each level (default: 5%)
   - **Level to Start Adding Animals** - Which level animals first appear (default: 3)
   - **Animals Added Every X Levels** - How often to add more animals (default: every 3 levels)
   - **Number of Animals to Add Each Time** - How many animals to add each interval (default: 3)
3. Click "Start Game" to begin
4. A black circle will appear on a calm, gradient background
5. Hover over the level number to see current game parameters
6. Wait for a random number to appear inside the circle
7. Remember the number - it will only be shown for a brief moment!
8. Enter the number in the popup that appears
9. Progress through increasingly difficult levels

## Game Features

### Customizable Settings
- **Fully Customizable Difficulty**: Configure game parameters before starting
  - Adjust how much wait time increases per level (0-100%)
  - Control how much faster the number disappears each level (0-100%)
  - Set animal movement speed progression (0-100%)
  - Choose when animals first appear (level 1-20)
  - Customize how often animals are added (every X levels)
  - Set how many animals to add each time
- **Perfect for All Skill Levels**: From beginners to memory masters
- **Experimental Gameplay**: Try different combinations to find your optimal challenge

### Progress Tracking
- **Top Progress Bar**: Shows all levels you've attempted
  - Completed levels appear in green
  - Current level appears in blue with a pulsing animation
  - Retry count displayed next to each level number (if any retries)
  - Hover over any level to see its parameters (wait time, display time, digits, animals, retries)
  - Click on any completed level to jump back and replay it
- Your progress is tracked throughout the session

### Core Mechanics
- **Initial Display**: After 10 seconds, a random 4-digit number appears in the circle
- **Brief Showing**: The number is displayed for only 1 second
- **User Input**: Enter the number you remember
- **Feedback**:
  - Correct: Celebration animation with clapping sound
  - Wrong: Error message showing the correct number and increments retry counter

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
- Customizable game settings modal on startup
- Dynamic difficulty scaling based on user-defined percentages
- Calming gradient background with SVG overlay
- Fixed top progress bar with interactive level navigation
- Interactive level tooltips showing real-time game parameters
- Session-based progress tracking with retry counting
- Level replay functionality - jump back to any completed level
- Responsive design
- Web Audio API for sound effects (works without external audio files)
- Dynamic JavaScript-based animations for random animal movements
- Interval-based animation system with customizable speed progression
- Modal popups for user interaction
- Smooth transitions and visual effects
- Input validation for all settings

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

1. **Start Easy**: First-time players should consider setting display time decrease to 0% and starting animals at level 5 or higher
2. **Advanced Challenge**: Memory experts can increase all percentages and add more animals per interval
3. Check the progress bar at the top to track your completed levels
4. Click on any level in the progress bar to replay it and improve your retry count
5. Hover over levels in the progress bar to review their difficulty settings
6. Hover over the current level number to see real-time difficulty parameters
7. Focus on the center of the circle before the number appears
8. Try to visualize the number in chunks (e.g., 12-34 instead of 1-2-3-4)
9. Don't let the animals distract you!
10. As levels increase, animals get faster and more numerous - stay focused!
11. Practice regularly to improve your memory skills

Enjoy the game and challenge yourself to reach higher levels!
