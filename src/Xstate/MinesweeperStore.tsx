import { cloneDeep } from 'lodash';
import { createMachine, assign, send } from 'xstate';

interface MineGameContext {
  size: number;
  mineCount: number;
  gameCount: number;
  gameState: number;
  grid: Array<Array<{ value: number; isDisclosed: boolean }>>;
}

const mineMachine = createMachine<MineGameContext>(
  { 

    
    id: 'main',
    initial: 'idle',
    context: {
      size: 8,
      mineCount: 5,
      gameCount: 0,
      gameState: 0,
      grid: Array.from({ length: 8 }, () =>
        Array.from({ length: 8 }, () => ({ value: 0, isDisclosed: false }))
      ),
    },
    states: {
      idle: {
        on: {
          START_GAME: {

            actions: 'startGame',
            target:'playing',
          },

          HANDLE_SETTINGS: {
            actions: 'handleSettings',
          
            
          } ,
        
        },
      },
      playing: {

        always: [
          { target: 'failed', cond: (context)=> context.gameState == -1 },
          { target: 'success', cond: (context)=> context.gameState == 1 },
          
        ],


        on: {
          BOX_CLICK: {
            target: 'playing',
            actions: ['handleBoxClick'],
          },
          GAME_OVER: 'failed',
          GAME_WIN: 'success',
          RESTART: 'idle'
        },
      },
      failed: {
        on: {
          CLOSE_DIALOG: {
            actions: assign({ gameCount: (context) => context.gameCount + 1 , gameState: 0}),
            target: 'idle',
          },
        },
      },
      success: {
        on: {
          CLOSE_DIALOG: {
            actions: assign({ gameCount: (context) => context.gameCount + 1,  gameState: 0 }),
            target: 'idle',
          },
        },
      },
    },
  },
  {


    actions: {


      startGame: assign(

        (context, event) => {

        const placedMines = new Set();

        const toBeGrid =  Array.from({ length: context.size }, () =>
        Array.from({ length: context.size }, () => ({
        value: 0,
        isDisclosed: false,
        })));
       

        for (let i = 0; i < context.mineCount; i++) {
          const x = Math.floor(Math.random() * context.size);
          const y = Math.floor(Math.random() * context.size);
          toBeGrid[x][y] = { value: -1, isDisclosed: false };
        
          if (placedMines.has(`${x}-${y}`)) {
            i--;
            continue;
          }

          placedMines.add(`${x}-${y}`);

          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              if (
                x + dx >= 0 &&
                x + dx < context.size &&
                y + dy >= 0 &&
                y + dy < context.size &&
                toBeGrid[x + dx][y + dy].value !== -1
              ) {
                toBeGrid[x + dx][y + dy].value++;
              
              }
            }
          }
        }

        return {
          ...context,
          gameState: 0,
          grid: cloneDeep(toBeGrid),
      
        }
      }


      ),



      handleSettings: assign( 

        (context, event)=>{

        
          

          return {
            ...context,
         
            size: event.targetSize,
            mineCount: event.targetMineCount,
            gameCount: context.gameCount + 1,
            gameState: 0,
            grid:   Array.from({ length: context.size }, () =>
            Array.from({ length: context.size }, () => ({
            value: 0,
            isDisclosed: false,
            }))
          )

          }

          
            
        }

      ),

      


      handleBoxClick: assign(

        
         (context, event) => {
          const { x, y } = event;
          const { grid, size } = context;
          let newGrid = cloneDeep(grid);
          console.log("hello from handleBoxClick");
      
          // Function to reveal a cell
          const revealCell = (row : number, col: number) => {
            newGrid[row][col].isDisclosed = true;
          };
      
          if (grid[x][y].value === -1) {
            // Handle mine click

            
            return {
              ...context,
              gameState: -1,
              
              grid: newGrid
            };
          }
      
          if (grid[x][y].value > 0) {
            revealCell(x, y);
          }
      
          if (grid[x][y].value === 0) {
            const zeroesArr = [];
            zeroesArr.push({ ...grid[x][y], x, y });
      
            while (zeroesArr.length > 0) {
              const { x: currentX, y: currentY  } = zeroesArr.pop()!;
      
              const directions = [
                { dx: -1, dy: -1 }, { dx: -1, dy: 0 }, { dx: -1, dy: 1 },
                { dx: 0, dy: -1 },                    { dx: 0, dy: 1 },
                { dx: 1, dy: -1 }, { dx: 1, dy: 0 }, { dx: 1, dy: 1 }
              ];
      
              directions.forEach(({ dx, dy }) => {
                const newRow = currentX + dx;
                const newCol = currentY + dy;
      
                if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && !newGrid[newRow][newCol].isDisclosed) {
                  if (newGrid[newRow][newCol].value === 0) {
                    zeroesArr.push({ ...newGrid[newRow][newCol], x: newRow, y: newCol });
                  }
      
                  revealCell(newRow, newCol);
                }
              });
            }
          }

          const totalBoxes = context.size*context.size;
          let revealed = 0;
      
          for (let i = 0; i < context.size; i++) {
            for (let j = 0; j < context.size; j++) {
              if (newGrid[i][j].isDisclosed) revealed++;
            }
          }
      
      
          if (revealed >= totalBoxes-context.mineCount) {
            
     
            return {

              ...context,
              gameState: 1,
              grid: newGrid
            
            }
          }
      
          return {
            ...context,
            grid: newGrid
          };
        
      })
    },
  }
);

export default mineMachine;
