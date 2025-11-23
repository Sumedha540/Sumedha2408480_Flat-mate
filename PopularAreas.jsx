import React, { useEffect, useState } from 'react'

const PopularAreas = () => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardsToShow, setCardsToShow] = useState(1)

  const properties = [
    { id: 1, image: "...", type: "Single Room", price: "Rs. 9,000/month", location: "Pokhara Lakeside", facilities: ["WiFi", "Parking"], host: "Flat-Mate", views: 81 },
    { id: 2, image: "...", type: "Shared Room", price: "Rs. 9,000/month", location: "Pulchowk", facilities: ["WiFi, Furnished Room", "Parking", "Kitchen"], host: "Flat-Mate", views: 75 },
    { id: 3, image: "...", type: "Family Flat", price: "Rs. 12,000/month", location: "Bhaktapur", facilities: ["WiFi, Furnished Room", "Parking", "Kitchen"], host: "Sunil", views: 28 },
    { id: 4, image: "...", type: "Single Room", price: "Rs. 7,500/month", location: "New Baneshwor", facilities: ["Water, Furnished Room", "Kitchen"], host: "Flat-Mate", views: 50 },
    { id: 5, image: "...", type: "Shared Room", price: "Rs. 3,500/month", location: "Biratnagar", facilities: ["WiFi, Furnished Room", "Kitchen"], host: "Sarmila", views: 81 },
    { id: 6, image: "...", type: "Single Room", price: "Rs. 3,500/month", location: "Kesaliya", facilities: ["Kitchen, Furnished Room, Attached Bathroom"], host: "Flat-Mate", views: 75 },
  ]

  useEffect(() => {
    const updateCardsToShow = () => {
      setCardsToShow(window.innerWidth >= 1024 ? 4 : 1)
    }

    updateCardsToShow()
    window.addEventListener('resize', updateCardsToShow)
    return () => window.removeEventListener('resize', updateCardsToShow)
  }, [])

  const maxIndex = Math.max(0, properties.length - cardsToShow)
  const canPrev = currentIndex > 0
  const canNext = currentIndex < maxIndex

  const nextSlide = () => {
    if (canNext) setCurrentIndex(prev => prev + 1)
  }

  const prevSlide = () => {
    if (canPrev) setCurrentIndex(prev => prev - 1)
  }

  return (
    <div className='container mx-auto py-4 px-6 lg:px-32 w-full overflow-hidden' id='PopularAreas'>

      {/* Section Title */}
      <h1 className='text-3xl md:text-4xl font-bold text-center py-4'>Popular Areas</h1>
      <p className='text-center text-gray-500'>Discover rooms and flats in top areas</p>

      {/* Arrows */}
      {properties.length > cardsToShow && (
        <div className='flex justify-end mb-3'>
          <button
            onClick={prevSlide}
            disabled={!canPrev}
            className={`p-2 bg-gray-200 rounded mr-2 ${
              !canPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            }`}>
            ←
          </button>

          <button
            onClick={nextSlide}
            disabled={!canNext}
            className={`p-2 bg-gray-200 rounded ${
              !canNext ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
            }`}>
            →
          </button>
        </div>
      )}

      {/* Slider Wrapper */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4 transition-transform duration-500"
          style={{ transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)` }}
        >

          {/* Cards */}
          {properties.map((property, index) => (
            <div key={index} className="flex-shrink-0 w-full lg:w-1/4">

              <div className="flex flex-col bg-white rounded-2xl shadow-md border p-3 h-[390px]">

                {/* Image */}
                <div className="h-36 w-full rounded-xl overflow-hidden">
                  <img src={property.image} className="w-full h-full object-cover" />
                </div>

                {/* Title + Price */}
                <div className="flex justify-between mt-2">
                  <h2 className="text-lg font-semibold">{property.type}</h2>
                  <span className="font-bold text-green-600">{property.price}</span>
                </div>

                {/* Location */}
                <p className="text-gray-600 mt-1 text-sm">📍 {property.location}</p>

                {/* Facilities */}
                <ul className="text-sm text-gray-500 mt-1 h-16 overflow-auto">
                  {property.facilities.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>

                {/* Views + Host */}
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>👁 {property.views} views</span>
                  <span className="font-semibold text-blue-600">{property.host}</span>
                </div>

                {/* Button */}
                <button
                  className="mt-auto w-full py-2 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: "#8EB69B" }}>
                  View Details
                </button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}


export default PopularAreas
