import React, { useEffect, useState } from 'react'
import snakeGameMachine from '../Xstate/SnakeStore';
import { useMachine } from '@xstate/react';
import _ from 'lodash'
import { GaugeCircle, RotateCcw, Settings, Tally5 } from 'lucide-react';




const Snake = () => {

  const [size, setSize] = useState(8);
  const [tickTime, setTick] = useState(300);

 
  
  const [state, send] = useMachine(snakeGameMachine);

  console.log(state.value);

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
      
      send('TICK');
    }, tickTime);
  

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
    <div className='flex  flex-col w-fit 2 border-2 border-slate-500 rounded-md' >
      
      <div className='header flex flex-row justify-between bg-slate-300 border-b-2 border-slate-400 py-1'>

        <div className='flex flex-row '>
        
          <RotateCcw size={30} className='ml-1'/>
          
        </div>


        <div className='flex flex-row'>
          <Tally5 size={30} />
          <p className='ml-1 text-lg font-semibold'> {state.context.score} </p>

        </div>

        <div className='flex flex-row '>
          <GaugeCircle size={30}/>
          <p className='ml-1 text-lg font-semibold'> {state.context.tickTime} </p>

        </div>


       

     

  
      </div>
      
    


      <div className="flex flex-col w-auto bg-red-200 ">
        {grid.map((currentSup, x) => {
          return (
            <div className="flex bg-slate-300  justify-evenly">
              {currentSup.map((currentBox, y) => {


                if (_.isEqual(state.context.snake[0], {x:x,y:y }) ) {

                  return <div className='flex bg-emerald-500 shadow-inner w-12 h-12 border border-slate-400  rounded-md'></div>

                }

                if (state.context.snake.findIndex( (a)=> { return _.isEqual(a,{x:x, y:y}) }) > -1) {

                  return <div className='flex bg-emerald-600 shadow-inner w-12 h-12 border border-slate-400  rounded-md'></div>
                }
              
                else if ( _.isEqual(state.context.foodLocation, {x:x, y:y})  ){


                  return <div className='flex bg-red-700 shadow-inner w-12 h-12 border border-slate-400 rounded-md'></div>
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