
import React from 'react'
import zyeatlogo from "../../assests/zyeat-removebg.png";
import { Link } from 'react-router-dom'

export default function Header () {
  return (
    <div className='fixed top-0 z-50 w-full bg-white px-5 py-4 flex justify-between items-center bg-white'>
      {/* Left Side: Profile Image & App Name */}
      <div className='flex items-center gap-3'>    

        {/* App Title */}
        <Link to='/'>
          {/* <h1 className='text-[24px] font-bold text-[#0D6E26] tracking-tight'> */}
            {/* Zyeat */}
          {/* </h1> */}
          <img src={zyeatlogo} alt="logo" className="w-20 h-10" />
        </Link>
      </div>

      {/* Right Side: Icons */}
      <div className='flex items-center gap-4'>
        {/* Notification Bell */}
        <button className='text-gray-800 hover:text-[#0D6E26] transition-colors'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.5'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
