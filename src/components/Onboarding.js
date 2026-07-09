// import React, { useState, useEffect } from "react";
// import BB from '../assests/food1.jpeg'
// import B1 from '../assests/food2.jpeg'
// import logo from '../assests/zyeat-logo.png'

// const images = [
//   { src: "./Assests/images/food1.jpeg", alt: "Healthy meal" },
//   { src: "./Assests/images/Peanut_butter.png", alt: "Peanut butter" },
//   { src: "./Assests/images/sprouts.png", alt: "Sprouts" },
// ];

// export default function Onboarding({ onLoginClick }) {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % images.length);
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <div className="w-full h-1/2 relative bg-[linear-gradient(to_bottom,_#d9f2f5,_#ffffff)]">

//         {/* Carousel */}
//         <div className="w-full h-full relative overflow-hidden">
//           <img
//             src={logo}
//             alt="bb"
//             className="w-full h-full object-cover transition-all duration-700"
//           />
//           <div className="absolute inset-0"></div>
//         </div>

//         {/* Thumbnails */}
//         <div className="absolute -bottom-16 w-full flex justify-center space-x-3 z-10">
//           <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform -rotate-6">
//             <img
//               src={BB}
//               alt="Chickpeas"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-2xl">
//             <img
//               src={B1}
//               alt="Peanut butter"
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl transform rotate-6">
//             <img
//               src={BB}
//               alt="Sprouts"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="w-full bg-white pt-[80px] px-8 flex flex-col flex-grow relative">
//         <div className="text-center mb-auto">
//           <h1 className="text-4xl font-extrabold mb-3 text-gray-900 leading-tight">
//             Fuel Your Fitness {" "}
//             <span className="text-[#FF7043]">Journey.</span>
//           </h1>
//           <h4 className="text-gray-600 px-2 text-xl tracking-wide">
//            Customized Pre & Post-Workout Meals
//           </h4>
//         </div>

//         {/* Dots */}
//         <div className="flex justify-center space-x-2 mb-8">
//           {images.map((_, i) => (
//             <span
//               key={i}
//               className={`h-2 rounded-full transition-all ${
//                 i === index ? "w-6 bg-[#FF7043]" : "w-2 bg-gray-300"
//               }`}
//             ></span>
//           ))}
//         </div>

//         {/* CTA */}
//         <div className="mb-6 w-full">
//           <button
//             onClick={onLoginClick}
//             className="w-full text-center py-4 rounded-full text-white font-bold text-lg transition duration-300 shadow-xl bg-gradient-to-r from-[#FF7043] to-[#FF3D00] hover:scale-[1.02] transform"
//           >
//             Login or Sign Up
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }
import React from 'react'

import food1 from '../assests/food1.jpeg'
import food2 from '../assests/food2.jpeg'
import food3 from '../assests/food1.jpeg'
import logo from '../assests/zyeat-logo2.png'

export default function Onboarding ({ onLoginClick }) {
  return (
    <div className='w-full min-h-screen bg-[#fdfefb] flex justify-center'>
      <div className='relative w-full max-w-[430px] min-h-screen overflow-hidden bg-[#fdfefb] flex flex-col'>
        {/* LEFT DECORATION */}
        <div className='absolute top-[135px] -left-[55px] w-[125px] h-[190px] rounded-full bg-[#eef7e9]' />

        {/* RIGHT DOTS */}
        <div className='absolute top-[145px] right-[20px] grid grid-cols-4 gap-[7px] opacity-50'>
          {Array.from({ length: 20 }).map((_, index) => (
            <span
              key={index}
              className='w-[3px] h-[3px] rounded-full bg-[#8cc77d]'
            />
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className='relative z-10 flex flex-col flex-1 px-5 pt-8'>
          {/* LOGO */}
          <div className='flex justify-center mb-0'>
            <img
              src={logo}
              alt='Zyeat'
              className='w-[175px] h-auto object-contain'
            />
          </div>

          {/* TITLE */}
          <div className='text-center'>
            <h1 className='text-[31px] leading-[1.15] font-extrabold text-[#20293a]'>
              Fuel your fitness
            </h1>

            <div className='flex items-center justify-center gap-3 mt-1'>
              {/* LEFT LINES */}
              <div className='flex flex-col gap-1 rotate-[-10deg]'>
                <span className='block w-7 h-[2px] bg-[#9bc98b] rounded-full' />
                <span className='block w-5 h-[2px] bg-[#9bc98b] rounded-full ml-2' />
              </div>

              <h2 className='text-[32px] leading-none font-extrabold text-[#ff681d]'>
                journey
              </h2>

              {/* RIGHT LINES */}
              <div className='flex flex-col gap-1 rotate-[10deg]'>
                <span className='block w-7 h-[2px] bg-[#9bc98b] rounded-full' />
                <span className='block w-5 h-[2px] bg-[#9bc98b] rounded-full' />
              </div>
            </div>

            <p className='mt-5 text-[14px] leading-6 font-medium text-[#4d5564]'>
              Customized pre & post-workout meals
              <br />
              designed for you.
            </p>
          </div>

          {/* FOOD CARDS */}
          <div className='relative mt-6 h-[165px] flex justify-center items-center'>
            {/* LEFT CARD */}
            <div className='absolute left-[10px] w-[100px] h-[140px] p-[5px] bg-white rounded-[22px] shadow-xl rotate-[-7deg]'>
              <img
                src={food1}
                alt='High protein meal'
                className='w-full h-full object-cover rounded-[18px]'
              />
            </div>

            {/* CENTER CARD */}
            <div className='absolute z-10 w-[110px] h-[140px] p-[3px] bg-white rounded-[20px] shadow-2xl'>
              <img
                src={food2}
                alt='Healthy meal'
                className='w-full h-full object-cover rounded-[18px]'
              />
            </div>

            {/* RIGHT CARD */}
            <div className='absolute right-[10px] w-[100px] h-[140px] p-[5px] bg-white rounded-[22px] shadow-xl rotate-[7deg]'>
              <img
                src={food3}
                alt='Fresh meal'
                className='w-full h-full object-cover rounded-[18px]'
              />
            </div>
          </div>

          {/* FEATURES BOX */}
          <div className='mt-2 mx-1 bg-gradient-to-b from-[#f6faf3] to-[#f8fbf6] rounded-[30px] px-3 py-7 shadow-[0_12px_35px_rgba(45,100,60,0.05)]'>
            <div className='flex items-stretch justify-between'>
              {/* HIGH PROTEIN */}
              <div className='flex-1 text-center px-2'>
                <div className='h-10 flex justify-center items-center'>
                  <svg
                    viewBox='0 0 64 64'
                    className='w-10 h-10 stroke-[#4d9252]'
                    fill='none'
                    strokeWidth='4'
                    strokeLinecap='round'
                  >
                    <path d='M8 25v14M14 20v24M20 26v12M20 32h24M44 26v12M50 20v24M56 25v14' />
                  </svg>
                </div>

                <p className='mt-2 text-[13px] leading-5 font-bold text-[#222938]'>
                  High Protein
                  <br />
                  Meals
                </p>
              </div>

              <div className='w-px bg-[#d8ddd5]' />

              {/* FRESH */}
              <div className='flex-1 text-center px-2'>
                <div className='h-10 flex justify-center items-center'>
                  <svg
                    viewBox='0 0 64 64'
                    className='w-11 h-11 stroke-[#4d9252]'
                    fill='none'
                    strokeWidth='3.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M12 48C26 30 37 20 54 12c-1 21-12 35-34 37' />
                    <path d='M18 46c9-11 18-18 30-26' />
                  </svg>
                </div>

                <p className='mt-2 text-[13px] leading-5 font-bold text-[#222938]'>
                  Fresh &
                  <br />
                  Healthy
                </p>
              </div>

              <div className='w-px bg-[#d8ddd5]' />

              {/* DELIVERY */}
              <div className='flex-1 text-center px-2'>
                <div className='h-10 flex justify-center items-center'>
                  <svg
                    viewBox='0 0 64 64'
                    className='w-10 h-10 stroke-[#4d9252]'
                    fill='none'
                    strokeWidth='3.5'
                    strokeLinecap='round'
                  >
                    <circle cx='32' cy='32' r='22' />
                    <path d='M32 18v15l10 6' />
                  </svg>
                </div>

                <p className='mt-2 text-[13px] leading-5 font-bold text-[#222938]'>
                  On-Time
                  <br />
                  Delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GREEN AREA */}
        <div className='relative mt-8 min-h-[210px] bg-[#377c4d] px-6 pt-16 pb-8'>
          {/* CURVED TOP */}
          <div
            className='absolute -top-[45px] left-[-10%] w-[120%] h-[90px] bg-[#377c4d]'
            style={{
              borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
              transform: 'rotate(-2deg)'
            }}
          />

          {/* DECORATIVE LEAVES */}
          <div className='absolute -top-[55px] left-5 z-10'>
            <svg width='60' height='80' viewBox='0 0 60 80' fill='none'>
              <path
                d='M27 75C27 52 26 31 30 10'
                stroke='#9dcc83'
                strokeWidth='3'
              />
              <path
                d='M30 10C15 20 15 34 27 42C39 28 39 18 30 10Z'
                fill='#9dcc83'
              />
              <path
                d='M26 53C12 45 5 51 5 62C15 65 23 61 26 53Z'
                fill='#9dcc83'
              />
              <path
                d='M28 61C41 50 51 53 54 63C45 70 36 69 28 61Z'
                fill='#9dcc83'
              />
            </svg>
          </div>

          {/* BUTTON */}
          <button
            type='button'
            onClick={onLoginClick}
            className='
              relative z-20
              w-full
              h-[60px]
              rounded-[18px]
              bg-gradient-to-r
              from-[#ff6a17]
              to-[#ff6518]
              text-white
              text-[18px]
              font-extrabold
              shadow-[0_15px_30px_rgba(255,102,24,0.3)]
              active:scale-[0.98]
              transition-transform
            '
          >
            Login or Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
