import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import cartService from '../services/cartService'
import orderService from '../services/orderService'
import fallbackFood from '../assests/food2.jpeg'

const API_URL = process.env.REACT_APP_BASE_URL
// const API_URL = 'https://gynode.1roofai.host'

export default function Checkout () {
  const navigate = useNavigate()
  const location = useLocation()

  /*
   * =========================================================
   * PLAN DATA FROM PLANS PAGE
   * =========================================================
   */

  const planData = location.state || {}

  const planId =
    planData.planId || planData.plan?.plan_id || planData.plan?.id || null

  const planName =
    planData.plan?.plan_name ||
    planData.plan?.name ||
    `${planData.totalDays || 3} Days Plan`

  const planStartDate = planData.planStartDate || null
  const planEndDate = planData.planEndDate || null
  const totalDays = Number(planData.totalDays) || 3
  const period = planData.period || 'PRE_WORKOUT'

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const normalizeDate = value => {
    if (!value) return ''

    return String(value).slice(0, 10)
  }

  const formatDisplayDate = value => {
    if (!value) return ''

    const cleanDate = normalizeDate(value)

    const [year, month, day] = cleanDate.split('-').map(Number)

    if (!year || !month || !day) return ''

    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatShortDate = value => {
    if (!value) return ''

    const cleanDate = normalizeDate(value)

    const [year, month, day] = cleanDate.split('-').map(Number)

    if (!year || !month || !day) return ''

    const date = new Date(year, month - 1, day)

    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
  }

  const getImageUrl = item => {
    if (!item?.image) return fallbackFood

    if (
      String(item.image).startsWith('http://') ||
      String(item.image).startsWith('https://')
    ) {
      return item.image
    }

    return `${API_URL}/uploads/${item.image}`
  }

  const getPeriodLabel = value => {
    return String(value).toUpperCase() === 'PRE_WORKOUT' ? 'Morning' : 'Evening'
  }

  const getPeriodIcon = value => {
    return String(value).toUpperCase() === 'PRE_WORKOUT' ? '🌤️' : '🌙'
  }

  /*
   * =========================================================
   * LOAD CART
   * =========================================================
   */

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true)

        const response = await cartService.getCart()

        setCart(response?.cart || null)
      } catch (error) {
        console.error('Load cart error:', error)

        setCart(null)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  /*
   * =========================================================
   * FILTER ONLY CURRENT PLAN ITEMS
   *
   * IMPORTANT:
   * Do not show products from another plan.
   * =========================================================
   */

  const planItems = useMemo(() => {
    if (!cart?.items) return []

    return cart.items.filter(item => {
      /*
       * If backend sends plan_id, use exact ID.
       */

      if (item.plan_id && planId) {
        return Number(item.plan_id) === Number(planId)
      }

      /*
       * Fallback:
       * compare plan name.
       */

      return (
        String(item.plan_name || '')
          .trim()
          .toLowerCase() ===
        String(planName || '')
          .trim()
          .toLowerCase()
      )
    })
  }, [cart, planId, planName])

  /*
   * =========================================================
   * GROUP PRODUCTS DATE-WISE
   * =========================================================
   */

  const groupedItems = useMemo(() => {
    return planItems.reduce((groups, item) => {
      const date = normalizeDate(item.selected_date)

      if (!date) return groups

      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(item)

      return groups
    }, {})
  }, [planItems])

  const sortedDates = useMemo(() => {
    return Object.keys(groupedItems).sort()
  }, [groupedItems])

  /*
   * =========================================================
   * TOTALS
   * =========================================================
   */

  const itemsTotal = useMemo(() => {
    return planItems.reduce((total, item) => {
      return total + Number(item.total_amount || 0)
    }, 0)
  }, [planItems])

  const deliveryCharge = 0
  const taxes = 0

  const grandTotal = itemsTotal + deliveryCharge + taxes

  /*
   * =========================================================
   * CREATE ORDER
   * =========================================================
   */

  const handlePlaceOrder = async () => {
    if (!planId) {
      alert('Plan ID is missing.')
      return
    }

    try {
      setPlacingOrder(true)

      console.log('Sending plan_id:', planId)

      const response = await orderService.createOrder({
        plan_id: Number(planId)
      })

      if (response.success) {
        navigate('/payment', {
          state: {
            order: response.data,
            plan: planData.plan,
            planId,
            planStartDate: planData.planStartDate,
            planEndDate: planData.planEndDate,
            totalDays: planData.totalDays,
            period: planData.period
          }
        })
      }
    } catch (error) {
      console.error('Create order error:', error)
      alert(error.message || 'Failed to create order')
    } finally {
      setPlacingOrder(false)
    }
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (loading) {
    return (
      <div className='fixed inset-0 z-[100] bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='w-10 h-10 border-4 border-gray-200 border-t-[#065c2d] rounded-full animate-spin mx-auto' />

          <p className='mt-3 text-[#065c2d] text-[14px] font-bold'>
            Preparing Checkout...
          </p>
        </div>
      </div>
    )
  }

  /*
   * =========================================================
   * EMPTY CART
   * =========================================================
   */

  if (!cart || planItems.length === 0) {
    return (
      <div className='min-h-screen bg-[#f7f8f7] flex items-center justify-center px-5'>
        <div className='w-full max-w-md bg-white rounded-[24px] p-7 text-center shadow-sm border border-gray-100'>
          <div className='w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto text-3xl'>
            🥗
          </div>

          <h2 className='text-[20px] font-bold text-gray-900 mt-5'>
            No Plan Items
          </h2>

          <p className='text-[13px] text-gray-500 mt-2 leading-5'>
            Add products to your plan before continuing to checkout.
          </p>

          <button
            type='button'
            onClick={() => navigate('/plans')}
            className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold mt-6'
          >
            Back to Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F7F8F7] pb-[150px] font-sans'>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className='sticky top-0 z-30 bg-white border-b border-gray-100'>
        <div className='max-w-md mx-auto px-5 h-[68px] flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700'
          >
            ‹
          </button>

          <div className='text-center'>
            <h1 className='text-[17px] font-bold text-gray-900'>
              Review Your Plan
            </h1>

            <p className='text-[10px] text-gray-400 mt-0.5'>
              Check your meals before payment
            </p>
          </div>

          <div className='w-9' />
        </div>
      </div>

      <div className='max-w-md mx-auto'>
        {/* =====================================================
            ACTIVE PLAN CARD
        ===================================================== */}

        <div className='px-5 pt-5'>
          <div className='bg-[#F2FAF3] border border-[#86C796] rounded-2xl p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[10px] uppercase tracking-wide text-gray-500 font-semibold'>
                  Your Active Plan
                </p>

                <h2 className='text-[18px] font-extrabold text-gray-900 mt-1'>
                  {planName}
                </h2>

                <div className='flex items-center gap-2 mt-2'>
                  <span className='text-[11px] text-gray-600'>
                    {getPeriodIcon(period)} {getPeriodLabel(period)}
                  </span>

                  <span className='text-gray-300'>•</span>

                  <span className='text-[11px] text-gray-600'>
                    {totalDays} Days
                  </span>
                </div>
              </div>

              <div className='w-14 h-14 rounded-full bg-[#065c2d] flex flex-col items-center justify-center text-white'>
                <span className='text-[20px] font-extrabold leading-none'>
                  {totalDays}
                </span>

                <span className='text-[8px] mt-1'>DAYS</span>
              </div>
            </div>

            {(planStartDate || planEndDate) && (
              <div className='mt-4 pt-3 border-t border-green-200 flex items-center gap-2'>
                <span className='text-sm'>📅</span>

                <p className='text-[11px] font-semibold text-gray-600'>
                  {formatDisplayDate(planStartDate)}
                  {'  →  '}
                  {formatDisplayDate(planEndDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            ORDER SUMMARY HEADER
        ===================================================== */}

        <div className='px-5 mt-6 flex items-center justify-between'>
          <div>
            <h2 className='text-[17px] font-bold text-gray-900'>
              Plan Summary
            </h2>

            <p className='text-[11px] text-gray-400 mt-1'>
              Meals grouped by delivery date
            </p>
          </div>

          <span className='px-3 py-1.5 rounded-full bg-green-50 text-[#065c2d] text-[11px] font-bold'>
            {planItems.length} Items
          </span>
        </div>

        {/* =====================================================
            DATE-WISE PRODUCTS
        ===================================================== */}

        <div className='px-5 mt-4 space-y-3'>
          {sortedDates.map((date, dateIndex) => {
            const dateItems = groupedItems[date]

            const dayTotal = dateItems.reduce((total, item) => {
              return total + Number(item.total_amount || 0)
            }, 0)

            return (
              <div
                key={date}
                className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'
              >
                {/* DATE HEADER */}

                <div className='px-4 py-3 bg-[#FAFCFA] border-b border-gray-100 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-[14px]'>
                      📅
                    </div>

                    <div>
                      <p className='text-[13px] font-bold text-[#065c2d]'>
                        Day {dateIndex + 1}
                      </p>

                      <p className='text-[11px] text-gray-500 mt-0.5'>
                        {formatShortDate(date)}
                      </p>
                    </div>
                  </div>

                  <div className='text-right'>
                    <p className='text-[10px] text-gray-400'>
                      {dateItems.length}{' '}
                      {dateItems.length === 1 ? 'Meal' : 'Meals'}
                    </p>

                    <p className='text-[14px] font-bold text-[#065c2d] mt-0.5'>
                      ₹{dayTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* PRODUCTS */}

                <div className='px-4'>
                  {dateItems.map((item, index) => (
                    <div
                      key={item.mapping_id}
                      className={`py-4 flex items-center gap-3 ${
                        index !== dateItems.length - 1
                          ? 'border-b border-gray-100'
                          : ''
                      }`}
                    >
                      {/* IMAGE */}

                      <div className='w-[58px] h-[58px] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0'>
                        <img
                          src={getImageUrl(item)}
                          alt={item.product_name}
                          className='w-full h-full object-cover'
                          onError={event => {
                            event.currentTarget.src = fallbackFood
                          }}
                        />
                      </div>

                      {/* DETAILS */}

                      <div className='flex-1 min-w-0'>
                        <h3 className='text-[13px] font-bold text-gray-900 truncate'>
                          {item.product_name}
                        </h3>

                        <div className='flex items-center gap-1.5 mt-1.5'>
                          <span className='text-[10px]'>
                            {getPeriodIcon(item.period)}
                          </span>

                          <span className='text-[10px] text-gray-500'>
                            {getPeriodLabel(item.period)}
                          </span>
                        </div>

                        <p className='text-[10px] text-gray-400 mt-1'>
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      {/* PRICE */}

                      <div className='text-right flex-shrink-0'>
                        <p className='text-[14px] font-bold text-gray-900'>
                          ₹{Number(item.total_amount || 0).toFixed(2)}
                        </p>

                        <p className='text-[9px] text-gray-400 mt-1'>
                          ₹{item.unit_price} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* =====================================================
            DELIVERY INFORMATION
        ===================================================== */}

        <div className='px-5 mt-5'>
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
            <h3 className='text-[15px] font-bold text-gray-900'>
              Delivery Details
            </h3>

            <div className='flex items-start gap-3 mt-4'>
              <div className='w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0'>
                🏋️
              </div>

              <div>
                <p className='text-[13px] font-bold text-gray-800'>
                  Gym Meal Delivery
                </p>

                <p className='text-[11px] leading-5 text-gray-500 mt-1'>
                  Your healthy meals will be delivered according to each
                  selected plan date.
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 mt-4'>
              <div className='w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0'>
                {getPeriodIcon(period)}
              </div>

              <div>
                <p className='text-[13px] font-bold text-gray-800'>
                  {getPeriodLabel(period)} Delivery
                </p>

                <p className='text-[11px] text-gray-500 mt-1'>
                  {getPeriodLabel(period) === 'Morning'
                    ? '6 AM - 12 PM'
                    : '4 PM - 9 PM'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PRICE DETAILS
        ===================================================== */}

        <div className='px-5 mt-5'>
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
            <h3 className='text-[15px] font-bold text-gray-900 mb-4'>
              Price Details
            </h3>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Items Total</span>

                <span className='text-[13px] font-semibold text-gray-900'>
                  ₹{itemsTotal.toFixed(2)}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>
                  Delivery Charges
                </span>

                <span className='text-[12px] font-bold text-[#07852d]'>
                  FREE
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Taxes</span>

                <span className='text-[13px] font-semibold text-gray-900'>
                  ₹{taxes.toFixed(2)}
                </span>
              </div>
            </div>

            <div className='border-t border-dashed border-gray-200 mt-4 pt-4 flex items-center justify-between'>
              <div>
                <p className='text-[15px] font-bold text-gray-900'>
                  Grand Total
                </p>

                <p className='text-[9px] text-gray-400 mt-1'>
                  Inclusive of all charges
                </p>
              </div>

              <p className='text-[24px] font-extrabold text-[#065c2d]'>
                {/* ₹{grandTotal.toFixed(2)} */}₹
                {Math.round(Number(grandTotal)).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FIXED BOTTOM PAYMENT BAR
      ===================================================== */}

      <div className='fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'>
        <div className='max-w-md mx-auto px-5 pt-3 pb-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-shrink-0'>
              <p className='text-[10px] text-gray-400'>Total Amount</p>

              <h2 className='text-[23px] font-extrabold text-gray-900'>
                ₹{Math.round(Number(grandTotal)).toLocaleString('en-IN')}
              </h2>
            </div>

            <button
              type='button'
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className='flex-1 h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-[0.98] transition-transform'
            >
              {placingOrder ? (
                <>
                  <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Creating Order...
                </>
              ) : (
                <>
                  Continue to Payment
                  <span className='text-[18px]'>›</span>
                </>
              )}
            </button>
          </div>

          <div className='flex items-center justify-center gap-1 mt-3'>
            <span className='text-[10px]'>🔒</span>

            <p className='text-[9px] text-gray-400'>
              Secure checkout and protected payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
