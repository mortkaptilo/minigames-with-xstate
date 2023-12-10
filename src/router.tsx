import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Header from "./Header";
import Snake from "./snake/Snake";
import Minesweeper from "./minesweeper/Minesweeper";
import Tetris from "./tetris/Tetris";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    
    
    children: [
      {
        path: "snake",
        element: <Snake />,
        
      
      },

      { 
        path: "minesweeper",
        element: <Minesweeper/>
      },

      {

        path: "tetris",
        element: <Tetris/>
      }
    ],
  },
]);

export default router