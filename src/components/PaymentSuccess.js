import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function PaymentSuccess () {
  const navigate = useNavigate()
  const location = useLocation()
  const payment = location.state?.payment
  const order = location.state?.order
  const plan = location.state?.plan
  const planId = location.state?.planId
  const planStartDate = location.state?.planStartDate
  const planEndDate = location.state?.planEndDate
  const totalDays = location.state?.totalDays
  const period = location.state?.period
  const selectedMethod = location.state?.selectedMethod

  /*
   * HELPERS
   */

  const formatAmount = value => {
    return Number(value || 0).toFixed(2)
  }

  const getPaymentMethod = () => {
    if (selectedMethod === 'COD') {
      return 'Cash on Delivery'
    }

    return 'Online Payment'
  }

  const getPlanName = () => {
    return (
      plan?.plan_name ||
      plan?.name ||
      (totalDays ? `${totalDays} Days Plan` : 'Meal Subscription')
    )
  }

  const getPeriodLabel = () => {
    return String(period || '').toUpperCase() === 'PRE_WORKOUT'
      ? 'Morning'
      : 'Evening'
  }

  /*
   * MISSING PAYMENT DATA
   */

  if (!payment) {
    return (
      <div className='min-h-screen bg-[#F7F8F7] flex items-center justify-center px-5'>
        <div className='w-full max-w-md bg-white rounded-[24px] p-7 text-center border border-gray-100 shadow-sm'>
          <div className='w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mx-auto text-3xl'>
            ⚠️
          </div>

          <h2 className='text-[20px] font-bold text-gray-900 mt-5'>
            Payment Information Missing
          </h2>

          <p className='text-[13px] text-gray-500 mt-2 leading-5'>
            We could not find your payment information.
          </p>

          <button
            type='button'
            onClick={() => navigate('/home', { replace: true })}
            className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold mt-6'
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F7F8F7] pb-10 pt-10 font-sans'>
      <div className='max-w-md mx-auto px-5 pt-10'>
        {/* Success Icon */}

        <div className='flex justify-center'>
          <div className='relative'>
            <div className='absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30' />

            <div className='relative w-[94px] h-[94px] rounded-full bg-[#E9F8ED] flex items-center justify-center'>
              <div className='w-[68px] h-[68px] rounded-full bg-[#065c2d] flex items-center justify-center shadow-lg'>
                <svg
                  className='w-9 h-9 text-white'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='3'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}

        <div className='text-center mt-6'>
          <h1 className='text-[26px] font-extrabold text-gray-900'>
            Order Confirmed!
          </h1>

          <p className='text-[13px] text-gray-500 mt-2 leading-5 px-4'>
            Your healthy meal subscription has been placed successfully.
          </p>
        </div>

        {/* Amount Card */}

        <div className='bg-[#065c2d] rounded-[22px] p-5 mt-7 text-center shadow-md relative overflow-hidden'>
          <div className='absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/5' />

          <div className='absolute -left-10 -bottom-14 w-36 h-36 rounded-full bg-white/5' />

          <div className='relative z-10'>
            <p className='text-[11px] text-white/70'>
              {selectedMethod === 'COD' ? 'Order Amount' : 'Amount Paid'}
            </p>

            <h2 className='text-[34px] font-extrabold text-white mt-1'>
              ₹{formatAmount(payment?.amount || order?.grand_total)}
            </h2>

            <div className='inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-white/15'>
              <span className='w-2 h-2 bg-green-300 rounded-full' />

              <span className='text-[10px] font-bold text-white'>
                {selectedMethod === 'COD'
                  ? 'ORDER CONFIRMED'
                  : 'PAYMENT SUCCESSFUL'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}

        <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm p-5 mt-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-[16px] font-bold text-gray-900'>
              Order Details
            </h2>

            <span className='text-[18px]'>📦</span>
          </div>

          <div className='space-y-4'>
            {order?.order_number && (
              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Order Number</span>

                <span className='text-[12px] font-bold text-gray-900'>
                  {order.order_number}
                </span>
              </div>
            )}

            {payment?.payment_id && (
              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Payment ID</span>

                <span className='text-[12px] font-bold text-gray-900'>
                  #{payment.payment_id}
                </span>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <span className='text-[12px] text-gray-500'>Payment Method</span>

              <span className='text-[12px] font-bold text-gray-900'>
                {getPaymentMethod()}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-[12px] text-gray-500'>Status</span>

              <span className='px-2.5 py-1 rounded-full bg-green-50 text-[#07852d] text-[10px] font-bold'>
                {selectedMethod === 'COD' ? 'CONFIRMED' : 'PAID'}
              </span>
            </div>
          </div>
        </div>

        {/* Subscription Details */}

        {(plan || totalDays || period) && (
          <div className='bg-[#F2FAF3] border border-[#9BD0A7] rounded-[20px] p-5 mt-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[10px] uppercase tracking-wide text-gray-500 font-semibold'>
                  Your Subscription
                </p>

                <h2 className='text-[17px] font-extrabold text-gray-900 mt-1'>
                  {getPlanName()}
                </h2>
              </div>

              <div className='w-12 h-12 rounded-full bg-[#065c2d] flex items-center justify-center text-white'>
                🥗
              </div>
            </div>

            <div className='mt-4 pt-4 border-t border-green-200 grid grid-cols-2 gap-3'>
              {totalDays && (
                <div className='bg-white/70 rounded-xl p-3'>
                  <p className='text-[9px] text-gray-400'>Duration</p>

                  <p className='text-[12px] font-bold text-gray-900 mt-1'>
                    {totalDays} Days
                  </p>
                </div>
              )}

              {period && (
                <div className='bg-white/70 rounded-xl p-3'>
                  <p className='text-[9px] text-gray-400'>Delivery</p>

                  <p className='text-[12px] font-bold text-gray-900 mt-1'>
                    {getPeriodLabel()}
                  </p>
                </div>
              )}

              {planStartDate && (
                <div className='bg-white/70 rounded-xl p-3'>
                  <p className='text-[9px] text-gray-400'>Start Date</p>

                  <p className='text-[11px] font-bold text-gray-900 mt-1'>
                    {planStartDate}
                  </p>
                </div>
              )}

              {planEndDate && (
                <div className='bg-white/70 rounded-xl p-3'>
                  <p className='text-[9px] text-gray-400'>End Date</p>

                  <p className='text-[11px] font-bold text-gray-900 mt-1'>
                    {planEndDate}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information */}

        <div className='bg-orange-50 border border-orange-100 rounded-[18px] p-4 mt-4'>
          <div className='flex items-start gap-3'>
            <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0'>
              🚚
            </div>

            <div>
              <h3 className='text-[12px] font-bold text-gray-800'>
                What happens next?
              </h3>

              <p className='text-[10px] leading-4 text-gray-500 mt-1'>
                Your meals will be prepared and delivered according to your
                selected plan dates and workout time.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}

        <div className='mt-6 space-y-3'>
          <button
            type='button'
            onClick={() => navigate('/subscriptions')}
            className='w-full h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-transform'
          >
            View My Subscription
            <span className='text-[19px]'>›</span>
          </button>

          <button
            type='button'
            onClick={() => navigate('/orders')}
            className='w-full h-[52px] bg-white border-[1.5px] border-[#065c2d] text-[#065c2d] rounded-xl font-bold text-[14px]'
          >
            View My Orders
          </button>

          <button
            type='button'
            onClick={() =>
              navigate('/home', {
                replace: true
              })
            }
            className='w-full py-3 text-[12px] font-semibold text-gray-500'
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
