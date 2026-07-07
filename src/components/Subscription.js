import React, { useCallback, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import subscriptionService from '../services/subscriptionService'

import fallbackFood from '../assests/food2.jpeg'

const IMAGE_BASE_URL = 'http://localhost:3001'

const getImageUrl = image => {
  if (!image) return fallbackFood

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }

  if (image.startsWith('/uploads/')) {
    return `${IMAGE_BASE_URL}${image}`
  }

  if (image.startsWith('/')) {
    return `${IMAGE_BASE_URL}${image}`
  }

  return `${IMAGE_BASE_URL}/uploads/${image}`
}

const formatDate = value => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getPeriodInfo = period => {
  const value = String(period || '').toUpperCase()

  if (value === 'PRE_WORKOUT' || value === 'MORNING') {
    return {
      title: 'Morning',
      subtitle: 'Pre-Workout',
      icon: '🌤️'
    }
  }

  if (value === 'POST_WORKOUT' || value === 'EVENING') {
    return {
      title: 'Evening',
      subtitle: 'Post-Workout',
      icon: '🌙'
    }
  }

  return {
    title: period || 'Meal',
    subtitle: '',
    icon: '🍽️'
  }
}

const MealCard = ({ meal, processingId, onConsume, onSkip }) => {
  const period = getPeriodInfo(meal.period)

  const isProcessing = processingId === meal.mapping_id

  const status = String(meal.status || 'PENDING').toUpperCase()

  const isPending = status === 'PENDING' || status === 'DELIVERED'

  return (
    <div className='bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden'>
      <div className='p-4'>
        <div className='flex gap-3'>
          {/* Image */}

          <div className='relative w-[94px] h-[94px] flex-shrink-0 rounded-2xl overflow-hidden bg-gray-100'>
            <img
              src={getImageUrl(meal.image)}
              alt={meal.product_name || 'Healthy Meal'}
              className='w-full h-full object-cover'
              onError={event => {
                event.currentTarget.src = fallbackFood
              }}
            />

            <div className='absolute left-2 bottom-2 w-8 h-8 bg-white/90 rounded-xl flex items-center justify-center'>
              {period.icon}
            </div>
          </div>

          {/* Information */}

          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0'>
                <h2 className='text-[15px] font-extrabold text-gray-900 leading-5 line-clamp-2'>
                  {meal.product_name || 'Healthy Meal'}
                </h2>

                <p className='text-[10px] text-gray-400 mt-1'>
                  {meal.plan_name || 'Meal Subscription'}
                </p>
              </div>

              <div className='px-2.5 py-1 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[9px] font-bold flex-shrink-0'>
                {status}
              </div>
            </div>

            <div className='flex flex-wrap gap-2 mt-3'>
              <div className='px-2.5 py-1.5 rounded-lg bg-[#F2FAF3] text-[#065c2d] text-[9px] font-bold'>
                {period.icon} {period.title}
              </div>

              {meal.quantity != null && (
                <div className='px-2.5 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-[9px] font-bold'>
                  {meal.quantity}
                  {meal.unit ? ` ${meal.unit}` : ''}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Date */}

        <div className='mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between'>
          <div>
            <p className='text-[9px] text-gray-400'>Scheduled Date</p>

            <p className='text-[11px] font-bold text-gray-800 mt-1'>
              {formatDate(meal.delivery_date)}
            </p>
          </div>

          <div className='text-right'>
            <p className='text-[9px] text-gray-400'>Meal Time</p>

            <p className='text-[11px] font-bold text-[#065c2d] mt-1'>
              {period.title}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}

      {isPending && (
        <div className='grid grid-cols-2 gap-3 px-4 pb-4'>
          <button
            type='button'
            disabled={isProcessing}
            onClick={() => onSkip(meal.mapping_id)}
            className='h-11 rounded-xl border border-gray-200 text-gray-600 text-[12px] font-bold disabled:opacity-50'
          >
            {isProcessing ? 'Please wait...' : 'Skip Meal'}
          </button>

          <button
            type='button'
            disabled={isProcessing}
            onClick={() => onConsume(meal.mapping_id)}
            className='h-11 rounded-xl bg-[#065c2d] text-white text-[12px] font-bold disabled:opacity-50'
          >
            {isProcessing ? 'Updating...' : 'Mark Consumed'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function Subscription () {
  const navigate = useNavigate()

  const [meals, setMeals] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState('')

  const [processingId, setProcessingId] = useState(null)

  const loadTodayMeals = useCallback(async () => {
    try {
      setLoading(true)

      setError('')

      const response = await subscriptionService.getTodayMeals()

      if (response?.success) {
        setMeals(Array.isArray(response.data) ? response.data : [])
      } else {
        setMeals([])

        setError(response?.message || 'Unable to load meals')
      }
    } catch (error) {
      console.error('Load subscription error:', error)

      setMeals([])

      setError(error?.message || 'Unable to load subscription')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodayMeals()
  }, [loadTodayMeals])

  const handleConsume = async mappingId => {
    try {
      setProcessingId(mappingId)

      const response = await subscriptionService.consumeMeal(mappingId)

      if (!response?.success) {
        throw new Error(response?.message || 'Unable to consume meal')
      }

      await loadTodayMeals()
    } catch (error) {
      console.error(error)

      alert(error.message || 'Unable to update meal')
    } finally {
      setProcessingId(null)
    }
  }

  const handleSkip = async mappingId => {
    try {
      setProcessingId(mappingId)

      const response = await subscriptionService.skipMeal(mappingId)

      if (!response?.success) {
        throw new Error(response?.message || 'Unable to skip meal')
      }

      await loadTodayMeals()
    } catch (error) {
      console.error(error)

      alert(error.message || 'Unable to update meal')
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className='min-h-screen bg-[#F7F8F7] pb-28'>
      {/* Header */}

      <div className='sticky top-0 z-30 bg-white border-b border-gray-100'>
        <div className='max-w-md mx-auto h-[68px] px-5 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          <div className='text-center'>
            <h1 className='text-[17px] font-bold text-gray-900'>
              My Subscription
            </h1>

            <p className='text-[10px] text-gray-400'>Today's healthy meals</p>
          </div>

          <button
            type='button'
            onClick={() => navigate('/meal-history')}
            className='w-9 h-9 rounded-full bg-[#EEF8F1] text-[#065c2d] flex items-center justify-center'
          >
            <svg
              className='w-[17px] h-[17px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 8v4l3 2'
              />

              <circle cx='12' cy='12' r='9' />
            </svg>
          </button>
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-5'>
        {/* Heading */}

        <div className='flex items-start justify-between mb-5'>
          <div>
            <h2 className='text-[19px] font-extrabold text-gray-900'>
              Today's Meals
            </h2>

            <p className='text-[11px] text-gray-400 mt-1'>
              Stay consistent with your plan
            </p>
          </div>

          {!loading && (
            <div className='px-3 py-1.5 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[10px] font-bold'>
              {meals.length} {meals.length === 1 ? 'Meal' : 'Meals'}
            </div>
          )}
        </div>

        {/* Loading */}

        {loading && (
          <div className='space-y-4'>
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className='h-[220px] bg-white rounded-[22px] border border-gray-100 animate-pulse'
              />
            ))}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className='bg-white rounded-[22px] border border-gray-100 p-7 text-center'>
            <div className='text-4xl'>⚠️</div>

            <h2 className='text-[17px] font-bold mt-4'>Unable to Load Meals</h2>

            <p className='text-[12px] text-gray-500 mt-2'>{error}</p>

            <button
              type='button'
              onClick={loadTodayMeals}
              className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[13px] mt-5'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && meals.length === 0 && (
          <div className='bg-white rounded-[22px] border border-gray-100 p-8 text-center'>
            <div className='w-20 h-20 rounded-full bg-[#EEF8F1] flex items-center justify-center mx-auto text-3xl'>
              🍽️
            </div>

            <h2 className='text-[19px] font-extrabold mt-5'>No Meals Today</h2>

            <p className='text-[12px] leading-5 text-gray-500 mt-2'>
              You do not have any meals scheduled for today.
            </p>

            <button
              type='button'
              onClick={() => navigate('/meal-history')}
              className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold text-[14px] mt-6'
            >
              View Meal History
            </button>
          </div>
        )}

        {/* Meals */}

        {!loading && !error && meals.length > 0 && (
          <div className='space-y-4'>
            {meals.map(meal => (
              <MealCard
                key={meal.mapping_id}
                meal={meal}
                processingId={processingId}
                onConsume={handleConsume}
                onSkip={handleSkip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
