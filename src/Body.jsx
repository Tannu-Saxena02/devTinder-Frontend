import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Body = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
      {/* //to render the child component */}
      <Footer/>
    </div>
  );
}

export default Body;
