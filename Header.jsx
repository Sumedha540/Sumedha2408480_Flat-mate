
// It uses a flex layout to position content and image side by side, with responsive stacking on smaller screens.
import React from 'react';

const Header = () => {
  return (
    // Hero section container: flex row for desktop, column for mobile; centered content with padding and max width
    <section className="flex items-center px-5 py-12 bg-white gap-12 max-w-6xl mx-auto md:flex-row flex-col">
      {/* Hero content wrapper: takes full width on mobile, half on desktop */}
      <div className="flex-1">
        {/* Main title: large bold text with line breaks preserved via <br />, dark color, tight line height */}
        <h1 className="text-5xl font-bold text-gray-800 leading-tight mb-5 md:text-6xl">
          Discover Affordable<br />
          Rooms, Flats, and<br />
          Apartments Near You
        </h1>
        {/* Subtitle: medium text, gray color, with <br /> for line break, loose line height */}
        <p className="text-lg text-gray-600 leading-relaxed">
          Browse verified listings and find a comfortable space<br />
          that fits your budget and lifestyle.
        </p>
      </div>
      {/* Image wrapper: flex-1 for equal spacing, full width image with rounded corners and subtle shadow */}
      <div className="flex-1">
        <img 
          src="https://via.placeholder.com/500x600/90EE90/006400?text=Cozy+Room+Image" 
          alt="Cozy room interior with window view, desk setup, bed, plants, and bookshelves" 
          className="w-full h-auto rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
};

export default Header;