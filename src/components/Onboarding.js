import React, { useState, useEffect } from "react";
import BB from '../assests/food1.jpeg'
import B1 from '../assests/food2.jpeg'
import logo from '../assests/zyeat-logo.png'


const images = [
  { src: "./Assests/images/food1.jpeg", alt: "Healthy meal" },
  { src: "./Assests/images/Peanut_butter.png", alt: "Peanut butter" },
  { src: "./Assests/images/sprouts.png", alt: "Sprouts" },
];

export default function Onboarding({ onLoginClick }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full h-1/2 relative bg-[linear-gradient(to_bottom,_#d9f2f5,_#ffffff)]">

        {/* Carousel */}
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={logo}
            alt="bb"
            className="w-full h-full object-cover transition-all duration-700"
          />
          <div className="absolute inset-0"></div>
        </div>

        {/* Thumbnails */}
        <div className="absolute -bottom-16 w-full flex justify-center space-x-3 z-10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-6">
            <img
              src={BB}
              alt="Chickpeas"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={B1}
              alt="Peanut butter"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform rotate-6">
            <img
              src={BB}
              alt="Sprouts"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full bg-white pt-[80px] px-8 flex flex-col flex-grow relative">
        <div className="text-center mb-auto">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-900 leading-tight">
            Fuel Your Fitness {" "}
            <span className="text-[#FF7043]">Journey.</span>
          </h1>
          <h4 className="text-gray-600 px-2 text-xl tracking-wide">
           Customized Pre & Post-Workout Meals
          </h4>
        </div>

        {/* Dots */}
        <div className="flex justify-center space-x-2 mb-8">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-[#FF7043]" : "w-2 bg-gray-300"
              }`}
            ></span>
          ))}
        </div>

        {/* CTA */}
        <div className="mb-6 w-full">
          <button
            onClick={onLoginClick}
            className="w-full text-center py-4 rounded-full text-white font-bold text-lg transition duration-300 shadow-xl bg-gradient-to-r from-[#FF7043] to-[#FF3D00] hover:scale-[1.02] transform"
          >
            Login or Sign Up
          </button>
        </div>
      </div>
    </>
  );
}
