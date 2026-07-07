import React, { useState, useEffect } from 'react'

export default function OnboardingModal ({
  show,
  isMandatory,
  onClose,
  onSave,
  currentUser
}) {
  // Pre-fill if editing, otherwise empty
  const [name, setName] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [diet, setDiet] = useState(currentUser?.diet || '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Keep state synced if currentUser changes
  useEffect(() => {
    setName(currentUser?.name || '')
    setEmail(currentUser?.email || '')
    setDiet(currentUser?.diet || '')
  }, [currentUser])

  const handleContinue = async () => {
    if (name.trim().length < 2) {
      setError('Please enter a valid name.')
      return
    }
    if (!diet) {
      setError('Please select your food preference.')
      return
    }

    setLoading(true)
    setError('')

    // Pass all 3 fields to the save handler
    await onSave({ name, email, diet })

    setLoading(false)
  }

  const isFormValid = name.trim().length >= 2 && diet !== ''

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          show ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={!isMandatory ? onClose : undefined}
      />

      <div
        className={`fixed left-1/2 bottom-0 transform -translate-x-1/2 w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 z-50 transition-transform duration-500 max-h-[90vh] overflow-y-auto ${
          show ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              {isMandatory ? 'Complete your profile' : 'Edit Profile'}
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              {isMandatory
                ? 'We need a few details to customize your meals.'
                : 'Update your details below.'}
            </p>
          </div>
          {!isMandatory && (
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-800 p-2 text-xl font-bold'
            >
              ✕
            </button>
          )}
        </div>

        {/* --- NAME INPUT (Mandatory) --- */}
        <div className='flex flex-col mb-4'>
          <label className='text-sm font-semibold text-gray-700 mb-2'>
            Full Name <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            placeholder='e.g. John Doe'
            value={name}
            onChange={e => {
              setName(e.target.value)
              setError('')
            }}
            className='w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all'
          />
        </div>

        {/* --- EMAIL INPUT (Optional) --- */}
        <div className='flex flex-col mb-5'>
          <label className='text-sm font-semibold text-gray-700 mb-2'>
            Email Address{' '}
            <span className='text-gray-400 font-normal text-xs'>
              (Optional)
            </span>
          </label>
          <input
            type='email'
            placeholder='e.g. john@example.com'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full border border-gray-300 rounded-xl p-3 bg-gray-50 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all'
          />
        </div>

        {/* --- DIET TOGGLE (Mandatory) --- */}
        <div className='flex flex-col mb-6'>
          <label className='text-sm font-semibold text-gray-700 mb-2'>
            Food Preference <span className='text-red-500'>*</span>
          </label>
          <div className='grid grid-cols-2 gap-3'>
            <button
              onClick={() => {
                setDiet('Veg')
                setError('')
              }}
              className={`py-3 rounded-xl border-2 font-bold transition-all ${
                diet === 'Veg'
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              🥦 Veg
            </button>
            <button
              onClick={() => {
                setDiet('Non-Veg')
                setError('')
              }}
              className={`py-3 rounded-xl border-2 font-bold transition-all ${
                diet === 'Non-Veg'
                  ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              🍗 Non-Veg
            </button>
          </div>
        </div>

        {error && (
          <p className='text-red-500 text-sm mb-3 font-medium text-center'>
            {error}
          </p>
        )}

        <button
          disabled={!isFormValid || loading}
          onClick={handleContinue}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg transition duration-300 shadow-lg ${
            isFormValid && !loading
              ? 'bg-gradient-to-r from-[#FF7043] to-[#FF3D00] hover:shadow-orange-500/30'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {loading ? 'Saving...' : 'Save & Continue'}
        </button>
      </div>
    </>
  )
}
