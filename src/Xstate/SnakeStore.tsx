
import { Machine, assign, createMachine, send } from 'xstate';
import { raise } from 'xstate/lib/actions';

const dirs = ["UP", "LEFT", "DOWN", "RIGHT"];

const raiseGameOver = raise('GAME_OVER');

interface SnakeGameContext {
  snake: Array<{ x: number; y: number }>;
  foodLocation: { x: number; y: number };
  direction: string;
  score: number;
  size: number;
  tickTime: number;
  isGameOver: boolean
}

const snakeGameMachine = createMachine<SnakeGameContext>({
  id: 'snakeGame',
  initial: 'notStarted',
  context: {
    snake: []  , // Array of { x, y } objects representing snake body parts
    foodLocation: { x: 0, y: 0 } , // The initial location of the food
    direction: 'RIGHT' , // The initial direction of the snake
    score: 0,
    size: 8,
    tickTime: 300,
    isGameOver: false
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

      always: [
        { target: 'gameOver', cond: (context)=> context.isGameOver },
        
      ],
      
      on: {

        CHANGE_DIRECTION: {

          actions: ['changeDirection']
        },
        TICK: [
          {
            actions: ['tick'],
            
            
          },

        ],
        PAUSE: 'paused',
        GAME_OVER: 'gameOver'
      },
      

    },
    paused: {
      on: {
        RESUME: 'playing',
        RESET: 'notStarted'
      }
    },
    gameOver: {
      entry: 'gameOverGreeter',
      on: {
        RESET: {

          actions: assign({   isGameOver: false }),
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

       
        console.log(size, '  ',tickTime)
        const d = dirs[Math.floor(Math.random() * 4)];
        
       
        
        return {
          ...context,
          size: size,
          tickTime: tickTime,
          direction:  d,
          snake: [startPosition],
          foodLocation: foodPosition,
          score: 0,
          
        }
      }
    
    ),
    
    changeDirection: assign(
      
      {
        
       direction:   (context, event) => {
          const dirs = ["UP", "LEFT", "DOWN", "RIGHT"];

          if (dirs[ (event.dir+ 2)% 4  ] == context.direction) return context.direction;
        

          return dirs[event.dir]
       }
    }),


    
    tick:
    
    
    assign((context) => {
      const gridSize = context.size;
      const direction = context.direction;
      const snake = context.snake;
      const foodLocation = context.foodLocation;

      // Logic to update the snake's head position based on its direction
      const head = snake.length === 0 ? { x: 0, y: 0 } : snake[0];
      const newHead = { ...head };
      switch (direction) {
        case 'UP': 
          if(newHead.x == 0){
            newHead.x= context.size -1
          }

          else  newHead.x -= 1; 

          break;
        case 'DOWN': 
          if(newHead.x == context.size -1){
            newHead.x= 0
          }
        
          else newHead.x += 1; 

            break;
        case 'LEFT': 

          if(newHead.y == 0){
            newHead.y= context.size -1
          }
          else newHead.y -= 1; 

          break;
        case 'RIGHT': 

          if(newHead.y == context.size -1){
            newHead.y= 0
          }
          else newHead.y += 1; 

          break;
      }

      const collisionWithSelf = snake.some(segment => segment.x === newHead.x && segment.y === newHead.y);

      if ( collisionWithSelf) {
   
          
          return {
            ...context,
            isGameOver: true

          };
       
        
      }

      // Update the snake's position by adding the new head to the front of the snake array
      const newSnake = [newHead, ...snake.slice(0, -1)]; // Remove the last segment to simulate movement

      // Check if the snake has eaten food
      if (newHead.x === foodLocation.x && newHead.y === foodLocation.y) {
        // Add a new segment to the snake, increase score, and place new food
        // For simplicity, we're not updating foodLocation here
        console.log('test');



        const newFoodPosition = {x: Math.floor(Math.random() * context.size) , y: Math.floor(Math.random() * context.size) };

        newSnake.push(snake[snake.length - 1]);

        while(newSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y)){

          newFoodPosition.x = Math.floor(Math.random() * context.size) ;
          newFoodPosition.y = Math.floor(Math.random() * context.size) ;

        }

        return {
          ...context,
          snake: newSnake, // Add the last segment back to grow the snake
          score: context.score + 1,
          
          foodLocation : newFoodPosition
        };
      }

      // If no food is eaten, just move the snake
      return {
        ...context,
        snake: newSnake,
      };
    }),
    

    gameOverGreeter: assign(
      (context)=>{
        console.log("greetings from game over")

        return {
          ...context,
      
        }
      }

    )

   

    
    // ... other actions, guards, and services
  }
});

export default snakeGameMachine