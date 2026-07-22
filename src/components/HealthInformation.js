import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// If you have an API service, import it here:
// import apiService from '../services/apiService'

export default function HealthInformation () {
  const navigate = useNavigate()

  // States
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  // Dynamic Form Data
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    activityLevel: 'Moderate',
    goal: 'Maintain Weight',
    allergies: []
  })

  // Pre-defined options
  const goals = ['Lose Weight', 'Maintain Weight', 'Gain Muscle']
  const commonAllergies = [
    'Dairy',
    'Gluten',
    'Peanuts',
    'Seafood',
    'Eggs',
    'Soy',
    'Nuts'
  ]

  // 1. Fetch data when component mounts
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setIsFetching(true)
        setError(null)

        // TODO: Replace with your actual API call to get user health info
        // const response = await apiService.getHealthInfo()
        // const data = response.data

        // --- SIMULATED API DELAY & MOCK DATA ---
        await new Promise(resolve => setTimeout(resolve, 800))
        const data = {
          age: '28',
          gender: 'Male',
          height: '175',
          weight: '72',
          goal: 'Maintain Weight',
          allergies: ['Peanuts', 'Gluten']
        }
        // ---------------------------------------

        setFormData({
          age: data.age || '',
          gender: data.gender || 'Male',
          height: data.height || '',
          weight: data.weight || '',
          goal: data.goal || 'Maintain Weight',
          allergies: data.allergies || []
        })
      } catch (err) {
        console.error('Failed to fetch health info:', err)
        setError('Failed to load health information.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchHealthData()
  }, [])

  // 2. Handle Input Changes
  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 3. Handle Allergies Toggle
  const toggleAllergy = allergy => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy]
    }))
  }

  // 4. Save Data to API
  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // TODO: Replace with your actual API call to update user health info
      // await apiService.updateHealthInfo(formData)

      // --- SIMULATED API DELAY ---
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Saved payload to API:', formData)
      // ---------------------------

      setSaved(true)
      setTimeout(() => setSaved(false), 3000) // Reset success message after 3s
    } catch (err) {
      console.error('Failed to save health info:', err)
      setError('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Loading State Screen
  if (isFetching) {
    return (
      <div className='min-h-screen bg-[#F9FAF9] flex items-center justify-center font-sans'>
        <div className='text-center'>
          <div className='w-9 h-9 border-4 border-gray-200 border-t-[#065c2d] rounded-full animate-spin mx-auto' />
          <p className='mt-3 text-[#065c2d] font-bold text-[14px]'>
            Loading Profile...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F9FAF9] pb-24 font-sans'>
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
              Health Info
            </h1>
            <p className='text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest'>
              Your Profile
            </p>
          </div>
          <div className='w-10 h-10' /> {/* Spacer for alignment */}
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-6'>
        {/* Error Banner */}
        {error && (
          <div className='mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600'>
            <svg
              className='w-5 h-5 flex-shrink-0'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-[13px] font-bold'>{error}</p>
          </div>
        )}

        {/* Basic Metrics Card */}
        <div className='bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 mb-6'>
          <h2 className='text-[16px] font-black text-gray-900 mb-5'>
            Basic Metrics
          </h2>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                Age
              </label>
              <input
                type='number'
                name='age'
                value={formData.age}
                onChange={handleInputChange}
                placeholder='e.g. 28'
                className='w-full h-12 bg-gray-50 border border-transparent rounded-[14px] px-4 text-[14px] font-bold text-gray-900 focus:bg-white focus:border-[#065c2d]/30 focus:ring-2 focus:ring-[#065c2d]/10 transition-all outline-none'
              />
            </div>
            <div>
              <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                Gender
              </label>
              <select
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                className='w-full h-12 bg-gray-50 border border-transparent rounded-[14px] px-4 text-[14px] font-bold text-gray-900 focus:bg-white focus:border-[#065c2d]/30 focus:ring-2 focus:ring-[#065c2d]/10 transition-all outline-none appearance-none'
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                Height (cm)
              </label>
              <input
                type='number'
                name='height'
                value={formData.height}
                onChange={handleInputChange}
                placeholder='e.g. 175'
                className='w-full h-12 bg-gray-50 border border-transparent rounded-[14px] px-4 text-[14px] font-bold text-gray-900 focus:bg-white focus:border-[#065c2d]/30 outline-none transition-all'
              />
            </div>
            <div>
              <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-2'>
                Weight (kg)
              </label>
              <input
                type='number'
                name='weight'
                value={formData.weight}
                onChange={handleInputChange}
                placeholder='e.g. 70'
                className='w-full h-12 bg-gray-50 border border-transparent rounded-[14px] px-4 text-[14px] font-bold text-gray-900 focus:bg-white focus:border-[#065c2d]/30 outline-none transition-all'
              />
            </div>
          </div>
        </div>

        {/* Dietary Preferences Card */}
        <div className='bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 mb-6'>
          <h2 className='text-[16px] font-black text-gray-900 mb-5'>
            Dietary Preferences
          </h2>

          {/* Primary Goal Selector */}
          <div className='mb-6'>
            <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-3'>
              Primary Goal
            </label>
            <div className='flex flex-col gap-2'>
              {goals.map(goal => (
                <label
                  key={goal}
                  className={`flex items-center justify-between p-4 rounded-[14px] border-2 cursor-pointer transition-all ${
                    formData.goal === goal
                      ? 'border-[#065c2d] bg-[#F4F9F5]'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <span
                    className={`text-[13px] font-bold ${
                      formData.goal === goal
                        ? 'text-[#065c2d]'
                        : 'text-gray-700'
                    }`}
                  >
                    {goal}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      formData.goal === goal
                        ? 'border-[#065c2d]'
                        : 'border-gray-300'
                    }`}
                  >
                    {formData.goal === goal && (
                      <div className='w-2.5 h-2.5 rounded-full bg-[#065c2d]' />
                    )}
                  </div>

                  {/* Hidden radio input for accessibility/form validation */}
                  <input
                    type='radio'
                    name='goal'
                    value={goal}
                    checked={formData.goal === goal}
                    onChange={handleInputChange}
                    className='hidden'
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Allergies Multiselect */}
          <div>
            <label className='block text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-3'>
              Allergies & Intolerances
            </label>
            <div className='flex flex-wrap gap-2'>
              {commonAllergies.map(allergy => {
                const isSelected = formData.allergies.includes(allergy)
                return (
                  <button
                    key={allergy}
                    type='button'
                    onClick={() => toggleAllergy(allergy)}
                    className={`px-4 py-2 rounded-full text-[12px] font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#065c2d] text-white border-[#065c2d] shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {allergy}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action */}
      <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] p-5 pb-[calc(20px+env(safe-area-inset-bottom))]'>
        <div className='max-w-md mx-auto'>
          <button
            type='button'
            onClick={handleSave}
            disabled={isSaving}
            className={`w-full h-12 rounded-xl font-bold text-[15px] flex items-center justify-center transition-all ${
              saved
                ? 'bg-[#EEF8F1] text-[#065c2d]'
                : 'bg-[#065c2d] text-white shadow-[0_4px_14px_rgba(6,92,45,0.25)] active:scale-[0.98] disabled:opacity-70'
            }`}
          >
            {isSaving ? (
              <span className='flex items-center gap-2'>
                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                Saving...
              </span>
            ) : saved ? (
              '✓ Saved Successfully'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
