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
        <div className='flex items-center justify-center mb-2 text-center space-x-3'>
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
                className='w-12 h-12 object-contain'
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
                className='w-11 h-11 object-contain'
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
                className='w-11 h-11 object-contain'
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
      <div className='mb-2 mt-5'>
        {/* Header and Compare Button */}
        <div className='flex justify-between items-center mb-2 px-1'>
          <h3 className='text-[17px] font-bold text-gray-900'>Choose a Plan</h3>
          {/* <button className='flex items-center text-[13px] font-semibold text-[#065c2d] hover:underline'>
            Compare Plans
            Updated SVG to match the overlapping "Copy/Compare" squares in the design
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
          </button> */}
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
                      <h4 className='font-bold text-gray-900 text-[15px]'>
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
      {/* <div className='flex space-x-2 overflow-x-auto scrollbar-hide mb-6 pb-1'>
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
      </div> */}

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
    fats,
    tag
  } = product || {}

  const safeId = id || _id

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

  const handleIncrement = async e => {
    e.preventDefault()
    e.stopPropagation()

    try {
      await cartService.updateQuantity({
        mapping_id: cartItem.mapping_id,
        quantity: displayQuantity + 1
      })

      await refreshCart()

      refreshCart()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecrement = async e => {
    e.preventDefault()
    e.stopPropagation()

    try {
      if (displayQuantity > 1) {
        await cartService.updateQuantity({
          mapping_id: cartItem.mapping_id,
          quantity: displayQuantity - 1
        })
      } else {
        await cartService.removeItem(
          cartItem.mappingId || cartItem.id || cartItem._id
        )
      }

      refreshCart()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Link
      to={`/product-details/${safeId}`}
      className='flex justify-between bg-white rounded-2xl border border-gray-200 shadow-sm p-3 mb-3'
    >
      {/* LEFT */}
      <div className='flex-1 pr-3'>
        {/* Veg */}
        <div className='flex items-center gap-2 mb-2'>
          <div
            className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
              tag?.toLowerCase() === 'veg'
                ? 'border-green-600'
                : 'border-red-600'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                tag?.toLowerCase() === 'veg' ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>

          <span
            className={`text-xs font-medium ${
              tag?.toLowerCase() === 'veg' ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {tag}
          </span>
        </div>

        {/* Name */}
        <h3 className='text-[16px] font-bold text-gray-900 leading-6'>
          {name}
        </h3>

        {/* Price */}
        <p className='text-[16px] font-bold mt-1'>₹{price}</p>

        {/* Nutrition */}
        <div className='flex flex-wrap gap-1 mt-2'>
          <span className='px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-semibold'>
            {calories} kcal
          </span>

          <span className='px-2 py-1 rounded bg-sky-50 text-sky-700 text-[10px] font-semibold'>
            {protein}g P
          </span>

          <span className='px-2 py-1 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold'>
            {carbs}g C
          </span>

          <span className='px-2 py-1 rounded bg-orange-50 text-orange-700 text-[10px] font-semibold'>
            {fats}g F
          </span>
        </div>

        {/* Description */}
        <p className='text-gray-500 text-sm mt-3 line-clamp-2'>{description}</p>
      </div>

      {/* RIGHT */}
      <div className='w-[96px] flex justify-end'>
        <div className='relative w-[96px] h-[132px]'>
          {/* Image */}
          <img
            src={imageUrl || fallbackFood}
            alt={name}
            className='w-[96px] h-[96px] rounded-xl object-cover bg-gray-100'
            onError={e => {
              e.target.src = fallbackFood
            }}
          />

          {/* Add / Quantity */}
          {isInCart ? (
            <div
              className='absolute left-1/2 -translate-x-1/2 top-[82px]
                         w-[84px] h-[32px]
                         bg-white border border-[#0B8F3A]
                         rounded-lg shadow-md
                         flex items-center justify-between'
            >
              <button
                onClick={handleDecrement}
                className='w-7 h-full flex items-center justify-center text-[#0B8F3A] font-bold'
              >
                −
              </button>

              <span className='text-sm font-bold'>{displayQuantity}</span>

              <button
                onClick={handleIncrement}
                className='w-7 h-full flex items-center justify-center text-[#0B8F3A] font-bold'
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className='absolute left-1/2 -translate-x-1/2 top-[82px]
                         w-[84px] h-[32px]
                         bg-white border border-[#0B8F3A]
                         rounded-lg shadow-md
                         text-[#0B8F3A]
                         font-bold text-sm'
            >
              ADD +
            </button>
          )}
        </div>
      </div>
    </Link>
  )
}

// import React, { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom'

// // Local assets (Ensure these exist in your project)
// import banner from '../assests/food/licensed-image (1).jpg'

// import food1 from '../assests/food/licensed-image (2).jpg'
// import food2 from '../assests/food4.png'
// import AddToCartModal from './AddToCartModal'

// // Fallback image in case the database image URL is missing
// import fallbackFood from '../assests/food2.jpeg'
// import planService from '../services/planService'
// import cartService from '../services/cartService'
// import productService from '../services/productService'

// export default function Home () {
//   const placeholderOptions = [
//     'meals, ingredients...',
//     'High Protein Bowl...',
//     'Boiled Eggs...',
//     'Oats Bowl...'
//   ]

//   const [placeholder, setPlaceholder] = useState(placeholderOptions[0])
//   const [dbProducts, setDbProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const featuredProducts = dbProducts.slice(0, 8)
//   const popularPicks = dbProducts.slice(0, 4) // For the top horizontal list
//   const navigate = useNavigate()

//   // Category State (Matching the new UI Filters)
//   const categories = ['All', 'Veg', 'Non Veg']
//   const [activeCategory, setActiveCategory] = useState('All')
//   const [plans, setPlans] = useState([])
//   const [activePlanId, setActivePlanId] = useState(null)
//   const [cartItems, setCartItems] = useState([])
//   const [selectedProductForModal, setSelectedProductForModal] = useState(null)

//   // Rotating search placeholder
//   useEffect(() => {
//     let index = 0
//     const interval = setInterval(() => {
//       index = (index + 1) % placeholderOptions.length
//       setPlaceholder(placeholderOptions[index])
//     }, 2000)
//     return () => clearInterval(interval)
//   }, [])

//   // Fetch Cart Function
//   const fetchCart = async () => {
//     try {
//       const response = await cartService.getCart()
//       if (response && response.cart && Array.isArray(response.cart.items)) {
//         setCartItems(response.cart.items)
//       } else {
//         setCartItems([])
//       }
//     } catch (error) {
//       console.error('Error fetching cart:', error)
//       setCartItems([])
//     }
//   }

//   // Fetch initial data (Products, Plans, and Cart)
//   useEffect(() => {
//     const loadAllData = async () => {
//       try {
//         const prodData = await productService.getProducts()
//         if (prodData.success) {
//           setDbProducts(prodData.products || prodData.data || [])
//         }

//         const planRes = await planService.getPlans()
//         const fetchedPlans = planRes.plans || planRes.data || planRes

//         if (Array.isArray(fetchedPlans)) {
//           setPlans(fetchedPlans)
//           if (fetchedPlans.length > 0) {
//             setActivePlanId(
//               fetchedPlans[0].plan_id ||
//                 fetchedPlans[0]._id ||
//                 fetchedPlans[0].id
//             )
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadAllData()
//     fetchCart()
//   }, [])

//   // Filter products based on active category
//   const filteredProducts = featuredProducts.filter(prod => {
//     if (activeCategory === 'All') return true
//     if (activeCategory === 'Veg') return prod.tag?.toLowerCase() === 'veg'
//     if (activeCategory === 'Non Veg') return prod.tag?.toLowerCase() !== 'veg'
//     return true
//   })

//   return (
//     <div className='pt-6 pb-24 bg-white flex-grow overflow-y-auto scrollbar-hide px-4 mt-10'>
//       {/* --- Greeting & Hero Text --- */}
//       <div className='mb-3'>
//         <h2 className='text-[18px] text-gray-900 font-bold leading-tight mt-1'>
//           Eat fresh, live <span className='text-[#0B8F3A]'>healthy.</span> 🌿
//         </h2>
//       </div>

//       {/* --- Search Bar --- */}
//       <div className='mb-3 flex items-center bg-white border border-gray-200 rounded-2xl p-3.5 shadow-sm'>
//         <svg
//           className='h-5 w-5 text-gray-400 mr-3'
//           fill='none'
//           viewBox='0 0 24 24'
//           stroke='currentColor'
//         >
//           <path
//             strokeLinecap='round'
//             strokeLinejoin='round'
//             strokeWidth='2'
//             d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
//           />
//         </svg>
//         <input
//           type='text'
//           placeholder={`Search ${placeholder}`}
//           className='flex-1 bg-transparent text-[14px] text-gray-700 placeholder-gray-400 focus:outline-none'
//         />
//         <button className='text-[#0B8F3A]'>
//           <svg
//             className='w-6 h-6'
//             fill='none'
//             viewBox='0 0 24 24'
//             stroke='currentColor'
//             strokeWidth='2'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               d='M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M20 8V6a2 2 0 00-2-2h-2M20 16v2a2 2 0 01-2 2h-2'
//             />
//             <path strokeLinecap='round' strokeLinejoin='round' d='M9 12h6' />
//           </svg>
//         </button>
//       </div>

//       {/* --- Banner Section --- */}
//       <div className='mb-3 bg-gradient-to-r from-[#F0FDF4] to-[#E8F6EB] rounded-[20px] p-5 flex relative overflow-hidden h-[160px] shadow-sm border border-[#E2F0E5]'>
//         {/* 1. Left Content */}
//         <div className='z-10 w-[65%] flex flex-col justify-center'>
//           <div className='flex items-center gap-3 mb-1.5'>
//             <div className='w-8 h-8 shrink-0 bg-white rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]'>
//               <svg
//                 className='w-4 h-4 text-[#0B8F3A]'
//                 fill='currentColor'
//                 viewBox='0 0 20 20'
//               >
//                 <path
//                   fillRule='evenodd'
//                   d='M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z'
//                   clipRule='evenodd'
//                 />
//               </svg>
//             </div>
//             <h3 className='font-extrabold text-gray-900 text-[16px] leading-[1.2] tracking-tight'>
//               Fuel your body. <br />
//               <span className='text-[#0B8F3A]'>Perform better.</span>
//             </h3>
//           </div>
//           <p className='text-[11px] text-gray-500 mt-1 leading-relaxed pr-8 font-medium'>
//             High protein meals to support your fitness goals.
//           </p>
//         </div>

//         {/* 2. Background/Right Image */}
//         <div className='absolute right-[-45px] top-[-30px] h-[220px] w-[220px] pointer-events-none'>
//           <img
//             src={banner || fallbackFood}
//             alt='Banner Food'
//             className='w-full h-full object-cover rounded-full mix-blend-multiply'
//           />
//         </div>

//         {/* 3. Explore Plans Button - THIS MUST BE INSIDE THE BANNER DIV */}
//         <button className='absolute bottom-4 right-4 z-20 bg-[#0B8F3A] hover:bg-[#097730] transition-colors text-white text-[11px] font-bold px-4 py-2 rounded-lg flex items-center shadow-md'>
//           Explore Plans
//           <svg
//             className='w-3.5 h-3.5 ml-1.5'
//             fill='none'
//             stroke='currentColor'
//             viewBox='0 0 24 24'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               strokeWidth='2.5'
//               d='M4 12h16m-7-7l7 7-7 7'
//             />
//           </svg>
//         </button>
//       </div>
//       {/* --- End Banner Section --- */}

//       {/* --- Popular Picks Section --- */}
//       <div className='mb-4'>
//         <div className='flex justify-between items-center mb-2'>
//           <h3 className='text-[18px] font-bold text-gray-900'>Popular Picks</h3>
//           <button className='flex items-center text-[13px] font-bold text-[#0B8F3A]'>
//             See all
//             <svg
//               className='w-4 h-4 ml-1'
//               fill='none'
//               stroke='currentColor'
//               viewBox='0 0 24 24'
//             >
//               <path
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//                 strokeWidth='2.5'
//                 d='M9 5l7 7-7 7'
//               />
//             </svg>
//           </button>
//         </div>

//         <div className='flex space-x-3 overflow-x-auto scrollbar-hide '>
//           {loading ? (
//             <div className='text-sm text-gray-500'>Loading...</div>
//           ) : (
//             popularPicks.map(product => (
//               <div
//                 key={product.id || product._id}
//                 // Removed p-2 here and added overflow-hidden so the image corners match the card
//                 className='min-w-[130px] w-[150px] h-[180px] bg-white rounded-[16px] border border-gray-100 shadow-sm flex flex-col overflow-hidden'
//               >
//                 {/* Image takes full width of the top */}
//                 <div className='h-[130px] w-full bg-[#F7F7F7] relative'>
//                   <img
//                     // src={product.imageUrl || food1}
//                     src={food1}
//                     alt={product.name}
//                     className='w-full h-full object-cover mix-blend-multiply'
//                   />
//                 </div>

//                 {/* Text and Button get their own padding */}
//                 <div className='p-3 flex flex-col flex-1'>
//                   <h4 className='text-[12px] font-bold text-gray-900 line-clamp-1 mb-0.2'>
//                     {product.name}
//                   </h4>

//                   <div className='flex justify-between items-center mt-auto'>
//                     <span className='font-extrabold text-[13px] text-gray-900'>
//                       ₹{product.price}
//                     </span>
//                     <button
//                       onClick={() => setSelectedProductForModal(product)}
//                       // Centered the + sign perfectly
//                       className='w-[23px] h-[23px] bg-[#0B8F3A] text-white rounded-full flex items-center justify-center font-bold text-[17px] pb-0.5 shadow-sm'
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//       {/* --- All Meals / Categories Section --- */}
//       <div className='flex justify-between items-center mb-4'>
//         <h3 className='text-[17px] font-extrabold text-gray-900'>All Meals</h3>

//         <div className='flex gap-2'>
//           {categories.map(cat => {
//             const isActive = activeCategory === cat
//             return (
//               <button
//                 key={cat}
//                 onClick={() => setActiveCategory(cat)}
//                 className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all flex items-center justify-center border ${
//                   isActive
//                     ? 'bg-[#087F2C] text-white border-[#087F2C]' // Slightly darker green for the active state to match the image
//                     : 'bg-white text-gray-800 border-gray-200 shadow-sm'
//                 }`}
//               >
//                 {cat}
//                 {cat === 'Veg' && (
//                   <span className='ml-1.5 text-[11px] leading-none'>🌿</span>
//                 )}
//                 {cat === 'Non Veg' && (
//                   <span className='ml-1.5 text-[11px] leading-none'>🥩</span>
//                 )}
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* --- Dynamic Product List --- */}
//       {loading ? (
//         <div className='text-center py-10 text-gray-500 font-bold'>
//           Loading fresh meals...
//         </div>
//       ) : (
//         <div className='flex flex-col gap-4 pb-6'>
//           {filteredProducts.map(product => (
//             <ProductCard
//               key={product.id || product._id}
//               product={product}
//               cartItems={cartItems}
//               refreshCart={fetchCart}
//               onOpenModal={setSelectedProductForModal}
//             />
//           ))}
//         </div>
//       )}

//       {/* --- Trust Badges (Bottom Info) --- */}
//       <div className='flex justify-between items-center bg-gray-50/80 rounded-2xl p-4 border border-gray-100 shadow-sm'>
//         <div className='flex flex-col items-center justify-center space-y-1 w-1/4'>
//           <span className='text-xl'>💪</span>
//           <span className='text-[10px] font-semibold text-center leading-tight'>
//             High
//             <br />
//             Protein
//           </span>
//         </div>
//         <div className='flex flex-col items-center justify-center space-y-1 w-1/4'>
//           <span className='text-xl'>🌿</span>
//           <span className='text-[10px] font-semibold text-center leading-tight'>
//             Clean
//             <br />
//             Ingredients
//           </span>
//         </div>
//         <div className='flex flex-col items-center justify-center space-y-1 w-1/4'>
//           <span className='text-xl'>🛡️</span>
//           <span className='text-[10px] font-semibold text-center leading-tight'>
//             Nutritionist
//             <br />
//             Designed
//           </span>
//         </div>
//         <div className='flex flex-col items-center justify-center space-y-1 w-1/4'>
//           <span className='text-xl'>🛵</span>
//           <span className='text-[10px] font-semibold text-center leading-tight'>
//             Delivered
//             <br />
//             Fresh Daily
//           </span>
//         </div>
//       </div>

//       {/* --- Add To Cart Modal --- */}
//       {selectedProductForModal && (
//         <AddToCartModal
//           product={selectedProductForModal}
//           onClose={() => setSelectedProductForModal(null)}
//           onConfirm={({ quantity, unit, time }) => {
//             const selectedPlan = plans.find(
//               plan =>
//                 String(plan.plan_id || plan.id || plan._id) ===
//                 String(activePlanId)
//             )
//             if (!selectedPlan) {
//               alert('Please select a plan first.')
//               return
//             }
//             navigate('/plans', {
//               state: {
//                 product: selectedProductForModal,
//                 plan: selectedPlan,
//                 quantity,
//                 unit,
//                 time
//               }
//             })
//             setSelectedProductForModal(null)
//           }}
//         />
//       )}
//     </div>
//   )
// }

// // -------------------------------------------------------------
// // Updated ProductCard Component (Image Flush with Edges)
// // -------------------------------------------------------------
// const ProductCard = ({ product, cartItems, refreshCart, onOpenModal }) => {
//   const {
//     id,
//     _id,
//     name,
//     imageUrl,
//     price,
//     description,
//     calories,
//     protein,
//     carbs,
//     fats,
//     tag
//   } = product || {}

//   const safeId = id || _id
//   const cartItem = cartItems?.find(
//     item => item.productId === safeId || item.product_id === safeId
//   )

//   const isInCart = !!cartItem
//   const displayQuantity = cartItem ? cartItem.quantity : 0
//   const isVeg = tag?.toLowerCase() === 'veg'

//   const handleAdd = e => {
//     e.preventDefault()
//     e.stopPropagation()
//     onOpenModal(product)
//   }

//   const handleIncrement = async e => {
//     e.preventDefault()
//     e.stopPropagation()
//     try {
//       await cartService.updateQuantity({
//         mapping_id: cartItem.mapping_id,
//         quantity: displayQuantity + 1
//       })
//       await refreshCart()
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const handleDecrement = async e => {
//     e.preventDefault()
//     e.stopPropagation()
//     try {
//       if (displayQuantity > 1) {
//         await cartService.updateQuantity({
//           mapping_id: cartItem.mapping_id,
//           quantity: displayQuantity - 1
//         })
//       } else {
//         await cartService.removeItem(
//           cartItem.mappingId || cartItem.id || cartItem._id
//         )
//       }
//       refreshCart()
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   return (
//     <Link
//       to={`/product-details/${safeId}`}
//       // Removed outer padding, added overflow-hidden to clip the image to the card's rounded corners
//       className='flex bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden mb-1'
//     >
//       {/* LEFT: Image Container - Takes full height, no padding */}
//       <div className='relative w-[160px] shrink-0 bg-[#F7F7F7]'>
//         <img
//           src={imageUrl || fallbackFood}
//           alt={name}
//           className='w-full h-full object-cover mix-blend-multiply'
//           onError={e => {
//             e.target.src = fallbackFood
//           }}
//         />
//         {/* Veg/Non-Veg Tag floating directly on the Image */}
//         <div className='absolute top-3 left-3 bg-white px-2 py-1 rounded-[6px] flex items-center shadow-sm'>
//           <div
//             className={`w-2.5 h-2.5 border rounded-[2px] flex items-center justify-center mr-1 ${
//               isVeg ? 'border-green-600' : 'border-red-600'
//             }`}
//           >
//             <div
//               className={`w-1.5 h-1.5 rounded-full ${
//                 isVeg ? 'bg-green-600' : 'bg-red-600'
//               }`}
//             />
//           </div>
//           <span
//             className={`text-[10px] font-bold ${
//               isVeg ? 'text-green-700' : 'text-red-700'
//             }`}
//           >
//             {isVeg ? 'Veg' : 'Non Veg'}
//           </span>
//         </div>
//       </div>

//       {/* RIGHT: Details - Reduced padding (py-2.5 px-3) to shrink height */}
//       <div className='flex-1 py-2.5 px-3 flex flex-col relative'>
//         {/* Heart Icon Top Right - Adjusted position slightly */}
//         <button className='absolute right-2.5 top-2.5 text-gray-400 hover:text-red-500'>
//           <svg
//             className='w-4 h-4'
//             fill='none'
//             stroke='currentColor'
//             viewBox='0 0 24 24'
//           >
//             <path
//               strokeLinecap='round'
//               strokeLinejoin='round'
//               strokeWidth='1.5'
//               d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
//             />
//           </svg>
//         </button>

//         {/* Title & Rating */}
//         <h3 className='text-[15px] font-extrabold text-gray-900 leading-tight pr-5'>
//           {name}
//         </h3>

//         <div className='flex items-center mt-0.5'>
//           {' '}
//           {/* Reduced margin from mt-1 */}
//           <svg
//             className='w-3 h-3 text-[#0B8F3A] fill-current mr-1'
//             viewBox='0 0 20 20'
//           >
//             <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
//           </svg>
//           <span className='text-[11px] font-bold text-[#0B8F3A]'>4.8</span>
//           <span className='text-[11px] text-gray-500 font-medium ml-1'>
//             (128)
//           </span>
//         </div>

//         {/* Description */}
//         <p className='text-gray-500 text-[10px] mt-1 font-medium leading-[1.3] line-clamp-2'>
//           {' '}
//           {/* Reduced from mt-1.5 */}
//           {description ||
//             'Grilled paneer, quinoa, broccoli, chickpeas, veggies & house sauce.'}
//         </p>

//         {/* Macros - Reduced margin from mt-2.5 to mt-1.5 */}
//         <div className='flex gap-1 mt-1.5'>
//           <div className='flex flex-col items-center bg-[#F4FBF5] px-1.5 py-0.5 rounded-[4px]'>
//             <span className='text-[9px] font-bold text-[#0B8F3A] leading-tight'>
//               {calories || 0}
//             </span>
//             <span className='text-[7px] font-semibold text-gray-500'>kcal</span>
//           </div>
//           <div className='flex flex-col items-center bg-[#F4FBF5] px-1.5 py-0.5 rounded-[4px]'>
//             <span className='text-[9px] font-bold text-[#0B8F3A] leading-tight'>
//               {protein || 0}g
//             </span>
//             <span className='text-[7px] font-semibold text-gray-500'>
//               Protein
//             </span>
//           </div>
//           <div className='flex flex-col items-center bg-[#F4FBF5] px-1.5 py-0.5 rounded-[4px]'>
//             <span className='text-[9px] font-bold text-[#0B8F3A] leading-tight'>
//               {carbs || 0}g
//             </span>
//             <span className='text-[7px] font-semibold text-gray-500'>
//               Carbs
//             </span>
//           </div>
//           <div className='flex flex-col items-center bg-[#F4FBF5] px-1.5 py-0.5 rounded-[4px]'>
//             <span className='text-[9px] font-bold text-[#0B8F3A] leading-tight'>
//               {fats || 0}g
//             </span>
//             <span className='text-[7px] font-semibold text-gray-500'>Fats</span>
//           </div>
//         </div>

//         {/* Bottom Row: Price & Button - Reduced margin from mt-3 to mt-2 */}
//         <div className='flex justify-between items-center mt-2'>
//           <span className='text-[16px] font-extrabold text-gray-900 tracking-tight'>
//             ₹{price}
//           </span>

//           {isInCart ? (
//             <div className='w-[70px] h-[28px] bg-white border-2 border-[#0B8F3A] rounded-lg flex items-center justify-between overflow-hidden shadow-sm'>
//               <button
//                 onClick={handleDecrement}
//                 className='w-1/3 h-full flex items-center justify-center text-[#0B8F3A] font-bold bg-green-50/50 hover:bg-green-100'
//               >
//                 −
//               </button>
//               <span className='text-[12px] font-bold text-gray-900'>
//                 {displayQuantity}
//               </span>
//               <button
//                 onClick={handleIncrement}
//                 className='w-1/3 h-full flex items-center justify-center text-[#0B8F3A] font-bold bg-green-50/50 hover:bg-green-100'
//               >
//                 +
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={handleAdd}
//               className='w-[70px] h-[28px] bg-white border-2 border-[#0B8F3A] rounded-[6px] text-[#087F2C] font-extrabold text-[11px] flex items-center justify-center shadow-sm hover:bg-green-50 transition-colors'
//             >
//               ADD
//             </button>
//           )}
//         </div>
//       </div>
//     </Link>
//   )
// }
