import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

export default function DeleteAccount () {
  const navigate = useNavigate()

  // States
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await authService.deleteAccount()

      if (res.success) {
        localStorage.clear()

        // ❌ REMOVE THIS: navigate('/')
        // ✅ ADD THIS: Force a hard page reload to clear React's memory
        window.location.href = '/'
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#F9FAF9] font-sans pb-10 relative'>
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
              Delete Account
            </h1>
            <p className='text-[10px] font-bold text-red-500 mt-0.5 uppercase tracking-widest'>
              Danger Zone
            </p>
          </div>
          <div className='w-10 h-10' /> {/* Spacer */}
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-6'>
        {/* Warning Card */}
        <div className='bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-6 text-center'>
          <div className='w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5 shadow-inner'>
            <svg
              className='w-10 h-10 text-red-500'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
              />
            </svg>
          </div>

          <h2 className='text-[20px] font-black text-gray-900 tracking-tight mb-3'>
            We're sorry to see you go.
          </h2>

          <p className='text-[13px] text-gray-500 leading-relaxed font-medium mb-6 px-2'>
            If you delete your account, your personal information, active
            subscriptions, and order history will be permanently erased.
          </p>

          <div className='space-y-3 pt-6 border-t border-gray-100'>
            <button
              onClick={() => setShowModal(true)}
              className='w-full h-12 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold text-[15px] flex items-center justify-center hover:bg-red-100 transition-colors'
            >
              Delete My Account
            </button>
            <button
              onClick={() => navigate(-1)}
              className='w-full h-12 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-[15px] flex items-center justify-center hover:bg-gray-50 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-5'>
          {/* Backdrop */}
          <div
            className='absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-[3px] transition-opacity'
            onClick={() => !loading && setShowModal(false)}
          />

          {/* Modal Content */}
          <div className='relative w-full max-w-[340px] bg-white rounded-[24px] shadow-2xl p-6 animate-slide-up'>
            <div className='w-14 h-14 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4'>
              <svg
                className='w-7 h-7 text-red-600'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                />
              </svg>
            </div>

            <h3 className='text-[18px] font-black text-center text-gray-900 mb-2'>
              Are you absolutely sure?
            </h3>
            <p className='text-[13px] text-center text-gray-500 font-medium mb-6'>
              This action cannot be undone. All your data will be lost forever.
            </p>

            {/* Inline Error Message */}
            {error && (
              <div className='mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-center text-[12px] font-bold text-red-600'>
                {error}
              </div>
            )}

            <div className='flex flex-col gap-3'>
              <button
                onClick={handleDelete}
                disabled={loading}
                className='w-full h-[48px] rounded-xl bg-red-600 text-white font-bold text-[14px] flex items-center justify-center shadow-[0_4px_14px_rgba(220,38,38,0.3)] disabled:opacity-70 active:scale-[0.98] transition-all'
              >
                {loading ? (
                  <span className='flex items-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Deleting...
                  </span>
                ) : (
                  'Yes, Delete My Account'
                )}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className='w-full h-[48px] rounded-xl bg-gray-100 text-gray-700 font-bold text-[14px] flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50'
              >
                No, Keep My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
