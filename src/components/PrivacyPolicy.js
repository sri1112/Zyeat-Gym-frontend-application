// PrivacyPolicy.js
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy () {
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
              Privacy
            </h1>
            <p className='text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest'>
              Data Protection
            </p>
          </div>
          <div className='w-10 h-10' />
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-6'>
        {/* Top Summary Card */}
        <div className='bg-gradient-to-br from-[#065c2d] to-[#04401f] rounded-[24px] shadow-lg p-6 mb-6 text-white'>
          <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
              />
            </svg>
          </div>
          <h2 className='text-[20px] font-black tracking-tight mb-2'>
            Your Privacy Matters
          </h2>
          <p className='text-[13px] text-white/80 leading-relaxed font-medium'>
            We are committed to protecting your personal data and ensuring
            transparency in how we collect, use, and store your health and
            payment information.
          </p>
        </div>

        {/* Detailed Content */}
        <div className='bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6'>
          <div className='space-y-6'>
            <div>
              <h3 className='text-[15px] font-black text-gray-900 mb-2 flex items-center gap-2'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#065c2d]' />{' '}
                Information We Collect
              </h3>
              <p className='text-[13px] text-gray-600 leading-relaxed'>
                We collect information you provide directly to us, such as your
                name, email, delivery address, physical metrics (weight/height),
                dietary preferences, and allergy information to customize your
                meal plans.
              </p>
            </div>

            <div>
              <h3 className='text-[15px] font-black text-gray-900 mb-2 flex items-center gap-2'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#065c2d]' /> How
                We Use Your Data
              </h3>
              <p className='text-[13px] text-gray-600 leading-relaxed'>
                Your data is primarily used to fulfill your orders and tailor
                the nutritional value of your meals. We do not sell your
                personal or health data to third-party advertisers.
              </p>
            </div>

            <div>
              <h3 className='text-[15px] font-black text-gray-900 mb-2 flex items-center gap-2'>
                <span className='w-1.5 h-1.5 rounded-full bg-[#065c2d]' />{' '}
                Payment Security
              </h3>
              <p className='text-[13px] text-gray-600 leading-relaxed'>
                Payment transactions are encrypted using secure sockets layer
                (SSL) technology and processed by our third-party gateway
                providers. We do not store your full credit card information on
                our servers.
              </p>
            </div>

            <div className='pt-4 border-t border-gray-100'>
              <p className='text-[11px] font-medium text-gray-400'>
                If you have questions about this privacy policy, please contact
                us at support@zyeat.com.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
