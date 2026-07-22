import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import productService from '../services/productService'
import cartService from '../services/cartService'

import fallbackFood from '../assests/food2.jpeg'

export default function ProductDetails () {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [product, setProduct] = useState(null)

  // States matching the new UI
  const [isFavorite, setIsFavorite] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true
    loadPage()
  }, [id])

  const loadPage = async () => {
    try {
      setLoading(true)
      const productResponse = await productService.getProductDetails(id)

      if (productResponse.success) {
        setProduct(productResponse.product || productResponse.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleIncrement = () => setQuantity(prev => prev + 1)
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = async () => {
    if (adding || !product) return
    try {
      setAdding(true)
      // Ensure your backend accepts the mapping (id vs _id)
      const safeId = product.id || product._id

      await cartService.addToCart({
        product_id: safeId,
        quantity: quantity
      })

      navigate('/cart')
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 text-[#0D6E26] font-bold'>
        Loading details...
      </div>
    )
  }

  if (!product) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 text-gray-500'>
        Product Not Found
      </div>
    )
  }

  const isVeg =
    product.category?.toLowerCase() === 'veg' || product.tag === 'Veg'

  return (
    <div className='bg-white min-h-screen font-sans pb-28'>
      {/* --- Header (Fixed Top) --- */}
      <div className='fixed top-0 z-30 w-full bg-white/95 backdrop-blur-sm px-4 py-3 flex justify-between items-center border-b border-gray-100'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 -ml-2 text-gray-800'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10 19l-7-7m0 0l7-7m-7 7h18'
            />
          </svg>
        </button>

        <h1 className='absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-gray-900'>
          Product Details
        </h1>

        {/* <div className='flex items-center gap-3'>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className='text-gray-800 transition-colors'
          >
            <svg
              className={`w-6 h-6 ${
                isFavorite
                  ? 'fill-red-500 text-red-500'
                  : 'fill-none text-gray-800'
              }`}
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z'
              />
            </svg>
          </button>
          <button className='text-gray-800'>
            <svg
              className='w-6 h-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              strokeWidth='2'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
              />
            </svg>
          </button>
        </div> */}
      </div>

      {/* --- Hero Image --- */}
      <div className='relative mt-[60px] w-full h-[260px]'>
        <img
          src={product.imageUrl || fallbackFood}
          alt={product.name}
          className='w-full h-full object-cover rounded-b-3xl'
          onError={e => {
            e.target.src = fallbackFood
          }}
        />
        <div className='absolute bottom-4 right-4 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 border border-green-100'>
          <span>{isVeg ? '🌱' : '🍗'}</span>
          {isVeg ? '100% Veg' : 'Non-Veg'}
        </div>
      </div>

      {/* --- Main Content Container --- */}
      <div className='px-5 mt-5'>
        {/* Title & Price Row */}
        <div className='flex justify-between items-start'>
          <div className='max-w-[70%]'>
            <h2 className='text-2xl font-extrabold text-gray-900 leading-tight'>
              {product.name}
            </h2>
            <p className='text-sm text-gray-500 mt-1 flex items-center gap-1.5'>
              <span className='text-yellow-500 text-lg'>☀️</span> Best for
              Breakfast
            </p>
          </div>
          <div className='text-right'>
            <p className='text-[26px] font-extrabold text-[#0D6E26] leading-none'>
              ₹{product.price || 0}
            </p>
            <p className='text-[11px] text-gray-500 mt-1.5 font-medium'>
              Per Serving
            </p>
          </div>
        </div>

        {/* Description */}
        <p className='text-[14px] text-gray-600 mt-4 leading-relaxed'>
          {product.description ||
            'A hearty and healthy bowl loaded with nutrients. Perfect for a nutritious start to your day.'}
        </p>

        {/* Features / Highlights Grid */}
        <div className='grid grid-cols-4 gap-2 mt-6'>
          <FeatureIcon icon='🍃' label='High Fibre' />
          <FeatureIcon icon='💪' label='High Protein' />
          <FeatureIcon icon='🌾' label='Whole Grain' />
          <FeatureIcon icon='🧊' label='No Added Sugar' />
        </div>

        {/* --- Nutrition Information Card --- */}
        <div className='mt-8 border border-gray-100 rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]'>
          <div className='flex justify-between items-end mb-4'>
            <h3 className='text-[15px] font-bold text-gray-900'>
              Nutrition Information
            </h3>
            <span className='text-[10px] font-bold text-[#0D6E26]'>
              Per Serving (Approx.)
            </span>
          </div>

          <div className='flex justify-between text-center mb-4'>
            <NutritionItem
              label='Calories'
              value={product.calories || '320 kcal'}
            />
            <NutritionItem
              label='Protein'
              value={product.protein ? `${product.protein} g` : '12 g'}
            />
            <NutritionItem
              label='Carbs'
              value={product.carbs ? `${product.carbs} g` : '45 g'}
            />
            <NutritionItem
              label='Fats'
              value={product.fats ? `${product.fats} g` : '10 g'}
            />
            <NutritionItem
              label='Fibre'
              value={product.fibre ? `${product.fibre} g` : '6 g'}
            />
          </div>

          <div className='border-t border-gray-100 pt-3 text-center'>
            <button className='text-[12px] font-bold text-[#0D6E26] flex items-center justify-center w-full gap-1'>
              View Full Nutrition Breakdown
              <svg
                className='w-3.5 h-3.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth='2.5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* --- Ingredients Card --- */}
        <div className='mt-5'>
          <h3 className='text-[15px] font-bold text-gray-900 mb-3'>
            Ingredients
          </h3>
          <div className='bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex gap-3 items-start'>
            <div className='bg-white p-2 rounded-full shadow-sm border border-gray-100 text-[#0D6E26]'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                />
              </svg>
            </div>
            <p className='text-[13px] text-gray-600 leading-snug pt-0.5'>
              {product.ingredients ||
                'Rolled Oats, Milk, Banana, Strawberry, Blueberry, Almonds, Chia Seeds, Honey.'}
            </p>
          </div>
        </div>

        {/* --- Allergens Card --- */}
        <div className='mt-5'>
          <h3 className='text-[15px] font-bold text-gray-900 mb-3'>
            Allergens
          </h3>
          <div className='bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex gap-3 items-center'>
            <div className='bg-white p-2 rounded-full shadow-sm border border-gray-100 text-[#0D6E26]'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                strokeWidth='2'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
            </div>
            <p className='text-[13px] text-gray-600'>
              {product.allergens || 'Contains Nuts, Milk.'}
            </p>
          </div>
        </div>

        {/* --- Why You'll Love It --- */}
        <div className='mt-6 mb-4'>
          <h3 className='text-[15px] font-bold text-gray-900 mb-3'>
            Why You'll Love It
          </h3>
          <ul className='space-y-2.5'>
            <LoveListItem text='Keeps you full for longer' />
            <LoveListItem text='Rich in fibre and protein' />
            <LoveListItem text='Supports healthy digestion' />
            <LoveListItem text='No artificial flavours or preservatives' />
          </ul>
        </div>
      </div>

      {/* --- Bottom Fixed Action Bar --- */}
      {/* <div className='fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center z-40 pb-safe'>
        {/* Left: Price Details */}
      {/* <div className='flex flex-col'>
          <p className='text-[20px] font-extrabold text-[#0D6E26] leading-none'>
            ₹{product.price || 0}
          </p>
          <p className='text-[11px] text-gray-500 mt-1 font-medium'>
            Per Serving
          </p>
        </div> */}

      {/* Right side: Actions */}
      {/* <div className='flex gap-3 h-[46px]'> */}
      {/* Quantity Selector */}
      {/* <div className='flex items-center border border-[#0D6E26]/30 rounded-xl bg-white w-[90px]'>
            <button
              onClick={handleDecrement}
              className='flex-1 h-full flex items-center justify-center text-[#0D6E26] text-lg font-medium rounded-l-xl hover:bg-green-50 transition-colors'
            >
              −
            </button>
            <span className='w-8 text-center text-[14px] font-bold text-gray-900 border-x border-[#0D6E26]/20 h-full flex items-center justify-center'>
              {quantity}
            </span>
            <button
              onClick={handleIncrement}
              className='flex-1 h-full flex items-center justify-center text-[#0D6E26] text-lg font-medium rounded-r-xl hover:bg-green-50 transition-colors'
            >
              +
            </button>
          </div> */}

      {/* Add Button */}
      {/* <button
            onClick={handleAddToCart}
            disabled={adding}
            className='bg-[#0D6E26] hover:bg-green-800 transition-colors text-white rounded-xl px-5 flex flex-col items-center justify-center min-w-[140px] disabled:opacity-70 shadow-sm'
          >
            <span className='text-[13px] font-bold'>
              {adding ? 'Processing...' : 'Add to Plan'}
            </span>
            <span className='text-[9px] font-medium opacity-80 flex items-center gap-1 mt-0.5'>
              <svg
                className='w-2.5 h-2.5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                />
              </svg>
              Choose date & time
            </span>
          </button>
        </div>
      </div> */}
    </div>
  )
}

// --- Subcomponents for clean code ---

function FeatureIcon ({ icon, label }) {
  return (
    <div className='flex flex-col items-center text-center'>
      <div className='w-12 h-12 bg-[#F2FBF2] rounded-full flex items-center justify-center text-xl mb-1.5 border border-green-50'>
        {icon}
      </div>
      <p className='text-[10px] font-bold text-gray-700 leading-tight px-1'>
        {label}
      </p>
    </div>
  )
}

function NutritionItem ({ label, value }) {
  return (
    <div className='flex flex-col items-center px-1'>
      <p className='text-[10px] text-gray-500 font-medium mb-1'>{label}</p>
      <p className='text-[13px] font-bold text-gray-900'>{value}</p>
    </div>
  )
}

function LoveListItem ({ text }) {
  return (
    <li className='flex items-center gap-2.5'>
      <svg
        className='w-4 h-4 text-[#0D6E26] flex-shrink-0'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        strokeWidth='2'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
      <span className='text-[13px] text-gray-600'>{text}</span>
    </li>
  )
}
