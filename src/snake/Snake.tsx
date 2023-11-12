import React, { useEffect, useState } from 'react'
import snakeGameMachine from '../Xstate/xstore';
import { useMachine } from '@xstate/react';
import _ from 'lodash'

const Snake = () => {

  const [size, setSize] = useState(8);
  const [tickTime, setTick] = useState(500);
  
  const [state, send] = useMachine(snakeGameMachine);

  if (state.value == "notStarted" ){

    send('START', {size: size, tt: tickTime, difficulty: 0 })
  }


  const [grid, setGrid] = useState<number [][]>(
    Array.from({ length: size }, () =>
      Array.from({ length: size }, () => (0))
    )
  );


  useEffect( ()=> {
    const intervalId = setInterval(() => {
      // Send a 'TICK' event to the state machine every 500ms
      send('TICK');
    }, tickTime);
  
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };



  }, [tickTime])



  useEffect(() => {
    

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleKeyDown = (event: KeyboardEvent) => {
    if (['w', 'a', 's', 'd'].includes(event.key.toLowerCase())) {

       const num = ['w', 'a', 's', 'd'].findIndex( (a) =>  a=== event.key.toLowerCase())

       const dirs = ["UP", "LEFT", "DOWN", "RIGHT"]

       send("CHANGE_DIRECTION", {dir:dirs[num] } )
      
      
    }
  };


  return (
    <div className='flex  flex-col w-fit 2 border-2 border-slate-900'>
      

      <div className='flex '>
        

      </div>


      <div className="flex flex-col w-auto bg-red-200 ">
        {grid.map((currentSup, y) => {
          return (
            <div className="flex bg-slate-300  justify-evenly">
              {currentSup.map((currentBox, x) => {

                if ( _.isEqual(state.context.foodLocation, {x:x, y:y})  ){
                  return <div className='flex bg-red-700 shadow-inner w-12 h-12 border border-slate-400 rounded-md'></div>
                }
                else if (state.context.snake.findIndex( (a)=> { return _.isEqual(a,{x:x, y:y}) }) > -1) {
 
                  return <div className='flex bg-emerald-600 shadow-inner w-12 h-12 border border-slate-400  rounded-md'></div>
                }

                else return (
                  <div className='flex bg-slate-300 shadow-inner w-12 h-12 border border-slate-400 rounded-md'></div>
                );
              })}
            </div>
          );
        })}
      </div>


    </div>
  )
}

export default Snake