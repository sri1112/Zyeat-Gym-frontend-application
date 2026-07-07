import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import paymentService from '../services/paymentService'

export default function Payment () {
  const navigate = useNavigate()
  const location = useLocation()

  /*
   * =========================================================
   * DATA FROM CHECKOUT PAGE
   * =========================================================
   */

  const order = location.state?.order
  const plan = location.state?.plan
  const planId = location.state?.planId
  const planStartDate = location.state?.planStartDate
  const planEndDate = location.state?.planEndDate
  const totalDays = location.state?.totalDays
  const period = location.state?.period

  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const [selectedMethod, setSelectedMethod] = useState('COD')
  const [loading, setLoading] = useState(false)

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const formatAmount = value => {
    return Number(value || 0).toFixed(2)
  }

  const getPeriodLabel = value => {
    return String(value || '').toUpperCase() === 'PRE_WORKOUT'
      ? 'Morning'
      : 'Evening'
  }

  const getPeriodIcon = value => {
    return String(value || '').toUpperCase() === 'PRE_WORKOUT' ? '🌤️' : '🌙'
  }

  /*
   * =========================================================
   * PAYMENT METHODS
   * =========================================================
   */

  const paymentMethods = [
    {
      id: 'COD',
      title: 'Cash on Delivery',
      description: 'Pay when your subscription is confirmed',
      icon: '💵'
    },
    {
      id: 'ONLINE',
      title: 'UPI / Card / Net Banking',
      description: 'Pay securely using online payment',
      icon: '💳'
    }
  ]

  /*
   * =========================================================
   * CREATE PAYMENT
   * =========================================================
   */

  const completePayment = async () => {
    try {
      setLoading(true)

      /*
       * STEP 1:
       * Create/initiate payment
       */
      const createResponse = await paymentService.createPayment({
        order_id: order.order_id,

        payment_gateway: selectedMethod === 'COD' ? 'COD' : 'RAZORPAY',

        payment_method: selectedMethod
      })

      if (!createResponse.success) {
        throw new Error(createResponse.message || 'Unable to create payment')
      }

      const paymentId = createResponse.data.payment_id

      /*
       * COD:
       * For your current development flow,
       * confirm directly.
       *
       * Later for Razorpay, call this only after
       * Razorpay payment verification succeeds.
       */
      const transactionId =
        selectedMethod === 'COD' ? `COD-${Date.now()}` : `TEST-${Date.now()}`

      /*
       * STEP 2:
       * Mark payment success.
       *
       * Backend now automatically:
       * - confirms order
       * - creates subscription
       * - copies all date-wise products
       */
      const successResponse = await paymentService.paymentSuccess({
        payment_id: paymentId,

        transaction_id: transactionId,

        payment_gateway: selectedMethod === 'COD' ? 'COD' : 'RAZORPAY'
      })

      if (!successResponse.success) {
        throw new Error(
          successResponse.message || 'Payment confirmation failed'
        )
      }

      /*
       * STEP 3:
       * Open success page
       */
      navigate('/payment-success', {
        replace: true,

        state: {
          payment: {
            payment_id: paymentId,
            plan_id: planId,

            transaction_id: transactionId,

            amount: order.grand_total
          },

          order,

          subscription_id: successResponse.data.subscription_id
        }
      })
    } catch (error) {
      console.error('Complete Payment Error:', error)

      alert(error.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  /*
   * =========================================================
   * MISSING ORDER
   * =========================================================
   */

  if (!order) {
    return (
      <div className='min-h-screen bg-[#F7F8F7] flex items-center justify-center px-5'>
        <div className='w-full max-w-md bg-white rounded-[24px] p-7 text-center border border-gray-100 shadow-sm'>
          <div className='w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-3xl'>
            📦
          </div>

          <h2 className='text-[20px] font-bold text-gray-900 mt-5'>
            Order Not Found
          </h2>

          <p className='text-[13px] text-gray-500 mt-2'>
            Your order information is missing.
          </p>

          <button
            type='button'
            onClick={() => navigate('/cart')}
            className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold mt-6'
          >
            Back to Cart
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
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-[24px]'
          >
            ‹
          </button>

          <div className='text-center'>
            <h1 className='text-[17px] font-bold text-gray-900'>Payment</h1>

            <p className='text-[10px] text-gray-400 mt-0.5'>
              Choose your payment method
            </p>
          </div>

          <div className='w-9 h-9 rounded-full bg-green-50 flex items-center justify-center'>
            🔒
          </div>
        </div>
      </div>

      <div className='max-w-md mx-auto'>
        {/* =====================================================
            AMOUNT CARD
        ===================================================== */}

        <div className='px-5 pt-5'>
          <div className='relative overflow-hidden bg-[#065c2d] rounded-[22px] p-5 shadow-md'>
            <div className='absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5' />

            <div className='absolute -right-4 -bottom-14 w-40 h-40 rounded-full bg-white/5' />

            <div className='relative z-10'>
              <p className='text-[11px] text-white/70'>Total Amount</p>

              <h2 className='text-[34px] leading-none font-extrabold text-white mt-2'>
                ₹{formatAmount(order.grand_total)}
              </h2>

              <div className='mt-5 pt-4 border-t border-white/15 flex items-center justify-between'>
                <div>
                  <p className='text-[9px] text-white/60 uppercase tracking-wide'>
                    Order Number
                  </p>

                  <p className='text-[12px] font-bold text-white mt-1'>
                    {order.order_number}
                  </p>
                </div>

                <div className='px-3 py-1.5 rounded-full bg-white/15'>
                  <span className='text-[10px] font-bold text-white'>
                    Payment Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PLAN INFORMATION
        ===================================================== */}

        {(plan || totalDays || period) && (
          <div className='px-5 mt-4'>
            <div className='bg-[#F2FAF3] border border-[#86C796] rounded-2xl p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-[10px] uppercase tracking-wide text-gray-500 font-semibold'>
                    Subscription Plan
                  </p>

                  <h3 className='text-[16px] font-extrabold text-gray-900 mt-1'>
                    {plan?.plan_name ||
                      plan?.name ||
                      `${totalDays || ''} Days Plan`}
                  </h3>
                </div>

                {totalDays && (
                  <div className='w-12 h-12 rounded-full bg-[#065c2d] text-white flex flex-col items-center justify-center'>
                    <span className='text-[17px] font-extrabold leading-none'>
                      {totalDays}
                    </span>

                    <span className='text-[7px] mt-1'>DAYS</span>
                  </div>
                )}
              </div>

              {period && (
                <div className='mt-3 pt-3 border-t border-green-200 flex items-center gap-2'>
                  <span>{getPeriodIcon(period)}</span>

                  <p className='text-[11px] font-semibold text-gray-600'>
                    {getPeriodLabel(period)} Delivery
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================
            PAYMENT METHOD TITLE
        ===================================================== */}

        <div className='px-5 mt-6'>
          <h2 className='text-[17px] font-bold text-gray-900'>
            Payment Method
          </h2>

          <p className='text-[11px] text-gray-400 mt-1'>
            Select how you want to pay
          </p>
        </div>

        {/* =====================================================
            PAYMENT METHODS
        ===================================================== */}

        <div className='px-5 mt-4 space-y-3'>
          {paymentMethods.map(method => {
            const isSelected = selectedMethod === method.id

            return (
              <button
                key={method.id}
                type='button'
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full p-4 rounded-2xl border-[1.5px] flex items-center gap-3 text-left transition-all ${
                  isSelected
                    ? 'bg-[#F2FAF3] border-[#065c2d] shadow-sm'
                    : 'bg-white border-gray-100'
                }`}
              >
                {/* ICON */}

                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 ${
                    isSelected ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {method.icon}
                </div>

                {/* TEXT */}

                <div className='flex-1 min-w-0'>
                  <h3
                    className={`text-[13px] font-bold ${
                      isSelected ? 'text-[#065c2d]' : 'text-gray-900'
                    }`}
                  >
                    {method.title}
                  </h3>

                  <p className='text-[10px] text-gray-400 mt-1 leading-4'>
                    {method.description}
                  </p>
                </div>

                {/* RADIO */}

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-[#065c2d]' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className='w-2.5 h-2.5 rounded-full bg-[#065c2d]' />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* =====================================================
            ONLINE PAYMENT INFO
        ===================================================== */}

        {selectedMethod === 'ONLINE' && (
          <div className='px-5 mt-4'>
            <div className='bg-blue-50 border border-blue-100 rounded-2xl p-4'>
              <div className='flex items-start gap-3'>
                <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0'>
                  🛡️
                </div>

                <div>
                  <p className='text-[12px] font-bold text-gray-800'>
                    Secure Online Payment
                  </p>

                  <p className='text-[10px] leading-4 text-gray-500 mt-1'>
                    You will be redirected to the secure payment gateway to
                    complete your payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            COD INFORMATION
        ===================================================== */}

        {selectedMethod === 'COD' && (
          <div className='px-5 mt-4'>
            <div className='bg-orange-50 border border-orange-100 rounded-2xl p-4'>
              <div className='flex items-start gap-3'>
                <div className='w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0'>
                  💵
                </div>

                <div>
                  <p className='text-[12px] font-bold text-gray-800'>
                    Cash on Delivery
                  </p>

                  <p className='text-[10px] leading-4 text-gray-500 mt-1'>
                    Your subscription order will be confirmed with cash on
                    delivery as the selected payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            PAYMENT SUMMARY
        ===================================================== */}

        <div className='px-5 mt-5'>
          <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
            <h3 className='text-[15px] font-bold text-gray-900'>
              Payment Summary
            </h3>

            <div className='mt-4 space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Order Amount</span>

                <span className='text-[13px] font-semibold text-gray-900'>
                  ₹{formatAmount(order.grand_total)}
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-[12px] text-gray-500'>Payment Fee</span>

                <span className='text-[12px] font-bold text-[#07852d]'>
                  FREE
                </span>
              </div>
            </div>

            <div className='border-t border-dashed border-gray-200 mt-4 pt-4 flex items-center justify-between'>
              <span className='text-[15px] font-bold text-gray-900'>
                Amount to Pay
              </span>

              <span className='text-[22px] font-extrabold text-[#065c2d]'>
                ₹{formatAmount(order.grand_total)}
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            SECURITY
        ===================================================== */}

        <div className='px-5 mt-5'>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-[12px]'>🔒</span>

            <p className='text-[10px] text-gray-400'>
              Your payment information is secure and protected
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          FIXED BOTTOM BUTTON
      ===================================================== */}

      <div className='fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]'>
        <div className='max-w-md mx-auto px-5 pt-3 pb-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex-shrink-0'>
              <p className='text-[10px] text-gray-400'>Total Amount</p>

              <h2 className='text-[22px] font-extrabold text-gray-900'>
                ₹{formatAmount(order.grand_total)}
              </h2>
            </div>

            <button
              type='button'
              onClick={completePayment}
              disabled={loading}
              className='flex-1 h-[54px] bg-[#065c2d] text-white rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-md disabled:opacity-50 active:scale-[0.98] transition-transform'
            >
              {loading ? (
                <>
                  <span className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                  Processing...
                </>
              ) : selectedMethod === 'COD' ? (
                <>
                  Confirm Order
                  <span className='text-[18px]'>›</span>
                </>
              ) : (
                <>
                  Pay ₹{formatAmount(order.grand_total)}
                  <span className='text-[18px]'>›</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
