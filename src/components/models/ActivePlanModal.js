import React from 'react'

const formatDate = dateString => {
  if (!dateString) return '-'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  }).format(new Date(dateString))
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
} 

export default function ActivePlanModal ({
  show,
  onClose,
  plan,
  loading,
  error
}) {
  if (!show) return null
  console.log('Active Plan Modal:', { show, plan, loading, error })
  const planData = plan?.data ?? null
  console.log('PLAN RESPONSE:', plan)
  console.log('PLAN DATA:', planData)
  return (
    <div className='fixed inset-0 z-[9999] flex items-end justify-center'>
      {/* Background Overlay */}
      <button
        type='button'
        aria-label='Close active plan modal'
        onClick={onClose}
        className='absolute inset-0 bg-black/50'
      />

      {/* Bottom Sheet */}
      <div className='relative w-full max-w-lg bg-[#fcfcfc] rounded-t-[28px] shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up'>
        {/* Drag Handle */}
        <div className='sticky top-0 z-10 bg-[#fcfcfc] pt-3 pb-2 rounded-t-[28px]'>
          <div className='w-12 h-1.5 bg-gray-300 rounded-full mx-auto' />
        </div>

        {/* Loading */}
        {loading && (
          <div className='flex flex-col items-center justify-center py-20'>
            <div className='w-10 h-10 border-4 border-gray-200 border-t-[#065c2d] rounded-full animate-spin' />
            <p className='text-sm text-gray-500 mt-4'>Loading active plan...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className='px-5 py-16 text-center'>
            <div className='w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3'>
              <svg
                className='w-7 h-7 text-red-500'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <p className='text-gray-800 font-bold'>Unable to load plan</p>
            <p className='text-sm text-gray-500 mt-1'>{error}</p>
            <button
              onClick={onClose}
              className='mt-5 px-6 py-2.5 bg-[#065c2d] text-white rounded-xl font-semibold'
            >
              Close
            </button>
          </div>
        )}

        {/* No Active Plan (Triggers when planData is null) */}
        {!loading && !error && !planData && (
          <div className='px-5 py-16 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CalendarIcon className='w-8 h-8 text-gray-400' />
            </div>
            <h3 className='text-lg font-bold text-gray-900'>No Active Plan</h3>
            <p className='text-sm text-gray-500 mt-1'>
              You do not have an active subscription right now.
            </p>
            <button
              onClick={onClose}
              className='mt-5 px-6 py-2.5 bg-[#065c2d] text-white rounded-xl font-semibold'
            >
              Close
            </button>
          </div>
        )}

        {/* Active Plan Data (Triggers ONLY when planData actually has data) */}
        {!loading && !error && planData && (
          <div className='px-4 pb-8'>
            {/* Header */}
            <div className='flex items-center justify-between mb-4'>
              <div>
                <p className='text-[12px] text-gray-500 font-medium'>
                  Your Subscription
                </p>
                <h2 className='text-[22px] font-bold text-gray-900'>
                  Active Plan
                </h2>
              </div>
              <button
                onClick={onClose}
                className='w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm'
              >
                <svg
                  className='w-5 h-5 text-gray-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            {/* Main Green Plan Card */}
            <div className='relative overflow-hidden bg-[#065c2d] rounded-3xl p-5 text-white shadow-lg'>
              <div className='absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/5' />
              <div className='absolute -right-5 bottom-[-60px] w-44 h-44 rounded-full bg-white/5' />
              <div className='relative'>
                <div className='flex items-start justify-between'>
                  <div>
                    <span className='inline-flex items-center bg-white/15 text-[11px] font-bold px-3 py-1 rounded-full'>
                      ● ACTIVE
                    </span>
                    <h3 className='text-2xl font-bold mt-3'>
                      {planData.plan_name || 'Active Plan'}
                    </h3>
                    <p className='text-white/70 text-sm mt-1'>
                      Your healthy meal subscription
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center'>
                    <CalendarIcon className='w-6 h-6 text-white' />
                  </div>
                </div>

                <div className='h-px bg-white/15 my-5' />

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-[11px] text-white/60'>Start Date</p>
                    <p className='font-bold text-sm mt-1'>
                      {formatDate(planData.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className='text-[11px] text-white/60'>End Date</p>
                    <p className='font-bold text-sm mt-1'>
                      {formatDate(planData.end_date)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className='bg-white border border-gray-100 rounded-2xl p-4 mt-3 shadow-[0px_1px_4px_rgba(0,0,0,0.12)]'>
              <div className='flex items-center'>
                <div className='w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center'>
                  <CalendarIcon className='w-5 h-5 text-[#065c2d]' />
                </div>
                <div className='ml-3'>
                  <p className='text-[11px] text-gray-500'>Plan Duration</p>
                  <p className='text-[14px] font-bold text-gray-900'>
                    {formatDateRange(planData.start_date, planData.end_date)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Cards */}
            <div className='grid grid-cols-3 gap-2 mt-3'>
              <ProgressCard
                value={planData.total_days ?? 0}
                label='Total Days'
              />
              <ProgressCard
                value={planData.completed_days ?? 0}
                label='Completed'
              />
              <ProgressCard
                value={planData.remaining_days ?? 0}
                label='Remaining'
              />
            </div>

            {/* Subscription Details */}
            <div className='bg-white border border-gray-100 rounded-2xl mt-3 overflow-hidden shadow-[0px_1px_4px_rgba(0,0,0,0.12)]'>
              <div className='px-4 py-3 border-b border-gray-100'>
                <h3 className='text-[14px] font-bold text-gray-900'>
                  Subscription Details
                </h3>
              </div>
              <DetailRow label='Plan' value={planData.plan_name || '-'} />
              <DetailRow
                label='Subscription ID'
                value={
                  planData.subscription_no ||
                  `SUB-${String(planData.subscription_id).padStart(6, '0')}`
                }
              />
              <DetailRow
                label='Order ID'
                value={`ORD-${String(planData.order_id).padStart(6, '0')}`}
              />
              <DetailRow
                label='Status'
                value={planData.status}
                status
                hideBorder
              />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className='w-full mt-4 py-3.5 bg-[#065c2d] text-white font-bold rounded-2xl active:scale-[0.99] transition-transform'
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const ProgressCard = ({ value, label }) => (
  <div className='bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-[0px_1px_4px_rgba(0,0,0,0.10)]'>
    <p className='text-xl font-bold text-[#065c2d]'>{value}</p>

    <p className='text-[10px] text-gray-500 mt-1'>{label}</p>
  </div>
)

const DetailRow = ({ label, value, status, hideBorder }) => (
  <div
    className={`flex items-center justify-between px-4 py-3 ${
      !hideBorder ? 'border-b border-gray-50' : ''
    }`}
  >
    <span className='text-[13px] text-gray-500'>{label}</span>

    {status ? (
      <span className='text-[11px] font-bold bg-green-50 text-[#065c2d] px-2.5 py-1 rounded-full'>
        {value}
      </span>
    ) : (
      <span className='text-[13px] font-bold text-gray-800'>{value}</span>
    )}
  </div>
)

const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
    strokeWidth={1.5}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
    />
  </svg>
)
