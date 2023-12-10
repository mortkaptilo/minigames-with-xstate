import { Machine, actions, assign, createMachine } from 'xstate';
import _, { map } from 'lodash'

const shapeNames = ['I', 'O', 'T', 'J', 'mirrorJ', 'S', 'mirrorS' ]

const colors = ['cyan', 'yellow', 'purple', 'blue', 'orange', 'green', 'red']

const tetrisShapes : { [key: string]: number[][]; } = {
  'I': [
      [1, 1, 1, 1],
  ],
  'O': [
      [1, 1],
      [1, 1],
  ],
  'T': [
      [0, 1, 0],
      [1, 1, 1],
  ],

  'J': [
    [1, 0, 0],
    [1, 1, 1],
  ] ,

  'mirrorJ': [
    [0, 0, 1],
    [1, 1, 1],
  ],

  'S': [
      [0, 1, 1],
      [1, 1, 0],
  ],
  'mirrorS': [
      [1, 1, 0],
      [0, 1, 1],
  ],
 
};


const ts90 : { [key: string]: number[][]; }  ={
  'I': [[1],
      [1],
      [1],
      [1]],

  'O': [[1, 1],
      [1, 1]],

  'T': [[1, 0], 
      [1, 1], 
      [1, 0]],

  'J': [[1, 1], 
      [1, 0], 
      [1, 0]],

  'mirrorJ': [[1, 0], 
            [1, 0], 
            [1, 1]],

  'S': [[1, 0], 
      [1, 1], 
      [0, 1]],

  'mirrorS': [[0, 1], 
            [1, 1], 
            [1, 0]]
}


const ts180 :{ [key: string]: number[][]; }= {
  'I': [[1, 1, 1, 1]],

  'O': [[1, 1], 
      [1, 1]],

  'T': [[1, 1, 1], 
      [0, 1, 0]],

  'J': [[1, 1, 1], 
      [0, 0, 1]],

  'mirrorJ': [[1, 1, 1], 
            [1, 0, 0]],

  'S': [[0, 1, 1], 
    [1, 1, 0]],

  'mirrorS': [[1, 1, 0], 
            [0, 1, 1]]
}

const ts270 : { [key: string]: number[][]; }= {
  'I': [[1], 
      [1], 
      [1], 
      [1]],

  'O': [[1, 1], 
      [1, 1]],

  'T': [[0, 1], 
      [1, 1], 
      [0, 1]],

  'J': [[0, 1], 
      [0, 1], 
      [1, 1]],

  'mirrorJ': [[1, 1], 
            [0, 1], 
            [0, 1]],

  'S': [[1, 0], 
      [1, 1], 
      [0, 1]],

  'mirrorS': [[0, 1], 
            [1, 1], 
            [1, 0]]
}


const shapesWithRotationsArr = [tetrisShapes, ts90, ts180, ts270]







interface TetrisGameContext {
  grid: Array<Array<{ color: string }>>;

  score: number;
  pastScores: number[];
  pastLevels: number[];
  size: Array<number>;
  level: number;
  tickTime: number;
  speedyTickTime: number,
  curObj: {x: number, y:number, shapeName: string, rot: number};
  nextShape: string;
  nextNextShape: string
}

const TetrisGameMachine = createMachine<TetrisGameContext>({

  id: 'tetrisGame',
  initial: 'notStarted',
  context: {
    grid: Array.from({ length: 20 }, () =>
    Array.from({ length: 10 }, () => ({ color: "default" }))
  ),
   
    score: 0,
    size: [20,10],
    pastLevels: [],
    pastScores: [],
    level: 1,
    tickTime: 500,
    curObj: {x:0, y:0, shapeName: 'L', rot: 0},
    speedyTickTime: 200,
    nextShape: 'L',
    nextNextShape: 'L'
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
        TELEPORT: {
          actions: ['teleport']

        },

        MOVE_INPUT: {

          actions: ['handleMove']
        },
        CHANGE_ROTATION: {

          actions: ['changeRotation']

        },
        TICK: {
          actions: ['tick']
        },
       
        GAME_OVER: 'gameOver'
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
},{

  actions: {

    initialize: assign(


      (context, event)=>{

        const shapeName = shapeNames[Math.floor(Math.random() * 7) ]


        return {
          ...context,
          moveInput: '',
          tickTime: event.tt,
          curObj: {x: 0, y: 0, shapeName:  shapeName, rot: 0}, 
          nextShape: shapeNames[Math.floor(Math.random() * 7) ],
          nextNextShape: shapeNames[Math.floor(Math.random() * 7) ]

        }
      }


    ),

    teleport: assign(
      (context)=>{

        let row
        for ( row = context.curObj.x; row < 19; row++) {
          let collision = checkCollision({...context.curObj, x: row +1}, context.grid)

          if(collision) break
          
        }


        let newGrid = objectToGridHelper({...context.curObj, x: row }, context.grid)



        return {
          ...context,
          grid: newGrid,
          curObj: {x: 0, y:0 , shapeName: context.nextShape, rot:0},
          nextShape: context.nextNextShape,
          nextNextShape: shapeNames[Math.floor(Math.random() * 7) ]
        }

      }

     
      
    ),

    handleMove: assign(
      (context, event)=> {
        
        

        let collison = checkCollision({...context.curObj, y: context.curObj.y+event.plusOrMinusOne }, context.grid)

        if(!collison) {
          return {
            ...context,
            curObj: {...context.curObj, y: context.curObj.y+event.plusOrMinusOne }

          }

        } else return {}

        

      }


    ),

    changeRotation: assign(
      (context)=> {

        return {
          ...context,
          rot: (context.curObj.rot+1)%4


        }
      }  

    ),

    tick: assign(

        (context) => {
          let newContext;

          let collision = checkCollision({...context.curObj, x: context.curObj.x +1}, context.grid)

          let locGrid = context.grid

          if(collision) {

            let newGrid = objectToGridHelper(context.curObj, context.grid)
            locGrid = newGrid;
            
             newContext= {
              ...context,
            
              curObj: {x: 0, y:0 , shapeName: context.nextShape, rot:0},
              nextShape: context.nextNextShape,
              nextNextShape: shapeNames[Math.floor(Math.random() * 7) ]
            }

          }

          else {

             newContext= {
              ...context,
              curObj: {...context.curObj, x: context.curObj.x+1 }

            }
          }

          let isBottomFull = context.grid[20 - 1].every(cell => cell.color !== '-1');

          let newGrid  = _.cloneDeep(context.grid)
          while(isBottomFull ) {
            
            // Move every row one row down, starting from the second-to-last row
            for (let row = 20- 1; row > 0; row--) {
              newGrid[row] = newGrid[row - 1];
            }

            // Clear the top row
            newGrid[0] = new Array(10).fill({color: '-1'});
    
            isBottomFull = newGrid[20 - 1].every(cell => cell.color !== '-1');
          }


          return {
            ...newContext,
            grid: newGrid

          }





        }


    ),

    resetGame: assign((context, event)=>{

      const shapeName = shapeNames[Math.floor(Math.random() * 7) ]


      return {
        ...context,
        pastLevels:[...context.pastLevels, context.level],
        pastScores:[...context.pastScores, context.score],
        level:1,
        score: 0,
        tickTime: event.tt,
        curObj: {x: 0, y: 0, shapeName:  shapeName, rot: 0}, 
        nextShape: shapeNames[Math.floor(Math.random() * 7) ],
        nextNextShape: shapeNames[Math.floor(Math.random() * 7) ]

      }
    }),

   
  },


 
})




/*
function transportHelper( obj:{x: number, y:number, shapeName: string}, grid: Array<Array<{ color: string }>> ){


  for (let a= 0;a < grid.length ;a++){

    for(let c = 0; c < tetrisShapes[obj.shapeName as keyof typeof tetrisShapes][-1].length;c++) {

      if (tetrisShapes[obj.shapeName as keyof typeof tetrisShapes][-1][c]==1) {

        if(  grid[a][obj.x+ c].color != "-1") return {row: a-1 }

      }
    
    }

  }


  return {row: 19}
}
*/


function objectToGridHelper(curObj: {x: number, y:number, shapeName: string, rot: number}, grid: {color: string}[][]) {

  let newGrid = _.cloneDeep(grid);
      
  
  const shape = shapesWithRotationsArr[curObj.rot][curObj.shapeName];

  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const gridX = curObj.x + col;
        const gridY = curObj.y + row;

        // Ensure the coordinates are within the grid boundaries
        if (gridX >= 0 && gridX < newGrid[0].length && gridY >= 0 && gridY < newGrid.length) {
          newGrid[gridY][gridX] = {color: colors[shapeNames.indexOf(curObj.shapeName )]}; // Fill the cell in the grid
        }
      }
    }
  }

  return newGrid;



}

function checkCollision(curObj: {x: number, y:number, shapeName: string, rot: number}, grid: {color: string}[][]  ){

  const shape = shapesWithRotationsArr[curObj.rot][curObj.shapeName];
  
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const gridX = curObj.x + col;
        const gridY = curObj.y + row;

        // Check if out of grid bounds
        if (gridX < 0 || gridX >= grid[0].length || gridY < 0 || gridY >= grid.length) {
          return true;
        }

        // Check if collides with filled cell in grid
        if (grid[gridY][gridX].color === '1') {
          return true;
        }
      }
    }
  }
  return false;

}

export {tetrisShapes, colors, shapeNames, shapesWithRotationsArr, TetrisGameMachine}