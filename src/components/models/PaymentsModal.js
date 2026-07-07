import React, { useEffect } from 'react'

export default function PaymentsModal ({
  show,
  onClose,
  payments = [],
  loading = false,
  onSelectPayment
}) {
  useEffect(() => {
    if (!show) return

    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [show, onClose])

  if (!show) return null

  const formatAmount = amount => {
    const value = Number(amount || 0)

    return `₹${value.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })}`
  }

  const formatDate = date => {
    if (!date) return 'Not paid yet'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusStyle = status => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-50 text-green-700 border-green-100'

      case 'PENDING':
        return 'bg-orange-50 text-orange-600 border-orange-100'

      case 'FAILED':
        return 'bg-red-50 text-red-600 border-red-100'

      default:
        return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  const getPaymentIcon = method => {
    if (method === 'COD') {
      return (
        <svg
          className='w-5 h-5'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.8}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 6v12m3-9.5C15 7.12 13.657 6 12 6S9 7.12 9 8.5 10.343 11 12 11s3 1.12 3 2.5S13.657 16 12 16s-3-1.12-3-2.5'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3a9 9 0 110 18 9 9 0 010-18z'
          />
        </svg>
      )
    }

    return (
      <svg
        className='w-5 h-5'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1.8}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 10h18M7 15h1m4 0h2m-8 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        />
      </svg>
    )
  }

  return (
    <div className='fixed inset-0 z-[100] flex items-end sm:items-center justify-center'>
      {/* Backdrop */}
      <button
        type='button'
        aria-label='Close payments'
        onClick={onClose}
        className='absolute inset-0 bg-black/45 backdrop-blur-[2px]'
      />

      {/* Modal */}
      <div className='relative bg-[#fcfcfc] w-full sm:max-w-md h-[82vh] sm:h-[700px] sm:max-h-[90vh] rounded-t-[28px] sm:rounded-[28px] shadow-2xl flex flex-col overflow-hidden animate-slide-up'>
        {/* Mobile Handle */}
        <div className='sm:hidden flex justify-center pt-3 pb-1'>
          <div className='w-10 h-1 rounded-full bg-gray-300' />
        </div>

        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100'>
          <div>
            <h2 className='text-[19px] font-bold text-gray-900'>
              Payment History
            </h2>

            <p className='text-[12px] text-gray-500 mt-0.5'>
              View all your payment transactions
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 active:scale-95 transition-transform'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 py-4'>
          {loading ? (
            <PaymentListSkeleton />
          ) : payments.length === 0 ? (
            <EmptyPayments />
          ) : (
            <div className='space-y-3'>
              {payments.map(payment => (
                <button
                  key={payment.payment_id}
                  type='button'
                  onClick={() => onSelectPayment(payment.payment_id)}
                  className='w-full text-left bg-white border border-gray-100 rounded-2xl p-4 shadow-[0px_1px_4px_rgba(0,0,0,0.10)] active:scale-[0.99] active:bg-gray-50 transition-all'
                >
                  {/* Top Row */}
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center min-w-0'>
                      <div className='w-10 h-10 rounded-xl bg-[#f0f9f3] text-[#065c2d] flex items-center justify-center flex-shrink-0'>
                        {getPaymentIcon(payment.payment_method)}
                      </div>

                      <div className='ml-3 min-w-0'>
                        <p className='text-[17px] font-bold text-gray-900'>
                          {formatAmount(payment.amount)}
                        </p>

                        <p className='text-[11px] text-gray-500 mt-0.5'>
                          {payment.payment_method || 'Payment'}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusStyle(
                        payment.payment_status
                      )}`}
                    >
                      {payment.payment_status || 'UNKNOWN'}
                    </span>
                  </div>

                  {/* Order Number */}
                  <div className='mt-4 pt-3 border-t border-gray-100'>
                    <div className='flex items-center justify-between'>
                      <div className='min-w-0 pr-3'>
                        <p className='text-[10px] uppercase tracking-wide text-gray-400 font-semibold'>
                          Order Number
                        </p>

                        <p className='text-[12px] font-semibold text-gray-700 mt-1 truncate'>
                          {payment.order_number || '-'}
                        </p>
                      </div>

                      <svg
                        className='w-4 h-4 text-gray-300 flex-shrink-0'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    </div>

                    {/* Bottom Info */}
                    <div className='flex items-center justify-between mt-3'>
                      <div className='flex items-center text-gray-500'>
                        <svg
                          className='w-3.5 h-3.5 mr-1.5'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>

                        <span className='text-[11px]'>
                          {formatDate(payment.paid_at || payment.created_at)}
                        </span>
                      </div>

                      <span className='text-[11px] font-semibold text-[#065c2d]'>
                        View Details
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='px-4 py-3 bg-white border-t border-gray-100'>
          <p className='text-center text-[11px] text-gray-400'>
            {payments.length} payment
            {payments.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  )
}

const PaymentListSkeleton = () => (
  <div className='space-y-3'>
    {[1, 2, 3, 4].map(item => (
      <div
        key={item}
        className='bg-white border border-gray-100 rounded-2xl p-4 animate-pulse'
      >
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <div className='w-10 h-10 rounded-xl bg-gray-200' />

            <div className='ml-3'>
              <div className='w-20 h-4 rounded bg-gray-200' />
              <div className='w-12 h-3 rounded bg-gray-100 mt-2' />
            </div>
          </div>

          <div className='w-16 h-6 rounded-full bg-gray-100' />
        </div>

        <div className='mt-4 pt-3 border-t border-gray-100'>
          <div className='w-32 h-3 rounded bg-gray-100' />
          <div className='w-44 h-3 rounded bg-gray-200 mt-2' />
        </div>
      </div>
    ))}
  </div>
)

const EmptyPayments = () => (
  <div className='h-full flex flex-col items-center justify-center text-center px-6'>
    <div className='w-16 h-16 rounded-full bg-[#f0f9f3] text-[#065c2d] flex items-center justify-center'>
      <svg
        className='w-8 h-8'
        fill='none'
        viewBox='0 0 24 24'
        stroke='currentColor'
        strokeWidth={1.5}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M3 10h18M7 15h1m4 0h2m-8 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
        />
      </svg>
    </div>

    <h3 className='text-[16px] font-bold text-gray-800 mt-4'>
      No Payments Found
    </h3>

    <p className='text-[12px] text-gray-500 mt-1'>
      Your payment transactions will appear here.
    </p>
  </div>
)
