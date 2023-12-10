import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <div className='flex flex-col items-center'>
      {/* Your header content goes here */}
      <nav className='flex flex-row justify-evenly md:w-4/5 mb-10 pb-5 border-b-2 pt-5  w-full '>
        <Link to="snake" > <h2 className=' text-2xl font-mono'> Snake</h2></Link>
        
        <Link to="tetris" > <h2 className=' text-2xl font-mono'> Tetris</h2></Link>

        <Link to="minesweeper" > <h2 className=' text-2xl font-mono'> Minesweeper</h2></Link>
      </nav>

      {/* The Outlet component where child components will be rendered */}
      <Outlet />
    </div>
  );
};

export default Header;