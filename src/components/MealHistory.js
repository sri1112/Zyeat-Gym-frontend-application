import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import subscriptionService from '../services/subscriptionService'
import fallbackFood from '../assests/food2.jpeg'

const IMAGE_BASE_URL = process.env.REACT_APP_BASE_URL


const formatDate = value => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getMealImage = image => {
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

const getStatusConfig = status => {
  const normalizedStatus = String(status || '').toUpperCase()

  switch (normalizedStatus) {
    case 'CONSUMED':
      return {
        label: 'Consumed',
        icon: '✓',
        badgeClass: 'bg-[#EEF8F1] text-[#06722F] border-[#CDE8D4]',
        dotClass: 'bg-[#06722F]'
      }

    case 'SKIPPED':
      return {
        label: 'Skipped',
        icon: '×',
        badgeClass: 'bg-red-50 text-red-600 border-red-100',
        dotClass: 'bg-red-500'
      }

    case 'DELIVERED':
      return {
        label: 'Delivered',
        icon: '✓',
        badgeClass: 'bg-blue-50 text-blue-600 border-blue-100',
        dotClass: 'bg-blue-500'
      }

    case 'PENDING':
      return {
        label: 'Pending',
        icon: '•',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
        dotClass: 'bg-amber-500'
      }

    default:
      return {
        label: normalizedStatus || 'Unknown',
        icon: '•',
        badgeClass: 'bg-gray-50 text-gray-600 border-gray-200',
        dotClass: 'bg-gray-500'
      }
  }
}

const getPeriodConfig = period => {
  const normalizedPeriod = String(period || '').toUpperCase()

  if (normalizedPeriod === 'PRE_WORKOUT' || normalizedPeriod === 'MORNING') {
    return {
      label: 'Morning',
      time: 'Pre-Workout',
      icon: '🌤️'
    }
  }

  if (normalizedPeriod === 'POST_WORKOUT' || normalizedPeriod === 'EVENING') {
    return {
      label: 'Evening',
      time: 'Post-Workout',
      icon: '🌙'
    }
  }

  return {
    label: period || 'Meal',
    time: '',
    icon: '🍽️'
  }
}

const HistoryCard = ({ meal }) => {
  const status = getStatusConfig(meal.status)
  const period = getPeriodConfig(meal.period)

  const quantity =
    meal.quantity != null
      ? `${meal.quantity}${meal.unit ? ` ${meal.unit}` : ''}`
      : null

  return (
    <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden'>
      {/* Date Header */}

      <div className='px-4 pt-4 pb-3 flex items-center justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-xl bg-[#EEF8F1] flex items-center justify-center'>
            <svg
              className='w-4 h-4 text-[#065c2d]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8 7V3m8 4V3M5 11h14M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z'
              />
            </svg>
          </div>

          <div>
            <p className='text-[9px] uppercase tracking-wide text-gray-400 font-semibold'>
              Meal Date
            </p>

            <p className='text-[12px] font-bold text-gray-900 mt-0.5'>
              {formatDate(meal.delivery_date)}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[9px] font-bold ${status.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />

          {status.label}
        </div>
      </div>

      {/* Meal Details */}

      <div className='px-4 pb-4'>
        <div className='flex gap-3'>
          {/* Image */}

          <div className='relative w-[88px] h-[88px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0'>
            <img
              src={getMealImage(meal.image)}
              alt={meal.product_name || 'Meal'}
              className='w-full h-full object-cover'
              onError={event => {
                event.currentTarget.src = fallbackFood
              }}
            />

            <div className='absolute bottom-1.5 left-1.5 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center text-[13px]'>
              {period.icon}
            </div>
          </div>

          {/* Information */}

          <div className='flex-1 min-w-0'>
            <h2 className='text-[15px] font-extrabold text-gray-900 leading-5 line-clamp-2'>
              {meal.product_name || 'Healthy Meal'}
            </h2>

            <p className='text-[10px] text-gray-400 mt-1 truncate'>
              {meal.plan_name || 'Healthy Meal Plan'}
            </p>

            <div className='flex flex-wrap gap-1.5 mt-3'>
              <div className='inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F2FAF3] text-[#065c2d]'>
                <span className='text-[10px]'>{period.icon}</span>

                <span className='text-[9px] font-bold'>{period.label}</span>
              </div>

              {quantity && (
                <div className='inline-flex items-center px-2 py-1 rounded-lg bg-gray-50 text-gray-600'>
                  <span className='text-[9px] font-bold'>{quantity}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Information */}

        <div className='mt-4 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between'>
          <div>
            <p className='text-[9px] text-gray-400'>Meal Time</p>

            <p className='text-[11px] font-bold text-gray-800 mt-0.5'>
              {period.label}

              {period.time && (
                <span className='font-normal text-gray-400'>
                  {' '}
                  • {period.time}
                </span>
              )}
            </p>
          </div>

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              String(meal.status).toUpperCase() === 'CONSUMED'
                ? 'bg-[#EEF8F1] text-[#065c2d]'
                : String(meal.status).toUpperCase() === 'SKIPPED'
                ? 'bg-red-50 text-red-500'
                : 'bg-gray-50 text-gray-500'
            }`}
          >
            <span className='text-[16px] font-bold'>{status.icon}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MealHistory () {
  const navigate = useNavigate()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await subscriptionService.getMealHistory()

      if (response?.success) {
        setHistory(Array.isArray(response.data) ? response.data : [])
      } else {
        setHistory([])

        setError(response?.message || 'Unable to load meal history.')
      }
    } catch (error) {
      console.error('Load meal history error:', error)

      setHistory([])

      setError(error?.message || 'Unable to load meal history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const consumedCount = history.filter(
    meal => String(meal.status).toUpperCase() === 'CONSUMED'
  ).length

  const skippedCount = history.filter(
    meal => String(meal.status).toUpperCase() === 'SKIPPED'
  ).length

  return (
    <div className='min-h-screen bg-[#F7F8F7] pb-24 font-sans'>
      {/* Header */}

      <div className='sticky top-0 z-30 bg-white border-b border-gray-100'>
        <div className='max-w-md mx-auto px-5 h-[68px] flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700'
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
              Meal History
            </h1>

            <p className='text-[10px] text-gray-400 mt-0.5'>
              Your previous meals
            </p>
          </div>

          <button
            type='button'
            onClick={loadHistory}
            className='w-9 h-9 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#065c2d]'
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
                d='M4 4v5h5M20 20v-5h-5'
              />

              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5.5 15a7 7 0 0011.7 2.5M18.5 9A7 7 0 006.8 6.5'
              />
            </svg>
          </button>
        </div>
      </div>

      <div className='max-w-md mx-auto px-5 pt-5'>
        {/* Summary */}

        {!loading && !error && history.length > 0 && (
          <>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h2 className='text-[18px] font-extrabold text-gray-900'>
                  Your Meal Journey
                </h2>

                <p className='text-[11px] text-gray-400 mt-1'>
                  Track your completed meal activity
                </p>
              </div>

              <div className='px-3 py-1.5 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[10px] font-bold'>
                {history.length} {history.length === 1 ? 'Meal' : 'Meals'}
              </div>
            </div>

            {/* Stats */}

            <div className='grid grid-cols-2 gap-3 mb-5'>
              <div className='bg-white rounded-2xl border border-gray-100 p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-[#EEF8F1] flex items-center justify-center text-[#065c2d] font-bold'>
                    ✓
                  </div>

                  <div>
                    <p className='text-[18px] font-extrabold text-gray-900'>
                      {consumedCount}
                    </p>

                    <p className='text-[9px] text-gray-400'>Consumed</p>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-2xl border border-gray-100 p-4 shadow-sm'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 font-bold'>
                    ×
                  </div>

                  <div>
                    <p className='text-[18px] font-extrabold text-gray-900'>
                      {skippedCount}
                    </p>

                    <p className='text-[9px] text-gray-400'>Skipped</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Loading */}

        {loading && (
          <div className='space-y-4'>
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className='bg-white rounded-[20px] border border-gray-100 p-4 animate-pulse'
              >
                <div className='flex justify-between'>
                  <div className='w-28 h-4 bg-gray-200 rounded' />

                  <div className='w-20 h-6 bg-gray-200 rounded-full' />
                </div>

                <div className='flex gap-3 mt-4'>
                  <div className='w-[88px] h-[88px] rounded-2xl bg-gray-200' />

                  <div className='flex-1'>
                    <div className='w-3/4 h-4 bg-gray-200 rounded' />

                    <div className='w-1/2 h-3 bg-gray-100 rounded mt-3' />

                    <div className='w-24 h-6 bg-gray-100 rounded-lg mt-4' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}

        {!loading && error && (
          <div className='bg-white rounded-[22px] border border-gray-100 p-7 text-center shadow-sm'>
            <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-2xl'>
              ⚠️
            </div>

            <h2 className='text-[17px] font-bold text-gray-900 mt-4'>
              Unable to Load History
            </h2>

            <p className='text-[12px] text-gray-500 mt-2'>{error}</p>

            <button
              type='button'
              onClick={loadHistory}
              className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[13px] mt-5'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}

        {!loading && !error && history.length === 0 && (
          <div className='bg-white rounded-[22px] border border-gray-100 p-8 text-center shadow-sm'>
            <div className='w-20 h-20 rounded-full bg-[#EEF8F1] flex items-center justify-center mx-auto text-3xl'>
              🍽️
            </div>

            <h2 className='text-[19px] font-extrabold text-gray-900 mt-5'>
              No Meal History
            </h2>

            <p className='text-[12px] leading-5 text-gray-500 mt-2 px-3'>
              Your consumed and skipped meals will appear here.
            </p>

            <button
              type='button'
              onClick={() => navigate('/subscriptions')}
              className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold text-[14px] mt-6'
            >
              View My Subscription
            </button>
          </div>
        )}

        {/* History List */}

        {!loading && !error && history.length > 0 && (
          <div className='space-y-4'>
            {history.map(meal => (
              <HistoryCard
                key={
                  meal.mapping_id || `${meal.product_id}-${meal.selected_date}`
                }
                meal={meal}
              />
            ))}
          </div>
        )}

        {/* End */}

        {!loading && !error && history.length > 0 && (
          <div className='flex items-center gap-3 py-7'>
            <div className='h-px flex-1 bg-gray-200' />

            <p className='text-[10px] text-gray-400'>End of meal history</p>

            <div className='h-px flex-1 bg-gray-200' />
          </div>
        )}
      </div>
    </div>
  )
}
