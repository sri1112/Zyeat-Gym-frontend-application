import React, { useEffect } from 'react'

const formatCurrency = value => {
  return `₹${Number(value || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`
}

const formatDate = value => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatDateTime = value => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusStyle = status => {
  switch (String(status || '').toUpperCase()) {
    case 'COMPLETED':
      return 'bg-green-50 text-green-700 border-green-200'

    case 'CONFIRMED':
      return 'bg-[#EEF8F1] text-[#065c2d] border-[#CDE8D4]'

    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200'

    case 'CANCELLED':
    case 'PAYMENT_FAILED':
      return 'bg-red-50 text-red-600 border-red-200'

    default:
      return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

const DetailRow = ({ label, value, last = false }) => (
  <div
    className={`flex items-center justify-between gap-4 py-3 ${
      !last ? 'border-b border-gray-100' : ''
    }`}
  >
    <span className='text-[12px] text-gray-500'>{label}</span>

    <span className='text-[12px] font-bold text-gray-900 text-right'>
      {value || '-'}
    </span>
  </div>
)

export default function OrderDetailsModal ({
  show,
  onClose,
  order,
  loading,
  error
}) {
  useEffect(() => {
    if (!show) return

    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [show, onClose])

  if (!show) return null

  // Supports both:
  // { success: true, data: {...} }
  // and direct {...}
  const data = order?.data || order

  const items =
    data?.items || data?.order_items || data?.products || data?.meals || []
  const PRODUCT_IMAGE_URL = `${process.env.REACT_APP_BASE_URL}/uploads/products`
  //   const PRODUCT_IMAGE_URL = 'https://gynode.1roofai.host/uploads/products'

  const getProductImage = image => {
    if (!image) return null

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image
    }

    return `${PRODUCT_IMAGE_URL}/${image}`
  }
  console.log(PRODUCT_IMAGE_URL, 'images')

  return (
    <div className='fixed inset-0 z-[100] flex items-end justify-center'>
      {/* Backdrop */}
      <button
        type='button'
        aria-label='Close order details'
        onClick={onClose}
        className='absolute inset-0 bg-black/45 backdrop-blur-[1px]'
      />

      {/* Modal */}
      <div className='relative w-full max-w-md max-h-[92vh] bg-[#F7F8F7] rounded-t-[28px] overflow-hidden shadow-2xl animate-[slideUp_0.25s_ease-out]'>
        {/* Drag Handle */}
        <div className='bg-white pt-3'>
          <div className='w-10 h-1 bg-gray-300 rounded-full mx-auto' />
        </div>

        {/* Header */}
        <div className='bg-white px-5 pt-4 pb-4 border-b border-gray-100 flex items-center justify-between'>
          <div>
            <h2 className='text-[18px] font-extrabold text-gray-900'>
              Order Details
            </h2>

            <p className='text-[10px] text-gray-400 mt-1'>
              Complete information about your order
            </p>
          </div>

          <button
            type='button'
            onClick={onClose}
            className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 active:scale-95 transition-transform'
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
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className='overflow-y-auto max-h-[calc(92vh-92px)] px-4 py-4 pb-8'>
          {/* Loading */}
          {loading && (
            <div className='space-y-3'>
              <div className='h-32 bg-white rounded-[20px] animate-pulse' />
              <div className='h-40 bg-white rounded-[20px] animate-pulse' />
              <div className='h-32 bg-white rounded-[20px] animate-pulse' />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className='bg-white rounded-[22px] p-7 text-center border border-gray-100 shadow-sm'>
              <div className='w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto text-2xl'>
                ⚠️
              </div>

              <h3 className='text-[17px] font-bold text-gray-900 mt-4'>
                Unable to Load Order
              </h3>

              <p className='text-[12px] text-gray-500 mt-2'>{error}</p>

              <button
                type='button'
                onClick={onClose}
                className='w-full h-12 rounded-xl bg-[#065c2d] text-white text-[13px] font-bold mt-5'
              >
                Close
              </button>
            </div>
          )}

          {/* Order Details */}
          {!loading && !error && data && (
            <>
              {/* Main Order Card */}
              <div className='bg-white rounded-[22px] border border-gray-100 shadow-sm overflow-hidden'>
                <div className='bg-[#065c2d] px-5 py-5 text-white'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <p className='text-[10px] text-white/70 font-medium'>
                        Order Number
                      </p>

                      <h3 className='text-[17px] font-extrabold mt-1 break-all'>
                        {data.order_number || `Order #${data.order_id}`}
                      </h3>
                    </div>

                    <div
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded-full border text-[9px] font-bold bg-white ${getStatusStyle(
                        data.order_status || data.status
                      )}`}
                    >
                      {data.order_status || data.status || 'PROCESSING'}
                    </div>
                  </div>

                  <div className='flex items-end justify-between mt-5'>
                    <div>
                      <p className='text-[10px] text-white/70'>Total Amount</p>

                      <h2 className='text-[28px] leading-none font-extrabold mt-1.5'>
                        {formatCurrency(
                          data.grand_total || data.total_amount || data.amount
                        )}
                      </h2>
                    </div>

                    <div className='w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center'>
                      <svg
                        className='w-6 h-6'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        strokeWidth='1.8'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plan Card */}
              <div className='bg-[#F2FAF3] border border-[#D7ECD9] rounded-[20px] p-4 mt-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 rounded-2xl bg-[#065c2d] flex items-center justify-center flex-shrink-0'>
                    <span className='text-[22px]'>🥗</span>
                  </div>

                  <div className='flex-1 min-w-0'>
                    <p className='text-[10px] text-gray-500 font-medium'>
                      Subscription Plan
                    </p>

                    <h3 className='text-[15px] font-extrabold text-gray-900 mt-0.5'>
                      {data.plan_name ||
                        (data.plan_duration
                          ? `${data.plan_duration} Days Plan`
                          : 'Healthy Meal Plan')}
                    </h3>
                  </div>

                  {data.plan_duration && (
                    <div className='text-center'>
                      <p className='text-[20px] font-extrabold text-[#065c2d] leading-none'>
                        {data.plan_duration}
                      </p>

                      <p className='text-[8px] uppercase text-gray-400 mt-1'>
                        Days
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meals / Products */}
              {items.length > 0 && (
                <div className='mt-4'>
                  <div className='flex items-center justify-between px-1 mb-2'>
                    <h3 className='text-[14px] font-bold text-gray-700'>
                      Meals in this Order
                    </h3>

                    <span className='px-2.5 py-1 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[9px] font-bold'>
                      {data.total_items || items.length}{' '}
                      {(data.total_items || items.length) === 1
                        ? 'Item'
                        : 'Items'}
                    </span>
                  </div>

                  <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden'>
                    {items.map((item, index) => (
                      <div
                        key={item.mapping_id || item.product_id || index}
                        className={`flex items-center gap-3 p-4 ${
                          index !== items.length - 1
                            ? 'border-b border-gray-100'
                            : ''
                        }`}
                      >
                        {/* Product Image */}
                        <div className='w-14 h-14 rounded-xl bg-[#F2FAF3] flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100'>
                          {item.image ? (
                            <img
                              src={getProductImage(item.image)}
                              alt={item.product_name || 'Product'}
                              className='w-full h-full object-cover'
                              onError={event => {
                                event.currentTarget.style.display = 'none'
                                event.currentTarget.nextElementSibling.style.display =
                                  'flex'
                              }}
                            />
                          ) : null}

                          <div
                            className={`w-full h-full items-center justify-center text-xl ${
                              item.image ? 'hidden' : 'flex'
                            }`}
                          >
                            🥗
                          </div>
                        </div>

                        {/* Product Information */}
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-1.5'>
                            <h4 className='text-[13px] font-bold text-gray-900 truncate'>
                              {item.product_name || 'Healthy Meal'}
                            </h4>

                            <span
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                item.product_category === 'veg'
                                  ? 'bg-green-500'
                                  : 'bg-red-500'
                              }`}
                            />
                          </div>

                          <p className='text-[10px] text-gray-400 mt-1'>
                            {item.quantity} {item.product_unit || ''}
                          </p>

                          <div className='flex items-center gap-2 mt-1.5'>
                            <span className='text-[9px] font-bold text-[#065c2d] bg-[#EEF8F1] px-2 py-0.5 rounded-full'>
                              {String(item.period || '')
                                .replace('_', ' ')
                                .replace(/\b\w/g, letter =>
                                  letter.toUpperCase()
                                )}
                            </span>

                            <span className='text-[9px] text-gray-400'>
                              {formatDate(item.selected_date)}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className='text-right flex-shrink-0'>
                          <p className='text-[13px] font-extrabold text-[#065c2d]'>
                            {formatCurrency(item.total_amount)}
                          </p>

                          <p className='text-[9px] text-gray-400 mt-1'>
                            {formatCurrency(item.unit_price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Information */}
              <div className='mt-4'>
                <h3 className='text-[14px] font-bold text-gray-700 mb-2 px-1'>
                  Order Information
                </h3>

                <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm px-4'>
                  <DetailRow
                    label='Order Number'
                    value={data.order_number || `Order #${data.order_id}`}
                  />

                  <DetailRow
                    label='Order Date'
                    value={formatDateTime(data.created_at)}
                  />

                  <DetailRow
                    label='Order Status'
                    value={data.order_status || data.status}
                  />

                  <DetailRow
                    label='Plan'
                    value={data.plan_name || 'Meal Plan'}
                    last
                  />
                </div>
              </div>

              {/* Payment Information */}
              <div className='mt-4'>
                <h3 className='text-[14px] font-bold text-gray-700 mb-2 px-1'>
                  Payment Summary
                </h3>

                <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm px-4'>
                  <DetailRow
                    label='Subtotal'
                    value={formatCurrency(
                      data.sub_total || data.subtotal || data.grand_total
                    )}
                  />

                  {data.discount_amount !== undefined && (
                    <DetailRow
                      label='Discount'
                      value={`-${formatCurrency(data.discount_amount)}`}
                    />
                  )}

                  {data.delivery_charge !== undefined && (
                    <DetailRow
                      label='Delivery Charge'
                      value={formatCurrency(data.delivery_charge)}
                    />
                  )}

                  <div className='flex items-center justify-between py-4'>
                    <span className='text-[13px] font-bold text-gray-900'>
                      Grand Total
                    </span>

                    <span className='text-[20px] font-extrabold text-[#065c2d]'>
                      {formatCurrency(
                        data.grand_total || data.total_amount || data.amount
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              {/* <button
                type='button'
                onClick={onClose}
                className='w-full h-[52px] mt-4 rounded-2xl bg-[#065c2d] text-white text-[13px] font-bold shadow-sm active:scale-[0.99] transition-transform'
              >
                Done
              </button> */}
            </>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
              opacity: 0;
            }

            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}
