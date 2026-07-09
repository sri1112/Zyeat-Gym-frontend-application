import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Local assets
import bodyBuilding from '../assests/body_build.png'
import leanMuscle from '../assests/lean.png'
import weightLoss from '../assests/wl.png'
import strength from '../assests/st.png'
import banner from '../assests/home-banner.png'
import choose from '../assests/choose.png'
import deliver from '../assests/deliver.png'
import meal from '../assests/meal.png'
import food1 from '../assests/food3.png'
import food2 from '../assests/food4.png'
import AddToCartModal from './AddToCartModal'

// Fallback image in case the database image URL is missing
import fallbackFood from '../assests/food2.jpeg'
import planService from '../services/planService'
import cartService from '../services/cartService'
import productService from '../services/productService'

export default function Home () {
  const placeholderOptions = [
    'fresh produce...',
    'Boiled Egg...',
    'Chicken Breast...',
    'Brown Rice...'
  ]

  const [placeholder, setPlaceholder] = useState(placeholderOptions[0])
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const featuredProducts = dbProducts.slice(0, 8)
  const navigate = useNavigate()

  // Category State (Matching the new UI)
  const categories = ['All Meals', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']
  const [activeCategory, setActiveCategory] = useState('All Meals')
  const [plans, setPlans] = useState([])
  const [activePlanId, setActivePlanId] = useState(null)
  const [loadingPlans, setLoadingPlans] = useState(true)
  const [cartItems, setCartItems] = useState([])
  const [selectedProductForModal, setSelectedProductForModal] = useState(null)

  // Rotating search placeholder
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % placeholderOptions.length
      setPlaceholder(placeholderOptions[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Cart Function
  const fetchCart = async () => {
    try {
      const response = await cartService.getCart()

      // Based on your JSON, the items are at response.cart.items
      if (response && response.cart && Array.isArray(response.cart.items)) {
        setCartItems(response.cart.items)
      } else {
        setCartItems([]) // Ensure it's an empty array if no items
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartItems([])
    }
  }

  // Fetch initial data (Products, Plans, and Cart)
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Fetch Products using productService
        const prodData = await productService.getProducts()
        if (prodData.success) {
          setDbProducts(prodData.products || prodData.data || [])
        }

        // 2. Fetch Plans using planService
        const planRes = await planService.getPlans()
        const fetchedPlans = planRes.plans || planRes.data || planRes

        if (Array.isArray(fetchedPlans)) {
          setPlans(fetchedPlans)
          if (fetchedPlans.length > 0) {
            // Consistent ID selection logic
            setActivePlanId(
              fetchedPlans[0].plan_id ||
                fetchedPlans[0]._id ||
                fetchedPlans[0].id
            )
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
        setLoadingPlans(false)
      }
    }

    loadAllData()
    fetchCart() // Fetch cart on mount
  }, [])

  return (
    <div className='pt-16 pb-24 bg-white flex-grow overflow-y-auto scrollbar-hide px-3'>
      {/* --- Hero Text --- */}
      <div className='mt-0 mb-3'>
        <h2 className='text-[18px] text-gray-800 font-medium leading-tight inline'>
          Eat fresh,{' '}
          <span className='text-[14px] text-[#065c2d] font-bold'>
            live healthy.
          </span>
          <span className='text-xl ml-1'>🌿</span>
        </h2>
      </div>
      {/* --- Search Bar --- */}
      <div className='mb-0 flex items-center bg-gray-50/50 border border-gray-100 rounded-2xl p-3.5 shadow-[0px_1px_4px_rgba(0,0,0,0.16)]'>
        <svg
          className='h-5 w-5 text-gray-400 mr-3'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
        <input
          type='text'
          placeholder={`Search ${placeholder}`}
          className='flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none'
        />
        {/* Scan Icon matching UI */}
        <button className='text-[#065c2d]'>
          <svg
            className='w-6 h-6'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth='1.5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 8V6a2 2 0 012-2h2M3 16v2a2 2 0 002 2h2M21 8V6a2 2 0 00-2-2h-2M21 16v2a2 2 0 01-2 2h-2'
            />
            <path strokeLinecap='round' strokeLinejoin='round' d='M7 12h10' />
          </svg>
        </button>
      </div>

      {/* --- How ZyEat Works? Section --- */}
      <div className='mb-2 bg-gray-50/50 rounded-2xl p-2 shadow-[0px_1px_4px_rgba(0,0,0,0.16)] mt-3'>
        <div className='flex items-center justify-center mb-6 text-center space-x-3'>
          <div className='h-0.5 w-6 bg-orange-400 rounded-full'></div>
          <h4 className='text-[16px] font-bold text-gray-900'>
            How ZyEat Works?
          </h4>
          <div className='h-0.5 w-6 bg-orange-400 rounded-full'></div>
        </div>
        <div className='flex justify-between items-start text-center space-x-2'>
          <div className='w-1/3 flex flex-col items-center'>
            <div className='mb-1'>
              <img
                src={choose}
                alt='Choose a Plan'
                className='w-8 h-8 object-contain'
              />
            </div>
            <p className='text-[11px] font-bold text-gray-900'>Choose a Plan</p>
            <p className='text-[9px] text-gray-500 mt-0.5'>3-Days / Weekly</p>
          </div>

          <div className='w-1/3 flex flex-col items-center'>
            <div className='mb-1'>
              <img
                src={meal}
                alt='Select Meals'
                className='w-8 h-8 object-contain'
              />
            </div>
            <p className='text-[11px] font-bold text-gray-900'>Select Meals</p>
            <p className='text-[9px] text-gray-500 mt-0.5'>Post-Workout</p>
          </div>

          <div className='w-1/3 flex flex-col items-center'>
            <div className='mb-1'>
              <img
                src={deliver}
                alt='Delivered to Gym'
                className='w-8 h-8 object-contain'
              />
            </div>
            <p className='text-[11px] font-bold text-gray-900'>
              Delivered to Gym
            </p>
            <p className='text-[9px] text-gray-500 mt-0.5'>Daily to Your Gym</p>
          </div>
        </div>
      </div>

      {/* --- Choose a Plan Section --- */}
      <div className='mb-2 mt-8'>
        {/* Header and Compare Button */}
        <div className='flex justify-between items-center mb-2 px-1'>
          <h3 className='text-[17px] font-bold text-gray-900'>Choose a Plan</h3>
          <button className='flex items-center text-[13px] font-semibold text-[#065c2d] hover:underline'>
            Compare Plans
            {/* Updated SVG to match the overlapping "Copy/Compare" squares in the design */}
            <svg
              className='w-4 h-4 ml-1.5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <rect x='9' y='9' width='11' height='11' rx='2' ry='2'></rect>
              <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'></path>
            </svg>
          </button>
        </div>

        <div className='flex space-x-4 justify-between pb-2'>
          {loadingPlans ? (
            <div className='text-xs font-semibold text-gray-500 py-4 px-2'>
              Loading plans...
            </div>
          ) : (
            // STRICTLY LIMIT TO 2 ITEMS USING .slice(0, 2)
            plans.slice(0, 2).map((plan, index) => {
              const isActive = activePlanId === plan.plan_id

              // Fallback image: food1 for the first card, food2 for the second
              const fallbackImage = index === 0 ? food1 : food2

              return (
                <div
                  key={plan.plan_id}
                  onClick={() => setActivePlanId(plan.plan_id)}
                  className={`w-full rounded-xl p-4 relative overflow-hidden h-[98px] cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-[#F2FBF2] border-[1.5px] border-[#065c2d]'
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  {/* Top Row: Title, Subtitle, Radio Button */}
                  <div className='flex justify-between items-start z-10 relative'>
                    <div className='max-w-[75%]'>
                      <h4 className='font-bold text-gray-900 text-[14px]'>
                        {plan.plan_name || '3 Days Plan'}
                      </h4>
                      <p className='text-[11px] text-gray-500 mt-0.5 leading-snug'>
                        {plan.description || 'Starter Plan'}
                      </p>
                    </div>

                    {/* Dynamic Radio Button */}
                    <div
                      className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center bg-transparent shrink-0 ${
                        isActive ? 'border-[#065c2d]' : 'border-gray-300'
                      }`}
                    >
                      {isActive && (
                        <div className='w-2.5 h-2.5 bg-[#065c2d] rounded-full'></div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Right: Plan Image */}
                  <img
                    src={plan.imageUrl || fallbackImage}
                    className={`absolute -bottom-4 -right-3 w-[80px] h-[80px] object-contain transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-90'
                    }`}
                    alt={plan.plan_name || 'Meal Bowl'}
                  />
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* --- All Meals / Categories Section --- */}
      <h3 className='text-[17px] font-bold text-gray-900 mb-2'>All Meals</h3>
      <div className='flex space-x-2 overflow-x-auto scrollbar-hide mb-6 pb-1'>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-lg text-[13px] font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-[#065c2d] text-white'
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* --- Dynamic Product Grid --- */}
      {loading ? (
        <div className='text-center py-10 text-gray-500 font-bold'>
          Loading fresh meals...
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-3 pb-4'>
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              cartItems={cartItems}
              refreshCart={fetchCart}
              onOpenModal={setSelectedProductForModal}
            />
          ))}
        </div>
      )}
      <div className='flex justify-center items-center'>
        <Link
          to='/products'
          className='text-[13px] font-semibold text-[#065c2d] hover:underline'
        >
          See All
        </Link>
      </div>
      {selectedProductForModal && (
        <AddToCartModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
          onConfirm={({ quantity, unit, time }) => {
            const selectedPlan = plans.find(plan => {
              const planId = plan.plan_id || plan.id || plan._id

              return String(planId) === String(activePlanId)
            })

            if (!selectedPlan) {
              alert('Please select a plan first.')
              return
            }

            navigate('/plans', {
              state: {
                product: selectedProductForModal,
                plan: selectedPlan,
                quantity,
                unit,
                time
              }
            })

            setSelectedProductForModal(null)
          }}
        />
      )}
    </div>
  )
}

// 1. Updated ProductCard Component matching the new rounded UI layout
const ProductCard = ({ product, cartItems, refreshCart, onOpenModal }) => {
  const {
    id,
    _id,
    name,
    imageUrl,
    price,
    description,
    calories,
    protein,
    carbs,
    fats
  } = product || {}
  const safeId = id || _id

  // 1. Check if this product is in the cart
  const cartItem = cartItems?.find(
    item => item.productId === safeId || item.product_id === safeId
  )
  const isInCart = !!cartItem
  const displayQuantity = cartItem ? cartItem.quantity : 0

  const handleAdd = e => {
    e.preventDefault()
    e.stopPropagation()

    onOpenModal(product)
  }

  // 3. Increment handler
  const handleIncrement = async e => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await cartService.updateQuantity({
        productId: safeId,
        quantity: displayQuantity + 1
      })

      await refreshCart()
    } catch (err) {
      console.error('Failed to increment:', err)
    }
  }

  // 4. Decrement handler
  const handleDecrement = async e => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (displayQuantity > 1) {
        await cartService.updateQuantity({
          productId: safeId,
          quantity: displayQuantity - 1
        })
      } else {
        const mappingId = cartItem.mappingId || cartItem._id || cartItem.id

        await cartService.removeItem(mappingId)
      }

      await refreshCart()
    } catch (err) {
      console.error('Failed to decrement:', err)
    }
  }

  return (
    <Link
      to={`/product-details/${safeId}`}
      className='flex justify-between gap-3 sm:gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 transition-all mb-2'
    >
      {/* Left Content */}
      <div className='flex-1 min-w-0'>
        {/* Name */}
        <h3 className='font-bold text-[18px] sm:text-[24px] text-gray-900 leading-tight'>
          {name || 'Sesame Seeds'}
        </h3>

        {/* Price */}
        <p className='mt-1 text-[18px] sm:text-[32px] font-bold text-black'>
          ₹{price || '6.00'}
        </p>

        {/* Nutrition */}
        <div className='flex flex-wrap gap-1.5 sm:gap-2 mt-2'>
          <span className='px-2 sm:px-3 py-1 rounded-lg bg-green-50 text-green-700 text-[10px] sm:text-sm font-semibold'>
            {calories ? `${calories} kcal` : '0 kcal'}
          </span>

          <span className='px-2 sm:px-3 py-1 rounded-lg bg-sky-50 text-sky-700 text-[10px] sm:text-sm font-semibold'>
            {protein ? `${protein}g P` : '0g P'}
          </span>

          <span className='px-2 sm:px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-[10px] sm:text-sm font-semibold'>
            {carbs ? `${carbs}g C` : '0g C'}
          </span>

          <span className='px-2 sm:px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] sm:text-sm font-semibold'>
            {fats ? `${fats}g F` : '0g F'}
          </span>
        </div>

        {/* Description */}
        <p className='mt-3 text-gray-500 text-[13px] sm:text-base leading-6 line-clamp-3 sm:line-clamp-none'>
          {description || 'No description available'}
        </p>
      </div>

      {/* Image */}
      <div className='relative shrink-0 pt-1'>
        <div className='w-28 h-28 sm:w-44 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden border bg-[#F7F8F7]'>
          <img
            src={imageUrl || fallbackFood}
            alt={name}
            className='w-full h-full object-cover'
            onError={e => {
              e.target.src = fallbackFood
            }}
          />
        </div>

        {/* Cart Button */}
        {isInCart ? (
          <div className='absolute left-1/2 -translate-x-1/2 bottom-[-12px] sm:bottom-[-18px] flex items-center bg-white border-2 border-[#065f2a] rounded-xl shadow-md overflow-hidden'>
            <button
              onClick={handleDecrement}
              className='px-3 sm:px-5 py-2 text-lg font-semibold text-[#065f2a]'
            >
              −
            </button>

            <span className='px-3 sm:px-5 font-bold text-gray-800'>
              {displayQuantity}
            </span>

            <button
              onClick={handleIncrement}
              className='px-3 sm:px-5 py-2 text-lg font-semibold text-[#065f2a]'
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className='absolute left-1/2 -translate-x-1/2 bottom-[18px] sm:bottom-[-18px] w-[105px] sm:w-[165px] py-1 sm:py-2 bg-white border border-[#065f2a] rounded-xl sm:rounded-2xl text-[#065f2a] font-bold text-md sm:text-2xl shadow-md hover:bg-green-50 transition'
          >
            ADD +
          </button>
        )}
      </div>
    </Link>
  )
}
