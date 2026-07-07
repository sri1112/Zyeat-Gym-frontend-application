import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import OnboardingModal from './models/OnboardingModal'
import profileService from '../services/profileService'
import ActivePlanModal from './models/ActivePlanModal'
import subscriptionService from '../services/subscriptionService'
import PaymentsModal from './models/PaymentsModal'
import PaymentDetailsModal from './models/PaymentDetailsModal'
import paymentService from '../services/paymentService'

export default function Profile () {
  const { user, checkAuth, logout } = useAuth()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)
  const [showActivePlanModal, setShowActivePlanModal] = useState(false)
  const [activePlan, setActivePlan] = useState(null)
  const [activePlanLoading, setActivePlanLoading] = useState(false)
  const [activePlanError, setActivePlanError] = useState('')
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)

  const [payments, setPayments] = useState([])
  const [paymentDetails, setPaymentDetails] = useState(null)

  const [loadingPayments, setLoadingPayments] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Incomplete profile if missing name OR diet
  const isProfileIncomplete = !user?.name || !user?.diet

  // Auto-trigger modal on mount if profile is incomplete
  useEffect(() => {
    if (user && isProfileIncomplete) {
      setShowModal(true)
    }
  }, [user, isProfileIncomplete])

  // Handle saving the profile data
  const handleSaveProfile = async formData => {
    try {
      await profileService.updateProfile(formData)
      await checkAuth()
      setShowModal(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleLogout = async e => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await logout()
        navigate('/')
      } catch (err) {
        alert(err.message)
      }
    }
  }
  // const handleOpenActivePlan = async () => {
  //   try {
  //     setShowActivePlanModal(true)
  //     setActivePlanLoading(true)
  //     setActivePlanError('')

  //     const data = await subscriptionService.getActiveSubscription()

  //     setActivePlan(data)
  //   } catch (error) {
  //     console.error('Active Plan Error:', error)

  //     setActivePlan(null)
  //     setActivePlanError(error.message || 'Failed to load active plan')
  //   } finally {
  //     setActivePlanLoading(false)
  //   }
  // }
  const loadActivePlan = async () => {
    try {
      setActivePlanLoading(true)
      setActivePlanError('')

      const response = await subscriptionService.getActiveSubscription()

      setActivePlan(response)
    } catch (error) {
      console.error('Active Plan Error:', error)
      setActivePlan(null)
      setActivePlanError(error.message || 'Failed to load active plan')
    } finally {
      setActivePlanLoading(false)
    }
  }

  useEffect(() => {
    loadActivePlan()
  }, [])

  const handleOpenActivePlan = () => {
    setShowActivePlanModal(true)
  }
  console.log('Active Plan:', activePlan)
  const formatPlanDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'No Active Plan'

    const start = new Date(startDate)
    const end = new Date(endDate)

    const startDay = start.toLocaleDateString('en-IN', {
      day: '2-digit'
    })

    const endFormatted = end.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })

    return `${startDay} - ${endFormatted}`
  }

  const handleOpenPayments = async () => {
    try {
      setShowPaymentsModal(true)
      setLoadingPayments(true)

      const response = await paymentService.getPayments()

      setPayments(response.data || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingPayments(false)
    }
  }
  const handleOpenPaymentDetails = async paymentId => {
    try {
      setLoadingDetails(true)

      const response = await paymentService.getPaymentById(paymentId)

      setPaymentDetails(response.data)

      setShowPaymentDetails(true)
    } catch (err) {
      console.log(err)
    } finally {
      setLoadingDetails(false)
    }
  }
  const TrashIcon = ({ className }) => (
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
        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      />
    </svg>
  )

  return (
    <div className='bg-[#fcfcfc] min-h-screen pb-24 font-sans text-gray-800'>
      {/* --- ONBOARDING MODAL --- */}
      <OnboardingModal
        show={showModal}
        isMandatory={isProfileIncomplete}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProfile}
        currentUser={user} // Pre-fill the form if they have some data
      />
      <ActivePlanModal
        show={showActivePlanModal}
        onClose={() => setShowActivePlanModal(false)}
        plan={activePlan}
        loading={activePlanLoading}
        error={activePlanError}
      />
      <PaymentsModal
        show={showPaymentsModal}
        onClose={() => setShowPaymentsModal(false)}
        payments={payments}
        loading={loadingPayments}
        onSelectPayment={handleOpenPaymentDetails}
      />

      <PaymentDetailsModal
        show={showPaymentDetails}
        onClose={() => setShowPaymentDetails(false)}
        payment={paymentDetails}
        loading={loadingDetails}
      />

      {/* --- Profile Header Section --- */}
      <div className='flex items-center px-5 pt-20 pb-3'>
        <div
          className='relative cursor-pointer'
          onClick={() => setShowModal(true)}
        >
          {/* Dynamic Initial Avatar if no image exists */}
          <div className='w-20 h-20 rounded-full flex items-center justify-center bg-[#065c2d] text-white text-3xl font-bold shadow-sm ring-2 ring-white'>
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>

          {/* Camera Icon Overlay (Triggers Edit Modal) */}
          <button className='absolute bottom-0 right-0 bg-[#065c2d] text-white p-1.5 rounded-full border-2 border-white shadow-sm'>
            <svg
              className='w-3.5 h-3.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
              />
            </svg>
          </button>
        </div>

        <div className='ml-4'>
          <h2 className='text-[19px] font-bold text-gray-900 leading-tight'>
            {user?.name || 'New User'}
          </h2>
          <p className='text-[13px] text-gray-500 mt-0.5'>
            +91 {user?.mobile || 'N/A'}
          </p>
          <p className='text-[13px] text-gray-500'>
            {user?.email || 'user@example.com'}
          </p>

          <div className='inline-flex items-center mt-1.5 bg-[#f0f9f3] text-[#065c2d] text-[12px] font-semibold px-2.5 py-0.5 rounded-full border border-green-100'>
            <span className='mr-1 text-sm'>🌿</span>
            {user?.diet === 'Veg'
              ? 'Pure Veg Preference'
              : 'Eat fresh, live healthy!'}
          </div>
        </div>
      </div>

      {/* --- Active Plan Card --- */}
      <div className='px-4 mb-2 '>
        <div className='bg-[#f9fdfa] border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-[0px_1px_4px_rgba(0,0,0,0.16)]'>
          <div className='flex flex-col'>
            <span className='text-[12px] text-gray-500 font-medium'>
              Active Plan
            </span>
            <button
              type='button'
              onClick={handleOpenActivePlan}
              className='text-[#065c2d] font-bold text-[12px] flex items-center mt-0.5 hover:underline'
            >
              {activePlanLoading
                ? 'Loading...'
                : activePlan?.data?.plan_name || 'No Active Plan'}

              <svg
                className='w-3.5 h-3.5 ml-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>
          </div>

          <div className='w-px h-10 bg-gray-200'></div>

          <div className='flex flex-col items-start'>
            <div className='flex items-center text-gray-800'>
              <svg
                className='w-4 h-4 text-[#065c2d] mr-1.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>

              <span className='text-[13px] font-bold'>
                {formatPlanDuration(
                  activePlan?.data.start_date,
                  activePlan?.data.end_date
                )}
              </span>
            </div>

            <span className='text-[11px] text-gray-500 ml-5.5 mt-0.5'>
              Plan Duration
            </span>
          </div>

          <div className='w-px h-10 bg-gray-200'></div>

          <div className='flex flex-col items-start pr-2'>
            <div className='flex items-center text-gray-800'>
              <svg
                className='w-4 h-4 text-[#065c2d] mr-1.5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
                />
              </svg>
              <span className='text-[13px] font-bold'>
                ₹{activePlan?.data?.total_paid || '0.00'}
              </span>
            </div>
            <span className='text-[11px] text-gray-500 ml-5.5 mt-0.5'>
              Total Paid
            </span>
          </div>
        </div>
      </div>

      {/* --- Action Grid Buttons --- */}
      <div className='px-4 mb-2 grid grid-cols-4 gap-2 grid-shadow-[0px_1px_4px_rgba(0,0,0,0.16)]'>
        <ActionButton
          onClick={handleOpenActivePlan}
          icon={CalendarIcon}
          label='Active Plan'
          active
        />
        <ActionButton to='/orders' icon={BagIcon} label='Order History' />
        <ActionButton
          onClick={handleOpenPayments}
          icon={CardIcon}
          label='Payments'
        />
        <ActionButton to='/address' icon={LocationIcon} label='Address' />
      </div>

      {/* --- Account Section --- */}
      <div className='px-4 mb-2'>
        <h3 className='text-[14px] font-bold text-gray-500 mb-2 px-1'>
          Account
        </h3>
        <div className='bg-white border border-gray-100 rounded-2xl shadow-[0px_1px_4px_rgba(0,0,0,0.16)] overflow-hidden '>
          <ListRow
            onClick={() => setShowModal(true)}
            icon={UserIcon}
            label='Personal Information'
          />
          <ListRow
            to='/health'
            icon={HeartbeatIcon}
            label='Health Information'
          />
          <ListRow
            to='/preferences'
            icon={LeafIcon}
            label='Dietary Preferences'
          />
          <ListRow
            to='/allergies'
            icon={ShieldCheckIcon}
            label='Allergies / Restrictions'
            hideBorder
          />
          <ListRow
            to='/delete-account'
            icon={TrashIcon}
            label='Delete Account'
            isLogout={true}
            hideBorder
          />
        </div>
      </div>

      {/* --- Support & Others Section --- */}
      <div className='px-4 '>
        <h3 className='text-[14px] font-bold text-gray-500 mb-2 px-1'>
          Support & Others
        </h3>
        <div className='bg-white border border-gray-100 rounded-2xl shadow-[0px_1px_4px_rgba(0,0,0,0.16)] overflow-hidden'>
          <ListRow to='/help' icon={HelpIcon} label='Help & FAQ' />
          <ListRow to='/support' icon={HeadsetIcon} label='Contact Support' />
          <ListRow
            to='/refer'
            icon={GiftIcon}
            label='Refer & Earn'
            badge={
              <span className='bg-green-50 text-[#065c2d] text-[10px] font-bold px-2 py-1 rounded-md'>
                Earn ₹100
              </span>
            }
          />
          <ListRow to='/terms' icon={DocumentIcon} label='Terms & Conditions' />
          <ListRow to='/privacy' icon={ShieldIcon} label='Privacy Policy' />

          {/* Dynamic Logout Row hooked to your function */}
          <ListRow
            onClick={handleLogout}
            icon={LogoutIcon}
            label='Logout'
            isLogout
            hideBorder
          />
        </div>
      </div>
    </div>
  )
}

// --- Sub-components adapted to support your Links and Clicks --- //

const ActionButton = ({ to, onClick, icon: Icon, label, active }) => {
  const content = (
    <>
      <Icon
        className={`w-6 h-6 mb-2 ${
          active ? 'text-[#065c2d]' : 'text-gray-600'
        }`}
      />

      <span
        className={`text-[11px] text-center leading-tight ${
          active ? 'text-[#065c2d] font-bold' : 'text-gray-600 font-medium'
        }`}
      >
        {label}
      </span>
    </>
  )

  const className =
    'flex flex-col items-center justify-center p-3 border border-gray-100 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-95 transition-transform h-[85px]'

  if (onClick) {
    return (
      <button type='button' onClick={onClick} className={className}>
        {content}
      </button>
    )
  }

  return (
    <Link to={to || '#'} className={className}>
      {content}
    </Link>
  )
}

const ListRow = ({
  to,
  onClick,
  icon: Icon,
  label,
  badge,
  isLogout,
  hideBorder
}) => {
  // If an onClick is passed (like for Logout or Edit Profile), use a button instead of a Link
  const Wrapper = onClick ? 'button' : Link
  const props = onClick
    ? { onClick, className: 'w-full text-left' }
    : { to: to || '#' }

  return (
    <Wrapper {...props}>
      <div
        className={`flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors ${
          !hideBorder ? 'border-b border-gray-50' : ''
        }`}
      >
        <div className='flex items-center'>
          <Icon
            className={`w-5 h-5 mr-3 ${
              isLogout ? 'text-red-500' : 'text-[#065c2d]'
            }`}
          />
          <span
            className={`text-[14px] font-semibold ${
              isLogout ? 'text-red-500' : 'text-gray-700'
            }`}
          >
            {label}
          </span>
        </div>
        <div className='flex items-center'>
          {badge && <div className='mr-2'>{badge}</div>}
          <svg
            className='w-4 h-4 text-gray-300'
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
      </div>
    </Wrapper>
  )
}

// --- Reusable SVG Icons tailored to match the design --- //
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
const BagIcon = ({ className }) => (
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
      d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
    />
  </svg>
)
const CardIcon = ({ className }) => (
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
      d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
    />
  </svg>
)
const LocationIcon = ({ className }) => (
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
      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
    />
  </svg>
)
const UserIcon = ({ className }) => (
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
      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    />
  </svg>
)
const HeartbeatIcon = ({ className }) => (
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
      d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M9 12h2l1-3 2 6 1-3h2'
    />
  </svg>
)
const LeafIcon = ({ className }) => (
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
      d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
    />
  </svg>
)
const ShieldCheckIcon = ({ className }) => (
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
      d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
    />
  </svg>
)
const HelpIcon = ({ className }) => (
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
      d='M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    />
  </svg>
)
const HeadsetIcon = ({ className }) => (
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
      d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
    />
  </svg>
)
const GiftIcon = ({ className }) => (
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
      d='M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7'
    />
  </svg>
)
const DocumentIcon = ({ className }) => (
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
      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
    />
  </svg>
)
const ShieldIcon = ({ className }) => (
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
      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
    />
  </svg>
)
const LogoutIcon = ({ className }) => (
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
      d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
    />
  </svg>
)
