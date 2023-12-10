import { createMachine, assign } from 'xstate';

const mainMachine = createMachine(
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
          START_GAME: 'playing',

          HANDLE_SETTINGS: {
            actions: 'handleSettings',
          
            target : 'playing'
          } ,
          HANDLE_START: {
            actions: 'handleStart',
          
            target : 'playing'
          } ,
        },
      },
      playing: {
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
            actions: assign({ gameCount: (context) => context.gameCount + 1 }),
            target: 'idle',
          },
        },
      },
      success: {
        on: {
          CLOSE_DIALOG: {
            actions: assign({ gameCount: (context) => context.gameCount + 1 }),
            target: 'idle',
          },
        },
      },
    },
  },
  {
    actions: {
      handleSettings: assign( 

        (context, event)=>{

          return {
            ...context,
            size: event.targetSize,
            mineCount: event.targetMineCount,
            gameCount: context.gameCount + 1,
            gameState: 0,
            grid:  Array.from({ length: context.size }, () =>
                    Array.from({ length: context.size }, () => ({
                    value: 0,
                    isDisclosed: false,
              }))
            )
          }

          
            
        }

      ),

      handleStart: assign(

        (context, event)=>{

          return {
            grid: 
            Array.from({ length: context.size }, () =>
              Array.from({ length: context.size }, () => ({
                value: 0,
                isDisclosed: false,
              }))
            ),

          }

        }

      ),


      handleBoxClick: assign(


        (context, event) => {
         
          return {}
  
        },

      ) 
    },
  }
);

export default mainMachine;
