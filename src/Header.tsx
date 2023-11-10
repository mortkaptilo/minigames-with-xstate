import React from 'react';
import { Outlet } from 'react-router-dom';

const Header = () => {
  return (
    <div>
      {/* Your header content goes here */}
      <nav>
        {/* Navigation links or other header elements */}
      </nav>

      {/* The Outlet component where child components will be rendered */}
      <Outlet />
    </div>
  );
};

export default Header;