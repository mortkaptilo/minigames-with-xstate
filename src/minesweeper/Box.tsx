import React, { useEffect, useState } from 'react'


interface propsType {

    gameCount: number;
    val: number;
    issDisclosed: boolean;
    onklik: () => void;
}

const XsBox = ( props: propsType ) => {


    const [isFlagged, setFlagged] = useState(false);
    useEffect( ()=>{
  
      setFlagged(false);
  
    
    },[props.gameCount])
   
  
    return (
      <div
        onAuxClick={() => {
          if( !props.issDisclosed)
              setFlagged(!isFlagged);
        }}
        onClick={() => {
          if(!isFlagged && !props.issDisclosed) {
             
            props.onklik();
          }
          
        }}
        className={ 
          "flex justify-center items-center hover:cursor-pointer shadow-inner shadow-slate-400  w-8 h-8 border-t border-r  hover:bg-slate-500 text-base font-bold border-gray-500 " +
          (props.issDisclosed ? " bg-slate-100 " : "bg-slate-300 ") +
  
          (props.val ==1 ? "text-black " :( props.val ==2 ?  " text-blue-600" : ( props.val == 3 ? "text-green-600" : (props.val == 4 ? "text-orange-600" : "text-orange-700" ) ) ) )
        }
      >
        {props.issDisclosed ? (
          props.val > 0 ? (
            props.val 
          ) : (
            ""
          )
        ) : isFlagged ? (
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
              d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
            />
          </svg>
        ) : (
          ""
        )}
      </div>
    );
}



export default XsBox