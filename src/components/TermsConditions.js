// TermsConditions.js
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function TermsConditions () {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-[#F9FAF9] pb-10 font-sans'>
      {/* Premium Header */}
      <div className='sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm'>
        <div className='max-w-md mx-auto px-5 h-[72px] flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2.5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <div className='text-center'>
            <h1 className='text-[18px] font-black text-gray-900 tracking-tight'>
              Legal
            </h1>
            <p className='text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest'>
              Terms & Conditions
            </p>
          </div>
          <div className='w-10 h-10' />
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-6'>
        <div className='bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 md:p-8'>
          {/* <p className='text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6'>
            Last Updated: July 18, 2026
          </p> */}

          <div className='prose prose-sm text-gray-600 prose-headings:text-gray-900 prose-headings:font-black prose-p:leading-relaxed'>
            <h2 className='text-[18px] mb-3'>1. Introduction</h2>
            <p className='mb-5 text-[13px]'>
              Welcome to Zyeat. By accessing or using our meal subscription app,
              you agree to be bound by these Terms and Conditions. Please read
              them carefully before making a purchase.
            </p>

            <h2 className='text-[18px] mb-3'>2. Subscription & Payments</h2>
            <p className='mb-5 text-[13px]'>
              When you select a meal plan (e.g., 3-day or 7-day plan), you agree
              to pay the total amount upfront. All payments are processed
              securely through our authorized payment gateways. Zyeat reserves
              the right to modify prices, though active subscriptions will not
              be affected until renewal.
            </p>

            <h2 className='text-[18px] mb-3'>3. Delivery Policy</h2>
            <p className='mb-5 text-[13px]'>
              Meals are delivered during the time slots you select (Morning or
              Evening). We require a minimum of 24 hours notice to pause, skip,
              or modify a scheduled delivery. If you fail to be present during
              delivery, the meal will be marked as delivered.
            </p>

            <h2 className='text-[18px] mb-3'>4. Health Disclaimer</h2>
            <p className='mb-5 text-[13px]'>
              The nutritional information provided by Zyeat is an estimate. If
              you have severe allergies, dietary restrictions, or medical
              conditions, it is your responsibility to verify the ingredients.
              Zyeat is not a medical organization and our meal plans should not
              be taken as medical advice.
            </p>

            <h2 className='text-[18px] mb-3'>5. Cancellations & Refunds</h2>
            <p className='mb-5 text-[13px]'>
              Cancellations made within 24 hours of the first scheduled delivery
              are not eligible for a full refund. Mid-plan cancellations will be
              reviewed on a case-by-case basis and may incur processing fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
