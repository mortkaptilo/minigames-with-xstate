import React from 'react'
import { useMachine } from '@xstate/react';
import mineMachine from '../Xstate/MinesweeperStore';

import './styles.css';

import XsBox from './Box';

import * as Dialog from "@radix-ui/react-dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"


const Minesweeper = () => {
  const [state, send] = useMachine(mineMachine);

  
 
  if (state.value == "idle" ){

    send('HANDLE_SETTINGS', {targetSize: state.context.size,  targetMineCount:  state.context.mineCount })
    send('START_GAME')
  }
  
  const {size, mineCount, gameCount, gameState, grid } = state.context;

  var noStateSize = size;
  var noStateMine = mineCount;


  

  return (
    

    <div id="mainbox" className=" flex  flex-col w-auto 2 border-2 border-slate-900 rounded-md gamebox">
   
    <Dialog.Root  open= {state.value == "failed" } >
      
      <Dialog.Portal >
        
        <Dialog.Overlay className=" DialogOverlay   bg-slate-700 bg-opacity-30"  />
        <Dialog.Content className="DialogContent bg-white">
          <Dialog.Description className="DialogDescription">
            Bomb's been exploded
          </Dialog.Description>
          <div className="flex justify-center">
          <Dialog.Close asChild onClick={ ()=>  { send("CLOSE_DIALOG"); } }>
            <Button className=" border-1 border-gray-700 rounded-sm p-1" aria-label="Close">
             Restart
            </Button>
          </Dialog.Close>

          </div>
         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    <Dialog.Root  open= {state.value == "success"} >
      
      <Dialog.Portal >
        
        <Dialog.Overlay className=" DialogOverlay   bg-slate-700 bg-opacity-30"  />
        <Dialog.Content className="DialogContent bg-white">
          <Dialog.Description className="DialogDescription">
            You won
          </Dialog.Description>
          <div className="flex justify-center">
          <Dialog.Close asChild onClick={ ()=>  { send("CLOSE_DIALOG"); } }>
            <Button className=" border-1 border-gray-700 rounded-sm p-1" aria-label="Close">
             Ok
            </Button>
          </Dialog.Close>

          </div>
         
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>



    <div className="flex gameboxheader justify-between my-1">
      <div className="flex">
        <Popover>
        <PopoverTrigger>

        <svg
          onClick={()=>{}}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6 "
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>

        </PopoverTrigger >
        <PopoverContent className="mr-4" >How to play:</PopoverContent>
        </Popover>
       

        <Popover>
          <PopoverTrigger>
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"                />
            </svg>
          </PopoverTrigger>
          <PopoverContent>
            <form onSubmit= {(e)=> { e.preventDefault();send('RESTART'), 
            send( 'HANDLE_SETTINGS',{targetSize: noStateSize, targetMineCount: noStateMine}) ;send('START_GAME')   }}>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="name">
                  Row Size:
                </label><base href="" />
                <input className="Input" id="size" defaultValue={8} onChange={(v)=>{noStateSize=Number(v.target.value)}}/>
              </fieldset>
              <fieldset className="Fieldset">
                <label className="Label" htmlFor="username">
                  Bomb Count: 
                </label>
                <input className="Input" id="bombCount" defaultValue={5}  onChange={(v)=>{noStateMine=Number(v.target.value)}}/>
              </fieldset>
              <Button className='mt-1' type="submit">Submit</Button>
            </form>

          
          </PopoverContent>
        </Popover>
      </div>

      <svg
        onClick={()=> { send('RESTART' ) ; send('START_GAME')  }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>

      <div className="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 fill-red-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796a3.765 3.765 0 00-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 01-1.388.88m2.268-2.268l4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0l-3.448-4.138m3.448 4.138a9.014 9.014 0 01-9.424 0m5.976-4.138a3.765 3.765 0 01-2.528 0m0 0a3.736 3.736 0 01-1.388-.88 3.737 3.737 0 01-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 01-1.652-1.306 9.027 9.027 0 01-1.306-1.652m0 0l4.138-3.448M4.33 16.712a9.014 9.014 0 010-9.424m4.138 5.976a3.765 3.765 0 010-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 011.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 00-1.652 1.306A9.025 9.025 0 004.33 7.288"
          />
        </svg>

        <h3 className=" text-gray-900 font-bold">{mineCount}</h3>
      </div>
    </div>

    <Separator />

    <div className="flex flex-col bg-red-200 ">
      {grid.map((currentSup , x) => {
        return (
          <div className="flex bg-red-600 justify-evenly">
            {currentSup.map((currentBox, y) => {
              return (
                <XsBox
                  onklik={() => send('BOX_CLICK',{x: x, y: y})}
                  val={currentBox.value}
                  issDisclosed={currentBox.isDisclosed}
                  gameCount={gameCount}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  </div>

  )
}

export default Minesweeper