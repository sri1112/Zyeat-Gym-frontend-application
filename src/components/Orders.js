import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import orderService from '../services/orderService'
import OrderDetailsModal from './models/OrderDetailsModal'

const formatCurrency = value => {
  return `₹${Number(value || 0).toFixed(2)}`
}

const formatDate = value => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusStyle = status => {
  const normalizedStatus = String(status || '').toUpperCase()

  switch (normalizedStatus) {
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'bg-green-50 text-green-700 border-green-100',
        dotClassName: 'bg-green-600'
      }

    case 'CONFIRMED':
      return {
        label: 'Confirmed',
        className: 'bg-[#EEF8F1] text-[#065c2d] border-[#CDE8D4]',
        dotClassName: 'bg-[#065c2d]'
      }

    case 'PENDING':
      return {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-100',
        dotClassName: 'bg-amber-500'
      }

    case 'PAYMENT_FAILED':
      return {
        label: 'Payment Failed',
        className: 'bg-red-50 text-red-600 border-red-100',
        dotClassName: 'bg-red-500'
      }

    case 'CANCELLED':
      return {
        label: 'Cancelled',
        className: 'bg-red-50 text-red-600 border-red-100',
        dotClassName: 'bg-red-500'
      }

    default:
      return {
        label: normalizedStatus || 'Processing',
        className: 'bg-gray-50 text-gray-600 border-gray-200',
        dotClassName: 'bg-gray-500'
      }
  }
}

const OrderCard = ({ order, onViewDetails, onReorder, reordering }) => {
  const status = getStatusStyle(order.status)

  const planName =
    order.plan_name ||
    (order.plan_duration
      ? `${order.plan_duration} Days Plan`
      : 'Healthy Meal Plan')

  const totalMeals =
    order.total_items ?? order.total_meals ?? order.item_count ?? null

  return (
    <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden mb-4'>
      {/* Order Header */}

      <div className='px-4 pt-4 pb-3 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[10px] uppercase tracking-[0.08em] font-semibold text-gray-400'>
            Order Number
          </p>

          <h3 className='text-[14px] font-extrabold text-gray-900 mt-1 truncate'>
            {order.order_number || `#${order.order_id}`}
          </h3>
        </div>

        <div
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[9px] font-bold ${status.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClassName}`} />

          {status.label}
        </div>
      </div>

      {/* Plan Information */}

      <div className='mx-4 bg-[#F2FAF3] border border-[#D7ECD9] rounded-2xl p-4'>
        <div className='flex items-center gap-3'>
          <div className='w-11 h-11 rounded-xl bg-[#065c2d] flex items-center justify-center flex-shrink-0'>
            <span className='text-[21px]'>🥗</span>
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-[10px] font-semibold text-gray-500'>
              Subscription Plan
            </p>

            <h4 className='text-[15px] font-extrabold text-gray-900 mt-0.5 truncate'>
              {planName}
            </h4>
          </div>

          {order.plan_duration && (
            <div className='text-right flex-shrink-0'>
              <p className='text-[18px] leading-none font-extrabold text-[#065c2d]'>
                {order.plan_duration}
              </p>

              <p className='text-[8px] uppercase tracking-wide text-gray-400 mt-1'>
                Days
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Information */}

      <div className='px-4 py-4'>
        <div className='grid grid-cols-2 gap-3'>
          <div className='bg-[#F8F9F8] rounded-xl p-3'>
            <p className='text-[9px] text-gray-400'>Order Date</p>

            <p className='text-[11px] font-bold text-gray-900 mt-1'>
              {formatDate(order.created_at)}
            </p>
          </div>

          <div className='bg-[#F8F9F8] rounded-xl p-3'>
            <p className='text-[9px] text-gray-400'>Total Meals</p>

            <p className='text-[11px] font-bold text-gray-900 mt-1'>
              {totalMeals !== null ? `${totalMeals} Meals` : 'Meal Plan'}
            </p>
          </div>
        </div>

        {/* Total */}

        <div className='flex items-end justify-between mt-4 pt-4 border-t border-dashed border-gray-200'>
          <div>
            <p className='text-[10px] text-gray-400'>Grand Total</p>

            <h2 className='text-[22px] leading-none font-extrabold text-[#065c2d] mt-1.5'>
              {formatCurrency(order.grand_total)}
            </h2>
          </div>

          <button
            type='button'
            onClick={() => onViewDetails(order)}
            className='h-10 px-4 rounded-xl bg-[#065c2d] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform'
          >
            View Details
            <span className='text-[16px] leading-none'>›</span>
          </button>
        </div>

        {/* Reorder */}

        {(String(order.status).toUpperCase() === 'COMPLETED' ||
          String(order.status).toUpperCase() === 'CONFIRMED') && (
          <button
            type='button'
            disabled={reordering}
            onClick={() => onReorder(order)}
            className='w-full h-11 mt-3 rounded-xl bg-white border-[1.5px] border-[#8CC49A] text-[#065c2d] text-[12px] font-bold active:bg-green-50 transition-colors disabled:opacity-60'
          >
            {reordering ? 'Adding Plan...' : 'Re-Order This Plan'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Orders () {
  const navigate = useNavigate()

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false)
  const [orderDetailsError, setOrderDetailsError] = useState('')
  const [reorderingId, setReorderingId] = useState(null)
  const handleReorder = async order => {
    try {
      setReorderingId(order.order_id)

      const response = await orderService.reorderOrder(order.order_id)

      if (!response.success) {
        throw new Error(response.message || 'Unable to reorder plan')
      }

      navigate('/plans', {
        state: {
          reordered: true,
          cartId: response.data.cart_id,
          planId: response.data.plan_id
        }
      })
    } catch (error) {
      console.error('REORDER ERROR:', error)
      alert(error.message || 'Unable to reorder this plan')
    } finally {
      setReorderingId(null)
    }
  }

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await orderService.getOrders()

      if (response?.success) {
        setOrders(Array.isArray(response.data) ? response.data : [])
      } else {
        setOrders([])
        setError(response?.message || 'Unable to load your orders.')
      }
    } catch (error) {
      console.error('Load orders error:', error)

      setOrders([])

      setError(error?.message || 'Unable to load your orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleViewDetails = async order => {
    try {
      setShowOrderDetails(true)
      setLoadingOrderDetails(true)
      setOrderDetailsError('')

      // Show list data immediately while API is loading
      setSelectedOrder(order)

      // GET /api/orders/:id
      const response = await orderService.getOrderDetails(order.order_id)

      console.log('ORDER DETAILS RESPONSE:', response)

      if (response?.success) {
        setSelectedOrder(response.data)
      } else {
        throw new Error(response?.message || 'Unable to load order details.')
      }
    } catch (error) {
      console.error('Order Details Error:', error)

      setOrderDetailsError(error?.message || 'Unable to load order details.')
    } finally {
      setLoadingOrderDetails(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#F7F8F7] pb-24 font-sans'>
      <OrderDetailsModal
        show={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false)
          setSelectedOrder(null)
          setOrderDetailsError('')
        }}
        order={selectedOrder}
        loading={loadingOrderDetails}
        error={orderDetailsError}
      />

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
            <h1 className='text-[17px] font-bold text-gray-900'>My Orders</h1>

            <p className='text-[10px] text-gray-400 mt-0.5'>
              Your meal plan history
            </p>
          </div>

          <button
            type='button'
            onClick={loadOrders}
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
        {/* Page Summary */}

        {!loading && orders.length > 0 && (
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-[18px] font-extrabold text-gray-900'>
                Order History
              </h2>

              <p className='text-[11px] text-gray-400 mt-1'>
                All your previous meal subscriptions
              </p>
            </div>

            <div className='px-3 py-1.5 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[10px] font-bold'>
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
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
                  <div className='w-36 h-4 bg-gray-200 rounded' />
                  <div className='w-20 h-6 bg-gray-200 rounded-full' />
                </div>

                <div className='h-20 bg-gray-100 rounded-2xl mt-4' />

                <div className='grid grid-cols-2 gap-3 mt-4'>
                  <div className='h-14 bg-gray-100 rounded-xl' />
                  <div className='h-14 bg-gray-100 rounded-xl' />
                </div>

                <div className='h-12 bg-gray-100 rounded-xl mt-4' />
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
              Unable to Load Orders
            </h2>

            <p className='text-[12px] text-gray-500 mt-2'>{error}</p>

            <button
              type='button'
              onClick={loadOrders}
              className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[13px] mt-5'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}

        {!loading && !error && orders.length === 0 && (
          <div className='bg-white rounded-[22px] border border-gray-100 p-8 text-center shadow-sm'>
            <div className='w-20 h-20 rounded-full bg-[#EEF8F1] flex items-center justify-center mx-auto text-3xl'>
              🥗
            </div>

            <h2 className='text-[19px] font-extrabold text-gray-900 mt-5'>
              No Orders Yet
            </h2>

            <p className='text-[12px] leading-5 text-gray-500 mt-2 px-3'>
              Choose a healthy meal plan and your order history will appear
              here.
            </p>

            <button
              type='button'
              onClick={() => navigate('/plans')}
              className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold text-[14px] mt-6'
            >
              Explore Meal Plans
            </button>
          </div>
        )}

        {/* Orders */}

        {!loading &&
          !error &&
          orders.map(order => (
            <OrderCard
              key={order.order_id}
              order={order}
              onViewDetails={handleViewDetails}
              onReorder={handleReorder}
              reordering={reorderingId === order.order_id}
            />
          ))}

        {!loading && !error && orders.length > 0 && (
          <div className='flex items-center gap-3 py-6'>
            <div className='h-px flex-1 bg-gray-200' />

            <p className='text-[10px] text-gray-400'>End of order history</p>

            <div className='h-px flex-1 bg-gray-200' />
          </div>
        )}
      </div>
    </div>
  )
}
