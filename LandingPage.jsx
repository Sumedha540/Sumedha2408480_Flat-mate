// Main landing page component that assembles the navbar, hero header, stats section, and popular areas.
import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import PopularAreas from './PopularAreas'; 
import FAQs from './FAQs';

const LandingPage = () => {
  return (
    // Page wrapper: sets base font family, full height/width for the entire page
    <div className="font-sans min-h-screen">
      <Navbar />
      <Header />
      
      {/* Stats section: light green background, flex row for even distribution of stat items, responsive column on mobile.
          Reduced py-10 to py-6 to minimize gap to next section. */}
      <section className="flex justify-around bg-[#DAF1DE] px-5 py-6 max-w-6xl mx-auto gap-5 md:flex-row flex-col">
        {/* First stat item: flex row, centered text, white background with padding, rounded, subtle shadow */}
        <div className="flex items-center justify-center bg-white p-5 rounded-xl shadow-md flex-1">
          {/* Icon: red heart symbol, large size */}
          <span className="text-3xl mr-4 text-red-500">♥</span>
          {/* Stat number: large dark green text, no margin bottom */}
          <div className="text-center">
            <h3 className="text-3xl font-bold text-[#006400] mb-1">97%</h3>
            {/* Stat label: small gray text */}
            <p className="text-sm text-gray-600">Positive feedback</p>
          </div>
        </div>
        
        {/* Second stat item: similar structure, user icon */}
        <div className="flex items-center justify-center bg-white p-5 rounded-xl shadow-md flex-1">
          {/* Icon: user silhouette, large size, dark green */}
          <span className="text-3xl mr-4 text-[#006400]">👤</span>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-[#006400] mb-1">200+</h3>
            <p className="text-sm text-gray-600">Happy Customers</p>
          </div>
        </div>
        
        {/* Third stat item: clock icon for support */}
        <div className="flex items-center justify-center bg-white p-5 rounded-xl shadow-md flex-1">
          {/* Icon: clock symbol, large size, dark green */}
          <span className="text-3xl mr-4 text-[#006400]">🕐</span>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-[#006400] mb-1">24/7</h3>
            <p className="text-sm text-gray-600">Support</p>
          </div>
        </div>
        
        {/* Fourth stat item: house icon for rentals */}
        <div className="flex items-center justify-center bg-white p-5 rounded-xl shadow-md flex-1">
          {/* Icon: house symbol, large size, dark green */}
          <span className="text-3xl mr-4 text-[#006400]">🏠</span>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-[#006400] mb-1">400+</h3>
            <p className="text-sm text-gray-600">Flats/room rented</p>
          </div>
        </div>
      </section>

      {/* Render PopularAreas directly after stats for minimal gap */}
      <div className="mt-12">   
          <PopularAreas />
      </div>
      <FAQs/>
    </div>
  );
};

export default LandingPage;