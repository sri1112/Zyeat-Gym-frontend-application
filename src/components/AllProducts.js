import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import productService from '../services/productService'
import AddToCartModal from './AddToCartModal'
import fallbackFood from '../assests/food2.jpeg'

export default function AllProducts () {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationData = location.state || {}
  const isAddToPlanMode =
    navigationData.addToPlanMode === true || navigationData.fromPlan === true
  const selectedPlan = navigationData.plan || null

  const selectedPlanId =
    navigationData.planId ||
    selectedPlan?.plan_id ||
    selectedPlan?.planId ||
    selectedPlan?.id ||
    selectedPlan?._id ||
    null

  const selectedDate = navigationData.selectedDate || null

  const selectedTime = navigationData.time || 'Morning'

  /*
   * =========================================================
   * PRODUCT STATES
   * =========================================================
   */

  const [products, setProducts] = useState([])

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(true)

  const [loadingMore, setLoadingMore] = useState(false)

  /*
   * =========================================================
   * FILTER STATE
   * =========================================================
   */

  const [activeTab, setActiveTab] = useState('All Meals')

  const tabs = ['All Meals', 'Breakfast', 'Lunch', 'Dinner', 'Snacks']

  /*
   * =========================================================
   * MODAL STATE
   * =========================================================
   */

  const [selectedProduct, setSelectedProduct] = useState(null)

  /*
   * =========================================================
   * LOAD PRODUCTS
   * =========================================================
   */

  const loadProducts = async (pageNumber = 1) => {
    try {
      if (pageNumber === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const response = await productService.getProducts(pageNumber, 10)

      if (!response?.success) {
        return
      }

      const newProducts = response.products || []

      setProducts(previous => {
        /*
         * FIRST PAGE
         */

        if (pageNumber === 1) {
          return newProducts
        }

        /*
         * PREVENT DUPLICATES
         */

        const existingIds = new Set(
          previous.map(item => {
            return item.id || item._id
          })
        )

        const uniqueProducts = newProducts.filter(item => {
          const productId = item.id || item._id

          return !existingIds.has(productId)
        })

        return [...previous, ...uniqueProducts]
      })

      setHasMore(pageNumber < response.totalPages)
    } catch (error) {
      console.error('Load products error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    loadProducts(1)
  }, [])

  /*
   * =========================================================
   * INFINITE SCROLL
   * =========================================================
   */

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore) {
        return
      }

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200

      if (!reachedBottom) {
        return
      }

      setPage(previousPage => {
        const nextPage = previousPage + 1

        loadProducts(nextPage)

        return nextPage
      })
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [loading, loadingMore, hasMore])

  /*
   * =========================================================
   * FILTER PRODUCTS
   * =========================================================
   */

  const filteredProducts =
    activeTab === 'All Meals'
      ? products
      : products.filter(product => {
          const category = String(
            product.category || product.product_category || ''
          ).toLowerCase()

          return category === activeTab.toLowerCase()
        })

  /*
   * =========================================================
   * CLICK ADD BUTTON
   * =========================================================
   *
   * IMPORTANT:
   *
   * We DO NOT call add-product API here.
   *
   * We only open AddToCartModal.
   * =========================================================
   */

  const handleOpenAddModal = product => {
    setSelectedProduct(product)
  }

  /*
   * =========================================================
   * CLOSE MODAL
   * =========================================================
   */

  const handleCloseModal = () => {
    setSelectedProduct(null)
  }

  /*
   * =========================================================
   * MODAL CONFIRM
   * =========================================================
   *
   * Modal returns:
   *
   * {
   *   quantity,
   *   unit,
   *   time
   * }
   *
   * Then:
   *
   * AllProducts
   * → Plans
   *
   * Plans page finally calls:
   *
   * POST /api/cart/add-product
   * =========================================================
   */

  const handleModalConfirm = modalData => {
    if (!selectedProduct) {
      return
    }

    console.log('RETURNING TO PLANS:', {
      product: selectedProduct,
      plan: selectedPlan,
      planId: selectedPlanId,
      selectedDate,
      modalData
    })

    navigate('/plans', {
      state: {
        product: selectedProduct,

        plan: {
          ...selectedPlan,
          plan_id: selectedPlanId,
          id: selectedPlanId
        },

        planId: selectedPlanId,

        quantity: modalData.quantity,

        unit: modalData.unit,

        time: modalData.time,

        selectedDate,

        planStartDate: navigationData.planStartDate,

        fromAllProducts: true
      }
    })
  }

  /*
   * =========================================================
   * BACK BUTTON
   * =========================================================
   */

  const handleBack = () => {
    if (isAddToPlanMode) {
      navigate('/plans', {
        state: {
          plan: {
            ...selectedPlan,
            plan_id: selectedPlanId,
            id: selectedPlanId
          },
          planId: selectedPlanId,
          selectedDate,
          planStartDate: navigationData.planStartDate,
          time: selectedTime,
          period: navigationData.period
        }
      })

      return
    }

    navigate(-1)
  }

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <>
      <div className='pt-20 pb-28 bg-[#f9fafc] min-h-screen font-sans'>
        {/* HEADER */}

        <div className='px-5 mb-5 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* BACK */}

            {isAddToPlanMode && (
              <button
                type='button'
                onClick={handleBack}
                className='w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm'
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
            )}

            <div>
              <h2 className='text-lg font-bold text-gray-800'>
                {isAddToPlanMode ? 'Add Product' : 'All Meals'}
              </h2>

              {isAddToPlanMode && selectedDate && (
                <p className='text-[11px] text-[#065f2a] font-semibold mt-0.5'>
                  Adding to {selectedDate}
                </p>
              )}
            </div>
          </div>

          <span className='text-xs font-semibold bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full'>
            {filteredProducts.length} Items
          </span>
        </div>

        {/* PLAN MODE INFORMATION */}

        {isAddToPlanMode && (
          <div className='mx-5 mb-4 p-3 bg-[#f1faf3] border border-[#b7dfc1] rounded-xl'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-[10px] text-gray-500'>Adding product to</p>

                <p className='text-[13px] font-bold text-[#065f2a] mt-0.5'>
                  {selectedDate || 'Selected Plan Date'}
                </p>
              </div>

              <div className='text-right'>
                <p className='text-[10px] text-gray-500'>Time</p>

                <p className='text-[13px] font-bold text-gray-900 mt-0.5'>
                  {selectedTime === 'Morning' ? '🌤️ Morning' : '🌙 Evening'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* FILTER TABS */}

        <div className='mb-2 px-3'>
          <div className='flex space-x-1 overflow-x-auto scrollbar-hide mb-6 pb-1'>
            {tabs.map(tab => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-3 py-1 rounded-lg text-[13px] font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-[#065f2a] text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}

        {loading ? (
          <div className='text-center py-20 text-gray-500 font-bold text-sm tracking-wide'>
            Loading fresh products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className='text-center py-20 text-gray-400 font-medium text-sm'>
            No items found in this category.
          </div>
        ) : (
          <div className='px-5 gap-4'>
            {filteredProducts.map(product => {
              const safeId = product.id || product._id

              return (
                <ProductCard
                  key={safeId}
                  product={product}
                  isAddToPlanMode={isAddToPlanMode}
                  onAdd={() => handleOpenAddModal(product)}
                />
              )
            })}
          </div>
        )}

        {/* LOAD MORE */}

        {loadingMore && (
          <div className='text-center py-6 text-[#065f2a] font-bold text-sm'>
            Loading more products...
          </div>
        )}

        {/* END */}

        {!hasMore && products.length > 0 && (
          <div className='text-center py-6 text-gray-400 text-xs'>
            All products loaded
          </div>
        )}
      </div>

      {/* ADD TO CART MODAL */}

      {selectedProduct && (
        <AddToCartModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onConfirm={handleModalConfirm}
        />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}

/*
 * =========================================================
 * PRODUCT CARD
 * =========================================================
 */

function ProductCard ({ product, isAddToPlanMode, onAdd }) {
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

  /*
   * =========================================================
   * ADD BUTTON
   * =========================================================
   */

  const handleAddClick = event => {
    /*
     * IMPORTANT:
     *
     * Prevent Link navigation.
     *
     * Without these two lines,
     * clicking ADD also opens
     * Product Details page.
     */

    event.preventDefault()

    event.stopPropagation()

    onAdd()
  }

  return (
    <Link
      to={`/product-details/${safeId}`}
      className='flex justify-between gap-3 sm:gap-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 transition-all mb-4'
    >
      {/* LEFT CONTENT */}

      <div className='flex-1 min-w-0'>
        {/* NAME */}

        <h3 className='font-bold text-[18px] sm:text-[24px] text-gray-900 leading-tight'>
          {name || 'Product'}
        </h3>

        {/* PRICE */}

        <p className='mt-1 text-[18px] sm:text-[32px] font-bold text-black'>
          ₹{price || '0.00'}
        </p>

        {/* NUTRITION */}

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

        {/* DESCRIPTION */}

        <p className='mt-3 text-gray-500 text-[13px] sm:text-base leading-6 line-clamp-3'>
          {description || 'No description available'}
        </p>
      </div>

      {/* RIGHT IMAGE */}

      <div className='relative shrink-0 pt-1'>
        <div className='w-28 h-28 sm:w-44 sm:h-44 rounded-2xl sm:rounded-3xl overflow-hidden border bg-[#F7F8F7]'>
          <img
            src={imageUrl || fallbackFood}
            alt={name || 'Product'}
            className='w-full h-full object-cover'
            onError={event => {
              event.currentTarget.src = fallbackFood
            }}
          />
        </div>

        {/* ADD BUTTON */}

        <button
          type='button'
          onClick={handleAddClick}
          className='absolute left-1/2 -translate-x-1/2 bottom-[-12px] sm:bottom-[-18px] w-[105px] sm:w-[165px] py-1.5 sm:py-2 bg-white border-2 border-[#065f2a] rounded-xl sm:rounded-2xl text-[#065f2a] font-bold text-md sm:text-2xl shadow-md hover:bg-green-50 transition'
        >
          {isAddToPlanMode ? 'ADD +' : 'ADD +'}
        </button>
      </div>
    </Link>
  )
}
