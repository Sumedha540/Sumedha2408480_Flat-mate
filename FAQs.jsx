import React, { useState } from 'react'
import Reviews from './Reviews';

const FAQs = () => {
  const [expanded, setExpanded] = useState([true, false, false, false]);

  const toggle = (index) => {
    setExpanded(prev => prev.map((e, i) => i === index ? !e : e));
  };

  const questions = [
    {
      q: "1. How do I know the listings are genuine?",
      a: "All rooms and flats are verified before going live on our platform, ensuring that you only see genuine and trustworthy listings."
    },
    {
      q: "2. Do I need to pay any extra charges?",
      a: "No, our platform is completely free for renters. You only need to pay the rent and any agreed-upon deposit directly to the owner."
    },
    {
      q: "3. Can I reserve or pre-book a room online?",
      a: "Yes, you can easily reserve or pre-book a room through our platform. Simply select the property and follow the booking steps to secure your spot."
    },
    {
      q: "4. What if I face issues after renting?",
      a: "If you encounter any issues after renting, our dedicated support team is here to help. We offer mediation services and ensure quick resolution to keep your experience positive."
    }
  ];

  return (
    <div>

      {/* ---------- FIRST BOX (#8EB69B) ---------- */}
      <div
        className="w-full max-w-6xl mx-auto mt-16 p-10 rounded-lg flex flex-col md:flex-row gap-10"
        style={{ background: "#8EB69B" }}
      >
        <img
          src="/your-image.png"
          alt="Room"
          className="w-full md:w-1/3 rounded-lg object-cover"
        />

        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-4 border-b border-black pb-1">
            Helping people find the right property
          </h2>

          <p className="font-semibold mb-1">Trust & Ease</p>
          <p className="text-sm mb-4">
            Find rooms and flats in just a few clicks. Trusted by hundreds of students and locals every month.
          </p>

          <p className="font-semibold mb-1">Fast & Reliable</p>
          <p className="text-sm mb-4">
            We make renting quick, safe, and stress-free by providing only genuine listings and reliable owners. With smart filters, easy navigation, and a growing number of successful matches, finding your ideal room or flat has never been simpler.
          </p>

          <p className="font-semibold mb-1">Community Feel</p>
          <p className="text-sm">
            Our growing community values trust, comfort, and transparency, ensuring every renter finds a place they can truly call home. With secure payments and verified owners, you’re always in safe hands.
          </p>
        </div>
      </div>

      {/* FAQ TITLE */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="text-gray-600 mt-3">
          If your question isn’t listed above, our support team is always ready to assist you. Feel free to reach out anytime for quick guidance and reliable answers. We’re committed to making your room search smooth and stress-free.
        </p>
      </div>

      {/* FAQ ITEMS */}
      <div className="max-w-6xl mx-auto mt-10 px-4 space-y-4">
        {questions.map((faq, index) => (
          <div key={index} className="p-5 rounded-lg" style={{ background: "#DAF1DE" }}>
            <div 
              className="flex justify-between items-start cursor-pointer" 
              onClick={() => toggle(index)}
            >
              <h3 className="font-semibold text-lg flex-1">
                {faq.q}
              </h3>
              <span className="text-xl font-bold ml-2 self-start">
                {expanded[index] ? '×' : '+'}
              </span>
            </div>
            {expanded[index] && (
              <p className="text-sm text-gray-700 mt-2">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Reviews Section */}
      <Reviews />
    </div>
  );
};

export default FAQs;