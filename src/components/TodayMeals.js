import React, { useEffect, useState } from 'react'
import subscriptionService from '../services/subscriptionService'
export default function TodayMeals () {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const loadMeals = async () => {
    try {
      const response = await subscriptionService.getTodayMeals()

      if (response.success) {
        setMeals(response.data || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMeals()
  }, [])

  const handleConsume = async mappingId => {
    try {
      setActionLoading(true)

      const response = await subscriptionService.consumeMeal(mappingId)

      if (response.success) {
        await loadMeals()
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to consume meal')
    } finally {
      setActionLoading(false)
    }
  }
  const handleSkip = async mappingId => {
    try {
      setActionLoading(true)

      const response = await subscriptionService.skipMeal(mappingId)

      if (response.success) {
        await loadMeals()
      }
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to skip meal')
    } finally {
      setActionLoading(false)
    }
  }
  const getStatusStyle = status => {
    switch (status) {
      case 'CONSUMED':
        return 'bg-green-100 text-green-700'

      case 'SKIPPED':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        Loading Today's Meals...
      </div>
    )
  }
  if (meals.length === 0) {
    return (
      <div className='min-h-screen flex justify-center items-center'>
        <h2 className='text-xl font-bold'>No Meals Scheduled Today</h2>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gray-100 pt-16 pb-24'>
      <div className='px-5 mb-5'>
        <h1 className='text-3xl font-bold'>Today's Meals</h1>
      </div>

      <div className='space-y-4 px-4'>
        {meals.map(meal => (
          <div
            key={meal.mapping_id}
            className='bg-white rounded-2xl shadow-md p-4'
          >
            <div className='flex gap-4'>
              <img
                // src={`https://gynode.1roofai.host${meal.image}`}
                src={`${process.env.REACT_APP_BASE_URL}${meal.image}`}

                alt={meal.product_name}
                className='w-24 h-24 rounded-xl object-cover'
                onError={e => {
                  e.target.src = '/placeholder-food.jpg'
                }}
              />

              <div className='flex-1'>
                <div className='flex justify-between'>
                  <h2 className='font-bold text-lg'>{meal.product_name}</h2>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                      meal.status
                    )}`}
                  >
                    {meal.status}
                  </span>
                </div>

                <p className='text-gray-500'>{meal.plan_name}</p>

                {/* <p className='text-sm mt-2'>{meal.period}</p> */}

                <p className='text-sm text-gray-500'>{meal.delivery_date}</p>
              </div>
            </div>

            {meal.status === 'PENDING' && (
              <div className='grid grid-cols-2 gap-3 mt-5'>
                <button
                  disabled={actionLoading}
                  onClick={() => handleConsume(meal.mapping_id)}
                  className='bg-green-600 text-white py-3 rounded-xl font-bold'
                >
                  Consume
                </button>

                <button
                  disabled={actionLoading}
                  onClick={() => handleSkip(meal.mapping_id)}
                  className='bg-red-500 text-white py-3 rounded-xl font-bold'
                >
                  Skip
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
