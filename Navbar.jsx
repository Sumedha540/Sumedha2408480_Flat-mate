import React from 'react';

const Navbar = () => {
  return (
    // Main navbar container: flexbox layout for spacing between logo, menu, and user icon
    // Background: dark green (#006400), fixed height, centered items vertically
    <nav className="flex justify-between items-center bg-[#163832] px-5 py-4 text-white font-sans h-16">
    
      <div className="text-2xl font-bold text-white">
        {/* <img src={assets.logo_dark} alt='Logo'/>Logo */} LoGo
        </div>
      
      <ul className="flex list-none m-0 p-0 gap-8">
        <li><a href="#home" className="text-white no-underline text-base hover:underline">Home</a></li>
        <li><a href="#properties" className="text-white no-underline text-base hover:underline">Properties</a></li>
        <li><a href="#favorites" className="text-white no-underline text-base hover:underline">Favorites</a></li>
        <li><a href="#contact" className="text-white no-underline text-base hover:underline">Contact Us</a></li>
        <li><a href="#about" className="text-white no-underline text-base hover:underline">About Us</a></li>
      </ul>
      
      {/* User icon section: simple circular placeholder icon */}
      <div className="text-2xl">○</div>
    </nav>
  );
};

export default Navbar;