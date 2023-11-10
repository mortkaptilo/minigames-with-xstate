
import { Machine, assign } from 'xstate';

interface SnakeGameContext {
  snake: Array<{ x: number; y: number }>;
  foodLocation: { x: number; y: number };
  direction: string;
  score: number;
  size: number;
  tickTime: number;
}

const snakeGameMachine = Machine<SnakeGameContext>({
  id: 'snakeGame',
  initial: 'notStarted',
  context: {
    snake: []  , // Array of { x, y } objects representing snake body parts
    foodLocation: { x: 0, y: 0 } , // The initial location of the food
    direction: 'RIGHT' , // The initial direction of the snake
    score: 0,
    size: 8,
    tickTime: 500,
    // ... other game context properties
  },
  states: {
    notStarted: {
      on: {
        START: {
          actions: ['initialize'],
          target: 'playing'
        }
      }
    },
    playing: {
      on: {
        CHANGE_DIRECTION: {

          actions: ['changeDirection']
        },
        TICK: {
          actions: ['tick']
        },
        PAUSE: 'paused',
        GAME_OVER: 'gameOver'
      }
    },
    paused: {
      on: {
        RESUME: 'playing',
        RESET: 'notStarted'
      }
    },
    gameOver: {
      on: {
        RESET: {

          actions: 'resetGame',
          target: 'notStarted'
          
        }
      }
    }
  }
}, {
  actions: {

    initialize: assign(

      (context,  event ) => {

        const size = event.size;
        const tickTime = event.tt;

        const startPosition = {x: Math.floor(Math.random() * size) , y: Math.floor(Math.random() * size) };
        
        // Start with just the head of the snake return [startPosition];
        const foodPosition = {x: Math.floor(Math.random() * size) , y: Math.floor(Math.random() *size) };

        
        return {
          ...context,
          size: size,
          tickTime: tickTime,
          snake: [startPosition],
          foodLocation: foodPosition
          
        }
      }
    
    ),
    
    changeDirection: assign({

       direction:   (context, event) => {

          return event.dir
       }
    }),

    tick :assign((context) => {
      const gridSize = context.size;
      const direction = context.direction;
      const snake = context.snake;
      const foodLocation = context.foodLocation;

      // Logic to update the snake's head position based on its direction
      const head = snake.length === 0 ? { x: 0, y: 0 } : snake[0];
      const newHead = { ...head };
      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      const collisionWithSelf = snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);

      if ( collisionWithSelf) {
        // Transition to a game over state, or handle the game over logic
        // For this example, we'll just log to the console
        
        console.log('Game Over');
        return {}; // Return the context unmodified
      }

      // Update the snake's position by adding the new head to the front of the snake array
      const newSnake = [newHead, ...snake.slice(0, -1)]; // Remove the last segment to simulate movement

      // Check if the snake has eaten food
      if (newHead.x === foodLocation.x && newHead.y === foodLocation.y) {
        // Add a new segment to the snake, increase score, and place new food
        // For simplicity, we're not updating foodLocation here
        return {
          ...context,
          snake: [...newSnake, snake[snake.length - 1]], // Add the last segment back to grow the snake
          score: context.score + 1,
          // foodLocation: ... // Logic to place new food goes here
        };
      }

      // If no food is eaten, just move the snake
      return {
        ...context,
        snake: newSnake,
      };
    }),


    resetGame: assign({
      
    })
    // ... other actions, guards, and services
  }
});

export default snakeGameMachine