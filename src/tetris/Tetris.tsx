import React, { useEffect, useState } from 'react'
import { useMachine } from '@xstate/react';
import _ from 'lodash'
import {TetrisGameMachine, colors, shapeNames, shapesWithRotationsArr, tetrisShapes} from '../Xstate/TetrisStore';

const colorsToTailwind = ['bg-blue-300', 'bg-yellow-500', 'bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-red']

const Tetris = () => {


  const [state, send] = useMachine(TetrisGameMachine);
  const [tickTime, setTick] = useState(100);


  const shape = shapesWithRotationsArr[state.context.curObj.rot][state.context.curObj.shapeName];
  
  

  useEffect(()=>{
    if (state.value == "notStarted" ){

      send('START', { tt: tickTime })
    }

    const intervalId = setInterval(() => {
      // Send a 'TICK' event to the state machine every 500ms
      send('TICK');
    }, tickTime);
  
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };


  })

  useEffect(() => {
  
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  const handleKeyDown = (event: KeyboardEvent) => {
    if (['r', 'a', 's', 'd', ' '].includes(event.key.toLowerCase())) {

       switch(event.key.toLowerCase()) {

         case 'r':

          send('CHANGE_ROTATION')

          break;

         case 'a':
          send('MOVE_INPUT', {plusOrMinusOne: -1})

          break;

         case 's':

          break;

         case 'd':
          send('MOVE_INPUT', {plusOrMinusOne: 1})

          break;

         case ' ':

          send('TELEPORT')

          break;

       }
      
      
    }
  };

  return (

    <div className='flex ' >
    <div className='flex  flex-col w-fit  border-2 border-slate-500 rounded-md' >
      <div className="flex flex-col w-auto bg-red-200 ">
      {
      
      
      state.context.grid.map((currentSup, x) => {
        return (
          <div className="flex bg-slate-300  justify-evenly">
            {currentSup.map((_, y) => {

              

              if(false) {


              } else{

                return <div className='flex bg-slate-300 shadow-inner w-8 h-8 border border-slate-400  rounded-sm'></div>
              }

              
            
            })}
          </div>
        );
      })}
      </div>
    </div>

    <div className="flex flex-col bg-slate-300 p-2 w-48 font-mono items-center gap-4 border-r-2 border-t-2 border-b-2 border-slate-500 rounded-md">
      {/* Outer border for the TOP box */}
      <div className=" w-fit border-4 border-slate-500 mt-2">
        {/* Inner border for the TOP box */}
        <div className="border-2 border-slate-100 bg-gray-700 text-white text-center p-4">
          <div>TOP</div>
          <div>01000</div>
        </div>
      </div>
      {/* Outer border for the SCORE box */}
      <div className="w-fit border-4 border-gray-600 my-2">
        {/* Inner border for the SCORE box */}
        <div className="border-2 border-slate-100 bg-gray-700 text-white text-center p-4">
          <div>SCORE</div>
          <div>000192</div>
        </div>
      </div>
      {/* Outer border for the NEXT box */}
      <div className="w-fit border-4 border-gray-600">
        {/* Inner border for the NEXT box */}
        <div className="border-2 border-slate-100 bg-gray-700 text-white  text-center p-4">
          <div>NEXT</div>
        </div>
       
      </div>
      {/* Outer border for the LEVEL box */}
      <div className="w-fit border-4 border-gray-600">
        {/* Inner border for the LEVEL box */}
        <div className="border-2 border-slate-100 bg-gray-700 text-white  text-center p-4">
          <div>LEVEL</div>
          <div>00</div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Tetris