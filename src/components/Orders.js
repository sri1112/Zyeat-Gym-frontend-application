// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// import orderService from '../services/orderService'
// import OrderDetailsModal from './models/OrderDetailsModal'

// const formatCurrency = value => {
//   return `₹${Number(value || 0).toFixed(2)}`
// }

// const formatDate = value => {
//   if (!value) return '-'

//   const date = new Date(value)

//   if (Number.isNaN(date.getTime())) {
//     return '-'
//   }

//   return date.toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   })
// }

// const getStatusStyle = status => {
//   const normalizedStatus = String(status || '').toUpperCase()

//   switch (normalizedStatus) {
//     case 'COMPLETED':
//       return {
//         label: 'Completed',
//         className: 'bg-green-50 text-green-700 border-green-100',
//         dotClassName: 'bg-green-600'
//       }

//     case 'CONFIRMED':
//       return {
//         label: 'Confirmed',
//         className: 'bg-[#EEF8F1] text-[#065c2d] border-[#CDE8D4]',
//         dotClassName: 'bg-[#065c2d]'
//       }

//     case 'PENDING':
//       return {
//         label: 'Pending',
//         className: 'bg-amber-50 text-amber-700 border-amber-100',
//         dotClassName: 'bg-amber-500'
//       }

//     case 'PAYMENT_FAILED':
//       return {
//         label: 'Payment Failed',
//         className: 'bg-red-50 text-red-600 border-red-100',
//         dotClassName: 'bg-red-500'
//       }

//     case 'CANCELLED':
//       return {
//         label: 'Cancelled',
//         className: 'bg-red-50 text-red-600 border-red-100',
//         dotClassName: 'bg-red-500'
//       }

//     default:
//       return {
//         label: normalizedStatus || 'Processing',
//         className: 'bg-gray-50 text-gray-600 border-gray-200',
//         dotClassName: 'bg-gray-500'
//       }
//   }
// }

// const OrderCard = ({ order, onViewDetails, onReorder, reordering }) => {
//   const status = getStatusStyle(order.status)

//   const planName =
//     order.plan_name ||
//     (order.plan_duration
//       ? `${order.plan_duration} Days Plan`
//       : 'Healthy Meal Plan')

//   const totalMeals =
//     order.total_items ?? order.total_meals ?? order.item_count ?? null

//   return (
//     <div className='bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden mb-4'>
//       {/* Order Header */}

//       <div className='px-4 pt-4 pb-3 flex items-start justify-between gap-3'>
//         <div className='min-w-0'>
//           <p className='text-[10px] uppercase tracking-[0.08em] font-semibold text-gray-400'>
//             Order Number
//           </p>

//           <h3 className='text-[14px] font-extrabold text-gray-900 mt-1 truncate'>
//             {order.order_number || `#${order.order_id}`}
//           </h3>
//         </div>

//         <div
//           className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[9px] font-bold ${status.className}`}
//         >
//           <span className={`w-1.5 h-1.5 rounded-full ${status.dotClassName}`} />

//           {status.label}
//         </div>
//       </div>

//       {/* Plan Information */}

//       <div className='mx-4 bg-[#F2FAF3] border border-[#D7ECD9] rounded-2xl p-4'>
//         <div className='flex items-center gap-3'>
//           <div className='w-11 h-11 rounded-xl bg-[#065c2d] flex items-center justify-center flex-shrink-0'>
//             <span className='text-[21px]'>🥗</span>
//           </div>

//           <div className='flex-1 min-w-0'>
//             <p className='text-[10px] font-semibold text-gray-500'>
//               Subscription Plan
//             </p>

//             <h4 className='text-[15px] font-extrabold text-gray-900 mt-0.5 truncate'>
//               {planName}
//             </h4>
//           </div>

//           {order.plan_duration && (
//             <div className='text-right flex-shrink-0'>
//               <p className='text-[18px] leading-none font-extrabold text-[#065c2d]'>
//                 {order.plan_duration}
//               </p>

//               <p className='text-[8px] uppercase tracking-wide text-gray-400 mt-1'>
//                 Days
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Order Information */}

//       <div className='px-4 py-4'>
//         <div className='grid grid-cols-2 gap-3'>
//           <div className='bg-[#F8F9F8] rounded-xl p-3'>
//             <p className='text-[9px] text-gray-400'>Order Date</p>

//             <p className='text-[11px] font-bold text-gray-900 mt-1'>
//               {formatDate(order.created_at)}
//             </p>
//           </div>

//           <div className='bg-[#F8F9F8] rounded-xl p-3'>
//             <p className='text-[9px] text-gray-400'>Total Meals</p>

//             <p className='text-[11px] font-bold text-gray-900 mt-1'>
//               {totalMeals !== null ? `${totalMeals} Meals` : 'Meal Plan'}
//             </p>
//           </div>
//         </div>

//         {/* Total */}

//         <div className='flex items-end justify-between mt-4 pt-4 border-t border-dashed border-gray-200'>
//           <div>
//             <p className='text-[10px] text-gray-400'>Grand Total</p>

//             <h2 className='text-[22px] leading-none font-extrabold text-[#065c2d] mt-1.5'>
//               {formatCurrency(order.grand_total)}
//             </h2>
//           </div>

//           <button
//             type='button'
//             onClick={() => onViewDetails(order)}
//             className='h-10 px-4 rounded-xl bg-[#065c2d] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform'
//           >
//             View Details
//             <span className='text-[16px] leading-none'>›</span>
//           </button>
//         </div>

//         {/* Reorder */}

//         {(String(order.status).toUpperCase() === 'COMPLETED' ||
//           String(order.status).toUpperCase() === 'CONFIRMED') && (
//           <button
//             type='button'
//             disabled={reordering}
//             onClick={() => onReorder(order)}
//             className='w-full h-11 mt-3 rounded-xl bg-white border-[1.5px] border-[#8CC49A] text-[#065c2d] text-[12px] font-bold active:bg-green-50 transition-colors disabled:opacity-60'
//           >
//             {reordering ? 'Adding Plan...' : 'Re-Order This Plan'}
//           </button>
//         )}
//       </div>
//     </div>
//   )
// }

// export default function Orders () {
//   const navigate = useNavigate()

//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')
//   const [showOrderDetails, setShowOrderDetails] = useState(false)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [loadingOrderDetails, setLoadingOrderDetails] = useState(false)
//   const [orderDetailsError, setOrderDetailsError] = useState('')
//   const [reorderingId, setReorderingId] = useState(null)
//   const handleReorder = async order => {
//     try {
//       setReorderingId(order.order_id)

//       const response = await orderService.reorderOrder(order.order_id)

//       if (!response.success) {
//         throw new Error(response.message || 'Unable to reorder plan')
//       }

//       navigate('/plans', {
//         state: {
//           reordered: true,
//           cartId: response.data.cart_id,
//           planId: response.data.plan_id
//         }
//       })
//     } catch (error) {
//       console.error('REORDER ERROR:', error)
//       alert(error.message || 'Unable to reorder this plan')
//     } finally {
//       setReorderingId(null)
//     }
//   }

//   const loadOrders = async () => {
//     try {
//       setLoading(true)
//       setError('')

//       const response = await orderService.getOrders()

//       if (response?.success) {
//         setOrders(Array.isArray(response.data) ? response.data : [])
//       } else {
//         setOrders([])
//         setError(response?.message || 'Unable to load your orders.')
//       }
//     } catch (error) {
//       console.error('Load orders error:', error)

//       setOrders([])

//       setError(error?.message || 'Unable to load your orders.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadOrders()
//   }, [])

//   const handleViewDetails = async order => {
//     try {
//       setShowOrderDetails(true)
//       setLoadingOrderDetails(true)
//       setOrderDetailsError('')

//       // Show list data immediately while API is loading
//       setSelectedOrder(order)

//       // GET /api/orders/:id
//       const response = await orderService.getOrderDetails(order.order_id)

//       console.log('ORDER DETAILS RESPONSE:', response)

//       if (response?.success) {
//         setSelectedOrder(response.data)
//       } else {
//         throw new Error(response?.message || 'Unable to load order details.')
//       }
//     } catch (error) {
//       console.error('Order Details Error:', error)

//       setOrderDetailsError(error?.message || 'Unable to load order details.')
//     } finally {
//       setLoadingOrderDetails(false)
//     }
//   }

//   return (
//     <div className='min-h-screen bg-[#F7F8F7] pb-24 font-sans'>
//       <OrderDetailsModal
//         show={showOrderDetails}
//         onClose={() => {
//           setShowOrderDetails(false)
//           setSelectedOrder(null)
//           setOrderDetailsError('')
//         }}
//         order={selectedOrder}
//         loading={loadingOrderDetails}
//         error={orderDetailsError}
//       />

//       {/* Header */}

//       <div className='sticky top-0 z-30 bg-white border-b border-gray-100'>
//         <div className='max-w-md mx-auto px-5 h-[68px] flex items-center justify-between'>
//           <button
//             type='button'
//             onClick={() => navigate(-1)}
//             className='w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700'
//           >
//             <svg
//               className='w-5 h-5'
//               fill='none'
//               viewBox='0 0 24 24'
//               stroke='currentColor'
//               strokeWidth='2'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 d='M15 19l-7-7 7-7'
//               />
//             </svg>
//           </button>

//           <div className='text-center'>
//             <h1 className='text-[17px] font-bold text-gray-900'>My Orders</h1>

//             <p className='text-[10px] text-gray-400 mt-0.5'>
//               Your meal plan history
//             </p>
//           </div>

//           <button
//             type='button'
//             onClick={loadOrders}
//             className='w-9 h-9 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#065c2d]'
//           >
//             <svg
//               className='w-[17px] h-[17px]'
//               fill='none'
//               viewBox='0 0 24 24'
//               stroke='currentColor'
//               strokeWidth='2'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 d='M4 4v5h5M20 20v-5h-5'
//               />

//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 d='M5.5 15a7 7 0 0011.7 2.5M18.5 9A7 7 0 006.8 6.5'
//               />
//             </svg>
//           </button>
//         </div>
//       </div>

//       <div className='max-w-md mx-auto px-5 pt-5'>
//         {/* Page Summary */}

//         {!loading && orders.length > 0 && (
//           <div className='flex items-center justify-between mb-4'>
//             <div>
//               <h2 className='text-[18px] font-extrabold text-gray-900'>
//                 Order History
//               </h2>

//               <p className='text-[11px] text-gray-400 mt-1'>
//                 All your previous meal subscriptions
//               </p>
//             </div>

//             <div className='px-3 py-1.5 rounded-full bg-[#EEF8F1] text-[#065c2d] text-[10px] font-bold'>
//               {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
//             </div>
//           </div>
//         )}

//         {/* Loading */}

//         {loading && (
//           <div className='space-y-4'>
//             {[1, 2, 3].map(item => (
//               <div
//                 key={item}
//                 className='bg-white rounded-[20px] border border-gray-100 p-4 animate-pulse'
//               >
//                 <div className='flex justify-between'>
//                   <div className='w-36 h-4 bg-gray-200 rounded' />
//                   <div className='w-20 h-6 bg-gray-200 rounded-full' />
//                 </div>

//                 <div className='h-20 bg-gray-100 rounded-2xl mt-4' />

//                 <div className='grid grid-cols-2 gap-3 mt-4'>
//                   <div className='h-14 bg-gray-100 rounded-xl' />
//                   <div className='h-14 bg-gray-100 rounded-xl' />
//                 </div>

//                 <div className='h-12 bg-gray-100 rounded-xl mt-4' />
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Error */}

//         {!loading && error && (
//           <div className='bg-white rounded-[22px] border border-gray-100 p-7 text-center shadow-sm'>
//             <div className='w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-2xl'>
//               ⚠️
//             </div>

//             <h2 className='text-[17px] font-bold text-gray-900 mt-4'>
//               Unable to Load Orders
//             </h2>

//             <p className='text-[12px] text-gray-500 mt-2'>{error}</p>

//             <button
//               type='button'
//               onClick={loadOrders}
//               className='w-full h-12 bg-[#065c2d] text-white rounded-xl font-bold text-[13px] mt-5'
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Empty State */}

//         {!loading && !error && orders.length === 0 && (
//           <div className='bg-white rounded-[22px] border border-gray-100 p-8 text-center shadow-sm'>
//             <div className='w-20 h-20 rounded-full bg-[#EEF8F1] flex items-center justify-center mx-auto text-3xl'>
//               🥗
//             </div>

//             <h2 className='text-[19px] font-extrabold text-gray-900 mt-5'>
//               No Orders Yet
//             </h2>

//             <p className='text-[12px] leading-5 text-gray-500 mt-2 px-3'>
//               Choose a healthy meal plan and your order history will appear
//               here.
//             </p>

//             <button
//               type='button'
//               onClick={() => navigate('/plans')}
//               className='w-full h-[52px] bg-[#065c2d] text-white rounded-xl font-bold text-[14px] mt-6'
//             >
//               Explore Meal Plans
//             </button>
//           </div>
//         )}

//         {/* Orders */}

//         {!loading &&
//           !error &&
//           orders.map(order => (
//             <OrderCard
//               key={order.order_id}
//               order={order}
//               onViewDetails={handleViewDetails}
//               onReorder={handleReorder}
//               reordering={reorderingId === order.order_id}
//             />
//           ))}

//         {!loading && !error && orders.length > 0 && (
//           <div className='flex items-center gap-3 py-6'>
//             <div className='h-px flex-1 bg-gray-200' />

//             <p className='text-[10px] text-gray-400'>End of order history</p>

//             <div className='h-px flex-1 bg-gray-200' />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import React, { useEffect, useState, useMemo } from 'react'
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
        className:
          'bg-gradient-to-r from-[#EEF8F1] to-[#E3F2E6] text-[#065c2d] border-[#CDE8D4] shadow-sm',
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
    <div className='bg-white rounded-[24px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 mb-5 overflow-hidden'>
      {/* Order Header */}
      <div className='px-5 pt-5 pb-4 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
            Order Number
          </p>
          <h3 className='text-[15px] font-black text-gray-900 mt-1 truncate tracking-tight'>
            {order.order_number || `#${order.order_id}`}
          </h3>
        </div>

        <div
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold ${status.className}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shadow-sm ${status.dotClassName}`}
          />
          {status.label}
        </div>
      </div>

      {/* Plan Information - Premium Gradient Box */}
      <div className='mx-5 bg-gradient-to-br from-[#F4F9F5] to-white border border-[#E8F3EA] rounded-[20px] p-4 relative overflow-hidden group'>
        <div className='absolute -right-4 -top-4 w-16 h-16 bg-[#EEF8F1] rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity' />

        <div className='flex items-center gap-4 relative z-10'>
          <div className='w-12 h-12 rounded-2xl bg-[#065c2d] shadow-lg shadow-green-900/20 flex items-center justify-center flex-shrink-0'>
            <span className='text-[22px] drop-shadow-md'>🥗</span>
          </div>

          <div className='flex-1 min-w-0'>
            <p className='text-[10px] uppercase tracking-wider font-bold text-[#065c2d]/60'>
              Subscription Plan
            </p>
            <h4 className='text-[16px] font-extrabold text-gray-900 mt-0.5 truncate'>
              {planName}
            </h4>
          </div>

          {order.plan_duration && (
            <div className='text-right flex-shrink-0 border-l border-[#D7ECD9] pl-4 py-1'>
              <p className='text-[20px] leading-none font-black text-[#065c2d]'>
                {order.plan_duration}
              </p>
              <p className='text-[9px] uppercase tracking-widest font-bold text-[#065c2d]/60 mt-1.5'>
                Days
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Information */}
      <div className='px-5 py-5'>
        <div className='flex items-center justify-between gap-3 mb-5'>
          <div>
            <p className='text-[10px] font-medium text-gray-400'>Order Date</p>
            <p className='text-[12px] font-bold text-gray-900 mt-0.5'>
              {formatDate(order.created_at)}
            </p>
          </div>

          <div className='w-px h-8 bg-gray-100' />

          <div>
            <p className='text-[10px] font-medium text-gray-400'>Total Meals</p>
            <p className='text-[12px] font-bold text-gray-900 mt-0.5'>
              {totalMeals !== null ? `${totalMeals} Meals` : 'Meal Plan'}
            </p>
          </div>

          <div className='w-px h-8 bg-gray-100' />

          <div className='text-right'>
            <p className='text-[10px] font-medium text-gray-400'>Grand Total</p>
            <p className='text-[14px] font-black text-[#065c2d] mt-0.5'>
              {formatCurrency(order.grand_total)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3'>
          {(String(order.status).toUpperCase() === 'COMPLETED' ||
            String(order.status).toUpperCase() === 'CONFIRMED') && (
            <button
              type='button'
              disabled={reordering}
              onClick={() => onReorder(order)}
              className='flex-1 h-12 rounded-[14px] bg-white border-2 border-[#E3F2E6] text-[#065c2d] text-[13px] font-bold hover:bg-[#F4F9F5] active:scale-[0.98] transition-all disabled:opacity-60 disabled:active:scale-100'
            >
              {reordering ? 'Adding...' : 'Re-Order'}
            </button>
          )}

          <button
            type='button'
            onClick={() => onViewDetails(order)}
            className='flex-1 h-12 rounded-[14px] bg-[#065c2d] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-[0_4px_14px_rgba(6,92,45,0.25)] hover:shadow-[0_6px_20px_rgba(6,92,45,0.3)] hover:-translate-y-0.5 active:scale-[0.98] transition-all'
          >
            View Details
            <span className='text-[16px] leading-none ml-1'>→</span>
          </button>
        </div>
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

  // Date filter state
  const [filterDate, setFilterDate] = useState('')

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
        // Remove duplicate orders using Map
        const apiOrders = Array.isArray(response.data) ? response.data : []
        const uniqueOrders = Array.from(
          new Map(apiOrders.map(order => [order.order_id, order])).values()
        )
        setOrders(uniqueOrders)
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

  // Filter logic
  const displayOrders = useMemo(() => {
    if (!filterDate) return orders

    return orders.filter(order => {
      try {
        const orderDate = new Date(order.created_at)
        const selectedDate = new Date(filterDate)
        return orderDate.toDateString() === selectedDate.toDateString()
      } catch (err) {
        return false
      }
    })
  }, [orders, filterDate])

  const handleViewDetails = async order => {
    try {
      setShowOrderDetails(true)
      setLoadingOrderDetails(true)
      setOrderDetailsError('')
      setSelectedOrder(order)

      const response = await orderService.getOrderDetails(order.order_id)

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
    <div className='min-h-screen bg-[#F9FAF9] pb-24 font-sans'>
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

      {/* Header - Glassmorphism Premium UI */}
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
              My Orders
            </h1>
            <p className='text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest'>
              History & Receipts
            </p>
          </div>

          <button
            type='button'
            onClick={loadOrders}
            className='w-10 h-10 rounded-full bg-[#EEF8F1] flex items-center justify-center text-[#065c2d] hover:bg-[#E3F2E6] transition-colors shadow-sm'
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

      <div className='max-w-md mx-auto px-5 pt-6'>
        {/* Page Summary */}
        {!loading && orders.length > 0 && (
          <div className='flex items-end justify-between mb-6'>
            <div>
              <h2 className='text-[22px] font-black text-gray-900 tracking-tight'>
                Order History
              </h2>
              <p className='text-[12px] font-medium text-gray-500 mt-1'>
                Manage your previous plans
              </p>
            </div>
            <div className='px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#EEF8F1] to-[#E3F2E6] text-[#065c2d] text-[11px] font-bold shadow-sm'>
              {displayOrders.length}{' '}
              {displayOrders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
        )}

        {/* Date Filter */}
        {!loading && !error && orders.length > 0 && (
          <div className='mb-6 flex items-center gap-3'>
            <div className='relative flex-1'>
              <div className='absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none'>
                <span className='text-gray-400'>📅</span>
              </div>
              <input
                type='date'
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className='w-full h-12 bg-white border-0 shadow-[0_2px_10px_rgb(0,0,0,0.04)] rounded-2xl pl-10 pr-4 text-[13px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#065c2d]/20 transition-all'
              />
            </div>
            {filterDate && (
              <button
                type='button'
                onClick={() => setFilterDate('')}
                className='h-12 px-5 rounded-2xl bg-white border border-gray-200 text-gray-600 text-[13px] font-bold shadow-sm hover:bg-gray-50 transition-colors'
              >
                Clear
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='space-y-5'>
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className='bg-white rounded-[24px] border border-gray-100 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse'
              >
                <div className='flex justify-between items-center'>
                  <div className='w-32 h-4 bg-gray-200 rounded-md' />
                  <div className='w-20 h-6 bg-gray-200 rounded-full' />
                </div>
                <div className='h-24 bg-gray-50 rounded-[20px] mt-5' />
                <div className='flex gap-3 mt-5'>
                  <div className='flex-1 h-12 bg-gray-50 rounded-[14px]' />
                  <div className='flex-1 h-12 bg-gray-100 rounded-[14px]' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className='bg-white rounded-[24px] border border-gray-100 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
            <div className='w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-3xl shadow-inner'>
              ⚠️
            </div>
            <h2 className='text-[18px] font-black text-gray-900 mt-5'>
              Unable to Load Orders
            </h2>
            <p className='text-[13px] text-gray-500 mt-2 font-medium'>
              {error}
            </p>
            <button
              type='button'
              onClick={loadOrders}
              className='w-full h-12 bg-[#065c2d] text-white rounded-[14px] font-bold text-[14px] mt-6 shadow-[0_4px_14px_rgba(6,92,45,0.25)] hover:-translate-y-0.5 transition-transform'
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State (Total Orders Empty) */}
        {!loading && !error && orders.length === 0 && (
          <div className='bg-white rounded-[24px] border border-gray-100 p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]'>
            <div className='w-24 h-24 rounded-[24px] bg-gradient-to-br from-[#EEF8F1] to-[#E3F2E6] flex items-center justify-center mx-auto text-4xl shadow-inner'>
              🥗
            </div>
            <h2 className='text-[20px] font-black text-gray-900 mt-6 tracking-tight'>
              No Orders Yet
            </h2>
            <p className='text-[13px] leading-relaxed text-gray-500 mt-3 px-2 font-medium'>
              Choose a healthy meal plan and your premium order history will
              appear here.
            </p>
            <button
              type='button'
              onClick={() => navigate('/plans')}
              className='w-full h-[52px] bg-[#065c2d] text-white rounded-[16px] font-bold text-[14px] mt-8 shadow-[0_4px_14px_rgba(6,92,45,0.25)] hover:-translate-y-0.5 transition-transform'
            >
              Explore Meal Plans
            </button>
          </div>
        )}

        {/* Empty State (Filtered Result Empty) */}
        {!loading && !error && orders.length > 0 && displayOrders.length === 0 && (
          <div className='bg-white rounded-[24px] border border-gray-100 p-8 text-center shadow-sm my-4'>
            <div className='text-4xl mb-4'>📅</div>
            <h2 className='text-[18px] font-black text-gray-900'>
              No orders on this date
            </h2>
            <p className='text-[13px] text-gray-500 mt-2 font-medium'>
              Try selecting a different date or clear the filter to see all
              orders.
            </p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && displayOrders.length > 0 && (
          <div className='space-y-0'>
            {displayOrders.map(order => (
              <OrderCard
                key={order.order_id}
                order={order}
                onViewDetails={handleViewDetails}
                onReorder={handleReorder}
                reordering={reorderingId === order.order_id}
              />
            ))}
          </div>
        )}

        {/* End of list */}
        {!loading && !error && displayOrders.length > 0 && (
          <div className='flex items-center gap-4 py-8'>
            <div className='h-px flex-1 bg-gradient-to-r from-transparent to-gray-200' />
            <p className='text-[10px] uppercase tracking-widest font-bold text-gray-400'>
              End of orders
            </p>
            <div className='h-px flex-1 bg-gradient-to-l from-transparent to-gray-200' />
          </div>
        )}
      </div>
    </div>
  )
}
