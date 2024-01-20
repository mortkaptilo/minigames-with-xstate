import React, { useEffect, useState } from 'react'
import snakeGameMachine from '../Xstate/SnakeStore';
import { useMachine } from '@xstate/react';
import _ from 'lodash'
import { GaugeCircle, RotateCcw, Settings, Tally5 } from 'lucide-react';
import * as Dialog from "@radix-ui/react-dialog"

import './styles.css';


import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"



const Snake = () => {


 
  
  const [state, send] = useMachine(snakeGameMachine);

  console.log(state.context.size);

  if (state.value == "notStarted" ){

    send('START', {size: state.context.size, tt: state.context.tickTime, difficulty: 0 })
  }


  const [grid, setGrid] = useState<number [][]>(
    Array.from({ length:  state.context.size }, () =>
      Array.from({ length:  state.context.size }, () => (0))
    )
  );

  if (grid.length != state.context.size) {
      
      setGrid( Array.from({ length:  state.context.size }, () =>
        Array.from({ length:  state.context.size }, () => (0))
      ))
  }


  const [settingSize, setSettingSize] = useState<number>(state.context.size);
  const [settingTick, setSettingTick] = useState<number>(state.context.tickTime);


  useEffect( ()=> {
    const intervalId = setInterval(() => {
      
      send('TICK');
    }, state.context.tickTime);
  

    return () => {
      clearInterval(intervalId);
    };



  }, [state.context.tickTime])



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

       

       send("CHANGE_DIRECTION", {dir:num  } )
      
      
    }
  };




  return (

    <>


      <Dialog.Root  open= {state.value == "gameOver" } >
          
          <Dialog.Portal >
            
            <Dialog.Overlay className=" DialogOverlay   bg-slate-700 bg-opacity-30"  />
            <Dialog.Content className="DialogContent  bg-white">
              <Dialog.Description className="DialogDescription">
                You've lost
              </Dialog.Description>
              <div className="flex justify-center">
              <Dialog.Close asChild onClick={ ()=>  { send('RESET'); } }>
                <Button className=" border-1 border-gray-700 rounded-sm p-1" aria-label="Close">
                Restart
                </Button>
              </Dialog.Close>

              </div>
            
            </Dialog.Content>
          </Dialog.Portal>
      </Dialog.Root>
    


    <div className='flex  flex-col w-fit 2 border-2 border-slate-500 rounded-md' >

      
      
      <div className='header flex flex-row justify-between bg-slate-300 border-b-2 border-slate-400 py-1'>


        
        <div className='flex flex-row '>

        <Popover>
          <PopoverTrigger>
            {" "}
            <Settings size={30}/>
          </PopoverTrigger>
          <PopoverContent>
            <form onSubmit= {(e)=> { e.preventDefault(); send('GAME_OVER'), send('RESET'), send('START', {size: settingSize, tt: settingTick, difficulty: 0 })   }}>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="name">
                 Row Size:
                </label><base href="" />
                <input className="Input" id="size" defaultValue={settingSize} onChange={(v)=>{setSettingSize(Number(v.target.value))}}/>
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="username">
                 Tick in ms: 
                </label>
                <input className="Input" id="bombCount" defaultValue={settingTick}  onChange={(v)=>{setSettingTick(Number(v.target.value))}}/>
              </fieldset>
              <Button className='mt-1' type="submit">Submit</Button>
            </form>

          
          </PopoverContent>
        </Popover>

          
          <RotateCcw size={30} className='ml-2'  onClick={ ()=> { send('GAME_OVER'), send('RESET'),  send('START', {size: state.context.size, tt: state.context.tickTime, difficulty: 0 }) }} />
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

                  return <div className='flex bg-emerald-500 shadow-inner w-12 h-12 border border-slate-400  '></div>

                }

                if (state.context.snake.findIndex( (a)=> { return _.isEqual(a,{x:x, y:y}) }) > -1) {

                  return <div className='flex bg-emerald-600 shadow-inner w-12 h-12 border border-slate-400 '></div>
                }
              
                else if ( _.isEqual(state.context.foodLocation, {x:x, y:y})  ){


                  return <div className='flex bg-red-700 shadow-inner w-12 h-12 border border-slate-400 '></div>
                }

                else return (
                  <div className='flex bg-slate-300 shadow-inner w-12 h-12 border border-slate-400 '></div>
                );
              })}
            </div>
          );
        })}
      </div>


    </div>
      
    
    
    </>

    
    
    
  )
}

export default Snake