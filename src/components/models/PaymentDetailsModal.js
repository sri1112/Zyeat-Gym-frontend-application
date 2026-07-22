// import React, { useEffect, useState } from 'react'

// export default function PaymentDetailsModal ({
//   show,
//   onClose,
//   payment,
//   loading = false
// }) {
//   const [copied, setCopied] = useState(false)

//   useEffect(() => {
//     if (!show) return

//     const handleEscape = event => {
//       if (event.key === 'Escape') {
//         onClose()
//       }
//     }

//     document.addEventListener('keydown', handleEscape)
//     document.body.style.overflow = 'hidden'

//     return () => {
//       document.removeEventListener('keydown', handleEscape)
//       document.body.style.overflow = ''
//     }
//   }, [show, onClose])

//   if (!show) return null

//   const formatAmount = amount => {
//     return `₹${Number(amount || 0).toLocaleString('en-IN', {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2
//     })}`
//   }

//   const formatDate = date => {
//     if (!date) return '-'

//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     })
//   }

//   const formatTime = date => {
//     if (!date) return '-'

//     return new Date(date).toLocaleTimeString('en-IN', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     })
//   }

//   const getStatusConfig = status => {
//     switch (status) {
//       case 'SUCCESS':
//         return {
//           title: 'Payment Successful',
//           description: 'Your payment has been received successfully.',
//           badge: 'Paid',
//           badgeClass: 'bg-[#eaf7ef] text-[#065c2d] border border-[#cdebd8]',
//           iconClass: 'bg-[#065c2d] text-white'
//         }

//       case 'PENDING':
//         return {
//           title: 'Payment Pending',
//           description: 'Your payment confirmation is being processed.',
//           badge: 'Pending',
//           badgeClass: 'bg-orange-50 text-orange-600 border border-orange-100',
//           iconClass: 'bg-orange-500 text-white'
//         }

//       default:
//         return {
//           title: 'Payment Failed',
//           description: 'The payment could not be completed.',
//           badge: 'Failed',
//           badgeClass: 'bg-red-50 text-red-600 border border-red-100',
//           iconClass: 'bg-red-500 text-white'
//         }
//     }
//   }

//   const status = getStatusConfig(payment?.payment_status)

//   const handleCopyTransaction = async () => {
//     if (!payment?.transaction_id) return

//     try {
//       await navigator.clipboard.writeText(payment.transaction_id)

//       setCopied(true)

//       setTimeout(() => {
//         setCopied(false)
//       }, 1500)
//     } catch (error) {
//       console.error('Copy failed:', error)
//     }
//   }

//   return (
//     <div className='fixed inset-0 z-[110] flex items-end justify-center'>
//       {/* Backdrop */}
//       <button
//         type='button'
//         aria-label='Close payment details'
//         onClick={onClose}
//         className='absolute inset-0 bg-black/45 backdrop-blur-[1px]'
//       />

//       {/* Bottom Sheet */}
//       <div className='relative w-full max-w-[480px] bg-[#f8f9f8] rounded-t-[28px] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col'>
//         {/* Handle */}
//         <div className='bg-white pt-3'>
//           <div className='w-10 h-1 bg-gray-300 rounded-full mx-auto' />
//         </div>

//         {/* Header */}
//         <div className='bg-white flex items-center justify-between px-5 py-4 border-b border-gray-100'>
//           <div className='flex items-center'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='w-9 h-9 -ml-2 mr-2 rounded-full flex items-center justify-center text-gray-700 active:bg-gray-100'
//             >
//               <svg
//                 className='w-5 h-5'
//                 fill='none'
//                 viewBox='0 0 24 24'
//                 stroke='currentColor'
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   d='M15 19l-7-7 7-7'
//                 />
//               </svg>
//             </button>

//             <div>
//               <h2 className='text-[17px] font-bold text-gray-900'>
//                 Payment Details
//               </h2>

//               <p className='text-[11px] text-gray-400 mt-0.5'>
//                 Transaction receipt
//               </p>
//             </div>
//           </div>

//           <span className='text-[11px] font-semibold text-gray-400'>ZYEAT</span>
//         </div>

//         {/* Content */}
//         <div className='flex-1 overflow-y-auto'>
//           {loading || !payment ? (
//             <PaymentDetailsSkeleton />
//           ) : (
//             <div className='px-4 py-4'>
//               {/* Main Receipt Card */}
//               <div className='bg-white rounded-[22px] border border-gray-100 shadow-[0px_1px_6px_rgba(0,0,0,0.08)] overflow-hidden'>
//                 {/* Status */}
//                 <div className='px-5 pt-6 pb-5 text-center'>
//                   <div
//                     className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${status.iconClass}`}
//                   >
//                     {payment.payment_status === 'SUCCESS' ? (
//                       <svg
//                         className='w-7 h-7'
//                         fill='none'
//                         viewBox='0 0 24 24'
//                         stroke='currentColor'
//                         strokeWidth={2.5}
//                       >
//                         <path
//                           strokeLinecap='round'
//                           strokeLinejoin='round'
//                           d='M5 13l4 4L19 7'
//                         />
//                       </svg>
//                     ) : payment.payment_status === 'PENDING' ? (
//                       <svg
//                         className='w-7 h-7'
//                         fill='none'
//                         viewBox='0 0 24 24'
//                         stroke='currentColor'
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap='round'
//                           strokeLinejoin='round'
//                           d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         className='w-7 h-7'
//                         fill='none'
//                         viewBox='0 0 24 24'
//                         stroke='currentColor'
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap='round'
//                           strokeLinejoin='round'
//                           d='M6 18L18 6M6 6l12 12'
//                         />
//                       </svg>
//                     )}
//                   </div>

//                   <h3 className='text-[17px] font-bold text-gray-900 mt-3'>
//                     {status.title}
//                   </h3>

//                   <p className='text-[11px] text-gray-400 mt-1'>
//                     {status.description}
//                   </p>

//                   <p className='text-[32px] leading-none font-extrabold text-gray-900 mt-5'>
//                     {formatAmount(payment.amount)}
//                   </p>

//                   <span
//                     className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-[10px] font-bold ${status.badgeClass}`}
//                   >
//                     <span className='w-1.5 h-1.5 rounded-full bg-current mr-1.5' />

//                     {status.badge}
//                   </span>
//                 </div>

//                 {/* Receipt Divider */}
//                 <div className='relative flex items-center'>
//                   <div className='absolute -left-3 w-6 h-6 rounded-full bg-[#f8f9f8]' />
//                   <div className='w-full border-t border-dashed border-gray-200 mx-4' />
//                   <div className='absolute -right-3 w-6 h-6 rounded-full bg-[#f8f9f8]' />
//                 </div>

//                 {/* Receipt Information */}
//                 <div className='px-5 py-5'>
//                   <ReceiptRow
//                     label='Order Number'
//                     value={payment.order_number || '-'}
//                     strong
//                   />

//                   <ReceiptRow
//                     label='Payment Method'
//                     value={payment.payment_method || '-'}
//                   />

//                   <ReceiptRow
//                     label='Payment Gateway'
//                     value={payment.payment_gateway || '-'}
//                   />

//                   <ReceiptRow
//                     label='Order Status'
//                     value={
//                       <StatusText status={payment.order_status}>
//                         {payment.order_status || '-'}
//                       </StatusText>
//                     }
//                   />

//                   <ReceiptRow
//                     label='Payment Date'
//                     value={formatDate(payment.paid_at)}
//                   />

//                   <ReceiptRow
//                     label='Payment Time'
//                     value={formatTime(payment.paid_at)}
//                     last
//                   />
//                 </div>
//               </div>

//               {/* Transaction ID */}
//               <div className='mt-3 bg-white rounded-2xl border border-gray-100 shadow-[0px_1px_4px_rgba(0,0,0,0.06)] p-4'>
//                 <p className='text-[11px] text-gray-400 font-medium'>
//                   Transaction ID
//                 </p>

//                 <div className='flex items-center justify-between mt-1.5'>
//                   <p className='text-[12px] font-bold text-gray-800 break-all pr-3'>
//                     {payment.transaction_id || 'Not generated'}
//                   </p>

//                   {payment.transaction_id && (
//                     <button
//                       type='button'
//                       onClick={handleCopyTransaction}
//                       className='flex-shrink-0 h-8 px-3 rounded-lg bg-[#f0f9f3] text-[#065c2d] text-[11px] font-bold active:scale-95 transition-transform'
//                     >
//                       {copied ? 'Copied' : 'Copy'}
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Security Info */}
//               <div className='flex items-center justify-center mt-4 mb-3'>
//                 <svg
//                   className='w-3.5 h-3.5 text-[#065c2d] mr-1.5'
//                   fill='none'
//                   viewBox='0 0 24 24'
//                   stroke='currentColor'
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap='round'
//                     strokeLinejoin='round'
//                     d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
//                   />
//                 </svg>

//                 <span className='text-[10px] text-gray-400'>
//                   Your payment information is secure
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Fixed Bottom Button */}
//         {!loading && payment && (
//           <div className='bg-white border-t border-gray-100 px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom))]'>
//             <button
//               type='button'
//               onClick={onClose}
//               className='w-full h-[48px] bg-[#065c2d] text-white text-[14px] font-bold rounded-xl shadow-sm active:scale-[0.99] transition-transform'
//             >
//               Done
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// const ReceiptRow = ({ label, value, strong = false, last = false }) => (
//   <div
//     className={`flex items-center justify-between py-3 ${
//       !last ? 'border-b border-gray-50' : ''
//     }`}
//   >
//     <span className='text-[12px] text-gray-400 pr-4'>{label}</span>

//     <div
//       className={`text-[12px] text-right ${
//         strong ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'
//       }`}
//     >
//       {value}
//     </div>
//   </div>
// )

// const StatusText = ({ status, children }) => {
//   const className =
//     status === 'CONFIRMED' || status === 'SUCCESS'
//       ? 'text-[#065c2d]'
//       : status === 'PENDING'
//       ? 'text-orange-600'
//       : 'text-red-500'

//   return <span className={`font-bold ${className}`}>{children}</span>
// }

// const PaymentDetailsSkeleton = () => (
//   <div className='px-4 py-4 animate-pulse'>
//     <div className='bg-white rounded-[22px] border border-gray-100 overflow-hidden'>
//       <div className='flex flex-col items-center px-5 py-7'>
//         <div className='w-14 h-14 bg-gray-200 rounded-full' />

//         <div className='w-36 h-4 bg-gray-200 rounded mt-4' />

//         <div className='w-48 h-3 bg-gray-100 rounded mt-2' />

//         <div className='w-28 h-8 bg-gray-200 rounded mt-5' />

//         <div className='w-14 h-5 bg-gray-100 rounded-full mt-3' />
//       </div>

//       <div className='border-t border-dashed border-gray-200 mx-4' />

//       <div className='p-5 space-y-5'>
//         {[1, 2, 3, 4, 5, 6].map(item => (
//           <div key={item} className='flex items-center justify-between'>
//             <div className='w-24 h-3 bg-gray-100 rounded' />
//             <div className='w-32 h-3 bg-gray-200 rounded' />
//           </div>
//         ))}
//       </div>
//     </div>

//     <div className='bg-white rounded-2xl mt-3 p-4'>
//       <div className='w-24 h-3 bg-gray-100 rounded' />

//       <div className='flex justify-between items-center mt-3'>
//         <div className='w-48 h-3 bg-gray-200 rounded' />
//         <div className='w-14 h-8 bg-gray-100 rounded-lg' />
//       </div>
//     </div>
//   </div>
// )
import React, { useEffect, useState } from 'react'

export default function PaymentDetailsModal({
  show,
  onClose,
  payment,
  loading = false
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!show) return
    const handleEscape = event => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [show, onClose])

  if (!show) return null

  const formatAmount = amount => {
    return `₹${Number(amount || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`
  }

  const formatDate = date => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = date => {
    if (!date) return '-'
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getStatusConfig = status => {
    switch (status) {
      case 'SUCCESS':
        return {
          title: 'Payment Successful',
          badge: 'Paid',
          badgeClass: 'bg-[#F4F9F5] text-[#065c2d] border-[#E3F2E6]',
          iconBg: 'bg-gradient-to-br from-[#E3F2E6] to-[#F4F9F5]',
          iconColor: 'text-[#065c2d]',
          svg: (
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
            </svg>
          )
        }
      case 'PENDING':
        return {
          title: 'Payment Pending',
          badge: 'Processing',
          badgeClass: 'bg-amber-50 text-amber-600 border-amber-100',
          iconBg: 'bg-gradient-to-br from-amber-100 to-amber-50',
          iconColor: 'text-amber-500',
          svg: (
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
          )
        }
      default:
        return {
          title: 'Payment Failed',
          badge: 'Failed',
          badgeClass: 'bg-red-50 text-red-600 border-red-100',
          iconBg: 'bg-gradient-to-br from-red-100 to-red-50',
          iconColor: 'text-red-500',
          svg: (
            <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          )
        }
    }
  }

  const status = getStatusConfig(payment?.payment_status)

  const handleCopyTransaction = async () => {
    if (!payment?.transaction_id) return
    try {
      await navigator.clipboard.writeText(payment.transaction_id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  return (
    <div className='fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4'>
      {/* Backdrop */}
      <button
        type='button'
        aria-label='Close payment details'
        onClick={onClose}
        className='absolute inset-0 bg-[#0A0A0A]/40 backdrop-blur-[3px] transition-all'
      />

      {/* Modal Container */}
      <div className='relative w-full max-w-[360px] bg-[#F7F8F7] rounded-t-[28px] sm:rounded-[24px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-slide-up mb-0 sm:mb-8'>
        
        {/* Mobile Handle */}
        <div className='sm:hidden flex justify-center pt-2.5 pb-1 absolute w-full top-0 z-10'>
          <div className='w-10 h-1 bg-gray-300/80 rounded-full' />
        </div>

        {/* Header */}
        <div className='flex items-center justify-between px-5 pt-6 pb-3 relative z-0'>
          <div>
            <h2 className='text-[18px] font-black text-gray-900 tracking-tight'>Receipt</h2>
            <p className='text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest'>
              Transaction Details
            </p>
          </div>
          <button
            type='button'
            onClick={onClose}
            className='w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200/60 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors'
          >
            <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 pb-6'>
          {loading || !payment ? (
            <PaymentDetailsSkeleton />
          ) : (
            <div className='space-y-4'>
              {/* Unified Digital Ticket */}
              <div className='bg-white rounded-[20px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 relative overflow-hidden'>
                
                {/* Top Section: Status & Amount */}
                <div className='px-5 pt-6 pb-5 text-center'>
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3.5 ${status.iconBg} ${status.iconColor} shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)]`}>
                    {status.svg}
                  </div>

                  <h3 className='text-[16px] font-black text-gray-900 tracking-tight'>
                    {status.title}
                  </h3>

                  <div className='flex items-center justify-center mt-3 mb-1'>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[9px] uppercase tracking-widest font-black border ${status.badgeClass}`}>
                      {status.badge}
                    </span>
                  </div>

                  <p className='text-[28px] leading-none font-black text-gray-900 mt-3 tracking-tight'>
                    {formatAmount(payment.amount)}
                  </p>
                </div>

                {/* Ticket Cutout Divider */}
                <div className='relative flex items-center h-4 opacity-70'>
                  <div className='absolute -left-2 w-4 h-4 rounded-full bg-[#F7F8F7] shadow-[inset_-2px_0_4px_rgba(0,0,0,0.02)]' />
                  <div className='w-full border-t border-dashed border-gray-200 mx-3' />
                  <div className='absolute -right-2 w-4 h-4 rounded-full bg-[#F7F8F7] shadow-[inset_2px_0_4px_rgba(0,0,0,0.02)]' />
                </div>

                {/* Bottom Section: Details Grid */}
                <div className='px-5 py-5 space-y-0.5 bg-gradient-to-b from-white to-gray-50/30'>
                  <ReceiptRow label='Order No.' value={payment.order_number || '-'} />
                  <ReceiptRow label='Method' value={payment.payment_method || '-'} />
                  <ReceiptRow label='Gateway' value={payment.payment_gateway || '-'} />
                  <ReceiptRow 
                    label='Status' 
                    value={
                      <span className={payment.order_status === 'CONFIRMED' || payment.order_status === 'SUCCESS' ? 'text-[#065c2d]' : 'text-gray-900'}>
                        {payment.order_status || '-'}
                      </span>
                    } 
                  />
                  <ReceiptRow label='Date' value={formatDate(payment.paid_at)} />
                  <ReceiptRow label='Time' value={formatTime(payment.paid_at)} />
                  
                  {/* Transaction ID integrated into the ticket */}
                  <div className='pt-3 mt-3 border-t border-gray-100/60 flex items-center justify-between'>
                    <div className='min-w-0 pr-3'>
                      <span className='text-[9px] uppercase tracking-widest font-bold text-gray-400'>Txn ID</span>
                      <p className='text-[11px] font-black text-gray-800 mt-0.5 truncate'>
                        {payment.transaction_id || 'Not generated'}
                      </p>
                    </div>
                    {payment.transaction_id && (
                      <button
                        type='button'
                        onClick={handleCopyTransaction}
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                          copied 
                            ? 'bg-[#065c2d] text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title="Copy Transaction ID"
                      >
                        {copied ? (
                          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                          </svg>
                        ) : (
                          <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className='flex items-center justify-center pt-2 mb-1'>
                <div className='flex items-center gap-1.5'>
                  <svg className='w-3 h-3 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                  </svg>
                  <span className='text-[9px] font-bold text-gray-400 uppercase tracking-widest'>
                    Secure 256-bit SSL
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ReceiptRow = ({ label, value }) => (
  <div className='flex items-center justify-between py-1.5'>
    <span className='text-[10px] uppercase tracking-widest font-semibold text-gray-400'>{label}</span>
    <div className='text-[12px] font-bold text-gray-900 text-right'>{value}</div>
  </div>
)

const PaymentDetailsSkeleton = () => (
  <div className='animate-pulse'>
    <div className='bg-white rounded-[20px] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100/50 overflow-hidden'>
      <div className='flex flex-col items-center px-5 pt-6 pb-5'>
        <div className='w-12 h-12 bg-gray-100 rounded-xl' />
        <div className='w-32 h-4 bg-gray-200 rounded mt-4' />
        <div className='w-16 h-4 bg-gray-100 rounded mt-3' />
        <div className='w-28 h-8 bg-gray-200 rounded mt-4' />
      </div>
      <div className='border-t border-dashed border-gray-100 mx-4' />
      <div className='px-5 py-5 space-y-3.5 bg-gray-50/30'>
        {[1, 2, 3, 4, 5].map(item => (
          <div key={item} className='flex items-center justify-between'>
            <div className='w-20 h-3 bg-gray-200 rounded' />
            <div className='w-24 h-3 bg-gray-300 rounded' />
          </div>
        ))}
        <div className='pt-3 mt-3 border-t border-gray-100/60 flex justify-between'>
          <div className='w-32 h-3 bg-gray-200 rounded' />
          <div className='w-8 h-8 bg-gray-100 rounded-lg' />
        </div>
      </div>
    </div>
  </div>
)